import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { gameweekPoints } from '../data/mockData'
import './Points.css'

function Points({ user }) {
  const navigate = useNavigate()

  const userTeam = useMemo(() => {
    try {
      const raw = localStorage.getItem('userTeam')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  const pointsMap = useMemo(() => {
    const map = new Map()
    gameweekPoints.forEach(p => map.set(p.playerId, p.points))
    return map
  }, [])

  const listItems = useMemo(() => {
    if (!userTeam) return []

    const selected = Object.values(userTeam.players).filter(Boolean)
    const captainId = userTeam.captain
    const viceId = userTeam.viceCaptain
    const captainPlayed = pointsMap.has(captainId)

    return selected.map(p => {
      const base = pointsMap.get(p.id) ?? 0
      let pts = base
      let note = ''
      if (p.id === captainId) {
        pts = base * 2
        note = 'Captain (2x)'
      } else if (!captainPlayed && p.id === viceId) {
        pts = base * 2
        note = 'Vice Captain (2x, Captain DNP)'
      }
      return {
        id: p.id,
        name: p.name,
        role: p.role,
        team: p.team,
        isCaptain: p.id === captainId,
        isVice: p.id === viceId,
        note,
        points: pts
      }
    }).sort((a, b) => b.points - a.points)
  }, [userTeam, pointsMap])

  const totals = useMemo(() => {
    const overallPoints = 856 // demo; you can persist and update this if needed
    const overallRank = 2341
    const totalUsers = 15420
    const gwPoints = listItems.reduce((sum, p) => sum + p.points, 0)
    return { overallPoints, overallRank, totalUsers, gwPoints }
  }, [listItems])

  if (!userTeam) {
    return (
      <div className="points-container">
        <div className="points-header">
          <h1>📊 Points & Rankings</h1>
          <p>Track your performance and player points</p>
        </div>
        <div className="no-team-message card">
          <h2>No Team Found</h2>
          <p>You need to create a team to view your gameweek player points.</p>
          <button className="cta-btn" onClick={() => navigate('/add-team')}>
            Create Your Team
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="points-container">
      <div className="points-header">
        <h1>📊 Points & Rankings</h1>
        <p>Track your performance and your players' gameweek points</p>
      </div>

      <div className="points-content">
        {/* Left: user stats */}
        <div className="user-stats-section">
          <div className="user-info-card">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <h2>{user?.username || 'Player'}</h2>
            <p className="full-name">{user?.fullName || 'Cricket Fan'}</p>
          </div>

          <div className="stats-cards">
            <div className="stat-card overall-points">
              <div className="stat-icon">⭐</div>
              <div className="stat-details">
                <div className="stat-value">{totals.overallPoints}</div>
                <div className="stat-label">Overall Points</div>
              </div>
            </div>
            <div className="stat-card overall-rank">
              <div className="stat-icon">🏆</div>
              <div className="stat-details">
                <div className="stat-value">#{totals.overallRank}</div>
                <div className="stat-label">Overall Rank</div>
              </div>
            </div>
            <div className="stat-card total-users">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <div className="stat-value">{totals.totalUsers.toLocaleString()}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            <div className="stat-card gameweek-points">
              <div className="stat-icon">📈</div>
              <div className="stat-details">
                <div className="stat-value">{totals.gwPoints}</div>
                <div className="stat-label">Gameweek Points</div>
              </div>
            </div>
          </div>

          <div className="rank-progress">
            <h3>Rank Progress</h3>
            <div className="progress-info">
              <p>Top {((totals.overallRank / totals.totalUsers) * 100).toFixed(1)}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((totals.overallRank / totals.totalUsers) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: user's players list */}
        <div className="gameweek-points-section">
          <h2>Your Players — Gameweek Points</h2>
          <p className="section-subtitle">Only the players selected in your team are shown here.</p>

          <div className="player-list">
            {listItems.map(p => (
              <div className="player-list-item" key={p.id}>
                <div className="left">
                  <div className="avatar">
                    {p.role === 'Batsman' ? '🏏' : p.role === 'Bowler' ? '⚾' : p.role === 'Wicket Keeper' ? '🧤' : '🌟'}
                  </div>
                  <div className="info">
                    <div className="name-row">
                      <strong>{p.name}</strong>
                      {p.isCaptain && <span className="chip captain">C</span>}
                      {p.isVice && <span className="chip vice">VC</span>}
                    </div>
                    <div className="meta">
                      <span className={`role-badge ${p.role.toLowerCase().replace(' ', '-')}`}>{p.role}</span>
                      <span className="team-badge">{p.team}</span>
                    </div>
                  </div>
                </div>
                <div className="right">
                  {p.note && <div className="note">{p.note}</div>}
                  <div className="points">{p.points}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="player-list-footer">
            <div className="total-row">
              <span>Total Gameweek Points</span>
              <strong>{totals.gwPoints}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Points