import db from '../config/database.js';

// List all active players
export const listPlayers = async (req, res, next) => {
  try {
    const { role, team_id, max_cost, is_active = true } = req.query;
    
    let query = `
      SELECT p.*, rt.name as team_name, rt.short_code as team_code
      FROM players p
      JOIN real_teams rt ON p.real_team_id = rt.id
      WHERE p.is_active = ?
    `;
    const params = [is_active !== 'false' && is_active !== '0'];
    
    if (role) {
      query += ' AND p.role = ?';
      params.push(role);
    }
    
    if (team_id) {
      query += ' AND p.real_team_id = ?';
      params.push(team_id);
    }
    
    if (max_cost) {
      query += ' AND p.cost <= ?';
      params.push(parseFloat(max_cost));
    }
    
    query += ' ORDER BY p.cost DESC, p.name ASC';
    
    const [players] = await db.query(query, params);
    
    res.json({
      success: true,
      data: players
    });
  } catch (error) {
    next(error);
  }
};

// Get player details
export const getPlayerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [players] = await db.query(
      `SELECT p.*, rt.name as team_name, rt.short_code as team_code
       FROM players p
       JOIN real_teams rt ON p.real_team_id = rt.id
       WHERE p.id = ?`,
      [id]
    );
    
    if (players.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    
    res.json({
      success: true,
      data: players[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get player stats
export const getPlayerStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { gameweek_id } = req.query;
    
    // Get player info
    const [players] = await db.query(
      'SELECT id, name, role FROM players WHERE id = ?',
      [id]
    );
    
    if (players.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    
    const player = players[0];
    
    // Get stats from view
    let statsQuery = `
      SELECT * FROM v_player_gw_base_points
      WHERE player_id = ?
    `;
    const params = [id];
    
    if (gameweek_id) {
      statsQuery += ' AND gameweek_id = ?';
      params.push(gameweek_id);
    }
    
    statsQuery += ' ORDER BY gameweek_id DESC';
    
    const [gameweekStats] = await db.query(statsQuery, params);
    
    // Calculate aggregate stats
    const totalPoints = gameweekStats.reduce((sum, gw) => sum + (gw.base_points || 0), 0);
    const matchesPlayed = gameweekStats.length;
    const averagePoints = matchesPlayed > 0 ? totalPoints / matchesPlayed : 0;
    const recentForm = gameweekStats.slice(0, 5).map(gw => gw.base_points || 0);
    
    res.json({
      success: true,
      data: {
        player,
        stats: {
          total_points: totalPoints,
          matches_played: matchesPlayed,
          average_points: Math.round(averagePoints * 10) / 10,
          recent_form: recentForm
        },
        gameweek_details: gameweekStats
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  listPlayers,
  getPlayerDetails,
  getPlayerStats
};
