import { Link } from 'react-router-dom'
import { Waves, Map, Star, Shield, ArrowRight, ChevronDown, AlertTriangle, TrendingUp, Gamepad2, Trophy, Zap, Heart, Calendar, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="card text-center group hover:scale-105 transition-transform cursor-default">
    <div className="w-12 h-12 rounded-2xl bg-ocean-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-ocean-500/30 transition-colors">
      <Icon size={24} className="text-ocean-300"/>
    </div>
    <div className="text-3xl font-display font-bold text-white mb-1">{number}</div>
    <div className="text-white/50 text-sm">{label}</div>
  </div>
)

const FeatureCard = ({ icon: Icon, title, description, color = 'ocean' }) => (
  <div className="card group hover:scale-[1.02] transition-all">
    <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${
      color === 'teal' ? 'bg-teal-500/20' : color === 'violet' ? 'bg-violet-500/20' : color === 'rose' ? 'bg-rose-500/20' : 'bg-ocean-500/20'
    } group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={
        color === 'teal' ? 'text-teal-300' : color === 'violet' ? 'text-violet-300' : color === 'rose' ? 'text-rose-300' : 'text-ocean-300'
      }/>
    </div>
    <h3 className="font-display text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-white/60 leading-relaxed">{description}</p>
  </div>
)

const HowStep = ({ number, title, description }) => (
  <div className="flex gap-5 items-start group">
    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-ocean-500/20 border border-ocean-400/30 flex items-center justify-center text-ocean-300 font-mono font-bold text-sm group-hover:bg-ocean-500/30 transition-colors">
      {number}
    </div>
    <div>
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <p className="text-white/55 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
)

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-950 via-ocean-900 to-ocean-800"/>
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-ocean-500/10 rounded-full blur-3xl animate-pulse-slow"/>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay:'2s'}}/>
          {[...Array(6)].map((_,i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-ocean-400/30 animate-float"
              style={{left:`${15+i*15}%`,top:`${20+(i%3)*25}%`,animationDelay:`${i*0.8}s`,animationDuration:`${4+i*0.5}s`}}/>
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Waves size={14} className="text-teal-300"/>
            <span className="text-teal-200 text-sm font-medium">Water Problem Reporting Platform by WaterWorks</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 leading-tight animate-slide-up">
            Report. Track.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 to-teal-300">Change the Flow.</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{animationDelay:'0.1s'}}>
            Join our community to identify and report water-related issues. Earn points for your contributions,
            volunteer at events, and play educational games — all powered by MOYA.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{animationDelay:'0.2s'}}>
            <Link to="/map" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              <Map size={18}/>Explore the Map
            </Link>
            <Link to="/volunteer" className="btn-teal flex items-center gap-2 text-base px-8 py-4">
              <Heart size={18}/>Join Us
            </Link>
            {!user && (
              <Link to="/signup" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
                Sign Up<ArrowRight size={18}/>
              </Link>
            )}
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
            <ChevronDown size={20}/>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-ocean-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard number="2.1K+" label="Reports Submitted" icon={AlertTriangle}/>
            <StatCard number="840+" label="Active Users" icon={Star}/>
            <StatCard number="94%" label="Issues Resolved" icon={TrendingUp}/>
            <StatCard number="6" label="Educational Games" icon={Gamepad2}/>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Everything MOYA Offers</h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto">Reporting, education, volunteering, and community — all in one platform</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={Map} title="Interactive Map" description="Report and track water issues live on an interactive map pinned to real locations in your community."/>
            <FeatureCard icon={Star} title="Earn Points" color="teal" description="Get rewarded for every approved report. Admins review submissions and award points based on quality."/>
            <FeatureCard icon={Heart} title="Volunteer" color="rose" description="Join hands-on water events — cleanups, surveys, and school programs. Earn points for every hour you give."/>
            <FeatureCard icon={Gamepad2} title="Game Hub" color="violet" description="Spend points unlocking water-themed educational games covering conservation, ecology, and crisis management."/>
          </div>
        </div>
      </section>

      {/* Volunteering CTA Section */}
      <section className="py-20 bg-ocean-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
                <Heart size={14} className="text-rose-300"/>
                <span className="text-rose-200 text-sm font-medium">Community Volunteering</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Volunteer with<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-orange-300">Your Hands</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Beyond reporting, MOYA connects volunteers with real on-the-ground events — river cleanups,
                water quality workshops, school programs, and ecological restoration drives. Every hour earns you AquaPoints.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {[
                  { emoji:'🌊', title:'River & Coast Cleanups', desc:'Remove pollution from Egypt\'s waterways' },
                  { emoji:'🧪', title:'Water Quality Testing', desc:'Survey contamination in local communities' },
                  { emoji:'📚', title:'School Education Programs', desc:'Teach kids about water conservation' },
                ].map(({ emoji, title, desc }) => (
                  <div key={title} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                    <span className="text-xl">{emoji}</span>
                    <div>
                      <p className="text-white font-medium text-sm">{title}</p>
                      <p className="text-white/40 text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/volunteer" className="btn-primary flex items-center gap-2 w-fit px-8 py-4">
                <Heart size={18}/>Join Us as a Volunteer
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji:'🌊', count:'6+', label:'Active Events', color:'from-ocean-600/40 to-ocean-900/60' },
                { emoji:'👥', count:'500+', label:'Volunteers', color:'from-teal-600/40 to-teal-900/60' },
                { emoji:'🏙️', count:'12', label:'Cities', color:'from-blue-600/40 to-blue-900/60' },
                { emoji:'⭐', count:'150+', label:'Avg Points/Event', color:'from-yellow-600/40 to-yellow-900/60' },
              ].map(({ emoji, count, label, color }) => (
                <div key={label} className={`rounded-3xl bg-gradient-to-br ${color} border border-white/10 p-6 flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform`}>
                  <span className="text-3xl">{emoji}</span>
                  <div className="font-display text-3xl font-bold text-white">{count}</div>
                  <div className="text-white/50 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-white mb-10">Get Started in Minutes</h2>
              <div className="flex flex-col gap-8">
                <HowStep number="01" title="Create Your Account" description="Sign up and verify your identity with a government ID. Protects the platform from fraudulent reports."/>
                <HowStep number="02" title="Find or Report a Problem" description="Navigate the map and drop a pin at any water issue location. Add photos, video, and a description."/>
                <HowStep number="03" title="Admin Reviews Your Report" description="Our team verifies submissions and awards points based on severity and quality of evidence."/>
                <HowStep number="04" title="Earn, Play, Volunteer & Redeem" description="Spend points unlocking games or use them in our shop. Volunteer at events to earn even more."/>
              </div>
            </div>
            <div className="card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ocean-500/10 rounded-full blur-2xl"/>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Waves size={20} className="text-teal-300"/>
                </div>
                <div>
                  <div className="text-sm text-white/50">Sample Report</div>
                  <div className="font-semibold text-white">Contaminated Pipeline</div>
                </div>
                <div className="ml-auto badge-approved">Approved</div>
              </div>
              <div className="w-full h-32 rounded-xl bg-ocean-800/60 mb-4 flex items-center justify-center border border-white/10">
                <Waves size={40} className="text-ocean-400/40"/>
              </div>
              <p className="text-white/60 text-sm mb-4">Visible brown discoloration in tap water with unusual odor. Affecting multiple households on Block 4.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-teal-300">
                  <Star size={14}/>
                  <span className="text-sm font-medium">+50 points awarded</span>
                </div>
                <span className="text-white/30 text-xs">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ocean-600/20 to-teal-600/10 rounded-2xl"/>
            <div className="relative">
              <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
              <p className="text-white/60 mb-8 text-lg">Join thousands of citizens improving water management across Egypt with MOYA.</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to={user ? "/map" : "/signup"} className="btn-teal inline-flex items-center gap-2 text-base px-10 py-4">
                  {user ? 'Open the Map' : 'Join MOYA'}<ArrowRight size={18}/>
                </Link>
                <Link to="/volunteer" className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-4">
                  <Heart size={18}/>Volunteer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Waves size={18} className="text-ocean-300"/>
            <div>
              <span className="font-display font-bold text-white tracking-widest">MOYA</span>
              <span className="text-ocean-400/50 text-xs ml-1">by WaterWorks</span>
            </div>
          </div>
          <p className="text-white/30 text-sm">© 2026 WaterWorks. Helping communities, one drop at a time.</p>
          <div className="flex gap-6">
            <Link to="/meet-us" className="text-white/40 hover:text-white/70 text-sm transition-colors">About</Link>
            <Link to="/map" className="text-white/40 hover:text-white/70 text-sm transition-colors">Map</Link>
            <Link to="/volunteer" className="text-white/40 hover:text-white/70 text-sm transition-colors">Volunteer</Link>
            <Link to="/shop" className="text-white/40 hover:text-white/70 text-sm transition-colors">Shop</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}