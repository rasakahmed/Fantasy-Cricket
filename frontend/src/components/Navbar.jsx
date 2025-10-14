
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar({ onLogout, user }) {
  const navigate = useNavigate()

  const handleSignOut = () => {
    onLogout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">🏏</span>
          <h2>Fantasy Cricket</h2>
        </div>
        
        <ul className="navbar-menu">
          <li><Link to="/main-menu">Main Menu</Link></li>
          <li><Link to="/add-team">Add Team</Link></li>
          <li><Link to="/modify-team">Modify Team</Link></li>
          <li><Link to="/leagues">Leagues</Link></li>
          <li><Link to="/points">Points</Link></li>
          <li><Link to="/fixtures">Fixtures</Link></li>
          <li><Link to="/stats">Stats</Link></li>
          <li><Link to="/help">Help</Link></li>
          <li className="user-info">
            <span>👤 {user?.username || 'User'}</span>
          </li>
          <li>
            <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar