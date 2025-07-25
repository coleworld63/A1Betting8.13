import React, { useState, useEffect, useRef, useMemo } from 'react';
// @ts-expect-error TS(2307): Cannot find module '@/lib/utils' or its correspond... Remove this comment to see the full error message
import { cn } from '@/lib/utils';

// Types for command palette
interface Command {
  id: string;
  title: string;
  description?: string;
  category: string;
  keywords: string[];
  icon?: string;
  shortcut?: string[];
  action: () => void | Promise<void>;
  disabled?: boolean;
  priority?: number;
  metadata?: Record<string, unknown>;
}

interface CommandCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
}

interface RecentCommand {
  commandId: string;
  timestamp: Date;
  frequency: number;
}

interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  loading: boolean;
  recentCommands: RecentCommand[];
  favoriteCommands: string[];
}

interface ModernCommandPaletteProps {
  commands: Command[];
  categories: CommandCategory[];
  isOpen: boolean;
  variant?: 'default' | 'cyber' | 'minimal' | 'professional' | 'glass';
  placeholder?: string;
  maxResults?: number;
  showCategories?: boolean;
  showShortcuts?: boolean;
  showRecents?: boolean;
  showFavorites?: boolean;
  enableFuzzySearch?: boolean;
  enableVoiceSearch?: boolean;
  className?: string;
  onOpenChange: (open: boolean) => void;
  onCommandExecute?: (command: Command) => void;
  onQueryChange?: (query: string) => void;
}

const _defaultCategories: CommandCategory[] = [
  { id: 'navigation', name: 'Navigation', icon: '🧭', color: 'blue' },
  { id: 'betting', name: 'Betting', icon: '🎯', color: 'green' },
  { id: 'account', name: 'Account', icon: '👤', color: 'purple' },
  { id: 'analytics', name: 'Analytics', icon: '📊', color: 'orange' },
  { id: 'settings', name: 'Settings', icon: '⚙️', color: 'gray' },
  { id: 'tools', name: 'Tools', icon: '🛠️', color: 'cyan' },
];

const _fuzzyMatch = (query: string, text: string): number => {
  if (!query) return 1;

  const _queryLower = query.toLowerCase();
  const _textLower = text.toLowerCase();

  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    return 1;
  }

  // Fuzzy matching - check if all query characters appear in order
  let _queryIndex = 0;
  let _score = 0;

  for (let _i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 1;
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length ? score / textLower.length : 0;
};

const _formatShortcut = (shortcut: string[]): string => {
  return shortcut
    .map(key => {
      // Convert common key names to symbols
      const _keyMap: Record<string, string> = {
        cmd: '⌘',
        ctrl: 'Ctrl',
        alt: '⌥',
        shift: '⇧',
        enter: '↵',
        escape: 'Esc',
        space: '␣',
        tab: '⇥',
        backspace: '⌫',
        delete: '⌦',
        up: '↑',
        down: '↓',
        left: '←',
        right: '→',
      };

      return keyMap[key.toLowerCase()] || key.toUpperCase();
    })
    .join(' + ');
};

export const _ModernCommandPalette: React.FC<ModernCommandPaletteProps> = ({
  commands,
  categories = defaultCategories,
  isOpen,
  variant = 'default',
  placeholder = 'Search commands...',
  maxResults = 10,
  showCategories = true,
  showShortcuts = true,
  showRecents = true,
  showFavorites = true,
  enableFuzzySearch = true,
  enableVoiceSearch = false,
  className,
  onOpenChange,
  onCommandExecute,
  onQueryChange,
}) => {
  const [state, setState] = useState<CommandPaletteState>({
    isOpen,
    query: '',
    selectedIndex: 0,
    loading: false,
    recentCommands: [],
    favoriteCommands: [],
  });

  const _inputRef = useRef<HTMLInputElement>(null);
  const _listRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);

  // Filtered and sorted commands
  const _filteredCommands = useMemo(() => {
    if (!state.query && !showRecents && !showFavorites) {
      return commands.slice(0, maxResults);
    }

    let _filtered = commands;

    if (state.query) {
      filtered = commands.filter(command => {
        if (enableFuzzySearch) {
          const _titleScore = fuzzyMatch(state.query, command.title);
          const _descScore = command.description ? fuzzyMatch(state.query, command.description) : 0;
          const _keywordScore = Math.max(...command.keywords.map(k => fuzzyMatch(state.query, k)));

          return titleScore > 0 || descScore > 0 || keywordScore > 0;
        } else {
          const _query = state.query.toLowerCase();
          return (
            command.title.toLowerCase().includes(query) ||
            command.description?.toLowerCase().includes(query) ||
            command.keywords.some(k => k.toLowerCase().includes(query))
          );
        }
      });

      // Sort by relevance
      filtered.sort((a, b) => {
        const _aScore = enableFuzzySearch
          ? Math.max(
              fuzzyMatch(state.query, a.title),
              a.description ? fuzzyMatch(state.query, a.description) : 0,
              ...a.keywords.map(k => fuzzyMatch(state.query, k))
            )
          : 1;
        const _bScore = enableFuzzySearch
          ? Math.max(
              fuzzyMatch(state.query, b.title),
              b.description ? fuzzyMatch(state.query, b.description) : 0,
              ...b.keywords.map(k => fuzzyMatch(state.query, k))
            )
          : 1;

        // Factor in priority and recent usage
        const _aPriority =
          (a.priority || 0) +
          (state.recentCommands.find(r => r.commandId === a.id)?.frequency || 0) * 0.1;
        const _bPriority =
          (b.priority || 0) +
          (state.recentCommands.find(r => r.commandId === b.id)?.frequency || 0) * 0.1;

        return bScore + bPriority - (aScore + aPriority);
      });
    }

    return filtered.slice(0, maxResults);
  }, [
    commands,
    state.query,
    state.recentCommands,
    maxResults,
    enableFuzzySearch,
    showRecents,
    showFavorites,
  ]);

  // Group commands by category
  const _groupedCommands = useMemo(() => {
    if (!showCategories) return { All: filteredCommands };

    const _grouped = filteredCommands.reduce(
      (acc, command) => {
        if (!acc[command.category]) {
          acc[command.category] = [];
        }
        acc[command.category].push(command);
        return acc;
      },
      {} as Record<string, Command[]>
    );

    return grouped;
  }, [filteredCommands, showCategories]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const _handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setState(prev => ({
            ...prev,
            selectedIndex: Math.min(prev.selectedIndex + 1, filteredCommands.length - 1),
          }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setState(prev => ({
            ...prev,
            selectedIndex: Math.max(prev.selectedIndex - 1, 0),
          }));
          break;
        case 'Enter':
          e.preventDefault();
          executeSelectedCommand();
          break;
        case 'Escape':
          e.preventDefault();
          onOpenChange(false);
          break;
        case 'Tab':
          e.preventDefault();
          // Cycle through categories if shown
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands.length, state.selectedIndex]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setState(prev => ({
        ...prev,
        query: '',
        selectedIndex: 0,
      }));
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const _selectedElement = listRef.current.children[state.selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [state.selectedIndex]);

  const _executeCommand = async (command: Command) => {
    if (command.disabled) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      await command.action();

      // Update recent commands
      setState(prev => {
        const _existingRecent = prev.recentCommands.find(r => r.commandId === command.id);
        const _updatedRecents = existingRecent
          ? prev.recentCommands.map(r =>
              r.commandId === command.id
                ? { ...r, timestamp: new Date(), frequency: r.frequency + 1 }
                : r
            )
          : [
              ...prev.recentCommands,
              { commandId: command.id, timestamp: new Date(), frequency: 1 },
            ];

        return {
          ...prev,
          recentCommands: updatedRecents.sort((a, b) => b.frequency - a.frequency).slice(0, 10),
        };
      });

      onCommandExecute?.(command);
      onOpenChange(false);
    } catch (error) {
      console.error('Command execution failed:', error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const _executeSelectedCommand = () => {
    const _command = filteredCommands[state.selectedIndex];
    if (command) {
      executeCommand(command);
    }
  };

  const _handleQueryChange = (query: string) => {
    setState(prev => ({ ...prev, query, selectedIndex: 0 }));
    onQueryChange?.(query);
  };

  const _toggleFavorite = (commandId: string) => {
    setState(prev => ({
      ...prev,
      favoriteCommands: prev.favoriteCommands.includes(commandId)
        ? prev.favoriteCommands.filter(id => id !== commandId)
        : [...prev.favoriteCommands, commandId],
    }));
  };

  // Voice search
  const _startVoiceSearch = () => {
    if (!enableVoiceSearch || !('webkitSpeechRecognition' in window)) return;

    const _recognition = new (window as unknown).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: unknown) => {
      const _transcript = event.results[0][0].transcript;
      handleQueryChange(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  };

  if (!isOpen) return null;

  const _variantClasses = {
    default: 'bg-white border border-gray-200 rounded-xl shadow-2xl',
    cyber:
      'bg-slate-900/95 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 backdrop-blur-md',
    minimal: 'bg-white border border-gray-100 rounded-lg shadow-xl',
    professional: 'bg-white border border-gray-300 rounded-2xl shadow-2xl',
    glass: 'bg-white/80 border border-white/20 rounded-xl shadow-2xl backdrop-blur-md',
  };

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div className='fixed inset-0 z-50 flex items-start justify-center pt-20'>
      {/* Backdrop */}
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={() => onOpenChange(false)}
      />

      {/* Command Palette */}
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div
        className={cn(
          'relative w-full max-w-2xl mx-4 max-h-96 overflow-hidden',
          variantClasses[variant],
          className
        )}
      >
        {/* Search Input */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div
          className={cn(
            'flex items-center p-4 border-b',
            variant === 'cyber' ? 'border-cyan-500/30' : 'border-gray-200'
          )}
        >
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='flex items-center flex-1 space-x-3'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div
              className={cn(
                'text-lg',
                state.loading ? 'animate-spin' : '',
                variant === 'cyber' ? 'text-cyan-400' : 'text-gray-400'
              )}
            >
              {state.loading ? '⟳' : '🔍'}
            </div>

            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <input
              ref={inputRef}
              type='text'
              placeholder={placeholder}
              value={state.query}
              onChange={e => handleQueryChange(e.target.value)}
              className={cn(
                'flex-1 bg-transparent border-none outline-none text-lg placeholder-gray-400',
                variant === 'cyber' ? 'text-cyan-300' : 'text-gray-900'
              )}
              disabled={state.loading}
            />

            {enableVoiceSearch && (
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <button
                onClick={startVoiceSearch}
                disabled={isListening}
                className={cn(
                  'p-2 rounded transition-colors',
                  isListening && 'animate-pulse',
                  variant === 'cyber'
                    ? 'text-cyan-400 hover:bg-cyan-500/10'
                    : 'text-gray-500 hover:bg-gray-100'
                )}
              >
                🎤
              </button>
            )}
          </div>

          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div
            className={cn('text-xs', variant === 'cyber' ? 'text-cyan-400/70' : 'text-gray-500')}
          >
            {filteredCommands.length} results
          </div>
        </div>

        {/* Results */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div ref={listRef} className='max-h-80 overflow-y-auto'>
          {/* Recent Commands */}
          {showRecents && !state.query && state.recentCommands.length > 0 && (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div
              className={cn(
                'p-3 border-b',
                variant === 'cyber' ? 'border-cyan-500/20' : 'border-gray-100'
              )}
            >
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div
                className={cn(
                  'text-xs font-medium mb-2 uppercase tracking-wider',
                  variant === 'cyber' ? 'text-cyan-400/70' : 'text-gray-500'
                )}
              >
                Recent
              </div>
              {state.recentCommands.slice(0, 3).map(recent => {
                const _command = commands.find(c => c.id === recent.commandId);
                if (!command) return null;

                return (
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <CommandItem
                    key={command.id}
                    command={command}
                    variant={variant}
                    isSelected={false}
                    showShortcuts={showShortcuts}
                    isFavorite={state.favoriteCommands.includes(command.id)}
                    onExecute={executeCommand}
                    onToggleFavorite={toggleFavorite}
                  />
                );
              })}
            </div>
          )}

          {/* Grouped Commands */}
          {Object.entries(groupedCommands).map(([categoryId, categoryCommands], groupIndex) => {
            if (categoryCommands.length === 0) return null;

            const _category = categories.find(c => c.id === categoryId);

            return (
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div key={categoryId}>
                {/* Category Header */}
                {showCategories && Object.keys(groupedCommands).length > 1 && (
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div
                    className={cn(
                      'px-4 py-2 border-b text-xs font-medium uppercase tracking-wider',
                      variant === 'cyber'
                        ? 'bg-slate-800/50 border-cyan-500/20 text-cyan-400/70'
                        : 'bg-gray-50 border-gray-100 text-gray-500'
                    )}
                  >
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className='flex items-center space-x-2'>
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      {category?.icon && <span>{category.icon}</span>}
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <span>{category?.name || categoryId}</span>
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <span className='text-xs opacity-50'>({categoryCommands.length})</span>
                    </div>
                  </div>
                )}

                {/* Commands */}
                {categoryCommands.map((command, index) => {
                  const _globalIndex =
                    Object.entries(groupedCommands)
                      .slice(0, groupIndex)
                      .reduce((acc, [, cmds]) => acc + cmds.length, 0) + index;

                  return (
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <CommandItem
                      key={command.id}
                      command={command}
                      variant={variant}
                      isSelected={globalIndex === state.selectedIndex}
                      showShortcuts={showShortcuts}
                      isFavorite={state.favoriteCommands.includes(command.id)}
                      onExecute={executeCommand}
                      onToggleFavorite={toggleFavorite}
                    />
                  );
                })}
              </div>
            );
          })}

          {/* No Results */}
          {filteredCommands.length === 0 && (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div
              className={cn(
                'p-8 text-center',
                variant === 'cyber' ? 'text-cyan-400/70' : 'text-gray-500'
              )}
            >
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='text-4xl mb-2'>🔍</div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='text-sm'>No commands found</div>
              {state.query && (
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-xs mt-1 opacity-70'>Try searching with different keywords</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div
          className={cn(
            'flex items-center justify-between p-3 border-t text-xs',
            variant === 'cyber'
              ? 'border-cyan-500/30 text-cyan-400/50'
              : 'border-gray-200 text-gray-500'
          )}
        >
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='flex items-center space-x-4'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <span>↑↓ Navigate</span>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <span>↵ Execute</span>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <span>Esc Close</span>
          </div>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div>{enableVoiceSearch && <span>🎤 Voice Search</span>}</div>
        </div>

        {/* Cyber Effects */}
        {variant === 'cyber' && (
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-xl pointer-events-none' />
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='absolute inset-0 bg-grid-white/[0.02] rounded-xl pointer-events-none' />
          </>
        )}
      </div>
    </div>
  );
};

// Individual command item component
interface CommandItemProps {
  command: Command;
  variant: string;
  isSelected: boolean;
  showShortcuts: boolean;
  isFavorite: boolean;
  onExecute: (command: Command) => void;
  onToggleFavorite: (commandId: string) => void;
}

const _CommandItem: React.FC<CommandItemProps> = ({
  command,
  variant,
  isSelected,
  showShortcuts,
  isFavorite,
  onExecute,
  onToggleFavorite,
}) => {
  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div
      className={cn(
        'flex items-center justify-between p-3 cursor-pointer transition-all duration-150',
        isSelected &&
          (variant === 'cyber'
            ? 'bg-cyan-500/20 border-l-2 border-cyan-500'
            : 'bg-blue-50 border-l-2 border-blue-500'),
        !isSelected && (variant === 'cyber' ? 'hover:bg-cyan-500/10' : 'hover:bg-gray-50'),
        command.disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !command.disabled && onExecute(command)}
    >
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className='flex items-center space-x-3 flex-1 min-w-0'>
        {/* Icon */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        {command.icon && <span className='text-lg flex-shrink-0'>{command.icon}</span>}

        {/* Content */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='flex-1 min-w-0'>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div
            className={cn(
              'font-medium truncate',
              variant === 'cyber' ? 'text-cyan-300' : 'text-gray-900'
            )}
          >
            {command.title}
          </div>
          {command.description && (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div
              className={cn(
                'text-sm truncate mt-0.5',
                variant === 'cyber' ? 'text-cyan-400/70' : 'text-gray-600'
              )}
            >
              {command.description}
            </div>
          )}
        </div>
      </div>

      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className='flex items-center space-x-2'>
        {/* Favorite Button */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite(command.id);
          }}
          className={cn(
            'p-1 rounded transition-colors',
            isFavorite
              ? 'text-yellow-500'
              : variant === 'cyber'
                ? 'text-cyan-400/50 hover:text-cyan-300'
                : 'text-gray-400 hover:text-gray-600'
          )}
        >
          {isFavorite ? '★' : '☆'}
        </button>

        {/* Shortcut */}
        {showShortcuts && command.shortcut && (
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div
            className={cn(
              'px-2 py-1 text-xs rounded border',
              variant === 'cyber'
                ? 'bg-slate-800 border-cyan-500/30 text-cyan-400'
                : 'bg-gray-100 border-gray-300 text-gray-600'
            )}
          >
            {formatShortcut(command.shortcut)}
          </div>
        )}
      </div>
    </div>
  );
};
