import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import MainMenu from './components/MainMenu'
import AddTeam from './components/AddTeam'
import ModifyTeam from './components/ModifyTeam'
import Leagues from './components/Leagues'
import Points from './components/Points'
import Fixtures from './components/Fixtures'
import Stats from './components/Stats'
import Help from './components/Help'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('fantasyUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('fantasyUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('fantasyUser')
    localStorage.removeItem('userTeam')
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar onLogout={handleLogout} user={user} />}
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/main-menu" /> : <Home />
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/main-menu" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/main-menu" /> : <Signup onSignup={handleLogin} />
          } />
          <Route path="/main-menu" element={
            isAuthenticated ? <MainMenu user={user} /> : <Navigate to="/" />
          } />
          <Route path="/add-team" element={
            isAuthenticated ? <AddTeam user={user} /> : <Navigate to="/" />
          } />
          <Route path="/modify-team" element={
            isAuthenticated ? <ModifyTeam user={user} /> : <Navigate to="/" />
          } />
          <Route path="/leagues" element={
            isAuthenticated ? <Leagues user={user} /> : <Navigate to="/" />
          } />
          <Route path="/points" element={
            isAuthenticated ? <Points user={user} /> : <Navigate to="/" />
          } />
          <Route path="/fixtures" element={
            isAuthenticated ? <Fixtures /> : <Navigate to="/" />
          } />
          <Route path="/stats" element={
            isAuthenticated ? <Stats /> : <Navigate to="/" />
          } />
          <Route path="/help" element={
            isAuthenticated ? <Help /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App