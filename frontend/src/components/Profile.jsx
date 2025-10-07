import { useState } from 'react'
import './Profile.css'

function Profile({ user }) {
  const [stats] = useState({
    totalPoints: 1250,
    matchesPlayed: 15,
    wins: 8,
    rank: 342,
    teamsCreated: 3,
    achievements: [
      '🏆 Top 500 Player',
      '⭐ 5 Consecutive Wins',
      '🎯 Perfect Captain Pick'
    ]
  })

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <div className="profile-info">
          <h1>{user?.username || 'Cricket Fan'}</h1>
          <p>{user?.email || 'user@example.com'}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalPoints}</div>
          <div className="stat-label">Total Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.matchesPlayed}</div>
          <div className="stat-label">Matches Played</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.wins}</div>
          <div className="stat-label">Wins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">#{stats.rank}</div>
          <div className="stat-label">Global Rank</div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>🏅 Achievements</h2>
        <div className="achievements-list">
          {stats.achievements.map((achievement, index) => (
            <div key={index} className="achievement-item">
              {achievement}
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h2>📊 Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">🏏</span>
            <div className="activity-details">
              <p className="activity-title">Joined IPL League 2024</p>
              <p className="activity-time">2 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">✅</span>
            <div className="activity-details">
              <p className="activity-title">Team "Champions XI" created</p>
              <p className="activity-time">1 day ago</p>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🎉</span>
            <div className="activity-details">
              <p className="activity-title">Won "Weekend Warriors" league</p>
              <p className="activity-time">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile