import { useState } from 'react'
import './TeamSelection.css'

function TeamSelection({ user }) {
  const [budget, setBudget] = useState(100)
  const [remainingBudget, setRemainingBudget] = useState(100)
  const [selectedPlayers, setSelectedPlayers] = useState([])

  const [players] = useState([
    {
      id: 1,
      name: 'Virat Kohli',
      role: 'Batsman',
      points: 950,
      price: 12,
      team: 'RCB',
      image: '🏏'
    },
    {
      id: 2,
      name: 'Rohit Sharma',
      role: 'Batsman',
      points: 920,
      price: 11.5,
      team: 'MI',
      image: '🏏'
    },
    {
      id: 3,
      name: 'Jasprit Bumrah',
      role: 'Bowler',
      points: 880,
      price: 11,
      team: 'MI',
      image: '⚾'
    },
    {
      id: 4,
      name: 'MS Dhoni',
      role: 'Wicket-Keeper',
      points: 850,
      price: 10,
      team: 'CSK',
      image: '🧤'
    },
    {
      id: 5,
      name: 'Hardik Pandya',
      role: 'All-Rounder',
      points: 820,
      price: 10.5,
      team: 'GT',
      image: '🌟'
    },
    {
      id: 6,
      name: 'KL Rahul',
      role: 'Batsman',
      points: 790,
      price: 10,
      team: 'LSG',
      image: '🏏'
    },
    {
      id: 7,
      name: 'Rashid Khan',
      role: 'Bowler',
      points: 810,
      price: 9.5,
      team: 'GT',
      image: '⚾'
    },
    {
      id: 8,
      name: 'Andre Russell',
      role: 'All-Rounder',
      points: 780,
      price: 9,
      team: 'KKR',
      image: '🌟'
    }
  ])

  const handleSelectPlayer = (player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id))
      setRemainingBudget(remainingBudget + player.price)
    } else {
      if (selectedPlayers.length < 11 && remainingBudget >= player.price) {
        setSelectedPlayers([...selectedPlayers, player])
        setRemainingBudget(remainingBudget - player.price)
      }
    }
  }

  const isPlayerSelected = (playerId) => {
    return selectedPlayers.some(p => p.id === playerId)
  }

  return (
    <div className="team-selection-container">
      <div className="team-header">
        <h1>🏏 Build Your Dream Team</h1>
        <div className="team-stats">
          <div className="stat-box">
            <span className="stat-label">Budget Remaining</span>
            <span className="stat-value">₹{remainingBudget.toFixed(1)}M</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Players Selected</span>
            <span className="stat-value">{selectedPlayers.length}/11</span>
          </div>
        </div>
      </div>

      <div className="team-content">
        <div className="players-section">
          <h2>Available Players</h2>
          <div className="players-grid">
            {players.map(player => (
              <div 
                key={player.id} 
                className={`player-card ${isPlayerSelected(player.id) ? 'selected' : ''}`}
              >
                <div className="player-image">{player.image}</div>
                <div className="player-info">
                  <h3>{player.name}</h3>
                  <div className="player-meta">
                    <span className="player-team">{player.team}</span>
                    <span className="player-role">{player.role}</span>
                  </div>
                  <div className="player-stats">
                    <span className="player-points">⭐ {player.points} pts</span>
                    <span className="player-price">₹{player.price}M</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleSelectPlayer(player)}
                  className={`select-btn ${isPlayerSelected(player.id) ? 'remove' : ''}`}
                  disabled={!isPlayerSelected(player.id) && (selectedPlayers.length >= 11 || remainingBudget < player.price)}
                >
                  {isPlayerSelected(player.id) ? 'Remove' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="selected-team-section">
          <h2>Your Team ({selectedPlayers.length}/11)</h2>
          {selectedPlayers.length === 0 ? (
            <div className="empty-team">
              <p>Start selecting players to build your team!</p>
            </div>
          ) : (
            <>
              <div className="selected-players-list">
                {selectedPlayers.map(player => (
                  <div key={player.id} className="selected-player-item">
                    <span className="player-icon">{player.image}</span>
                    <div className="player-details">
                      <strong>{player.name}</strong>
                      <span className="role-text">{player.role}</span>
                    </div>
                    <span className="price-tag">₹{player.price}M</span>
                  </div>
                ))}
              </div>
              <button 
                className={`save-team-btn ${selectedPlayers.length === 11 ? 'active' : ''}`}
                disabled={selectedPlayers.length !== 11}
              >
                {selectedPlayers.length === 11 ? 'Save Team' : `Select ${11 - selectedPlayers.length} more players`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamSelection