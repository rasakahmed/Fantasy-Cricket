import { useState } from 'react'
import './League.css'

function League() {
  const [leagues] = useState([
    {
      id: 1,
      name: 'IPL 2024 Championship',
      prize: '₹10,000',
      participants: 1250,
      maxParticipants: 2000,
      entryFee: '₹50',
      status: 'Open',
      startDate: '2024-03-15'
    },
    {
      id: 2,
      name: 'Weekend Warriors',
      prize: '₹5,000',
      participants: 580,
      maxParticipants: 1000,
      entryFee: '₹25',
      status: 'Open',
      startDate: '2024-03-20'
    },
    {
      id: 3,
      name: 'T20 Blast League',
      prize: '₹15,000',
      participants: 2000,
      maxParticipants: 2000,
      entryFee: '₹100',
      status: 'Full',
      startDate: '2024-03-10'
    },
    {
      id: 4,
      name: 'Beginner\'s Tournament',
      prize: '₹2,000',
      participants: 320,
      maxParticipants: 500,
      entryFee: '₹10',
      status: 'Open',
      startDate: '2024-03-25'
    }
  ])

  const [myLeagues] = useState([
    {
      id: 1,
      name: 'IPL 2024 Championship',
      rank: 42,
      points: 850
    },
    {
      id: 2,
      name: 'Weekend Warriors',
      rank: 15,
      points: 1120
    }
  ])

  return (
    <div className="league-container">
      <div className="league-section">
        <h1>🏆 My Leagues</h1>
        <div className="my-leagues-grid">
          {myLeagues.map(league => (
            <div key={league.id} className="my-league-card">
              <h3>{league.name}</h3>
              <div className="my-league-stats">
                <div className="my-league-stat">
                  <span className="stat-label">Rank</span>
                  <span className="stat-value">#{league.rank}</span>
                </div>
                <div className="my-league-stat">
                  <span className="stat-label">Points</span>
                  <span className="stat-value">{league.points}</span>
                </div>
              </div>
              <button className="view-btn">View Details</button>
            </div>
          ))}
        </div>
      </div>

      <div className="league-section">
        <h1>🎯 Available Leagues</h1>
        <div className="leagues-grid">
          {leagues.map(league => (
            <div key={league.id} className={`league-card ${league.status === 'Full' ? 'full' : ''}`}>
              <div className="league-header">
                <h3>{league.name}</h3>
                <span className={`status-badge ${league.status.toLowerCase()}`}>
                  {league.status}
                </span>
              </div>
              
              <div className="league-details">
                <div className="detail-row">
                  <span className="detail-icon">💰</span>
                  <span className="detail-text">Prize Pool: <strong>{league.prize}</strong></span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">🎫</span>
                  <span className="detail-text">Entry Fee: <strong>{league.entryFee}</strong></span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">👥</span>
                  <span className="detail-text">
                    Participants: <strong>{league.participants}/{league.maxParticipants}</strong>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">Starts: <strong>{league.startDate}</strong></span>
                </div>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(league.participants / league.maxParticipants) * 100}%` }}
                ></div>
              </div>
              
              <button 
                className={`join-btn ${league.status === 'Full' ? 'disabled' : ''}`}
                disabled={league.status === 'Full'}
              >
                {league.status === 'Full' ? 'League Full' : 'Join League'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default League