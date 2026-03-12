import { Link } from 'react-router-dom'
import { Droplets, Map, Star, Shield, ArrowRight, ChevronDown, Waves, AlertTriangle, TrendingUp, Gamepad2, Brain, Puzzle, Trophy, Zap, Heart, Users, Globe, Crown, ExternalLink, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="card text-center group hover:scale-105 transition-transform cursor-default">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-ocean-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-ocean-500/30 transition-colors">
      <Icon size={20} className="text-ocean-300 sm:hidden" />
      <Icon size={24} className="text-ocean-300 hidden sm:block" />
    </div>
    <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">{number}</div>
    <div className="text-white/50 text-xs sm:text-sm">{label}</div>
  </div>
)

const FeatureCard = ({ icon: Icon, title, description, color = 'ocean' }) => (
  <div className="card group hover:scale-[1.02] transition-all">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl mb-3 sm:mb-4 flex items-center justify-center ${
      color === 'teal' ? 'bg-teal-500/20' :
      color === 'violet' ? 'bg-violet-500/20' :
      color === 'rose' ? 'bg-rose-500/20' :
      'bg-ocean-500/20'
    } group-hover:scale-110 transition-transform`}>
      <Icon size={20} className={`sm:hidden ${
        color === 'teal' ? 'text-teal-300' :
        color === 'violet' ? 'text-violet-300' :
        color === 'rose' ? 'text-rose-300' :
        'text-ocean-300'
      }`} />
      <Icon size={24} className={`hidden sm:block ${
        color === 'teal' ? 'text-teal-300' :
        color === 'violet' ? 'text-violet-300' :
        color === 'rose' ? 'text-rose-300' :
        'text-ocean-300'
      }`} />
    </div>
    <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-white/60 leading-relaxed text-sm sm:text-base">{description}</p>
  </div>
)

const HowStep = ({ number, title, description }) => (
  <div className="flex gap-4 sm:gap-5 items-start group">
    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-ocean-500/20 border border-ocean-400/30 flex items-center justify-center text-ocean-300 font-mono font-bold text-xs sm:text-sm group-hover:bg-ocean-500/30 transition-colors">
      {number}
    </div>
    <div>
      <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">{title}</h4>
      <p className="text-white/55 text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
  </div>
)

// ── Mini preview card for the homepage game section ──────────────────────
// type: 'featured' | 'medium' | 'standard'
function HomeGamePreviewCard({ emoji, name, label, desc, type = 'standard', accentColor, coverImage, externalUrl }) {
  const isCover = (type === 'featured' || type === 'medium') && coverImage

  if (isCover) {
    return (
      <div className={`relative overflow-hidden rounded-xl glass border border-white/10 group hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
        type === 'featured' ? 'sm:col-span-2 min-h-[130px]' : 'min-h-[100px]'
      }`}
        onClick={() => externalUrl && window.open(externalUrl, '_blank', 'noopener,noreferrer')}
      >
        {/* Cover image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 z-10">
          {type === 'featured' && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: `${accentColor || '#f59e0b'}30`, border: `1px solid ${accentColor || '#f59e0b'}60`, color: accentColor || '#f59e0b' }}>
              <Crown size={8} />FEATURED
            </span>
          )}
          {type === 'medium' && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-indigo-300 text-[10px] font-bold">
              <Sparkles size={8} />PREMIUM
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
            label === 'Free'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              : 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25'}`}>
            {label}
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="text-white font-semibold text-xs sm:text-sm block truncate drop-shadow">{name}</span>
              <p className="text-white/45 text-[10px] truncate hidden sm:block">{desc}</p>
            </div>
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold"
                style={{
                  background: `linear-gradient(135deg, ${accentColor || '#f59e0b'}, ${accentColor || '#f59e0b'}bb)`,
                  color: '#000',
                }}>
                <ExternalLink size={9} />Play
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Standard preview row
  return (
    <div className="flex items-center gap-3 glass rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 group hover:bg-white/10 transition-colors">
      <span className="text-base sm:text-xl flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-xs sm:text-sm">{name}</span>
          <span className={`badge text-[10px] ${label === 'Free'
            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
            : 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25'}`}>
            {label}
          </span>
        </div>
        <p className="text-white/40 text-xs truncate">{desc}</p>
      </div>
      <ChevronDown size={13} className="text-white/20 -rotate-90 flex-shrink-0" />
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-20 pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-950 via-ocean-900 to-ocean-800" />
          <div className="absolute top-20 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-ocean-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-ocean-400/30 animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center w-full">
          <div className="inline-flex items-center gap-2 glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8 animate-fade-in">
            <Waves size={12} className="text-teal-300 sm:hidden" />
            <Waves size={14} className="text-teal-300 hidden sm:block" />
            <span className="text-teal-200 text-xs sm:text-sm font-medium">Managing Optimal Yield of Aqua</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-slide-up">
            Report. Track.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 to-teal-300">
              Change the Flow.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-slide-up px-2" style={{ animationDelay: '0.1s' }}>
            Join our community to identify and report water-related issues in your area.
            Volunteer at real events, play water-themed games, and help build a better water future.
          </p>

          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
            <Link to="/map" className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4">
              <Map size={16} />
              Explore Map
            </Link>
            <Link to="/volunteer" className="btn-teal flex items-center justify-center gap-2 text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4">
              <Heart size={16} />
              Volunteer
            </Link>
            <Link to="/games" className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4">
              <Gamepad2 size={16} />
              Play Games
            </Link>
            {!user && (
              <Link to="/signup" className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-4">
                Join Now
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          <div className="mt-12 sm:mt-0 sm:absolute sm:bottom-10 sm:left-1/2 sm:-translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
            <ChevronDown size={20} />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 sm:py-20 bg-ocean-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <StatCard number="2.1K+" label="Reports Submitted" icon={AlertTriangle} />
            <StatCard number="840+"  label="Active Users"       icon={Star} />
            <StatCard number="94%"   label="Issues Resolved"    icon={TrendingUp} />
            <StatCard number="500+"  label="Volunteers"         icon={Heart} />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">How MOYA Works</h2>
            <p className="text-white/55 text-base sm:text-lg max-w-xl mx-auto px-2">A complete ecosystem for water problem reporting, education, volunteering, and community engagement</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <FeatureCard icon={Map}      title="Interactive Map"  description="Browse a live map of your community. See water problems reported by others and contribute your own observations at any location." />
            <FeatureCard icon={Heart}    title="Volunteer Events" description="Sign up for on-the-ground cleanup drives, water surveys, and restoration days happening across Egypt. Every hour you give makes a real impact." color="rose" />
            <FeatureCard icon={Gamepad2} title="Game Hub"         description="Play water-themed educational games to learn about conservation, infrastructure, and ecology in a fun and interactive way." color="violet" />
            <FeatureCard icon={Shield}   title="Admin Review"     description="All reports go through expert admin review before appearing publicly, ensuring data quality and rewarding meaningful contributions." color="teal" />
          </div>
        </div>
      </section>

      {/* ── How to get started ── */}
      <section className="py-16 sm:py-20 bg-ocean-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10">Get Started in Minutes</h2>
              <div className="flex flex-col gap-6 sm:gap-8">
                <HowStep number="01" title="Create Your Account"  description="Sign up for free and set up your profile to start contributing to water management in your area." />
                <HowStep number="02" title="Find a Problem"       description="Navigate to the map and drop a pin at the location where you've spotted a water issue." />
                <HowStep number="03" title="Submit a Report"      description="Add a title, description, and photos of the water problem. Your report will be reviewed by our admin team." />
                <HowStep number="04" title="Volunteer & Play"     description="Join real community events to restore water bodies near you, or visit the Game Hub to learn while you play." />
              </div>
            </div>

            <div className="relative mt-4 md:mt-0">
              <div className="card p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-ocean-500/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <Droplets size={18} className="text-teal-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-white/50">Sample Report</div>
                    <div className="font-semibold text-white text-sm sm:text-base truncate">Contaminated Pipeline</div>
                  </div>
                  <div className="ml-auto badge-approved text-xs flex-shrink-0">Approved</div>
                </div>
                <div className="w-full h-24 sm:h-32 rounded-xl bg-ocean-800/60 mb-4 flex items-center justify-center border border-white/10">
                  <Waves size={36} className="text-ocean-400/40" />
                </div>
                <p className="text-white/60 text-xs sm:text-sm mb-4">Visible brown discoloration in tap water with unusual odor. Affecting multiple households on Block 4.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-teal-300">
                    <Star size={13} />
                    <span className="text-xs sm:text-sm font-medium">+50 points awarded</span>
                  </div>
                  <span className="text-white/30 text-xs">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Volunteer section ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-950/60 via-ocean-900/80 to-teal-950/60" />
            <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-rose-500/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-teal-500/8 rounded-full blur-3xl" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute rounded-full animate-float opacity-15"
                style={{
                  width: `${12 + i * 8}px`, height: `${12 + i * 8}px`,
                  left: `${10 + i * 18}%`, top: `${15 + (i % 3) * 30}%`,
                  background: ['#f43f5e','#0ea5e9','#14b8a6','#f43f5e','#10b981'][i],
                  filter: 'blur(3px)',
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${4 + i * 0.4}s`,
                }}
              />
            ))}

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 p-6 sm:p-10 md:p-14 items-center">
              <div>
                <div className="inline-flex items-center gap-2 glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-6">
                  <Heart size={13} className="text-rose-300" />
                  <span className="text-rose-200 text-xs sm:text-sm font-medium">Community Volunteering</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-5 leading-tight">
                  Get Your
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-orange-200 to-teal-300">
                    Hands Wet
                  </span>
                </h2>
                <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                  Beyond reporting — MOYA connects you with real events on the ground.
                  Join cleanup drives along the Nile, survey coastlines in Alexandria,
                  restore wetlands in Damietta, and more.
                </p>

                <div className="flex flex-col gap-2 sm:gap-3 mb-6 sm:mb-8">
                  {[
                    { emoji: '🌊', label: 'Nile River Cleanup Drive',    date: 'Mar 15 · Cairo'     },
                    { emoji: '🗺️', label: 'Alexandria Coastline Survey', date: 'Apr 5 · Alexandria' },
                    { emoji: '🌿', label: 'Wetlands Restoration Day',     date: 'May 3 · Damietta'  },
                  ].map(({ emoji, label, date }) => (
                    <div key={label} className="flex items-center gap-3 glass rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                      <span className="text-base sm:text-lg flex-shrink-0">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs sm:text-sm font-medium truncate">{label}</p>
                        <p className="text-white/40 text-xs">{date}</p>
                      </div>
                      <ChevronDown size={12} className="text-white/20 -rotate-90 flex-shrink-0" />
                    </div>
                  ))}
                </div>

                <Link to="/volunteer"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base text-white transition-all hover:brightness-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#f43f5e,#e11d48)', boxShadow: '0 4px 24px #f43f5e30' }}>
                  <Heart size={16} />
                  See All Volunteer Events
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: Heart,  value: '500+', label: 'Active Volunteers',     color: '#f43f5e' },
                  { icon: Globe,  value: '12',   label: 'Cities Covered',        color: '#0ea5e9' },
                  { icon: Users,  value: '6',    label: 'Events This Month',     color: '#14b8a6' },
                  { icon: Waves,  value: '3',    label: 'Water Bodies Restored', color: '#10b981' },
                ].map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className="glass rounded-2xl p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-white font-display font-bold text-xl sm:text-2xl leading-none mb-1">{value}</p>
                      <p className="text-white/45 text-xs leading-snug">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Game Hub preview ── */}
      <section className="py-16 sm:py-24 bg-ocean-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">

            <div>
              <div className="inline-flex items-center gap-2 glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-6">
                <Gamepad2 size={13} className="text-violet-300" />
                <span className="text-violet-200 text-xs sm:text-sm font-medium">Educational Game Hub</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-5 leading-tight">
                Learn While
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-teal-300">
                  You Play
                </span>
              </h2>
              <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                MOYA isn't just about reporting — it's about understanding water.
                Our Game Hub features hand-crafted educational games covering water
                science, infrastructure, purification, and real-world crisis management.
              </p>

              {/*
                ── GAME PREVIEW LIST ──────────────────────────────────────────
                The first 2 entries below are YOUR custom games (featured + medium).
                They always show at the top. The remaining 2 are standard games.
                To update: replace the name, label, desc, accentColor, coverImage,
                and externalUrl for the featured/medium games.
              */}
              <div className="flex flex-col gap-2 sm:gap-3 mb-6 sm:mb-8">

                {/* ── YOUR FEATURED GAME (always first, big cover card) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <HomeGamePreviewCard
                    type="featured"
                    name="Water Quest"          // ← replace
                    label="500 pts"
                    desc="Your featured game description"   // ← replace
                    accentColor="#1E93B3"                   // ← match your game's accent
                    coverImage="https://i.ibb.co/XxW9K3DM/sunset-valley.jpg"  // ← replace
                    externalUrl="https://daniel-geo.itch.io/water-quest" // ← replace
                  />

                  {/* ── YOUR MEDIUM GAME (second, right column) ── */}
                  <HomeGamePreviewCard
                    type="medium"
                    name="Water Dispatch"            // ← replace
                    label="250 pts"
                    desc="Help the water management team solve real-world water challenges through strategic decision-making and problem-solving!"     // ← replace
                    accentColor="#6366f1"                   // ← match your game's accent
                    coverImage="https://i.ibb.co/sv5GmzRT/water-dispatch.jpg"    // ← replace
                    externalUrl="https://le-sinister.itch.io/water-patch" // ← replace
                  />
                </div>

                {/* ── Standard game rows — keep 2 here to balance the layout ── */}
                <HomeGamePreviewCard
                  emoji="🔧"
                  name="Pipeline Puzzle"
                  label="10 pts"
                  desc="Rotate pipes to route water infrastructure"
                />
                <HomeGamePreviewCard
                  emoji="🌊"
                  name="Flood Defense"
                  label="20 pts"
                  desc="Real-time strategy: protect homes from floods"
                />
              </div>

              <div className="flex flex-col xs:flex-row gap-3">
                <Link to="/games" className="btn-primary flex items-center justify-center gap-2 px-5 sm:px-7 py-3 text-sm sm:text-base">
                  <Gamepad2 size={16} />
                  Open Game Hub
                </Link>
                <Link to="/map" className="btn-secondary flex items-center justify-center gap-2 px-5 sm:px-7 py-3 text-sm sm:text-base">
                  <Star size={16} />
                  Earn Points via Map
                </Link>
              </div>
            </div>

            {/* ── Right side: animated mock game cards ── */}
            <div className="relative h-80 sm:h-96 hidden lg:block">
              <div className="absolute inset-0 bg-violet-500/5 rounded-3xl blur-3xl" />

              <div className="absolute top-6 left-8 right-8 glass rounded-3xl p-5 border border-violet-500/15 rotate-2 opacity-60">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌊</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Flood Defense</p>
                    <p className="text-white/40 text-xs">Protect 3 homes · 60s round</p>
                  </div>
                  <span className="ml-auto badge bg-red-500/15 text-red-300 border border-red-500/25 text-[10px]">Hard</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                </div>
              </div>

              <div className="absolute top-16 left-4 right-4 glass rounded-3xl p-5 border border-white/15 -rotate-1 opacity-80">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🔧</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Pipeline Puzzle</p>
                    <p className="text-white/40 text-xs">Level 2: Creek · 12 moves</p>
                  </div>
                  <span className="ml-auto badge bg-yellow-500/15 text-yellow-300 border border-yellow-500/25 text-[10px]">Medium</span>
                </div>
                <div className="grid grid-cols-4 gap-1 opacity-70">
                  {['━','┗','┓','┃','┃','┏','┛','━','┗','━','━','┛'].map((s, i) => (
                    <div key={i} className="w-full aspect-square glass rounded-lg flex items-center justify-center text-ocean-300 text-lg font-bold border border-white/10">{s}</div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 glass-light rounded-3xl p-5 border border-teal-400/20 shadow-2xl shadow-black/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🧠</span>
                  <span className="text-white font-semibold text-sm">Water Trivia</span>
                  <span className="ml-auto badge bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px]">Free</span>
                </div>
                <p className="text-white text-sm font-medium mb-3">What % of Earth's water is freshwater?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['3%', '10%', '25%', '50%'].map((opt, i) => (
                    <div key={opt} className={`px-3 py-2 rounded-xl text-xs font-medium text-center border transition-colors ${
                      i === 0
                        ? 'bg-teal-500/25 border-teal-400/60 text-teal-200'
                        : 'glass border-white/10 text-white/50'
                    }`}>{opt}</div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Zap size={12} className="text-yellow-400" />
                    <span className="text-yellow-300 text-xs font-medium">+15 pts streak bonus</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy size={12} className="text-ocean-300" />
                    <span className="text-ocean-300 text-xs">Q 7/10</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="card p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ocean-600/20 to-teal-600/10 rounded-2xl" />
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Ready to Make a Difference?</h2>
              <p className="text-white/60 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">Join thousands of citizens helping to improve water management in their communities.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link to={user ? "/map" : "/signup"} className="btn-teal inline-flex items-center gap-2 text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4 w-full sm:w-auto justify-center">
                  {user ? 'Open the Map' : 'Join MOYA'}
                  <ArrowRight size={17} />
                </Link>
                <Link to="/volunteer" className="btn-secondary inline-flex items-center gap-2 text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4 w-full sm:w-auto justify-center">
                  <Heart size={17} />
                  Volunteer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}