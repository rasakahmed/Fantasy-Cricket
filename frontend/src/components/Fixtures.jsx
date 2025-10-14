import { useState } from 'react'
import { fixtures } from '../data/mockData'
import './Fixtures.css'

function Fixtures() {
  const [filter, setFilter] = useState('all') // all, upcoming, completed

  const filteredFixtures = fixtures.filter(fixture => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return fixture.status === 'Upcoming'
    if (filter === 'completed') return fixture.status === 'Completed'
    return true
  })

  const upcomingFixtures = fixtures.filter(f => f.status === 'Upcoming')
  const completedFixtures = fixtures.filter(f => f.status === 'Completed')

  return (
    <div className="fixtures-container">
      <div className="fixtures-header">
        <h1>📅 Match Fixtures</h1>
        <p>View upcoming and completed cricket matches</p>
      </div>

      <div className="fixtures-summary">
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <div className="summary-value">{fixtures.length}</div>
            <div className="summary-label">Total Matches</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">🔜</div>
          <div className="summary-content">
            <div className="summary-value">{upcomingFixtures.length}</div>
            <div className="summary-label">Upcoming</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-value">{completedFixtures.length}</div>
            <div className="summary-label">Completed</div>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Matches
        </button>
        <button 
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="fixtures-list">
        {filteredFixtures.map(fixture => (
          <div key={fixture.id} className={`fixture-card ${fixture.status.toLowerCase()}`}>
            <div className="fixture-status-badge">
              <span className={`status-dot ${fixture.status.toLowerCase()}`}></span>
              {fixture.status}
            </div>
            
            <div className="fixture-teams">
              <div className="team">
                <div className="team-logo">{fixture.team1}</div>
                <h3>{fixture.team1}</h3>
              </div>
              
              <div className="vs-section">
                <span className="vs-text">VS</span>
              </div>
              
              <div className="team">
                <div className="team-logo">{fixture.team2}</div>
                <h3>{fixture.team2}</h3>
              </div>
            </div>

            <div className="fixture-details">
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span className="detail-text">{fixture.date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏰</span>
                <span className="detail-text">{fixture.time}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{fixture.venue}</span>
              </div>
            </div>

            {fixture.status === 'Upcoming' && (
              <button className="fixture-action-btn">Set Reminder</button>
            )}
            {fixture.status === 'Completed' && (
              <button className="fixture-action-btn secondary">View Scorecard</button>
            )}
          </div>
        ))}
      </div>

      {filteredFixtures.length === 0 && (
        <div className="no-fixtures">
          <p>No {filter !== 'all' ? filter : ''} matches found.</p>
        </div>
      )}
    </div>
  )
}

export default Fixtures