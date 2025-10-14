import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MainMenu.css'

function MainMenu({ user }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    overallPoints: 0,
    overallRank: 0,
    totalUsers: 15420,
    gameweekPoints: 0,
    teamsCreated: 0,
    leaguesJoined: 0
  })

  useEffect(() => {
    // Load user stats from localStorage
    const storedTeam = localStorage.getItem('userTeam')
    const storedLeagues = localStorage.getItem('userLeagues')
    
    if (storedTeam) {
      setStats(prev => ({
        ...prev,
        teamsCreated: 1,
        overallPoints: 856,
        overallRank: 2341,
        gameweekPoints: 78
      }))
    }
    
    if (storedLeagues) {
      const leagues = JSON.parse(storedLeagues)
      setStats(prev => ({
        ...prev,
        leaguesJoined: leagues.length
      }))
    }
  }, [])

  return (
    <div className="main-menu-container">
      <div className="welcome-section">
        <h1>Welcome back, {user?.username || 'Player'}! 🏏</h1>
        <p className="welcome-subtitle">Ready to dominate the fantasy cricket world?</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{stats.overallPoints}</div>
            <div className="stat-label">Overall Points</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">#{stats.overallRank || 'N/A'}</div>
            <div className="stat-label">Overall Rank</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.gameweekPoints}</div>
            <div className="stat-label">Gameweek Points</div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.teamsCreated}</div>
            <div className="stat-label">Teams Created</div>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🎪</div>
          <div className="stat-content">
            <div className="stat-value">{stats.leaguesJoined}</div>
            <div className="stat-label">Leagues Joined</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate('/add-team')}>
            <span className="action-icon">➕</span>
            <h3>Add Team</h3>
            <p>Create your dream team</p>
          </div>

          <div className="action-card" onClick={() => navigate('/modify-team')}>
            <span className="action-icon">✏️</span>
            <h3>Modify Team</h3>
            <p>Update your squad</p>
          </div>

          <div className="action-card" onClick={() => navigate('/leagues')}>
            <span className="action-icon">🏆</span>
            <h3>Join League</h3>
            <p>Compete with others</p>
          </div>

          <div className="action-card" onClick={() => navigate('/points')}>
            <span className="action-icon">📈</span>
            <h3>View Points</h3>
            <p>Check your performance</p>
          </div>

          <div className="action-card" onClick={() => navigate('/fixtures')}>
            <span className="action-icon">📅</span>
            <h3>Fixtures</h3>
            <p>Upcoming matches</p>
          </div>

          <div className="action-card" onClick={() => navigate('/stats')}>
            <span className="action-icon">📊</span>
            <h3>Player Stats</h3>
            <p>Analyze players</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">✅</span>
            <div className="activity-content">
              <p className="activity-text">Account created successfully</p>
              <p className="activity-time">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainMenu