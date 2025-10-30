-- Fantasy Cricket Performance Indexes
-- Migration 004: Strategic Indexes for Query Performance

-- Additional indexes for frequently queried fields and common JOIN operations

-- Users indexes (already has idx_email, idx_username from schema)
-- Add index for admin queries
CREATE INDEX IF NOT EXISTS idx_users_admin ON users(is_admin) WHERE is_admin = TRUE;

-- Players indexes
-- Composite index for filtering by team and role
CREATE INDEX IF NOT EXISTS idx_players_team_role ON players(real_team_id, role);
-- Index for active player queries
CREATE INDEX IF NOT EXISTS idx_players_active_cost ON players(is_active, cost);

-- Gameweeks indexes
-- Composite index for active gameweek queries
CREATE INDEX IF NOT EXISTS idx_gameweeks_status ON gameweeks(is_active, is_completed);

-- Fixtures indexes
-- Composite index for gameweek and status queries
CREATE INDEX IF NOT EXISTS idx_fixtures_gw_status ON fixtures(gameweek_id, status);
-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_fixtures_date_status ON fixtures(match_date, status);

-- Fantasy teams indexes
-- Composite index for user's teams
CREATE INDEX IF NOT EXISTS idx_fantasy_teams_user_created ON fantasy_teams(user_id, created_at DESC);

-- Fantasy team squads indexes
-- Composite index for team gameweek queries with submission status
CREATE INDEX IF NOT EXISTS idx_squads_team_gw_submitted ON fantasy_team_squads(fantasy_team_id, gameweek_id, is_submitted);
-- Index for gameweek squad queries
CREATE INDEX IF NOT EXISTS idx_squads_gw_submitted ON fantasy_team_squads(gameweek_id, is_submitted);

-- Fantasy team squad players indexes
-- Composite index for squad queries
CREATE INDEX IF NOT EXISTS idx_squad_players_squad_playing ON fantasy_team_squad_players(squad_id, is_playing_11);

-- Leagues indexes
-- Index for public league browsing
CREATE INDEX IF NOT EXISTS idx_leagues_public_created ON leagues(is_public, created_at DESC);

-- League memberships indexes
-- Composite index for team's league memberships
CREATE INDEX IF NOT EXISTS idx_memberships_team_joined ON league_memberships(fantasy_team_id, joined_at DESC);

-- Player gameweek points indexes (already has basic indexes)
-- Composite index for player performance queries
CREATE INDEX IF NOT EXISTS idx_pgp_player_gw_points ON player_gameweek_points(player_id, gameweek_id, total_points DESC);
-- Composite index for gameweek leaderboard
CREATE INDEX IF NOT EXISTS idx_pgp_gw_points ON player_gameweek_points(gameweek_id, total_points DESC);
-- Index for fixture-based queries
CREATE INDEX IF NOT EXISTS idx_pgp_fixture_player ON player_gameweek_points(fixture_id, player_id);

-- Covering indexes for common query patterns

-- Index for league leaderboard queries (covering index)
CREATE INDEX IF NOT EXISTS idx_memberships_league_team_joined ON league_memberships(league_id, fantasy_team_id, joined_at);

-- Index for user authentication queries
CREATE INDEX IF NOT EXISTS idx_users_email_password ON users(email, password_hash);

-- Index for captain/vice-captain queries
CREATE INDEX IF NOT EXISTS idx_squads_captains ON fantasy_team_squads(captain_player_id, vice_captain_player_id);

-- Analyze tables to update statistics for query optimizer
ANALYZE TABLE users;
ANALYZE TABLE real_teams;
ANALYZE TABLE players;
ANALYZE TABLE gameweeks;
ANALYZE TABLE fixtures;
ANALYZE TABLE fantasy_teams;
ANALYZE TABLE fantasy_team_squads;
ANALYZE TABLE fantasy_team_squad_players;
ANALYZE TABLE leagues;
ANALYZE TABLE league_memberships;
ANALYZE TABLE player_gameweek_points;
