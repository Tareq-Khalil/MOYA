import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, LogOut, User, Shield, ShoppingBag, Map, Gamepad2, Heart } from 'lucide-react'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }
  const isActive = (path) => location.pathname === path
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass py-3 shadow-2xl shadow-black/30' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img
            src="/logo.png"
            alt="MOYA"
            className="h-20 w-auto object-contain transition-opacity group-hover:opacity-80"
          />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-lg">
          <Link to="/" className={`nav-link ${isActive('/') ? 'text-white' : ''}`}>Home</Link>
          <Link to="/meet-us" className={`nav-link ${isActive('/meet-us') ? 'text-white' : ''}`}>Meet Us</Link>
          <Link to="/map" className={`nav-link flex items-center gap-1.5 ${isActive('/map') ? 'text-white' : ''}`}>
            <Map size={14} />Map
          </Link>
          <Link to="/shop" className={`nav-link flex items-center gap-1.5 ${isActive('/shop') ? 'text-white' : ''}`}>
            <ShoppingBag size={14} />Shop
          </Link>
          <Link to="/volunteer" className={`nav-link flex items-center gap-1.5 ${isActive('/volunteer') ? 'text-white' : ''}`}>
            <Heart size={14} />Volunteer
          </Link>
          <Link to="/games" className={`nav-link flex items-center gap-1.5 ${isActive('/games') ? 'text-white' : 'text-ocean-300/80'}`}>
            <Gamepad2 size={14} />Games Hub
          </Link>
          {profile?.is_admin && (
            <Link to="/admin" className={`nav-link flex items-center gap-1.5 text-teal-300 ${isActive('/admin') ? 'text-teal-200' : ''}`}>
              <Shield size={14} />Admin
            </Link>
          )}
          <Link
            to="/donate"
            className={`relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group ${
              isActive('/donate') ? 'ring-2 ring-rose-400/60' : ''
            }`}
            style={{
              background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
              boxShadow: '0 2px 16px rgba(244,63,94,0.35)',
            }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />
            <Heart size={13} className="fill-white relative z-10 group-hover:scale-110 transition-transform" />
            <span className="relative z-10">Donate</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {profile && (
                <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-teal-300 text-sm font-mono font-medium">{profile.points ?? 0} pts</span>
                </div>
              )}
              <Link to="/profile" className="w-9 h-9 rounded-xl bg-ocean-600/40 border border-ocean-400/30 flex items-center justify-center hover:bg-ocean-500/30 transition-colors">
                <User size={17} className="text-ocean-200" />
              </Link>
              <button onClick={handleSignOut} className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-red-500/20 transition-colors group">
                <LogOut size={17} className="text-white/60 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Log In</Link>
              <Link to="/signup" className="btn-primary py-2 px-4 text-sm">Sign Up</Link>
            </>
          )}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden glass p-2 rounded-xl">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-4 flex flex-col gap-2">
          {[
            ['/', 'Home'],
            ['/meet-us', 'Meet Us'],
            ['/map', 'Map'],
            ['/shop', 'Shop'],
            ['/volunteer', '❤️ Volunteer'],
            ['/games', '🎮 Games'],
          ].map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl transition-colors ${isActive(path) ? 'bg-ocean-600/40 text-white' : 'text-white/70 hover:bg-white/5'}`}>
              {label}
            </Link>
          ))}
          {profile?.is_admin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-teal-300 hover:bg-teal-500/10">
              Admin Panel
            </Link>
          )}
          <Link
            to="/donate"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(225,29,72,0.25), rgba(244,63,94,0.15))',
              border: '1px solid rgba(244,63,94,0.35)',
            }}
          >
            <Heart size={15} className="fill-rose-400 text-rose-400" />
            <span className="text-rose-300">Donate to MOYA</span>
          </Link>
          <div className="border-t border-white/10 mt-2 pt-2">
            {user ? (
              <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="w-full text-left px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10">
                Sign Out
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 btn-secondary text-center py-2 text-sm">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1 btn-primary text-center py-2 text-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}