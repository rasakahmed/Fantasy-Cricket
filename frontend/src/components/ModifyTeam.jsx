import { useState, useEffect } from 'react'
import { players } from '../data/mockData'
import './ModifyTeam.css'

function ModifyTeam() {
  const [currentTeam, setCurrentTeam] = useState(null)
  const [modifiedPosition, setModifiedPosition] = useState('')
  const [newPlayer, setNewPlayer] = useState(null)
  const [captain, setCaptain] = useState(null)
  const [viceCaptain, setViceCaptain] = useState(null)
  const [hasModifiedThisWeek, setHasModifiedThisWeek] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const storedTeam = localStorage.getItem('userTeam')
    if (storedTeam) {
      const team = JSON.parse(storedTeam)
      setCurrentTeam(team)
      setCaptain(team.captain)
      setViceCaptain(team.viceCaptain)
    }
    
    // Check if user has already modified this week
    const lastModified = localStorage.getItem('lastModifiedWeek')
    const currentWeek = getCurrentGameweek()
    if (lastModified === currentWeek.toString()) {
      setHasModifiedThisWeek(true)
    }
  }, [])

  const getCurrentGameweek = () => {
    // Simple gameweek calculation based on date
    const startDate = new Date('2025-10-01')
    const today = new Date()
    const diffTime = Math.abs(today - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.ceil(diffDays / 7)
  }

  const getPositionLabel = (position) => {
    const labels = {
      batsman1: 'Batsman 1',
      batsman2: 'Batsman 2',
      batsman3: 'Batsman 3',
      wicketKeeper: 'Wicket Keeper',
      bowler1: 'Bowler 1',
      bowler2: 'Bowler 2',
      bowler3: 'Bowler 3',
      mixRole1: 'Mix Role 1',
      mixRole2: 'Mix Role 2',
      mixRole3: 'Mix Role 3',
      mixRole4: 'Mix Role 4'
    }
    return labels[position] || position
  }

  const getAvailablePlayers = (position) => {
    if (position.startsWith('batsman')) {
      return players.filter(p => p.role === 'Batsman')
    } else if (position === 'wicketKeeper') {
      return players.filter(p => p.role === 'Wicket Keeper')
    } else if (position.startsWith('bowler')) {
      return players.filter(p => p.role === 'Bowler')
    } else {
      return players
    }
  }

  const handleSaveModification = () => {
    if (!modifiedPosition && captain === currentTeam.captain && viceCaptain === currentTeam.viceCaptain) {
      alert('No changes made!')
      return
    }

    if (modifiedPosition && !newPlayer) {
      alert('Please select a new player for the position!')
      return
    }

    if (modifiedPosition && hasModifiedThisWeek) {
      alert('You can only modify one player per gameweek!')
      return
    }

    const updatedTeam = {
      ...currentTeam,
      captain,
      viceCaptain
    }

    if (modifiedPosition && newPlayer) {
      updatedTeam.players = {
        ...currentTeam.players,
        [modifiedPosition]: newPlayer
      }
      
      // Mark as modified this week
      localStorage.setItem('lastModifiedWeek', getCurrentGameweek().toString())
      setHasModifiedThisWeek(true)
    }

    localStorage.setItem('userTeam', JSON.stringify(updatedTeam))
    setCurrentTeam(updatedTeam)
    setShowSuccess(true)
    setModifiedPosition('')
    setNewPlayer(null)

    setTimeout(() => setShowSuccess(false), 5000)
  }

  const handleCaptainChange = (playerId) => {
    if (viceCaptain === playerId) {
      alert('This player is already the vice captain!')
      return
    }
    setCaptain(playerId)
  }

  const handleViceCaptainChange = (playerId) => {
    if (captain === playerId) {
      alert('This player is already the captain!')
      return
    }
    setViceCaptain(playerId)
  }

  if (!currentTeam) {
    return (
      <div className="modify-team-container">
        <div className="no-team-message">
          <h2>No Team Found</h2>
          <p>Please create a team first before modifying.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="modify-team-container">
      <div className="modify-team-header">
        <h1>✏️ Modify Your Team</h1>
        <p>Change one player per gameweek or update captain anytime</p>
      </div>

      {showSuccess && (
        <div className="success-message">
          <h3>✅ Team Modified Successfully!</h3>
          <p>Your changes have been saved.</p>
        </div>
      )}

      {hasModifiedThisWeek && !showSuccess && (
        <div className="warning-message">
          <p>⚠️ You have already modified a player this gameweek. You can only change captain/vice-captain.</p>
        </div>
      )}

      <div className="current-team-section">
        <h2>Current Team: {currentTeam.name}</h2>
        <div className="team-players-grid">
          {Object.entries(currentTeam.players).map(([position, player]) => (
            <div key={position} className="current-player-card">
              <div className="player-header">
                <h4>{getPositionLabel(position)}</h4>
                {!hasModifiedThisWeek && (
                  <button
                    onClick={() => setModifiedPosition(position)}
                    className={`modify-position-btn ${modifiedPosition === position ? 'active' : ''}`}
                  >
                    {modifiedPosition === position ? 'Selected' : 'Modify'}
                  </button>
                )}
              </div>
              <div className="player-details">
                <h3>{player.name}</h3>
                <p>{player.team} - {player.role}</p>
                <p className="player-cost">{player.cost} points</p>
              </div>
              <div className="captain-options">
                <label className="captain-checkbox">
                  <input
                    type="radio"
                    name="captain"
                    checked={captain === player.id}
                    onChange={() => handleCaptainChange(player.id)}
                  />
                  Captain
                </label>
                <label className="captain-checkbox">
                  <input
                    type="radio"
                    name="viceCaptain"
                    checked={viceCaptain === player.id}
                    onChange={() => handleViceCaptainChange(player.id)}
                  />
                  Vice Captain
                </label>
              </div>
              {captain === player.id && <span className="badge captain-badge">C</span>}
              {viceCaptain === player.id && <span className="badge vc-badge">VC</span>}
            </div>
          ))}
        </div>
      </div>

      {modifiedPosition && !hasModifiedThisWeek && (
        <div className="modification-section">
          <h2>Select New Player for {getPositionLabel(modifiedPosition)}</h2>
          <div className="player-replacement">
            <select
              value={newPlayer?.id || ''}
              onChange={(e) => {
                const selected = players.find(p => p.id === parseInt(e.target.value))
                setNewPlayer(selected)
              }}
              className="player-select-large"
            >
              <option value="">Select New Player</option>
              {getAvailablePlayers(modifiedPosition).map(player => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.team}) - {player.role} - {player.cost} pts
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="modify-actions">
        <button onClick={handleSaveModification} className="save-btn">
          Save Modifications
        </button>
      </div>
    </div>
  )
}

export default ModifyTeam