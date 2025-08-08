"""
Enhanced Integration Manager
Orchestrates the enhanced data architecture components following the comprehensive analysis recommendations
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone

from backend.services.enhanced_data_pipeline import enhanced_data_pipeline
from backend.services.intelligent_cache_service import intelligent_cache_service
from backend.services.sportradar_service import sportradar_service, SportType, DataType
from backend.services.data_quality_monitor import data_quality_monitor, DataSourceType, QualityViolation
from backend.services.event_driven_cache import event_driven_cache, EventType, InvalidationScope
from backend.services.sport_volatility_models import sport_volatility_models, GameState
from backend.utils.enhanced_logging import get_logger

logger = get_logger("enhanced_integration_manager")


class EnhancedIntegrationManager:
    """
    Integration manager implementing the recommendations from the comprehensive analysis:
    - Orchestrates Sportradar integration
    - Manages data quality monitoring
    - Coordinates intelligent caching
    - Handles cross-source reconciliation
    - Provides unified API for data access
    """

    def __init__(self):
        self.initialized = False
        self.active_sports = [SportType.MLB, SportType.NBA, SportType.NFL, SportType.NHL]
        self.quality_alert_handlers = []
        
        # Performance tracking
        self.integration_metrics = {
            "total_requests": 0,
            "cache_hits": 0,
            "data_quality_violations": 0,
            "cross_source_discrepancies": 0,
            "avg_response_time": 0.0
        }

    async def initialize(self):
        """Initialize all enhanced data architecture components"""
        logger.info("🚀 Initializing Enhanced Data Architecture...")
        
        try:
            # Initialize core components in order
            await self._initialize_core_components()
            
            # Set up data quality monitoring
            await self._setup_data_quality_monitoring()
            
            # Configure cross-source reconciliation
            await self._setup_cross_source_reconciliation()
            
            # Start background services
            await self._start_background_services()
            
            self.initialized = True
            logger.info("✅ Enhanced Data Architecture initialized successfully")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Enhanced Data Architecture: {e}")
            return False

    async def _initialize_core_components(self):
        """Initialize core data architecture components"""

        # 1. Initialize enhanced data pipeline
        await enhanced_data_pipeline.initialize()
        logger.info("✅ Enhanced data pipeline initialized")

        # 2. Initialize intelligent cache service
        await intelligent_cache_service.initialize()
        logger.info("✅ Intelligent cache service initialized")

        # 3. Initialize event-driven cache system
        await event_driven_cache.initialize()
        logger.info("✅ Event-driven cache system initialized")

        # 4. Initialize sport volatility models
        # No explicit initialization needed for models
        logger.info("✅ Sport volatility models ready")

        # 5. Initialize Sportradar service
        sportradar_available = await sportradar_service.initialize()
        if sportradar_available:
            logger.info("✅ Sportradar service initialized")
        else:
            logger.warning("⚠️ Sportradar service running in demo mode")

        # 6. Initialize data quality monitor
        await data_quality_monitor.initialize()
        logger.info("✅ Data quality monitor initialized")

    async def _setup_data_quality_monitoring(self):
        """Set up comprehensive data quality monitoring"""
        
        # Register quality alert handler
        async def quality_alert_handler(violation: QualityViolation):
            await self._handle_quality_violation(violation)
        
        from backend.services.data_quality_monitor import AlertSeverity
        data_quality_monitor.register_alert_callback(AlertSeverity.ERROR, quality_alert_handler)
        data_quality_monitor.register_alert_callback(AlertSeverity.CRITICAL, quality_alert_handler)
        
        logger.info("✅ Data quality monitoring configured")

    async def _setup_cross_source_reconciliation(self):
        """Set up cross-source data reconciliation"""
        
        # Register reconciliation rules
        async def odds_reconciliation_rule(primary_source, secondary_source, primary_data, secondary_data):
            """Reconcile odds data between different sources"""
            discrepancies = []
            
            try:
                if primary_source == DataSourceType.SPORTRADAR and secondary_source == DataSourceType.ODDS_API:
                    # Compare odds data if available
                    # This is a placeholder - implement actual reconciliation logic
                    logger.debug("🔄 Performing odds reconciliation between Sportradar and Odds API")
                    
            except Exception as e:
                logger.error(f"❌ Odds reconciliation error: {e}")
            
            return discrepancies
        
        data_quality_monitor.register_reconciliation_rule(odds_reconciliation_rule)
        
        logger.info("✅ Cross-source reconciliation configured")

    async def _start_background_services(self):
        """Start background services for enhanced functionality"""
        
        # Start Sportradar push feeds if available
        if sportradar_service.api_key:
            await sportradar_service.start_push_feeds(self.active_sports)
            logger.info("✅ Sportradar push feeds started")
        
        # Set up real-time data quality monitoring
        self._setup_realtime_quality_monitoring()
        
        logger.info("✅ Background services started")

    def _setup_realtime_quality_monitoring(self):
        """Set up real-time data quality monitoring for incoming data"""

        # Subscribe to Sportradar updates for quality monitoring and cache events
        async def sportradar_quality_callback(data):
            await self._monitor_incoming_data(DataSourceType.SPORTRADAR, data)

            # Emit cache invalidation events based on data updates
            await self._emit_cache_events_from_data(DataSourceType.SPORTRADAR, data)

        for sport in self.active_sports:
            sportradar_service.subscribe_to_updates(sport, sportradar_quality_callback)

        # Set up event-driven cache listeners
        self._setup_cache_event_listeners()

    async def _monitor_incoming_data(self, data_source: DataSourceType, data: Dict[str, Any]):
        """Monitor incoming data for quality issues"""
        try:
            # Validate data quality
            violations = await data_quality_monitor.validate_data(data_source, data)
            
            if violations:
                self.integration_metrics["data_quality_violations"] += len(violations)
                logger.warning(f"⚠️ {len(violations)} quality violations detected for {data_source.value}")
            
            # Update timeliness metrics
            await data_quality_monitor.update_timeliness_metric(data_source)
            
            # Detect anomalies
            anomalies = await data_quality_monitor.detect_anomalies(data_source, data)
            if anomalies:
                logger.warning(f"🔍 {len(anomalies)} anomalies detected in {data_source.value} data")
            
        except Exception as e:
            logger.error(f"❌ Error monitoring incoming data from {data_source.value}: {e}")

    async def _handle_quality_violation(self, violation: QualityViolation):
        """Handle data quality violations"""
        self.integration_metrics["data_quality_violations"] += 1

        # Log the violation
        logger.error(
            f"🚨 Data Quality Violation: {violation.rule_name} "
            f"({violation.severity.value}) - {violation.description}"
        )

        # Take corrective action based on severity
        if violation.severity.value in ["error", "critical"]:
            # Emit cache invalidation event
            await event_driven_cache.emit_event(
                event_type=EventType.DATA_SOURCE_UPDATE,
                source=violation.data_source.value,
                sport=None,  # Will be extracted from violation if available
                data_category=violation.field_path,
                payload={"violation": violation.rule_name, "severity": violation.severity.value},
                invalidation_scope=InvalidationScope.PATTERN
            )
            logger.info(f"📡 Emitted cache invalidation event for quality violation")

        # Notify registered handlers
        for handler in self.quality_alert_handlers:
            try:
                await handler(violation)
            except Exception as e:
                logger.error(f"❌ Quality alert handler error: {e}")

    def _setup_cache_event_listeners(self):
        """Set up event listeners for cache invalidation events"""

        async def game_state_listener(event):
            """Handle game state change events"""
            try:
                # Update sport volatility models with new game state
                if event.game_id and event.payload.get("new_state"):
                    game_state = GameState(event.payload["new_state"])
                    await sport_volatility_models.update_game_state(event.game_id, game_state)
                    logger.info(f"🎮 Updated game state for {event.game_id}: {game_state.value}")

            except Exception as e:
                logger.error(f"❌ Error handling game state event: {e}")

        async def score_update_listener(event):
            """Handle score update events"""
            try:
                # Log score update for metrics
                self.integration_metrics["total_requests"] += 1
                logger.debug(f"⚽ Score update received for game {event.game_id}")

            except Exception as e:
                logger.error(f"❌ Error handling score update event: {e}")

        # Register event listeners
        event_driven_cache.register_event_listener(EventType.GAME_STATE_CHANGE, game_state_listener)
        event_driven_cache.register_event_listener(EventType.SCORE_UPDATE, score_update_listener)

    async def _emit_cache_events_from_data(self, data_source: DataSourceType, data: Dict[str, Any]):
        """Emit cache invalidation events based on incoming data"""
        try:
            # Detect what type of data this is and emit appropriate events

            if "games" in data:
                # Process game data for score and state changes
                games = data.get("games", [])

                for game in games:
                    game_id = game.get("id")
                    if not game_id:
                        continue

                    # Check for score updates
                    home_score = game.get("home_score")
                    away_score = game.get("away_score")

                    if home_score is not None or away_score is not None:
                        await event_driven_cache.emit_event(
                            event_type=EventType.SCORE_UPDATE,
                            source=data_source.value,
                            sport=self._extract_sport_from_data(data),
                            game_id=game_id,
                            payload={"home_score": home_score, "away_score": away_score},
                            invalidation_scope=InvalidationScope.RELATED
                        )

                    # Check for game state changes
                    game_status = game.get("status")
                    if game_status:
                        await event_driven_cache.emit_event(
                            event_type=EventType.GAME_STATE_CHANGE,
                            source=data_source.value,
                            sport=self._extract_sport_from_data(data),
                            game_id=game_id,
                            payload={"new_state": game_status},
                            invalidation_scope=InvalidationScope.PATTERN
                        )

            # Check for odds data
            if "odds" in data or "bookmakers" in data:
                await event_driven_cache.emit_event(
                    event_type=EventType.ODDS_CHANGE,
                    source=data_source.value,
                    sport=self._extract_sport_from_data(data),
                    data_category="odds",
                    payload={"timestamp": datetime.now(timezone.utc).isoformat()},
                    invalidation_scope=InvalidationScope.PATTERN
                )

            # Check for injury reports
            if "injuries" in data or "injury_reports" in data:
                await event_driven_cache.emit_event(
                    event_type=EventType.INJURY_REPORT,
                    source=data_source.value,
                    sport=self._extract_sport_from_data(data),
                    data_category="injuries",
                    invalidation_scope=InvalidationScope.RELATED
                )

        except Exception as e:
            logger.error(f"❌ Error emitting cache events from data: {e}")

    def _extract_sport_from_data(self, data: Dict[str, Any]) -> Optional[str]:
        """Extract sport type from data structure"""
        try:
            # Look for sport indicators in the data
            sport_indicators = {
                "mlb": ["baseball", "mlb"],
                "nba": ["basketball", "nba"],
                "nfl": ["football", "nfl", "american_football"],
                "nhl": ["hockey", "nhl", "ice_hockey"]
            }

            data_str = str(data).lower()

            for sport, indicators in sport_indicators.items():
                if any(indicator in data_str for indicator in indicators):
                    return sport

            return None

        except Exception:
            return None

    # Public API methods following the analysis recommendations

    async def get_comprehensive_sports_data(self, sport: SportType = None) -> Dict[str, Any]:
        """
        Get comprehensive sports data with enhanced caching and quality monitoring
        Implements Phase 1 recommendation: Complete Sportradar integration
        """
        import time
        start_time = time.time()
        
        try:
            self.integration_metrics["total_requests"] += 1
            
            if sport:
                sports_to_fetch = [sport]
            else:
                sports_to_fetch = self.active_sports
            
            # Get data from Sportradar with enhanced pipeline
            sports_data = await sportradar_service.get_all_sports_data(sports_to_fetch)
            
            # Monitor data quality for each sport
            for sport_name, data in sports_data.items():
                if data and any(data.values()):  # Check if we have actual data
                    await self._monitor_incoming_data(DataSourceType.SPORTRADAR, data)
            
            # Update performance metrics
            response_time = time.time() - start_time
            self._update_response_time_metric(response_time)
            
            return {
                "data": sports_data,
                "metadata": {
                    "source": "sportradar",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "response_time_ms": response_time * 1000,
                    "cache_status": "api"  # Enhanced pipeline handles caching internally
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Error fetching comprehensive sports data: {e}")
            # Return cached data as fallback
            return await self._get_fallback_data(sports_to_fetch)

    async def get_enhanced_player_data(self, sport: SportType, player_id: str, user_id: str = None) -> Dict[str, Any]:
        """
        Get enhanced player data with quality validation and event-driven caching
        Implements intelligent caching with sport-specific volatility and user tracking
        """
        import time
        start_time = time.time()

        try:
            self.integration_metrics["total_requests"] += 1

            # Use sport-aware cache with user tracking
            cached_data = await intelligent_cache_service.get_sport_data(
                sport=sport.value,
                data_category="player_stats",
                key=f"enhanced_player_{sport.value}_{player_id}",
                user_id=user_id
            )

            if cached_data:
                self.integration_metrics["cache_hits"] += 1
                logger.debug(f"✅ Cache hit for player {player_id}")
                return {
                    "data": cached_data,
                    "metadata": {
                        "source": "cache",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "cache_status": "hit",
                        "cache_type": "sport_aware"
                    }
                }

            # Fetch from Sportradar
            player_data = await sportradar_service.get_player_stats(sport, player_id)

            if player_data:
                # Validate data quality
                violations = await data_quality_monitor.validate_data(
                    DataSourceType.SPORTRADAR,
                    {"player": player_data}
                )

                # Cache with sport-specific volatility model
                await intelligent_cache_service.set_sport_data(
                    sport=sport.value,
                    data_category="player_stats",
                    key=f"enhanced_player_{sport.value}_{player_id}",
                    value=player_data,
                    user_id=user_id
                )

                response_time = time.time() - start_time
                self._update_response_time_metric(response_time)

                return {
                    "data": player_data,
                    "metadata": {
                        "source": "sportradar",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "response_time_ms": response_time * 1000,
                        "cache_status": "miss",
                        "quality_violations": len(violations) if violations else 0,
                        "cache_type": "sport_aware"
                    }
                }

            return {"error": "Player data not available"}

        except Exception as e:
            logger.error(f"❌ Error fetching enhanced player data: {e}")
            return {"error": str(e)}

    async def get_live_scores_with_quality_monitoring(self, sport: SportType) -> Dict[str, Any]:
        """
        Get live scores with real-time quality monitoring
        Implements event-driven cache invalidation
        """
        try:
            # Get live scores from Sportradar
            live_data = await sportradar_service.get_live_scores(sport)
            
            if live_data:
                # Monitor data quality in real-time
                await self._monitor_incoming_data(DataSourceType.SPORTRADAR, live_data)
                
                # Trigger cache warming for related data
                await self._warm_related_caches(sport, live_data)
                
                return {
                    "data": live_data,
                    "metadata": {
                        "source": "sportradar_live",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "quality_checked": True
                    }
                }
            
            return {"error": "Live scores not available"}
            
        except Exception as e:
            logger.error(f"❌ Error fetching live scores with quality monitoring: {e}")
            return {"error": str(e)}

    async def get_data_quality_dashboard(self) -> Dict[str, Any]:
        """
        Get comprehensive data quality dashboard
        Implements Phase 1 recommendation: Data quality monitoring
        """
        try:
            # Get quality dashboard from monitor
            dashboard = await data_quality_monitor.get_quality_dashboard()
            
            # Add integration-specific metrics
            dashboard["integration_metrics"] = self.integration_metrics.copy()
            
            # Add service health status
            dashboard["service_health"] = {
                "sportradar": await sportradar_service.get_health_status(),
                "data_pipeline": await enhanced_data_pipeline.get_health_status(),
                "cache_service": await intelligent_cache_service.get_metrics()
            }
            
            return dashboard
            
        except Exception as e:
            logger.error(f"❌ Error getting data quality dashboard: {e}")
            return {"error": str(e)}

    # Helper methods

    def _get_sport_specific_cache_ttl(self, sport: SportType, data_type: str) -> int:
        """Get sport-specific cache TTL based on volatility models"""
        # Implement sport-specific volatility models as recommended in analysis
        base_ttls = {
            "live_scores": 30,
            "player_stats": 1800,
            "team_stats": 3600,
            "schedules": 7200,
            "injury_reports": 600
        }
        
        sport_multipliers = {
            SportType.MLB: 1.2,  # Less volatile
            SportType.NBA: 0.8,  # More volatile
            SportType.NFL: 1.5,  # Weekly games, less frequent updates
            SportType.NHL: 1.0   # Standard volatility
        }
        
        base_ttl = base_ttls.get(data_type, 3600)
        sport_multiplier = sport_multipliers.get(sport, 1.0)
        
        return int(base_ttl * sport_multiplier)

    async def _warm_related_caches(self, sport: SportType, live_data: Dict[str, Any]):
        """Warm related caches based on live data patterns"""
        try:
            # Extract game IDs from live data for cache warming
            games = live_data.get("games", [])
            
            for game in games:
                game_id = game.get("id")
                if game_id:
                    # Warm cache for game-specific data
                    patterns = [
                        f"game_details_{sport.value}_{game_id}",
                        f"player_props_{sport.value}_{game_id}",
                        f"team_stats_{sport.value}_{game.get('home_team', {}).get('id')}",
                        f"team_stats_{sport.value}_{game.get('away_team', {}).get('id')}"
                    ]
                    
                    # Use intelligent cache warming
                    async def game_data_fetcher(pattern):
                        # This would fetch related data - placeholder for now
                        return None
                    
                    await intelligent_cache_service.warm_cache(
                        patterns, 
                        game_data_fetcher, 
                        priority="high"
                    )
            
        except Exception as e:
            logger.error(f"❌ Error warming related caches: {e}")

    async def _get_fallback_data(self, sports: List[SportType]) -> Dict[str, Any]:
        """Get fallback data when primary sources fail"""
        fallback_data = {}
        
        for sport in sports:
            # Try to get cached data
            cache_key = f"fallback_sports_data_{sport.value}"
            cached = await intelligent_cache_service.get(cache_key)
            
            if cached:
                fallback_data[sport.value] = cached
            else:
                # Return demo data structure
                fallback_data[sport.value] = {
                    "live_scores": None,
                    "schedules": None,
                    "injuries": None,
                    "error": "Data source unavailable, using fallback"
                }
        
        return {
            "data": fallback_data,
            "metadata": {
                "source": "fallback",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "cache_status": "fallback"
            }
        }

    def _update_response_time_metric(self, response_time: float):
        """Update average response time metric"""
        current_avg = self.integration_metrics["avg_response_time"]
        total_requests = self.integration_metrics["total_requests"]
        
        if total_requests > 1:
            self.integration_metrics["avg_response_time"] = (
                (current_avg * (total_requests - 1) + response_time) / total_requests
            )
        else:
            self.integration_metrics["avg_response_time"] = response_time

    def register_quality_alert_handler(self, handler: callable):
        """Register handler for quality alerts"""
        self.quality_alert_handlers.append(handler)

    async def get_health_status(self) -> Dict[str, Any]:
        """Get overall integration health status"""
        return {
            "integration_manager": {
                "initialized": self.initialized,
                "active_sports": [sport.value for sport in self.active_sports],
                "metrics": self.integration_metrics
            },
            "components": {
                "sportradar": await sportradar_service.get_health_status(),
                "data_pipeline": await enhanced_data_pipeline.get_health_status(),
                "cache_service": await intelligent_cache_service.get_metrics(),
                "quality_monitor": (await data_quality_monitor.get_quality_dashboard())["overview"]
            }
        }

    async def close(self):
        """Cleanup integration manager resources"""
        logger.info("🔄 Shutting down Enhanced Integration Manager...")
        
        # Close all services
        await sportradar_service.close()
        await enhanced_data_pipeline.close()
        await intelligent_cache_service.close()
        await data_quality_monitor.close()
        
        self.initialized = False
        logger.info("✅ Enhanced Integration Manager shutdown completed")


# Global instance
enhanced_integration_manager = EnhancedIntegrationManager()
