import db from '../config/database.js';

// List fixtures
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

// Get fixture details
export const getFixtureDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [fixtures] = await db.query(
      `SELECT f.*, 
        gw.gameweek_number, gw.name as gameweek_name,
        ht.name as home_team_name, ht.short_code as home_team_code,
        at.name as away_team_name, at.short_code as away_team_code
       FROM fixtures f
       JOIN gameweeks gw ON f.gameweek_id = gw.id
       JOIN real_teams ht ON f.home_team_id = ht.id
       JOIN real_teams at ON f.away_team_id = at.id
       WHERE f.id = ?`,
      [id]
    );
    
    if (fixtures.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fixture not found'
      });
    }
    
    res.json({
      success: true,
      data: fixtures[0]
    });
  } catch (error) {
    next(error);
  }
};

export default {
  listFixtures,
  getFixtureDetails
};
