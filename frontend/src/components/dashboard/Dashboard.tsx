import { motion } from 'framer-motion';
import { BarChart3, Brain, DollarSign, Maximize, RefreshCw, Star, Trophy, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Metric {
  label: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

interface Opportunity {
  id: string;
  title: string;
  confidence: number;
  expectedValue: string;
  kellyPercentage: number;
  sharpeRatio: number;
  modelConsensus: string;
  confidenceLevel: 'high' | 'medium' | 'low';
}

interface LiveFeedItem {
  id: string;
  time: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'alert';
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: 'Win Rate',
      value: '72.4%',
      change: '+2.3% this week',
      changeType: 'positive',
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      icon: <Trophy className='w-8 h-8 text-green-400' />,
    },
    {
      label: 'Total Profit',
      value: '$18,420',
      change: '+$1,240 today',
      changeType: 'positive',
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      icon: <DollarSign className='w-8 h-8 text-purple-400' />,
    },
    {
      label: 'AI Accuracy',
      value: '91.5%',
      change: '+0.8% improvement',
      changeType: 'positive',
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      icon: <Brain className='w-8 h-8 text-cyan-400' />,
    },
    {
      label: 'Live Opportunities',
      value: 23,
      change: '+7 new',
      changeType: 'positive',
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      icon: <Zap className='w-8 h-8 text-yellow-400' />,
    },
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      title: 'Lakers vs Warriors O/U 228.5',
      confidence: 96,
      expectedValue: '+12.3%',
      kellyPercentage: 18.4,
      sharpeRatio: 3.42,
      modelConsensus: '47/47',
      confidenceLevel: 'high',
    },
    {
      id: '2',
      title: 'Chiefs -3.5 vs Bills',
      confidence: 94,
      expectedValue: '+8.7%',
      kellyPercentage: 12.7,
      sharpeRatio: 2.89,
      modelConsensus: '44/47',
      confidenceLevel: 'high',
    },
    {
      id: '3',
      title: 'Dodgers ML +145',
      confidence: 87,
      expectedValue: '+6.2%',
      kellyPercentage: 8.9,
      sharpeRatio: 2.14,
      modelConsensus: '38/47',
      confidenceLevel: 'medium',
    },
  ]);

  const [liveFeed, setLiveFeed] = useState<LiveFeedItem[]>([
    {
      id: '1',
      time: '14:32',
      message: '🎯 New arbitrage opportunity detected: +5.2% ROI',
      type: 'alert',
    },
    {
      id: '2',
      time: '14:30',
      message: '🤖 Neural Network #23 updated prediction confidence to 96%',
      type: 'info',
    },
    {
      id: '3',
      time: '14:28',
      message: '💰 Bet placed successfully: $500 on Lakers O/U',
      type: 'success',
    },
    {
      id: '4',
      time: '14:25',
      message: '📊 Model accuracy increased by 0.3% this hour',
      type: 'info',
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics slightly
      setMetrics(prev =>
        prev.map(metric => {
          if (metric.label === 'Win Rate') {
            const currentValue = parseFloat(metric.value.toString());
            const newValue = (currentValue + (Math.random() - 0.5) * 0.2).toFixed(1);
            return { ...metric, value: `${newValue}%` };
          }
          if (metric.label === 'Live Opportunities') {
            const currentValue = parseInt(metric.value.toString());
            const change = Math.floor((Math.random() - 0.5) * 3);
            return { ...metric, value: Math.max(1, currentValue + change) };
          }
          return metric;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Add new feed item
      const newFeedItem: LiveFeedItem = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
        message: '🔄 Dashboard refreshed with latest data',
        type: 'info',
      };
      setLiveFeed(prev => [newFeedItem, ...prev].slice(0, 10));
    }, 1500);
  };

  const executeQuickBet = () => {
    console.log('Executing quick bet...');
    // Add implementation
  };

  const runQuickArbitrage = () => {
    console.log('Running quick arbitrage...');
    // Add implementation
  };

  const scanAllBooks = () => {
    console.log('Scanning all books...');
    // Add implementation
  };

  const optimizePortfolio = () => {
    console.log('Optimizing portfolio...');
    // Add implementation
  };

  const executeBet = (betId: string) => {
    console.log('Executing bet:', betId);
    // Add implementation
  };

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div className='space-y-6'>
      {/* Header */}
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className='flex justify-between items-start'>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <h2 className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent'>
            Dashboard
          </h2>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <p className='text-gray-400 mt-2'>
            Command Center - Platform Overview & Performance Metrics
          </p>
        </div>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='flex gap-2'>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <button
            onClick={handleRefresh}
            className='p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg transition-all'
            title='Refresh'
          >
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <RefreshCw className={`w-5 h-5 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <button
            className='p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg transition-all'
            title='Add to Favorites'
          >
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <Star className='w-5 h-5 text-gray-400' />
          </button>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <button
            className='p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg transition-all'
            title='Fullscreen'
          >
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <Maximize className='w-5 h-5 text-gray-400' />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {metrics.map((metric, index) => (
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className='bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all'
          >
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='flex items-center justify-between'>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <p className='text-gray-400 text-sm'>{metric.label}</p>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <p className='text-2xl font-bold mt-1'>{metric.value}</p>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <p
                  className={`text-xs mt-2 ${
                    metric.changeType === 'positive'
                      ? 'text-green-400'
                      : metric.changeType === 'negative'
                        ? 'text-red-400'
                        : 'text-gray-400'
                  }`}
                >
                  {metric.change}
                </p>
              </div>
              {metric.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Dashboard Widgets */}
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Hot Streaks */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl'>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <h4 className='text-lg font-bold text-purple-400 p-4 border-b border-slate-700/50'>
            🔥 Hot Streaks
          </h4>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='p-4 space-y-4'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='bg-slate-900/50 p-4 rounded-lg border border-slate-700/50'>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='font-bold mb-2'>NBA Player Props</div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='space-y-2'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='flex justify-between text-sm'>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <span className='text-gray-400'>Win Streak</span>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <span className='text-green-400'>12 games</span>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='w-full bg-slate-700/50 rounded-full h-2 overflow-hidden'>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div
                    className='bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full transition-all duration-1000'
                    style={{ width: '88%' }}
                  ></div>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-green-400 text-sm'>ROI: +247.8% this month</div>
              </div>
            </div>

            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 flex items-center gap-3'>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <Zap className='w-5 h-5 text-yellow-400' />
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='flex-1'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='font-bold'>NFL Spreads</div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-sm text-gray-400'>8-game hot streak | +89.3% ROI</div>
              </div>
            </div>

            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='bg-slate-900/50 p-4 rounded-lg border border-slate-700/50'>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='font-bold mb-1'>Arbitrage Scanner</div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='text-sm text-gray-400'>47 opportunities found today</div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='text-green-400 text-sm'>Average ROI: +4.7%</div>
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl'>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <h4 className='text-lg font-bold text-purple-400 p-4 border-b border-slate-700/50'>
            📊 Performance Analytics
          </h4>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='p-4'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='h-40 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg flex items-center justify-center mb-4'>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <BarChart3 className='w-12 h-12 text-purple-400/50' />
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <span className='ml-2 text-gray-500'>Real-time Chart</span>
            </div>

            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='grid grid-cols-2 gap-3'>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='bg-slate-900/50 p-3 rounded-lg text-center'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-sm text-gray-400'>Today</div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-green-400 font-bold'>+47.8%</div>
              </div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='bg-slate-900/50 p-3 rounded-lg text-center'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-sm text-gray-400'>This Week</div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-green-400 font-bold'>+184.2%</div>
              </div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='bg-slate-900/50 p-3 rounded-lg text-center'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-sm text-gray-400'>This Month</div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-green-400 font-bold'>+689.7%</div>
              </div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='bg-slate-900/50 p-3 rounded-lg text-center'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-sm text-gray-400'>All Time</div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-green-400 font-bold'>+2,847%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl'>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <h4 className='text-lg font-bold text-purple-400 p-4 border-b border-slate-700/50'>
            ⚡ Quick Actions
          </h4>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='p-4 space-y-3'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <button
              onClick={executeQuickBet}
              className='w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all transform hover:scale-105'
            >
              🎯 Execute Best Bet
            </button>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <button
              onClick={runQuickArbitrage}
              className='w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all transform hover:scale-105'
            >
              ⚡ Find Arbitrage
            </button>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <button
              onClick={scanAllBooks}
              className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-lg transition-all transform hover:scale-105'
            >
              🔍 Scan All Books
            </button>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <button
              onClick={optimizePortfolio}
              className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all transform hover:scale-105'
            >
              📊 Optimize Portfolio
            </button>

            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30'>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='font-bold mb-2'>AI Recommendations</div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='space-y-1 text-sm'>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div>💡 Increase NBA exposure by 15%</div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div>⚠️ Reduce same-game parlays</div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div>🎯 Focus on arbitrage opportunities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Opportunities & Feed */}
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Elite Opportunities */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl'>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <h3 className='text-lg font-bold text-purple-400 p-4 border-b border-slate-700/50'>
            🎯 Elite Opportunities
          </h3>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='p-4 space-y-4'>
            {opportunities.map(opp => (
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border ${
                  opp.confidenceLevel === 'high'
                    ? 'bg-green-900/20 border-green-500/30'
                    : 'bg-slate-900/50 border-slate-700/50'
                }`}
              >
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='flex justify-between items-start mb-3'>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div className='font-bold'>{opp.title}</div>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      opp.confidenceLevel === 'high'
                        ? 'bg-green-500 text-slate-900'
                        : 'bg-cyan-500 text-slate-900'
                    }`}
                  >
                    {opp.confidence}% Confidence
                  </span>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='text-sm space-y-1'>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    Expected Value: <span className='text-green-400'>{opp.expectedValue}</span>
                  </div>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div className='text-gray-400'>
                    Kelly: {opp.kellyPercentage}% | Sharpe: {opp.sharpeRatio} | Model Consensus:{' '}
                    {opp.modelConsensus}
                  </div>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className='w-full bg-slate-700/50 rounded-full h-2 overflow-hidden mt-3'>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div
                    className='bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full transition-all duration-1000'
                    style={{ width: `${opp.confidence}%` }}
                  ></div>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button
                  onClick={() => executeBet(opp.id)}
                  className='mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white text-sm font-bold rounded-lg transition-all'
                >
                  Execute Bet
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Intelligence Feed */}
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl'>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <h3 className='text-lg font-bold text-purple-400 p-4 border-b border-slate-700/50'>
            📡 Live Intelligence Feed
          </h3>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='p-4 space-y-3 max-h-[400px] overflow-y-auto'>
            {liveFeed.map(item => (
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50'
              >
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span className='text-xs text-gray-500 min-w-[45px]'>{item.time}</span>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span className='text-sm'>{item.message}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Market Overview */}
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className='bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl'>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <h4 className='text-lg font-bold text-purple-400 p-4 border-b border-slate-700/50'>
          🌐 Real-Time Market Intelligence
        </h4>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4'>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 flex items-center gap-3'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <BarChart3 className='w-5 h-5 text-cyan-400' />
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='font-bold'>Line Movement Alerts</div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className='text-sm text-gray-400'>47 significant moves detected</div>
            </div>
          </div>

          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='bg-slate-900/50 p-4 rounded-lg border border-slate-700/50'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='font-bold mb-1'>Sharp Money Activity</div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='text-sm text-gray-400'>$2.4M tracked today</div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='text-green-400 text-sm'>+67% above average</div>
          </div>

          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='bg-slate-900/50 p-4 rounded-lg border border-orange-500/30'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='font-bold mb-1'>Injury Impact Analysis</div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='text-sm text-gray-400'>12 player updates processed</div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='text-sm text-gray-400'>Line adjustments: 8 games affected</div>
          </div>

          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className='bg-cyan-900/20 p-4 rounded-lg border-l-4 border-cyan-400'>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='font-bold mb-1'>Market Inefficiencies</div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='text-sm'>Detected: 23 opportunities</div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className='text-green-400 text-sm'>Avg ROI: +4.8%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
