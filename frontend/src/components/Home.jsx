import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <span className="cricket-icon">🏏</span>
          <h1>Register to Play Fantasy Cricket</h1>
          <p>Build your dream team and compete with cricket fans worldwide!</p>
        </div>
        
        <div className="home-buttons">
          <button className="home-btn login-btn" onClick={() => navigate('/login')}>
            Log In
          </button>
          <button className="home-btn register-btn" onClick={() => navigate('/signup')}>
            Register Now
          </button>
        </div>

        <div className="home-features">
          <div className="feature">
            <span className="feature-icon">⭐</span>
            <h3>Build Your Team</h3>
            <p>Select 11 players within budget</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🏆</span>
            <h3>Join Leagues</h3>
            <p>Compete in public or private leagues</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <h3>Track Points</h3>
            <p>Monitor your team's performance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home