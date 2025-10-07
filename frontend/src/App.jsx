import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import League from './components/League'
import TeamSelection from './components/TeamSelection'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} user={user} />
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/profile" /> : <Signup onSignup={handleLogin} />
          } />
          <Route path="/profile" element={
            isAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/league" element={
            isAuthenticated ? <League /> : <Navigate to="/login" />
          } />
          <Route path="/team-selection" element={
            isAuthenticated ? <TeamSelection user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App