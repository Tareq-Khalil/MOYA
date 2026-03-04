import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import AICompanion from './components/AICompanion'
import Home from './pages/Home'
import MeetUs from './pages/MeetUs'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import MapPage from './pages/MapPage'
import Admin from './pages/Admin'
import Shop from './pages/Shop'
import Profile from './pages/Profile'
import GameHub from './pages/GameHub'
import Volunteer from './pages/Volunteer'
import Footer from './components/Footer'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

const AdminRoute = ({ children }) => {
  const { profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!profile?.is_admin) return <Navigate to="/" replace />
  return children
}

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-ocean-500/30 border-t-ocean-400 animate-spin" />
      <p className="text-white/60 font-body">Loading MOYA...</p>
    </div>
  </div>
)

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meet-us" element={<MeetUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/games" element={<GameHub />} />
      </Routes>
      <AICompanion />
      <Footer />
    </div>
  )
}