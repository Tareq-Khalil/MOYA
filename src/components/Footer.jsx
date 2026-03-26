import { Link } from 'react-router-dom'
import { Mail, Phone, Waves } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ocean-950/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          <div className="flex flex-col gap-4">
            <img src="/logo.png" alt="MOYA" className="h-12 w-auto object-contain self-start" />
            <p className="text-white/40 text-sm leading-relaxed max-w-[220px]">
              Helping communities manage and protect water, one drop at a time.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">Navigate</p>
            {[
              { to: '/meet-us',   label: 'About' },
              { to: '/map',       label: 'Map' },
              { to: '/volunteer', label: 'Volunteer' },
              { to: '/games',     label: 'Games' },
              { to: '/shop',      label: 'Shop' },
              { to: '/donate',    label: 'Donate' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="text-white/40 hover:text-white/80 text-sm transition-colors w-fit">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">Contact</p>
            <a href="mailto:info@moyaeg.org"
              className="flex items-center gap-2.5 text-white/40 hover:text-teal-300 text-sm transition-colors group w-fit">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors flex-shrink-0">
                <Mail size={13} className="text-teal-400" />
              </div>
              info@moyaeg.org
            </a>
            <a href="tel:+201012439278"
              className="flex items-center gap-2.5 text-white/40 hover:text-ocean-300 text-sm transition-colors group w-fit">
              <div className="w-7 h-7 rounded-lg bg-ocean-500/10 border border-ocean-500/20 flex items-center justify-center group-hover:bg-ocean-500/20 transition-colors flex-shrink-0">
                <Phone size={13} className="text-ocean-400" />
              </div>
              +20 101 243 9278
            </a>
          </div>

        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">© 2026 WaterWorks. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-white/20 text-xs">
            <Waves size={11} className="text-teal-500/40" />
            <span>Built for cleaner water in Egypt</span>
          </div>
        </div>

      </div>
    </footer>
  )
}