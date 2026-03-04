import { Link } from 'react-router-dom'
import { Droplets } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-ocean-300" />
          <span className="font-display font-bold text-white">MOYA</span>
        </div>
        <p className="text-white/30 text-sm">© 2026 WaterWorks. Helping communities, one drop at a time.</p>
        <div className="flex gap-6">
          <Link to="/meet-us"   className="text-white/40 hover:text-white/70 text-sm transition-colors">About</Link>
          <Link to="/map"       className="text-white/40 hover:text-white/70 text-sm transition-colors">Map</Link>
          <Link to="/volunteer" className="text-white/40 hover:text-white/70 text-sm transition-colors">Volunteer</Link>
          <Link to="/shop"      className="text-white/40 hover:text-white/70 text-sm transition-colors">Shop</Link>
        </div>
      </div>
    </footer>
  )
}