import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {
  const { user, isLoading } = useAuth()

  console.log('🏠 App rendered - User:', user)
  console.log('🏠 App rendered - Loading:', isLoading)

  if (isLoading) {
    console.log('⏳ App loading...')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  console.log('✅ App loaded - Routing...')
  console.log('🔀 User authenticated:', !!user)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              !user ? (
                <Login />
              ) : (
                <>
                  {console.log('🔄 Redirecting to dashboard from login...')}
                  <Navigate to="/dashboard" />
                </>
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !user ? (
                <Register />
              ) : (
                <>
                  {console.log('🔄 Redirecting to dashboard from register...')}
                  <Navigate to="/dashboard" />
                </>
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard />
              ) : (
                <>
                  {console.log('🔄 Redirecting to login from dashboard...')}
                  <Navigate to="/login" />
                </>
              )
            } 
          />
          <Route 
            path="/" 
            element={
              <Navigate to={user ? "/dashboard" : "/login"} />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App