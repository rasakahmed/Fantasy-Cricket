-- Fantasy Cricket Scoring Views
-- Migration 003: Views for Scoring System
-- These views implement the exact scoring logic as specified

-- Drop existing views if they exist
DROP VIEW IF EXISTS v_league_leaderboard;
DROP VIEW IF EXISTS v_fantasy_team_gw_points;
DROP VIEW IF EXISTS v_player_gw_base_points;

-- View 1: Player Gameweek Base Points
-- Calculates base points for each player per gameweek based on their performance
CREATE VIEW v_player_gw_base_points AS
SELECT 
    pgp.id,
    pgp.player_id,
    pgp.gameweek_id,
    pgp.fixture_id,
    p.name AS player_name,
    p.role,
    rt.short_code AS team_code,
    
    -- Batting points calculation
    (pgp.runs_scored * 1) AS runs_points,
    (pgp.fours * 2) AS fours_points,
    (pgp.sixes * 3) AS sixes_points,
    (CASE WHEN pgp.is_duck = TRUE THEN -2 ELSE 0 END) AS duck_penalty,
    
    -- Bowling points calculation
    (pgp.wickets * 25) AS wickets_points,
    (pgp.maiden_overs * 8) AS maiden_points,
    (pgp.dot_balls * 4) AS dot_ball_points,
    (CASE 
        WHEN pgp.wickets >= 5 THEN 20
        WHEN pgp.wickets = 4 THEN 15
        WHEN pgp.wickets = 3 THEN 10
        ELSE 0
    END) AS haul_bonus,
    
    -- Fielding points calculation
    (pgp.catches * 8) AS catch_points,
    (pgp.stumpings * 12) AS stumping_points,
    (pgp.run_outs * 6) AS run_out_points,
    
    -- Total base points
    (
        (pgp.runs_scored * 1) +
        (pgp.fours * 2) +
        (pgp.sixes * 3) +
        (CASE WHEN pgp.is_duck = TRUE THEN -2 ELSE 0 END) +
        (pgp.wickets * 25) +
        (pgp.maiden_overs * 8) +
        (pgp.dot_balls * 4) +
        (CASE 
            WHEN pgp.wickets >= 5 THEN 20
            WHEN pgp.wickets = 4 THEN 15
            WHEN pgp.wickets = 3 THEN 10
            ELSE 0
        END) +
        (pgp.catches * 8) +
        (pgp.stumpings * 12) +
        (pgp.run_outs * 6)
    ) AS base_points
    
FROM player_gameweek_points pgp
INNER JOIN players p ON pgp.player_id = p.id
INNER JOIN real_teams rt ON p.real_team_id = rt.id;

-- View 2: Fantasy Team Gameweek Points
-- Calculates total points for fantasy teams per gameweek with captain/vice-captain multipliers
CREATE VIEW v_fantasy_team_gw_points AS
SELECT 
    fts.id AS squad_id,
    fts.fantasy_team_id,
    ft.team_name,
    ft.user_id,
    u.username,
    fts.gameweek_id,
    gw.gameweek_number,
    
    -- Captain and vice-captain info
    fts.captain_player_id,
    fts.vice_captain_player_id,
    
    -- Sum of all squad player points with captain logic
    SUM(
        CASE
            -- Captain gets 2x points
            WHEN ftsp.player_id = fts.captain_player_id THEN 
                COALESCE(vpb.base_points, 0) * 2
            -- Vice-captain gets 2x only if captain scored 0 base points
            WHEN ftsp.player_id = fts.vice_captain_player_id THEN
                CASE 
                    WHEN COALESCE((
                        SELECT base_points 
                        FROM v_player_gw_base_points 
                        WHERE player_id = fts.captain_player_id 
                          AND gameweek_id = fts.gameweek_id
                        LIMIT 1
                    ), 0) = 0 THEN COALESCE(vpb.base_points, 0) * 2
                    ELSE COALESCE(vpb.base_points, 0)
                END
            -- Regular players get 1x points
            ELSE COALESCE(vpb.base_points, 0)
        END
    ) AS total_gameweek_points,
    
    -- Count of players with points
    COUNT(DISTINCT ftsp.player_id) AS players_count
    
FROM fantasy_team_squads fts
INNER JOIN fantasy_teams ft ON fts.fantasy_team_id = ft.id
INNER JOIN users u ON ft.user_id = u.id
INNER JOIN gameweeks gw ON fts.gameweek_id = gw.id
LEFT JOIN fantasy_team_squad_players ftsp ON fts.id = ftsp.squad_id
LEFT JOIN v_player_gw_base_points vpb ON ftsp.player_id = vpb.player_id 
    AND fts.gameweek_id = vpb.gameweek_id
WHERE fts.is_submitted = TRUE
GROUP BY 
    fts.id,
    fts.fantasy_team_id,
    ft.team_name,
    ft.user_id,
    u.username,
    fts.gameweek_id,
    gw.gameweek_number,
    fts.captain_player_id,
    fts.vice_captain_player_id;

-- View 3: League Leaderboard
-- Provides per-league rankings with total and gameweek points
CREATE VIEW v_league_leaderboard AS
SELECT 
    l.id AS league_id,
    l.league_name,
    l.league_code,
    ft.id AS fantasy_team_id,
    ft.team_name,
    ft.user_id,
    u.username AS owner_username,
    u.full_name AS owner_full_name,
    
    -- Total points across all gameweeks
    COALESCE(SUM(vfgp.total_gameweek_points), 0) AS total_points,
    
    -- Latest gameweek points (for current GW display)
    COALESCE(MAX(
        CASE WHEN vfgp.gameweek_id = (SELECT MAX(id) FROM gameweeks WHERE is_completed = TRUE)
        THEN vfgp.total_gameweek_points
        ELSE 0
        END
    ), 0) AS latest_gw_points,
    
    -- Rank within league using RANK() window function
    RANK() OVER (
        PARTITION BY l.id 
        ORDER BY COALESCE(SUM(vfgp.total_gameweek_points), 0) DESC
    ) AS league_rank
    
FROM leagues l
INNER JOIN league_memberships lm ON l.id = lm.league_id
INNER JOIN fantasy_teams ft ON lm.fantasy_team_id = ft.id
INNER JOIN users u ON ft.user_id = u.id
LEFT JOIN v_fantasy_team_gw_points vfgp ON ft.id = vfgp.fantasy_team_id
GROUP BY 
    l.id,
    l.league_name,
    l.league_code,
    ft.id,
    ft.team_name,
    ft.user_id,
    u.username,
    u.full_name
ORDER BY 
    l.id,
    league_rank;
