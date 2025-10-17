import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Leagues.css'
import { gameweekPoints } from '../data/mockData'

function Leagues({ user }) {
  const navigate = useNavigate()

  // UI modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState(null)

  // Forms
  const [newLeague, setNewLeague] = useState({ name: '', type: 'public' })
  const [joinKey, setJoinKey] = useState('')

  // Data
  const [userLeagues, setUserLeagues] = useState([])
  const [availableLeagues, setAvailableLeagues] = useState([
    { id: 1, name: 'IPL Champions League 2025', type: 'public', members: 1250, creator: 'admin', createdAt: '2025-10-01' },
    { id: 2, name: 'Weekend Warriors', type: 'public', members: 580, creator: 'cricketfan123', createdAt: '2025-10-05' },
    { id: 3, name: 'Office Cricket League', type: 'private', members: 45, creator: 'johndoe', joinKey: 'OFFICE2025', createdAt: '2025-10-08' },
    { id: 4, name: 'Pro Players Only', type: 'public', members: 2100, creator: 'proplayer', createdAt: '2025-09-28' }
  ])

  // Details modal (leaderboard)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsLeague, setDetailsLeague] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    try {
      const storedLeagues = localStorage.getItem('userLeagues')
      if (storedLeagues) setUserLeagues(JSON.parse(storedLeagues))
    } catch {
      // ignore parse issues
    }
  }, [])

  const getUserTeam = useMemo(() => {
    try {
      const raw = localStorage.getItem('userTeam')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  const getCurrentGameweek = () => {
    const startDate = new Date('2025-10-01')
    const today = new Date()
    const diffTime = Math.abs(today - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, Math.ceil(diffDays / 7))
  }

  // Compute GW points for the current user from their selected players only
  const computeUserGWPoints = () => {
    const team = getUserTeam
    if (!team) return { gwPoints: 0 }

    const pointsMap = new Map(gameweekPoints.map(p => [p.playerId, p.points]))
    const captainId = team.captain
    const viceId = team.viceCaptain
    const captainPlayed = pointsMap.has(captainId)

    let sum = 0
    for (const p of Object.values(team.players)) {
      if (!p) continue
      const base = pointsMap.get(p.id) ?? 0
      if (p.id === captainId) {
        sum += base * 2
      } else if (!captainPlayed && p.id === viceId) {
        sum += base * 2
      } else {
        sum += base
      }
    }
    return { gwPoints: sum }
  }

  // Persist per-league total points for the user (roll forward once per GW)
  const updateAndGetUserLeagueTotals = (leagueId) => {
    const key = 'userLeagueTotals'
    const currentWeek = getCurrentGameweek()
    const totals = JSON.parse(localStorage.getItem(key) || '{}')
    const entry = totals[leagueId] || { totalPoints: 0, lastUpdatedWeek: 0 }
    const { gwPoints } = computeUserGWPoints()

    if (entry.lastUpdatedWeek !== currentWeek) {
      entry.totalPoints += gwPoints
      entry.lastUpdatedWeek = currentWeek
      totals[leagueId] = entry
      localStorage.setItem(key, JSON.stringify(totals))
    }
    return totals[leagueId]
  }

  // Mock other competitors in leaderboard
  const generateMockCompetitors = (count = 9) => {
    const sampleNames = ['Warriors XI','Strikers','Thunderbolts','Blaze United','Spin Kings','Yorkers','Boundary Bashers','Pace Setters','Cover Drivers','Night Watchmen']
    const sampleUsers = ['rahul','sachin','anil','arjun','priya','neha','vijay','amit','sana','zara']
    const arr = []
    for (let i = 0; i < count; i++) {
      const tp = Math.floor(600 + Math.random() * 1200)
      const gw = Math.floor(20 + Math.random() * 120)
      arr.push({ rank: 0, teamName: sampleNames[i % sampleNames.length], username: sampleUsers[i % sampleUsers.length], gwPoints: gw, totalPoints: tp })
    }
    return arr
  }

  const openLeagueDetails = (leagueId) => {
    const fullLeague = availableLeagues.find(l => l.id === leagueId)
    const myEntry = userLeagues.find(l => l.id === leagueId)
    if (!fullLeague || !myEntry) return

    const team = getUserTeam
    const teamName = team?.name || `${user?.username || 'User'}'s Team`
    const { totalPoints } = updateAndGetUserLeagueTotals(leagueId)
    const { gwPoints } = computeUserGWPoints()

    const rows = [
      ...generateMockCompetitors(),
      { rank: 0, teamName, username: user?.username || 'User', gwPoints, totalPoints }
    ]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((row, idx) => ({ ...row, rank: idx + 1 }))

    setLeaderboard(rows)
    setDetailsLeague(fullLeague)
    setDetailsOpen(true)
  }

  const generateJoinKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }

  const handleCreateLeague = () => {
    if (!newLeague.name.trim()) {
      alert('Please enter a league name!')
      return
    }

    const created = {
      id: Date.now(),
      name: newLeague.name,
      type: newLeague.type,
      members: 1,
      creator: user?.username || 'User',
      createdAt: new Date().toISOString().split('T')[0],
      joinKey: newLeague.type === 'private' ? generateJoinKey() : null
    }

    setAvailableLeagues(prev => [created, ...prev])

    const updatedUserLeagues = [
      ...userLeagues,
      { id: created.id, name: created.name, rank: 1, points: 0, members: 1 }
    ]
    setUserLeagues(updatedUserLeagues)
    localStorage.setItem('userLeagues', JSON.stringify(updatedUserLeagues))

    if (created.joinKey) {
      alert(`League created! Share this join key: ${created.joinKey}`)
    } else {
      alert('League created successfully!')
    }

    setNewLeague({ name: '', type: 'public' })
    setShowCreateModal(false)
  }

  const requireTeamBeforeJoin = () => {
    if (!getUserTeam) {
      if (window.confirm('You must create a team before joining a league. Go to Add Team now?')) {
        navigate('/add-team')
      }
      return false
    }
    return true
  }

  const joinLeagueDirectly = (league) => {
    const updatedUserLeagues = [
      ...userLeagues,
      { id: league.id, name: league.name, rank: league.members + 1, points: 0, members: league.members }
    ]
    setUserLeagues(updatedUserLeagues)
    localStorage.setItem('userLeagues', JSON.stringify(updatedUserLeagues))

    setAvailableLeagues(prev => prev.map(l => l.id === league.id ? { ...l, members: l.members + 1 } : l))
    alert(`Successfully joined ${league.name}!`)
    setShowJoinModal(false)
    setJoinKey('')
    setSelectedLeague(null)
  }

  const handleJoinLeague = (league) => {
    if (!requireTeamBeforeJoin()) return
    if (isLeagueJoined(league.id)) {
      alert('You have already joined this league!')
      return
    }
    if (league.type === 'private') {
      setSelectedLeague(league)
      setShowJoinModal(true)
    } else {
      joinLeagueDirectly(league)
    }
  }

  const handleJoinPrivateLeague = () => {
    const key = joinKey.trim().toUpperCase()
    if (!key) {
      alert('Please enter the join key!')
      return
    }

    // If opened from card, we have selectedLeague; otherwise find by key
    const targetLeague = selectedLeague || availableLeagues.find(l => l.joinKey === key)
    if (!targetLeague) {
      alert('Invalid join key or league not found!')
      return
    }
    if (targetLeague.type !== 'private') {
      alert('This is not a private league.')
      return
    }
    if (targetLeague.joinKey !== key) {
      alert('Invalid join key!')
      return
    }
    if (!requireTeamBeforeJoin()) return

    joinLeagueDirectly(targetLeague)
  }

  const isLeagueJoined = (leagueId) => userLeagues.some(l => l.id === leagueId)

  const leaveLeague = (leagueId) => {
    const le = availableLeagues.find(l => l.id === leagueId)
    if (!le) return
    if (!window.confirm(`Are you sure you want to leave "${le.name}"?`)) return

    const updatedUserLeagues = userLeagues.filter(l => l.id !== leagueId)
    setUserLeagues(updatedUserLeagues)
    localStorage.setItem('userLeagues', JSON.stringify(updatedUserLeagues))

    setAvailableLeagues(prev => prev.map(l => l.id === leagueId ? { ...l, members: Math.max(0, l.members - 1) } : l))

    setDetailsOpen(false)
    setDetailsLeague(null)
    setLeaderboard([])
    alert('You have left the league.')
  }

  const deleteLeague = (leagueId) => {
    const le = availableLeagues.find(l => l.id === leagueId)
    if (!le) return
    if (le.type !== 'private') return
    if ((user?.username || 'User') !== le.creator) {
      alert('Only the league owner can delete this private league.')
      return
    }
    if (!window.confirm(`Delete private league "${le.name}"? This cannot be undone.`)) return

    setAvailableLeagues(prev => prev.filter(l => l.id !== leagueId))
    const updatedUserLeagues = userLeagues.filter(l => l.id !== leagueId)
    setUserLeagues(updatedUserLeagues)
    localStorage.setItem('userLeagues', JSON.stringify(updatedUserLeagues))

    const totalsKey = 'userLeagueTotals'
    const totals = JSON.parse(localStorage.getItem(totalsKey) || '{}')
    delete totals[leagueId]
    localStorage.setItem(totalsKey, JSON.stringify(totals))

    setDetailsOpen(false)
    setDetailsLeague(null)
    setLeaderboard([])
    alert('League deleted.')
  }

  return (
    <div className="leagues-container">
      <div className="leagues-header">
        <h1>🏆 Leagues</h1>
        <p>Join leagues and compete with other players</p>
      </div>

      <div className="league-actions">
        <button
          onClick={() => {
            setSelectedLeague(null) // generic join by key
            setShowJoinModal(true)
          }}
          className="action-btn join-btn"
        >
          Join a League
        </button>
        <button onClick={() => setShowCreateModal(true)} className="action-btn create-btn">
          Create a League
        </button>
      </div>

      <div className="my-leagues-section">
        <h2>My Leagues ({userLeagues.length})</h2>
        {userLeagues.length === 0 ? (
          <div className="empty-state">
            <p>You haven't joined any leagues yet. Join or create one to get started!</p>
          </div>
        ) : (
          <div className="leagues-grid">
            {userLeagues.map(league => (
              <div key={league.id} className="league-card my-league">
                <div className="league-card-header">
                  <h3>{league.name}</h3>
                  <span className="members-badge">👥 {league.members ?? 'N/A'} members</span>
                </div>
                <div className="league-stats">
                  <div className="stat">
                    <span className="stat-label">Your Rank</span>
                    <span className="stat-value">#{league.rank}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Your Points</span>
                    <span className="stat-value">{league.points}</span>
                  </div>
                </div>
                <button className="view-details-btn" onClick={() => openLeagueDetails(league.id)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="available-leagues-section">
        <h2>Available Leagues</h2>
        <div className="leagues-grid">
          {availableLeagues.map(league => (
            <div key={league.id} className="league-card">
              <div className="league-card-header">
                <h3>{league.name}</h3>
                <span className={`type-badge ${league.type}`}>
                  {league.type === 'private' ? '🔒 Private' : '🌐 Public'}
                </span>
              </div>
              <div className="league-info">
                <p><strong>Members:</strong> {league.members}</p>
                <p><strong>Created by:</strong> {league.creator}</p>
                <p><strong>Created:</strong> {league.createdAt}</p>
              </div>
              <button
                onClick={() => handleJoinLeague(league)}
                className={`join-league-btn ${isLeagueJoined(league.id) ? 'joined' : ''}`}
                disabled={isLeagueJoined(league.id)}
              >
                {isLeagueJoined(league.id) ? '✓ Joined' : 'Join League'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create League Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New League</h2>
              <button onClick={() => setShowCreateModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>League Name *</label>
                <input
                  type="text"
                  value={newLeague.name}
                  onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
                  placeholder="Enter league name"
                  className="modal-input"
                />
              </div>
              <div className="form-group">
                <label>League Type *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="leagueType"
                      value="public"
                      checked={newLeague.type === 'public'}
                      onChange={(e) => setNewLeague({ ...newLeague, type: e.target.value })}
                    />
                    <span>Public (Anyone can join)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="leagueType"
                      value="private"
                      checked={newLeague.type === 'private'}
                      onChange={(e) => setNewLeague({ ...newLeague, type: e.target.value })}
                    />
                    <span>Private (Requires join key)</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCreateLeague} className="modal-btn add-btn">Create</button>
              <button onClick={() => { setNewLeague({ name: '', type: 'public' }); setShowCreateModal(false) }} className="modal-btn clear-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Join Private League Modal (also supports generic join-by-key) */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Join Private League</h2>
              <button onClick={() => setShowJoinModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                {selectedLeague
                  ? `"${selectedLeague.name}" is a private league. Enter the join key to join.`
                  : 'Enter a private league join key to join.'}
              </p>
              <div className="form-group">
                <label>Join Key *</label>
                <input
                  type="text"
                  value={joinKey}
                  onChange={(e) => setJoinKey(e.target.value.toUpperCase())}
                  placeholder="Enter join key"
                  className="modal-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleJoinPrivateLeague} className="modal-btn add-btn">Join</button>
              <button onClick={() => { setJoinKey(''); setSelectedLeague(null); setShowJoinModal(false) }} className="modal-btn clear-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* League Details Modal (Leaderboard) */}
      {detailsOpen && detailsLeague && (
        <div className="modal-overlay" onClick={() => setDetailsOpen(false)}>
          <div className="modal-content league-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{detailsLeague.name} — Leaderboard</h2>
              <button onClick={() => setDetailsOpen(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="leaderboard-meta">
                <span className={`type-badge ${detailsLeague.type}`}>
                  {detailsLeague.type === 'private' ? '🔒 Private' : '🌐 Public'}
                </span>
                <span className="members-badge">👥 {detailsLeague.members} members</span>
                <span className="creator-badge">👑 Owner: {detailsLeague.creator}</span>
              </div>

              <div className="leaderboard-table-wrap">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team name / Username</th>
                      <th>GW Points</th>
                      <th>Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map(row => {
                      const isMe = row.username === (user?.username || 'User')
                      return (
                        <tr key={`${row.username}-${row.teamName}`} className={isMe ? 'me' : ''}>
                          <td>#{row.rank}</td>
                          <td>
                            <div className="team-user">
                              <strong>{row.teamName}</strong>
                              <span className="username">@{row.username}</span>
                            </div>
                          </td>
                          <td>{row.gwPoints}</td>
                          <td>{row.totalPoints}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer modal-footer-actions">
              <button className="modal-btn danger-btn" onClick={() => leaveLeague(detailsLeague.id)}>
                Leave League
              </button>
              {detailsLeague.type === 'private' && (user?.username || 'User') === detailsLeague.creator && (
                <button className="modal-btn delete-btn" onClick={() => deleteLeague(detailsLeague.id)} title="Only the owner of a private league can delete it">
                  Delete League
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leagues