import { useState, useEffect } from 'react'
import { players } from '../data/mockData'
import './AddTeam.css'

function AddTeam({ user }) {
  const [teamExists, setTeamExists] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState({
    batsman1: null,
    batsman2: null,
    batsman3: null,
    wicketKeeper: null,
    bowler1: null,
    bowler2: null,
    bowler3: null,
    mixRole1: null,
    mixRole2: null,
    mixRole3: null,
    mixRole4: null
  })
  const [captain, setCaptain] = useState(null)
  const [viceCaptain, setViceCaptain] = useState(null)
  const [remainingBudget, setRemainingBudget] = useState(125)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [teamPlayers, setTeamPlayers] = useState([])

  const batsmen = players.filter(p => p.role === 'Batsman')
  const wicketKeepers = players.filter(p => p.role === 'Wicket Keeper')
  const bowlers = players.filter(p => p.role === 'Bowler')
  const allPlayers = players

  useEffect(() => {
    const existing = localStorage.getItem('userTeam')
    if (existing) setTeamExists(true)
  }, [])

  useEffect(() => {
    calculateBudget()
    checkTeamConstraints()
  }, [selectedPlayers])

  const calculateBudget = () => {
    let totalCost = 0
    Object.values(selectedPlayers).forEach(player => {
      if (player) totalCost += player.cost
    })
    setRemainingBudget(150 - totalCost)
  }

  const checkTeamConstraints = () => {
    const teamCount = {}
    Object.values(selectedPlayers).forEach(player => {
      if (player) teamCount[player.team] = (teamCount[player.team] || 0) + 1
    })
    const newErrors = {}
    Object.entries(teamCount).forEach(([team, count]) => {
      if (count > 3) newErrors.teamConstraint = `Cannot have more than 3 players from ${team}`
    })
    setErrors(prev => ({ ...prev, teamConstraint: newErrors.teamConstraint }))
  }

  const handlePlayerSelect = (position, playerId) => {
    const player = players.find(p => p.id === parseInt(playerId))
    if (player) {
      const alreadySelected = Object.entries(selectedPlayers).find(
        ([key, val]) => val && val.id === player.id && key !== position
      )
      if (alreadySelected) {
        alert('This player is already selected in another position!')
        return
      }
      if (selectedPlayers[position]) {
        if (captain === selectedPlayers[position].id) setCaptain(null)
        if (viceCaptain === selectedPlayers[position].id) setViceCaptain(null)
      }
      setSelectedPlayers(prev => ({ ...prev, [position]: player }))
    } else {
      setSelectedPlayers(prev => ({ ...prev, [position]: null }))
    }
  }

  const handleCaptainSelect = (playerId) => {
    if (viceCaptain === playerId) {
      alert('This player is already the vice captain!')
      return
    }
    setCaptain(captain === playerId ? null : playerId)
  }

  const handleViceCaptainSelect = (playerId) => {
    if (captain === playerId) {
      alert('This player is already the captain!')
      return
    }
    setViceCaptain(viceCaptain === playerId ? null : playerId)
  }

  const validateTeam = () => {
    const newErrors = {}
    if (!teamName.trim()) newErrors.teamName = 'Team name is required'
    const allSelected = Object.values(selectedPlayers).every(player => player !== null)
    if (!allSelected) newErrors.players = 'Please select all 11 players'
    if (!captain) newErrors.captain = 'Please select a captain'
    if (!viceCaptain) newErrors.viceCaptain = 'Please select a vice captain'
    if (remainingBudget < 0) newErrors.budget = 'Budget exceeded!'
    return newErrors
  }

  const handleAddTeam = () => {
    if (teamExists) {
      setErrors(prev => ({ ...prev, teamExists: 'You can only create one team per account. Modify your existing team instead.' }))
      return
    }
    const validationErrors = validateTeam()
    const hasOtherErrors = Object.values(errors).filter(Boolean).length > 0
    if (Object.keys(validationErrors).length > 0 || hasOtherErrors) {
      setErrors(prev => ({ ...prev, ...validationErrors }))
      return
    }

    const team = {
      name: teamName,
      players: selectedPlayers,
      captain,
      viceCaptain,
      createdAt: new Date().toISOString()
    }

    localStorage.setItem('userTeam', JSON.stringify(team))
    setShowSuccess(true)
    setTeamPlayers(Object.values(selectedPlayers))
    setTeamExists(true)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const handleClearAll = () => {
    if (teamExists) {
      // Keep existing team; just clear the selection UI
      setTeamName('')
    }
    setSelectedPlayers({
      batsman1: null,
      batsman2: null,
      batsman3: null,
      wicketKeeper: null,
      bowler1: null,
      bowler2: null,
      bowler3: null,
      mixRole1: null,
      mixRole2: null,
      mixRole3: null,
      mixRole4: null
    })
    setCaptain(null)
    setViceCaptain(null)
    setErrors({})
    setShowSuccess(false)
    setTeamPlayers([])
  }

  return (
    <div className="add-team-container">
      <div className="add-team-header">
        <h1>🏏 Add Your Team</h1>
        <p>Create your dream cricket team within 125 points budget</p>
      </div>

      {teamExists && (
        <div className="success-message" style={{ background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' }}>
          <h3>ℹ️ Team Already Created</h3>
          <p>You can only create one team per account. Please use Modify Team to change your squad before matches start.</p>
        </div>
      )}

      <div className="budget-display">
        <div className="budget-card">
          <span className="budget-label">Remaining Budget</span>
          <span className={`budget-value ${remainingBudget < 0 ? 'negative' : ''}`}>
            {remainingBudget} Points
          </span>
        </div>
        <div className="budget-info">
          <p>✓ Select 3 Batsmen, 1 Wicket Keeper, 3 Bowlers, 4 Mixed Roles</p>
          <p>✓ Maximum 3 players from the same team</p>
          <p>✓ Players rated from A (15 points) to G (3 points)</p>
        </div>
      </div>

      {showSuccess && (
        <div className="success-message">
          <h3>✅ Team Added Successfully!</h3>
          <p>Your team "{teamName}" has been created.</p>
        </div>
      )}

      {Object.values(errors).filter(Boolean).length > 0 && (
        <div className="error-messages">
          {Object.values(errors).filter(Boolean).map((error, index) => (
            <p key={index}>❌ {error}</p>
          ))}
        </div>
      )}

      <div className="team-form">
        <div className="form-section">
          <label htmlFor="teamName" className="section-label">Team Name *</label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter unique team name"
            className="team-name-input"
            disabled={teamExists}
          />
        </div>

        <div className="players-section">
          <h2>Select Batsmen (3 Required)</h2>
          <div className="player-selects">
            {['batsman1', 'batsman2', 'batsman3'].map((position, index) => (
              <div key={position} className="player-select-group">
                <label>Batsman {index + 1} *</label>
                <select
                  value={selectedPlayers[position]?.id || ''}
                  onChange={(e) => handlePlayerSelect(position, e.target.value)}
                  className="player-select"
                  disabled={teamExists}
                >
                  <option value="">Select Batsman</option>
                  {batsmen.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name} ({player.team}) - {player.cost} pts ({player.rating})
                    </option>
                  ))}
                </select>
                {selectedPlayers[position] && !teamExists && (
                  <div className="captain-selects">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={captain === selectedPlayers[position].id}
                        onChange={() => handleCaptainSelect(selectedPlayers[position].id)}
                      />
                      Captain
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={viceCaptain === selectedPlayers[position].id}
                        onChange={() => handleViceCaptainSelect(selectedPlayers[position].id)}
                      />
                      Vice Captain
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="players-section">
          <h2>Select Wicket Keeper (1 Required)</h2>
          <div className="player-selects">
            <div className="player-select-group">
              <label>Wicket Keeper *</label>
              <select
                value={selectedPlayers.wicketKeeper?.id || ''}
                onChange={(e) => handlePlayerSelect('wicketKeeper', e.target.value)}
                className="player-select"
                disabled={teamExists}
              >
                <option value="">Select Wicket Keeper</option>
                {wicketKeepers.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.team}) - {player.cost} pts ({player.rating})
                  </option>
                ))}
              </select>
              {selectedPlayers.wicketKeeper && !teamExists && (
                <div className="captain-selects">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={captain === selectedPlayers.wicketKeeper.id}
                      onChange={() => handleCaptainSelect(selectedPlayers.wicketKeeper.id)}
                    />
                    Captain
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={viceCaptain === selectedPlayers.wicketKeeper.id}
                      onChange={() => handleViceCaptainSelect(selectedPlayers.wicketKeeper.id)}
                    />
                    Vice Captain
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="players-section">
          <h2>Select Bowlers (3 Required)</h2>
          <div className="player-selects">
            {['bowler1', 'bowler2', 'bowler3'].map((position, index) => (
              <div key={position} className="player-select-group">
                <label>Bowler {index + 1} *</label>
                <select
                  value={selectedPlayers[position]?.id || ''}
                  onChange={(e) => handlePlayerSelect(position, e.target.value)}
                  className="player-select"
                  disabled={teamExists}
                >
                  <option value="">Select Bowler</option>
                  {bowlers.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name} ({player.team}) - {player.cost} pts ({player.rating})
                    </option>
                  ))}
                </select>
                {selectedPlayers[position] && !teamExists && (
                  <div className="captain-selects">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={captain === selectedPlayers[position].id}
                        onChange={() => handleCaptainSelect(selectedPlayers[position].id)}
                      />
                      Captain
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={viceCaptain === selectedPlayers[position].id}
                        onChange={() => handleViceCaptainSelect(selectedPlayers[position].id)}
                      />
                      Vice Captain
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="players-section">
          <h2>Select Mixed Roles (4 Required - Any Position)</h2>
          <div className="player-selects">
            {['mixRole1', 'mixRole2', 'mixRole3', 'mixRole4'].map((position, index) => (
              <div key={position} className="player-select-group">
                <label>Mix Role {index + 1} *</label>
                <select
                  value={selectedPlayers[position]?.id || ''}
                  onChange={(e) => handlePlayerSelect(position, e.target.value)}
                  className="player-select"
                  disabled={teamExists}
                >
                  <option value="">Select Any Player</option>
                  {allPlayers.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name} ({player.team}) - {player.role} - {player.cost} pts ({player.rating})
                    </option>
                  ))}
                </select>
                {selectedPlayers[position] && !teamExists && (
                  <div className="captain-selects">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={captain === selectedPlayers[position].id}
                        onChange={() => handleCaptainSelect(selectedPlayers[position].id)}
                      />
                      Captain
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={viceCaptain === selectedPlayers[position].id}
                        onChange={() => handleViceCaptainSelect(selectedPlayers[position].id)}
                      />
                      Vice Captain
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleAddTeam} className="add-btn" disabled={teamExists} title={teamExists ? 'Only one team allowed per account' : ''}>
            Add Team
          </button>
          <button onClick={handleClearAll} className="clear-btn">
            Clear All
          </button>
        </div>
      </div>

      {showSuccess && teamPlayers.length > 0 && (
        <div className="selected-team-display">
          <h2>Your Selected Team</h2>
          <div className="team-grid">
            {teamPlayers.map((player, index) => (
              <div key={index} className="team-player-card">
                <div className="player-info">
                  <h4>{player.name}</h4>
                  <p>{player.team} - {player.role}</p>
                  <p className="player-cost">{player.cost} points</p>
                </div>
                {captain === player.id && <span className="badge captain-badge">C</span>}
                {viceCaptain === player.id && <span className="badge vc-badge">VC</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AddTeam