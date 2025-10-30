import db from '../config/database.js';
import { logger } from '../utils/logger.js';

// List all leagues
export const listLeagues = async (req, res, next) => {
  try {
    const { is_public } = req.query;
    const userId = req.user?.id;
    
    let query = `
      SELECT l.*, 
        u.username as creator_username,
        COUNT(DISTINCT lm.id) as current_members
      FROM leagues l
      LEFT JOIN users u ON l.created_by_user_id = u.id
      LEFT JOIN league_memberships lm ON l.id = lm.league_id
      WHERE 1=1
    `;
    const params = [];
    
    if (is_public !== undefined) {
      query += ' AND l.is_public = ?';
      params.push(is_public === 'true' || is_public === '1');
    }
    
    // If user is authenticated, also show private leagues they're a member of
    if (userId) {
      query += ` OR l.id IN (
        SELECT lm2.league_id 
        FROM league_memberships lm2
        JOIN fantasy_teams ft ON lm2.fantasy_team_id = ft.id
        WHERE ft.user_id = ?
      )`;
      params.push(userId);
    }
    
    query += ' GROUP BY l.id ORDER BY l.created_at DESC';
    
    const [leagues] = await db.query(query, params);
    
    res.json({
      success: true,
      data: leagues
    });
  } catch (error) {
    next(error);
  }
};

// Get league details
export const getLeagueDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const [leagues] = await db.query(
      `SELECT l.*, 
        u.username as creator_username,
        u.full_name as creator_name,
        COUNT(DISTINCT lm.id) as current_members
      FROM leagues l
      LEFT JOIN users u ON l.created_by_user_id = u.id
      LEFT JOIN league_memberships lm ON l.id = lm.league_id
      WHERE l.id = ?
      GROUP BY l.id`,
      [id]
    );
    
    if (leagues.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'League not found'
      });
    }
    
    const league = leagues[0];
    
    // Check if user has access (public league or member of private league)
    if (!league.is_public && userId) {
      const [membership] = await db.query(
        `SELECT 1 FROM league_memberships lm
         JOIN fantasy_teams ft ON lm.fantasy_team_id = ft.id
         WHERE lm.league_id = ? AND ft.user_id = ?`,
        [id, userId]
      );
      
      if (membership.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to private league'
        });
      }
    }
    
    res.json({
      success: true,
      data: league
    });
  } catch (error) {
    next(error);
  }
};

// Get league leaderboard
export const getLeagueLeaderboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { gameweek_id, limit = 100, offset = 0 } = req.query;
    const userId = req.user?.id;
    
    // Check if league exists and user has access
    const [leagues] = await db.query(
      'SELECT id, league_name, league_code, is_public FROM leagues WHERE id = ?',
      [id]
    );
    
    if (leagues.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'League not found'
      });
    }
    
    const league = leagues[0];
    
    // Check access for private leagues
    if (!league.is_public && userId) {
      const [membership] = await db.query(
        `SELECT 1 FROM league_memberships lm
         JOIN fantasy_teams ft ON lm.fantasy_team_id = ft.id
         WHERE lm.league_id = ? AND ft.user_id = ?`,
        [id, userId]
      );
      
      if (membership.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to private league leaderboard'
        });
      }
    }
    
    // Get leaderboard from view
    let query = `
      SELECT * FROM v_league_leaderboard
      WHERE league_id = ?
    `;
    const params = [id];
    
    if (gameweek_id) {
      // For specific gameweek, we need to recalculate
      query = `
        SELECT 
          l.id AS league_id,
          l.league_name,
          l.league_code,
          ft.id AS fantasy_team_id,
          ft.team_name,
          ft.user_id,
          u.username AS owner_username,
          u.full_name AS owner_full_name,
          COALESCE(SUM(vfgp.total_gameweek_points), 0) AS total_points,
          COALESCE(MAX(
            CASE WHEN vfgp.gameweek_id = ?
            THEN vfgp.total_gameweek_points
            ELSE 0
            END
          ), 0) AS latest_gw_points,
          RANK() OVER (
            PARTITION BY l.id 
            ORDER BY COALESCE(SUM(vfgp.total_gameweek_points), 0) DESC
          ) AS league_rank
        FROM leagues l
        INNER JOIN league_memberships lm ON l.id = lm.league_id
        INNER JOIN fantasy_teams ft ON lm.fantasy_team_id = ft.id
        INNER JOIN users u ON ft.user_id = u.id
        LEFT JOIN v_fantasy_team_gw_points vfgp ON ft.id = vfgp.fantasy_team_id
          AND vfgp.gameweek_id <= ?
        WHERE l.id = ?
        GROUP BY l.id, l.league_name, l.league_code, ft.id, ft.team_name, ft.user_id, u.username, u.full_name
        ORDER BY league_rank
      `;
      params.unshift(gameweek_id, gameweek_id);
      params.push(id);
    }
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const [leaderboard] = await db.query(query, params);
    
    // Get total count for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(DISTINCT lm.fantasy_team_id) as total
       FROM league_memberships lm
       WHERE lm.league_id = ?`,
      [id]
    );
    
    logger.info('Leaderboard accessed', { 
      league_id: id, 
      gameweek_id,
      userId 
    });
    
    res.json({
      success: true,
      data: {
        league: {
          id: league.id,
          league_name: league.league_name,
          league_code: league.league_code
        },
        leaderboard,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: countResult[0].total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create league
export const createLeague = async (req, res, next) => {
  try {
    const { league_name, league_code, is_public, max_members } = req.validatedData;
    const userId = req.user.id;
    
    const [result] = await db.query(
      'INSERT INTO leagues (league_name, league_code, created_by_user_id, is_public, max_members) VALUES (?, ?, ?, ?, ?)',
      [league_name, league_code, userId, is_public !== false, max_members || 100]
    );
    
    logger.info('League created', { 
      id: result.insertId, 
      league_name,
      userId 
    });
    
    res.status(201).json({
      success: true,
      message: 'League created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Join league
export const joinLeague = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fantasy_team_id } = req.validatedData;
    const userId = req.user.id;
    
    // Verify team belongs to user
    const [teams] = await db.query(
      'SELECT id FROM fantasy_teams WHERE id = ? AND user_id = ?',
      [fantasy_team_id, userId]
    );
    
    if (teams.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Fantasy team not found or does not belong to you'
      });
    }
    
    // Check league capacity
    const [leagues] = await db.query(
      `SELECT l.*, COUNT(lm.id) as current_members
       FROM leagues l
       LEFT JOIN league_memberships lm ON l.id = lm.league_id
       WHERE l.id = ?
       GROUP BY l.id`,
      [id]
    );
    
    if (leagues.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'League not found'
      });
    }
    
    const league = leagues[0];
    
    if (league.current_members >= league.max_members) {
      return res.status(400).json({
        success: false,
        message: 'League is full'
      });
    }
    
    // Join league
    try {
      await db.query(
        'INSERT INTO league_memberships (league_id, fantasy_team_id) VALUES (?, ?)',
        [id, fantasy_team_id]
      );
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Team is already a member of this league'
        });
      }
      throw err;
    }
    
    logger.info('Team joined league', { 
      league_id: id, 
      fantasy_team_id,
      userId 
    });
    
    res.json({
      success: true,
      message: 'Successfully joined league'
    });
  } catch (error) {
    next(error);
  }
};

export default {
  listLeagues,
  getLeagueDetails,
  getLeagueLeaderboard,
  createLeague,
  joinLeague
};
