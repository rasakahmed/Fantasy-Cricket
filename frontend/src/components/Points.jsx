import { useState } from 'react'
import { gameweekPoints } from '../data/mockData'
import './Points.css'

function Points({ user }) {
  const [userStats] = useState({
    username: user?.username || 'Player',
    fullName: user?.fullName || 'Cricket Fan',
    overallPoints: 856,
    overallRank: 2341,
    totalUsers: 15420,
    gameweekPoints: 78
  })

  return (
    <div className="points-container">
      <div className="points-header">
        <h1>📊 Points & Rankings</h1>
        <p>Track your performance and player points</p>
      </div>

      <div className="points-content">
        {/* Left Side - User Stats (30%) */}
        <div className="user-stats-section">
          <div className="user-info-card">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <h2>{userStats.username}</h2>
            <p className="full-name">{userStats.fullName}</p>
          </div>

          <div className="stats-cards">
            <div className="stat-card overall-points">
              <div className="stat-icon">⭐</div>
              <div className="stat-details">
                <div className="stat-value">{userStats.overallPoints}</div>
                <div className="stat-label">Overall Points</div>
              </div>
            </div>

            <div className="stat-card overall-rank">
              <div className="stat-icon">🏆</div>
              <div className="stat-details">
                <div className="stat-value">#{userStats.overallRank}</div>
                <div className="stat-label">Overall Rank</div>
              </div>
            </div>

            <div className="stat-card total-users">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <div className="stat-value">{userStats.totalUsers.toLocaleString()}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>

            <div className="stat-card gameweek-points">
              <div className="stat-icon">📈</div>
              <div className="stat-details">
                <div className="stat-value">{userStats.gameweekPoints}</div>
                <div className="stat-label">Gameweek Points</div>
              </div>
            </div>
          </div>

          <div className="rank-progress">
            <h3>Rank Progress</h3>
            <div className="progress-info">
              <p>Top {((userStats.overallRank / userStats.totalUsers) * 100).toFixed(1)}%</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((userStats.overallRank / userStats.totalUsers) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Player Gameweek Points (70%) */}
        <div className="gameweek-points-section">
          <h2>Gameweek Player Points</h2>
          <p className="section-subtitle">Points earned by players in the current gameweek</p>
          
          <div className="points-table-container">
            <table className="points-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player Name</th>
                  <th>Team</th>
                  <th>Role</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {gameweekPoints
                  .sort((a, b) => b.points - a.points)
                  .map((player, index) => (
                    <tr key={player.playerId} className={index < 3 ? 'top-performer' : ''}>
                      <td>
                        <span className={`rank-badge rank-${index + 1}`}>
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </span>
                      </td>
                      <td className="player-name">{player.playerName}</td>
                      <td>{player.team}</td>
                      <td>
                        <span className={`role-badge ${player.role.toLowerCase().replace(' ', '-')}`}>
                          {player.role}
                        </span>
                      </td>
                      <td>
                        <span className="points-value">{player.points}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="points-legend">
            <h3>Points Breakdown</h3>
            <div className="legend-grid">
              <div className="legend-item">
                <span className="legend-icon">🏏</span>
                <span>Runs: 1 point per run</span>
              </div>
              <div className="legend-item">
                <span className="legend-icon">⚾</span>
                <span>Wickets: 25 points per wicket</span>
              </div>
              <div className="legend-item">
                <span className="legend-icon">🎯</span>
                <span>Catches: 8 points per catch</span>
              </div>
              <div className="legend-item">
                <span className="legend-icon">👑</span>
                <span>Captain: 2x points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Points