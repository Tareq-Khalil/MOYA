import { Link } from 'react-router-dom'
import { Droplets, Map, Star, Shield, ArrowRight, ChevronDown, Waves, AlertTriangle, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="card text-center group hover:scale-105 transition-transform cursor-default">
    <div className="w-12 h-12 rounded-2xl bg-ocean-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-ocean-500/30 transition-colors">
      <Icon size={24} className="text-ocean-300" />
    </div>
    <div className="text-3xl font-display font-bold text-white mb-1">{number}</div>
    <div className="text-white/50 text-sm">{label}</div>
  </div>
)

const FeatureCard = ({ icon: Icon, title, description, color = 'ocean' }) => (
  <div className={`card group hover:scale-[1.02] transition-all`}>
    <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${
      color === 'teal' ? 'bg-teal-500/20' : 'bg-ocean-500/20'
    } group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={color === 'teal' ? 'text-teal-300' : 'text-ocean-300'} />
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-950 via-ocean-900 to-ocean-800" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-ocean-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          {/* Floating droplets */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-ocean-400/30 animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-fade-in">
            <Waves size={14} className="text-teal-300" />
            <span className="text-teal-200 text-sm font-medium">Water Problem Reporting Platform</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Report. Track.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 to-teal-300">
              Change the Flow.
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Join our community to identify and report water-related issues in your area.
            Earn rewards for your contributions and help build a better water future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/map" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              <Map size={18} />
              Explore the Map
            </Link>
            {!user && (
              <Link to="/signup" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
                Join Now
                <ArrowRight size={18} />
              </Link>
            )}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
            <ChevronDown size={20} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-ocean-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard number="0K+" label="Reports Submitted" icon={AlertTriangle} />
            <StatCard number="0+" label="Active Users" icon={Star} />
            <StatCard number="0%" label="Issues Resolved" icon={TrendingUp} />
            <StatCard number="0+" label="Cities Covered" icon={Map} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">How AquaWatch Works</h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto">A complete ecosystem for water problem reporting and community engagement</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Map}
              title="Interactive Map"
              description="Browse a live map of your community. See water problems reported by others and contribute your own observations at any location."
            />
            <FeatureCard
              icon={Star}
              title="Earn Points"
              description="Get rewarded for every approved report. Admins review your submissions and assign points based on severity and quality."
              color="teal"
            />
            <FeatureCard
              icon={Shield}
              title="Admin Review"
              description="All reports go through expert admin review before appearing publicly, ensuring data quality and rewarding meaningful contributions."
            />
          </div>
        </div>
      </section>

      {/* How it works steps */}
      <section className="py-20 bg-ocean-900/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-white mb-10">Get Started in Minutes</h2>
              <div className="flex flex-col gap-8">
                <HowStep number="01" title="Create Your Account" description="Sign up for free and set up your profile to start contributing to water management in your area." />
                <HowStep number="02" title="Find a Problem" description="Navigate to the map and drop a pin at the location where you've spotted a water issue." />
                <HowStep number="03" title="Submit a Report" description="Add a title, description, and photos of the water problem. Your report will be reviewed by our admin team." />
                <HowStep number="04" title="Earn & Redeem" description="Once approved, you'll receive points that can be redeemed in our shop for real rewards and benefits." />
              </div>
            </div>
            <div className="relative">
              <div className="card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-ocean-500/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Droplets size={20} className="text-teal-300" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">Sample Report</div>
                    <div className="font-semibold text-white">Contaminated Pipeline</div>
                  </div>
                  <div className="ml-auto badge-approved">Approved</div>
                </div>
                <div className="w-full h-32 rounded-xl bg-ocean-800/60 mb-4 flex items-center justify-center border border-white/10">
                  <Waves size={40} className="text-ocean-400/40" />
                </div>
                <p className="text-white/60 text-sm mb-4">Visible brown discoloration in tap water with unusual odor. Affecting multiple households on Block 4.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-teal-300">
                    <Star size={14} />
                    <span className="text-sm font-medium">+50 points awarded</span>
                  </div>
                  <span className="text-white/30 text-xs">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ocean-600/20 to-teal-600/10 rounded-2xl" />
            <div className="relative">
              <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
              <p className="text-white/60 mb-8 text-lg">Join thousands of citizens helping to improve water management in their communities.</p>
              <Link to={user ? "/map" : "/signup"} className="btn-teal inline-flex items-center gap-2 text-base px-10 py-4">
                {user ? 'Open the Map' : 'Join AquaWatch'}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-ocean-300" />
            <span className="font-display font-bold text-white">AquaWatch</span>
          </div>
          <p className="text-white/30 text-sm">© 2026 WaterWise. Helping communities, one drop at a time.</p>
          <div className="flex gap-6">
            <Link to="/meet-us" className="text-white/40 hover:text-white/70 text-sm transition-colors">About</Link>
            <Link to="/map" className="text-white/40 hover:text-white/70 text-sm transition-colors">Map</Link>
            <Link to="/shop" className="text-white/40 hover:text-white/70 text-sm transition-colors">Shop</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
