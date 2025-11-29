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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 space-y-8">
        {/* Digital Radar Background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="radar-grid"></div>
        </div>
        
        {/* Animated Airplane with Digital Trail */}
        <div className="relative z-10">
          <div className="digital-airplane">
            <div className="airplane-body">
              <div className="airplane-wing"></div>
              <div className="airplane-tail"></div>
            </div>
            <div className="digital-trail"></div>
          </div>
        </div>
        
        {/* Loading Content */}
        <div className="flex flex-col items-center space-y-6 relative z-10">
          {/* Digital Progress Bar */}
          <div className="digital-progress">
            <div className="progress-fill"></div>
          </div>
          
          {/* Loading Text dengan Efek Digital */}
          <div className="text-center space-y-3">
            <h2 className="digital-text text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              SYSTEM INITIALIZATION
            </h2>
            <p className="text-gray-300 font-mono text-sm">Preparing optimal experience...</p>
            
            {/* Digital Loading Dots */}
            <div className="flex justify-center space-x-2 pt-3">
              <div className="digital-dot"></div>
              <div className="digital-dot" style={{animationDelay: '0.2s'}}></div>
              <div className="digital-dot" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>


        {/* Digital Corner Decorations */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-500 opacity-60"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-cyan-500 opacity-60"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-cyan-500 opacity-60"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-cyan-500 opacity-60"></div>
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