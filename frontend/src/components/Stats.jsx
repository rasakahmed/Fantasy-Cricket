import { useState } from 'react'
import { players } from '../data/mockData'
import './Stats.css'

function Stats() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'totalPoints', direction: 'desc' })
  const [filterRole, setFilterRole] = useState('all')

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortedPlayers = () => {
    let filteredPlayers = [...players]

    // Filter by search term
    if (searchTerm) {
      filteredPlayers = filteredPlayers.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by role
    if (filterRole !== 'all') {
      filteredPlayers = filteredPlayers.filter(player => player.role === filterRole)
    }

    // Sort
    filteredPlayers.sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    return filteredPlayers
  }

  const sortedPlayers = getSortedPlayers()

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>📊 Player Statistics</h1>
        <p>Comprehensive stats of all players in the league</p>
      </div>

      <div className="stats-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search by player name or team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <label>Filter by Role:</label>
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="Wicket Keeper">Wicket Keeper</option>
            <option value="Mixed Role">Mixed Role</option>
          </select>
        </div>
      </div>

      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-label">Total Players</span>
          <span className="summary-value">{sortedPlayers.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Batsmen</span>
          <span className="summary-value">{players.filter(p => p.role === 'Batsman').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Bowlers</span>
          <span className="summary-value">{players.filter(p => p.role === 'Bowler').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Wicket Keepers</span>
          <span className="summary-value">{players.filter(p => p.role === 'Wicket Keeper').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">All Rounders</span>
          <span className="summary-value">{players.filter(p => p.role === 'Mixed Role').length}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="stats-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('team')} className="sortable">
                Team {getSortIcon('team')}
              </th>
              <th onClick={() => handleSort('role')} className="sortable">
                Role {getSortIcon('role')}
              </th>
              <th onClick={() => handleSort('cost')} className="sortable">
                Cost (Points) {getSortIcon('cost')}
              </th>
              <th onClick={() => handleSort('totalPoints')} className="sortable">
                Total Points {getSortIcon('totalPoints')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr key={player.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td className="player-name-cell">
                  <div className="player-name-wrapper">
                    <span className="player-icon">
                      {player.role === 'Batsman' && '🏏'}
                      {player.role === 'Bowler' && '⚾'}
                      {player.role === 'Wicket Keeper' && '🧤'}
                      {player.role === 'Mixed Role' && '🌟'}
                    </span>
                    <strong>{player.name}</strong>
                  </div>
                </td>
                <td>
                  <span className="team-badge">{player.team}</span>
                </td>
                <td>
                  <span className={`role-badge ${player.role.toLowerCase().replace(' ', '-')}`}>
                    {player.role}
                  </span>
                </td>
                <td>
                  <span className="cost-value">
                    {player.cost} pts
                    <span className="rating-badge">({player.rating})</span>
                  </span>
                </td>
                <td>
                  <span className="points-value">{player.totalPoints}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedPlayers.length === 0 && (
        <div className="no-results">
          <p>No players found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Stats