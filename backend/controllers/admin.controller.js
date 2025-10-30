import db from '../config/database.js';
import { logger } from '../utils/logger.js';

// List all gameweeks
export const listGameweeks = async (req, res, next) => {
  try {
    const { is_active, is_completed } = req.query;
    
    let query = 'SELECT * FROM gameweeks WHERE 1=1';
    const params = [];
    
    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active === 'true' || is_active === '1');
    }
    
    if (is_completed !== undefined) {
      query += ' AND is_completed = ?';
      params.push(is_completed === 'true' || is_completed === '1');
    }
    
    query += ' ORDER BY gameweek_number ASC';
    
    const [gameweeks] = await db.query(query, params);
    
    res.json({
      success: true,
      data: gameweeks
    });
  } catch (error) {
    next(error);
  }
};

// Create a new gameweek
export const createGameweek = async (req, res, next) => {
  try {
    const { gameweek_number, name, start_date, end_date, is_active } = req.validatedData;
    
    const [result] = await db.query(
      'INSERT INTO gameweeks (gameweek_number, name, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?)',
      [gameweek_number, name, start_date, end_date, is_active || false]
    );
    
    logger.info('Gameweek created', { 
      id: result.insertId, 
      gameweek_number, 
      name,
      userId: req.user.id 
    });
    
    res.status(201).json({
      success: true,
      message: 'Gameweek created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Update gameweek
export const updateGameweek = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.validatedData;
    
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });
    
    values.push(id);
    
    const [result] = await db.query(
      `UPDATE gameweeks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gameweek not found'
      });
    }
    
    logger.info('Gameweek updated', { id, updates, userId: req.user.id });
    
    res.json({
      success: true,
      message: 'Gameweek updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete gameweek
export const deleteGameweek = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM gameweeks WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gameweek not found'
      });
    }
    
    logger.info('Gameweek deleted', { id, userId: req.user.id });
    
    res.json({
      success: true,
      message: 'Gameweek deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// List all fixtures
export const listFixtures = async (req, res, next) => {
  try {
    const { gameweek_id, status } = req.query;
    
    let query = `
      SELECT f.*, 
        gw.gameweek_number, gw.name as gameweek_name,
        ht.name as home_team_name, ht.short_code as home_team_code,
        at.name as away_team_name, at.short_code as away_team_code
      FROM fixtures f
      JOIN gameweeks gw ON f.gameweek_id = gw.id
      JOIN real_teams ht ON f.home_team_id = ht.id
      JOIN real_teams at ON f.away_team_id = at.id
      WHERE 1=1
    `;
    const params = [];
    
    if (gameweek_id) {
      query += ' AND f.gameweek_id = ?';
      params.push(gameweek_id);
    }
    
    if (status) {
      query += ' AND f.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY f.match_date ASC';
    
    const [fixtures] = await db.query(query, params);
    
    res.json({
      success: true,
      data: fixtures
    });
  } catch (error) {
    next(error);
  }
};

// Create fixture
export const createFixture = async (req, res, next) => {
  try {
    const { gameweek_id, home_team_id, away_team_id, match_date, venue, status } = req.validatedData;
    
    // Validate teams are different
    if (home_team_id === away_team_id) {
      return res.status(400).json({
        success: false,
        message: 'Home team and away team must be different'
      });
    }
    
    const [result] = await db.query(
      'INSERT INTO fixtures (gameweek_id, home_team_id, away_team_id, match_date, venue, status) VALUES (?, ?, ?, ?, ?, ?)',
      [gameweek_id, home_team_id, away_team_id, match_date, venue, status || 'Scheduled']
    );
    
    logger.info('Fixture created', { 
      id: result.insertId, 
      gameweek_id,
      userId: req.user.id 
    });
    
    res.status(201).json({
      success: true,
      message: 'Fixture created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Update fixture
export const updateFixture = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.validatedData;
    
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });
    
    values.push(id);
    
    const [result] = await db.query(
      `UPDATE fixtures SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fixture not found'
      });
    }
    
    logger.info('Fixture updated', { id, updates, userId: req.user.id });
    
    res.json({
      success: true,
      message: 'Fixture updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add player points
export const addPlayerPoints = async (req, res, next) => {
  try {
    const {
      player_id,
      gameweek_id,
      fixture_id,
      runs_scored = 0,
      fours = 0,
      sixes = 0,
      is_duck = false,
      wickets = 0,
      maiden_overs = 0,
      dot_balls = 0,
      catches = 0,
      stumpings = 0,
      run_outs = 0
    } = req.validatedData;
    
    // Calculate points
    const batting_points = (runs_scored * 1) + (fours * 2) + (sixes * 3) + (is_duck ? -2 : 0);
    const haul_bonus = wickets >= 5 ? 20 : wickets === 4 ? 15 : wickets === 3 ? 10 : 0;
    const bowling_points = (wickets * 25) + (maiden_overs * 8) + (dot_balls * 4) + haul_bonus;
    const fielding_points = (catches * 8) + (stumpings * 12) + (run_outs * 6);
    const total_points = batting_points + bowling_points + fielding_points;
    
    const [result] = await db.query(
      `INSERT INTO player_gameweek_points 
       (player_id, gameweek_id, fixture_id, runs_scored, fours, sixes, is_duck, 
        wickets, maiden_overs, dot_balls, catches, stumpings, run_outs,
        batting_points, bowling_points, fielding_points, total_points)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       runs_scored = VALUES(runs_scored), fours = VALUES(fours), sixes = VALUES(sixes),
       is_duck = VALUES(is_duck), wickets = VALUES(wickets), maiden_overs = VALUES(maiden_overs),
       dot_balls = VALUES(dot_balls), catches = VALUES(catches), stumpings = VALUES(stumpings),
       run_outs = VALUES(run_outs), batting_points = VALUES(batting_points),
       bowling_points = VALUES(bowling_points), fielding_points = VALUES(fielding_points),
       total_points = VALUES(total_points)`,
      [player_id, gameweek_id, fixture_id, runs_scored, fours, sixes, is_duck,
       wickets, maiden_overs, dot_balls, catches, stumpings, run_outs,
       batting_points, bowling_points, fielding_points, total_points]
    );
    
    logger.info('Player points added/updated', { 
      player_id, 
      gameweek_id, 
      total_points,
      userId: req.user.id 
    });
    
    res.status(201).json({
      success: true,
      message: result.insertId ? 'Player points added successfully' : 'Player points updated successfully',
      data: { total_points }
    });
  } catch (error) {
    next(error);
  }
};

// Bulk add player points (CSV or array)
export const bulkAddPlayerPoints = async (req, res, next) => {
  try {
    const { points } = req.body;
    
    if (!Array.isArray(points) || points.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Points array is required and must not be empty'
      });
    }
    
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      let inserted = 0;
      let updated = 0;
      const errors = [];
      
      for (const point of points) {
        try {
          const {
            player_id, gameweek_id, fixture_id,
            runs_scored = 0, fours = 0, sixes = 0, is_duck = false,
            wickets = 0, maiden_overs = 0, dot_balls = 0,
            catches = 0, stumpings = 0, run_outs = 0
          } = point;
          
          // Calculate points
          const batting_points = (runs_scored * 1) + (fours * 2) + (sixes * 3) + (is_duck ? -2 : 0);
          const haul_bonus = wickets >= 5 ? 20 : wickets === 4 ? 15 : wickets === 3 ? 10 : 0;
          const bowling_points = (wickets * 25) + (maiden_overs * 8) + (dot_balls * 4) + haul_bonus;
          const fielding_points = (catches * 8) + (stumpings * 12) + (run_outs * 6);
          const total_points = batting_points + bowling_points + fielding_points;
          
          const [result] = await connection.query(
            `INSERT INTO player_gameweek_points 
             (player_id, gameweek_id, fixture_id, runs_scored, fours, sixes, is_duck, 
              wickets, maiden_overs, dot_balls, catches, stumpings, run_outs,
              batting_points, bowling_points, fielding_points, total_points)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             runs_scored = VALUES(runs_scored), fours = VALUES(fours), sixes = VALUES(sixes),
             is_duck = VALUES(is_duck), wickets = VALUES(wickets), maiden_overs = VALUES(maiden_overs),
             dot_balls = VALUES(dot_balls), catches = VALUES(catches), stumpings = VALUES(stumpings),
             run_outs = VALUES(run_outs), batting_points = VALUES(batting_points),
             bowling_points = VALUES(bowling_points), fielding_points = VALUES(fielding_points),
             total_points = VALUES(total_points)`,
            [player_id, gameweek_id, fixture_id, runs_scored, fours, sixes, is_duck,
             wickets, maiden_overs, dot_balls, catches, stumpings, run_outs,
             batting_points, bowling_points, fielding_points, total_points]
          );
          
          if (result.insertId) {
            inserted++;
          } else {
            updated++;
          }
        } catch (err) {
          errors.push({
            player_id: point.player_id,
            error: err.message
          });
        }
      }
      
      await connection.commit();
      
      logger.info('Bulk player points processed', { 
        inserted, 
        updated, 
        errors: errors.length,
        userId: req.user.id 
      });
      
      res.json({
        success: true,
        message: 'Bulk upload completed',
        data: { inserted, updated, errors }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

export default {
  listGameweeks,
  createGameweek,
  updateGameweek,
  deleteGameweek,
  listFixtures,
  createFixture,
  updateFixture,
  addPlayerPoints,
  bulkAddPlayerPoints
};
