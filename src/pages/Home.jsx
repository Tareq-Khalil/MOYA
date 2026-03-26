import { Link } from 'react-router-dom'
import { Droplets, Map, Star, Shield, ArrowRight, ChevronDown, Waves, AlertTriangle, TrendingUp, Gamepad2, Brain, Puzzle, Trophy, Zap, Heart, Users, Globe, Crown, ExternalLink, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

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

              <div className="flex flex-col gap-2 sm:gap-3 mb-6 sm:mb-8">

                <div className="flex items-center gap-3 rounded-xl px-3 sm:px-4 py-3 group hover:brightness-110 transition-all border border-amber-500/25 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(245,158,11,0.04))' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)' }}>
                    <Crown size={14} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-xs sm:text-sm">Water Quest</span>{/* ← replace */}
                      <span className="badge text-[10px] font-bold" style={{ background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.35)', color:'#fbbf24' }}>500 pts</span>
                      <span className="badge bg-orange-500/20 text-orange-300 border border-orange-400/30 text-[10px] font-bold tracking-wide">NEW</span>
                    </div>
                    <p className="text-white/40 text-xs truncate mt-0.5">A Stardew Valley Adventure</p>{/* ← replace */}
                  </div>
                  <ExternalLink size={13} className="text-amber-400/50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex items-center gap-3 rounded-xl px-3 sm:px-4 py-3 group hover:brightness-110 transition-all border border-indigo-500/25 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(99,102,241,0.04))' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-indigo-500/20 border border-indigo-500/35">
                    <Sparkles size={14} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-xs sm:text-sm">Water Dispatch</span>{/* ← replace */}
                      <span className="badge bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">250 pts</span>
                      <span className="badge bg-orange-500/20 text-orange-300 border border-orange-400/30 text-[10px] font-bold tracking-wide">NEW</span>
                    </div>
                    <p className="text-white/40 text-xs truncate mt-0.5">Fix, Learn, Earn</p>{/* ← replace */}
                  </div>
                  <ExternalLink size={13} className="text-indigo-400/50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {[
                  { emoji: '🔧', name: 'Pipeline Puzzle', label: '10 pts',  desc: 'Rotate pipes to route water infrastructure' },
                  { emoji: '🌊', name: 'Flood Defense',   label: '20 pts',  desc: 'Real-time strategy: protect homes from floods' },
                ].map(({ emoji, name, label, desc }) => (
                  <div key={name} className="flex items-center gap-3 glass rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 group hover:bg-white/10 transition-colors">
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
                ))}
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
            <div className="relative hidden lg:block" style={{ height: '500px' }}>

              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />

              <div className="absolute left-12 right-12 top-2 glass rounded-3xl px-5 py-4 border border-white/8 rotate-3 opacity-35 pointer-events-none" style={{ zIndex: 1 }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🧠</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">Water Trivia</p>
                    <p className="text-white/30 text-xs">10 timed questions · free</p>
                  </div>
                  <span className="badge bg-teal-500/15 text-teal-300 border border-teal-500/20 text-[10px]">Free</span>
                </div>
              </div>

              <div className="absolute left-8 right-8 top-10 glass rounded-3xl p-5 border border-white/10 -rotate-1 opacity-50 pointer-events-none" style={{ zIndex: 2 }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">🔧</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Pipeline Puzzle</p>
                    <p className="text-white/35 text-xs">Level 2 · 12 moves</p>
                  </div>
                  <span className="ml-auto badge bg-yellow-500/15 text-yellow-300 border border-yellow-500/20 text-[10px]">Medium</span>
                </div>
                <div className="grid grid-cols-4 gap-1 opacity-50">
                  {['━','┗','┓','┃','┃','┏','┛','━'].map((s, i) => (
                    <div key={i} className="w-full aspect-square glass rounded-lg flex items-center justify-center text-ocean-300 text-sm font-bold border border-white/8">{s}</div>
                  ))}
                </div>
              </div>

              <div className="absolute left-5 right-5 top-24 glass rounded-3xl p-5 border border-blue-500/15 rotate-1 opacity-65 pointer-events-none" style={{ zIndex: 3 }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌊</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Flood Defense</p>
                    <p className="text-white/35 text-xs">Protect 3 homes · 60s round</p>
                  </div>
                  <span className="ml-auto badge bg-red-500/15 text-red-300 border border-red-500/20 text-[10px]">Hard</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 rounded-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #22d3ee)' }} />
                </div>
              </div>

              <div className="absolute left-2 right-2 top-40 rounded-3xl p-5 border -rotate-0.5 opacity-88 pointer-events-none"
                style={{
                  zIndex: 4,
                  background: 'linear-gradient(135deg, rgba(49,46,129,0.70) 0%, rgba(8,47,73,0.90) 100%)',
                  borderColor: 'rgba(99,102,241,0.40)',
                  backdropFilter: 'blur(14px)',
                }}>
                <div className="absolute top-0 left-8 right-8 h-px rounded-full"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)' }} />
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.45)' }}>
                    <Sparkles size={16} className="text-indigo-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="badge bg-indigo-500/25 text-indigo-300 border border-indigo-400/40 text-[10px] font-bold tracking-wide">PREMIUM</span>
                      <span className="badge bg-orange-500/20 text-orange-300 border border-orange-400/30 text-[10px] font-bold">NEW</span>
                    </div>
                    <p className="text-white font-bold text-sm leading-snug">YOUR_MEDIUM_GAME_NAME</p>{/* ← replace */}
                    <p className="text-indigo-300/60 text-xs mt-0.5">External game · 150 pts</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg px-2 py-1 flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)' }}>
                    <Star size={9} className="text-indigo-300" />
                    <span className="text-indigo-300 text-[10px] font-bold">150</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {['Unique Gameplay','Water Themed','Score Tracking'].map(f => (
                    <span key={f} className="text-[10px] px-2 py-0.5 rounded-md text-indigo-300/60 border border-indigo-500/20"
                      style={{ background: 'rgba(99,102,241,0.10)' }}>{f}</span>
                  ))}
                </div>
              </div>

              <div className="absolute left-0 right-0 bottom-0 rounded-3xl p-6 border shadow-2xl"
                style={{
                  zIndex: 5,
                  background: 'linear-gradient(135deg, rgba(8,47,73,0.98) 0%, rgba(20,60,100,0.95) 60%, rgba(12,74,110,0.90) 100%)',
                  borderColor: 'rgba(245,158,11,0.45)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,158,11,0.10), 0 0 48px rgba(245,158,11,0.06)',
                }}>
                <div className="absolute top-0 left-8 right-8 h-px rounded-full"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.75), transparent)' }} />
                <div className="absolute top-0 left-0 w-24 h-24 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)' }} />

                <div className="flex items-start gap-3 mb-4 relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(245,158,11,0.22)', border: '1px solid rgba(245,158,11,0.50)' }}>
                    <Crown size={20} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.20)', border: '1px solid rgba(245,158,11,0.45)', color: '#fbbf24' }}>
                        ★ FEATURED
                      </span>
                      <span className="badge bg-orange-500/25 text-orange-300 border border-orange-400/40 text-[10px] font-bold">NEW</span>
                    </div>
                    <p className="text-white font-bold text-base leading-snug">YOUR_FEATURED_GAME_NAME</p>{/* ← replace */}
                    <p className="text-amber-400/65 text-xs mt-0.5">Premium external game · 500 pts to unlock</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 flex-shrink-0"
                    style={{ background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.40)' }}>
                    <Star size={11} className="text-amber-400" />
                    <span className="text-amber-300 text-xs font-bold font-mono">500</span>
                  </div>
                </div>

                <p className="text-white/48 text-xs leading-relaxed mb-4 relative">
                  Your featured game description — a line that captures what makes it special.{/* ← replace */}
                </p>

                <div className="flex items-center justify-between relative">
                  <div className="flex gap-1.5 flex-wrap">
                    {['Premium', 'External', 'Featured', 'Expert'].map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-md text-amber-300/55 border border-amber-500/18"
                        style={{ background: 'rgba(245,158,11,0.07)' }}>{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs flex-shrink-0 ml-2"
                    style={{ color: 'rgba(245,158,11,0.50)' }}>
                    <ExternalLink size={11} />
                    <span>Opens externally</span>
                  </div>
                </div>
              </div>

            </div>{/* end stacked deck */}
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