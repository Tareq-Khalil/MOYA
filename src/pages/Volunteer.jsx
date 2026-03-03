import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Heart, Calendar, MapPin, Users, Clock, ArrowRight, Check, Loader, Star, Waves, Globe, Droplets } from 'lucide-react'
import { Link } from 'react-router-dom'

const EVENTS = [
  {
    id: 1,
    title: 'Nile River Cleanup Drive',
    date: 'March 15, 2026',
    time: '8:00 AM – 1:00 PM',
    location: 'Cairo Corniche, Maadi',
    category: 'Cleanup',
    spots: 12,
    total: 40,
    description: 'Join us for a major cleanup along the Nile bank. We provide gloves, bags, and refreshments. Help restore one of the world\'s most iconic waterways.',
    reward: 200,
    difficulty: 'Easy',
    color: 'from-ocean-600/40 to-ocean-900/60',
    accent: '#0ea5e9',
    emoji: '🌊',
  },
  {
    id: 2,
    title: 'Water Quality Testing Workshop',
    date: 'March 22, 2026',
    time: '10:00 AM – 3:00 PM',
    location: 'Cairo University, Giza',
    category: 'Education',
    spots: 5,
    total: 20,
    description: 'Learn to use professional water testing kits and help assess water quality in local communities. Training provided. Results feed directly into our database.',
    reward: 300,
    difficulty: 'Medium',
    color: 'from-teal-600/40 to-teal-900/60',
    accent: '#14b8a6',
    emoji: '🧪',
  },
  {
    id: 3,
    title: 'Alexandria Coastline Survey',
    date: 'April 5, 2026',
    time: '7:00 AM – 12:00 PM',
    location: 'Stanley Beach, Alexandria',
    category: 'Survey',
    spots: 8,
    total: 25,
    description: 'Document pollution sources and coastal erosion along Alexandria\'s coast. GPS devices and datasheets provided. Your data helps shape city policy.',
    reward: 250,
    difficulty: 'Medium',
    color: 'from-blue-600/40 to-blue-900/60',
    accent: '#3b82f6',
    emoji: '📍',
  },
  {
    id: 4,
    title: 'School Water Awareness Program',
    date: 'April 12, 2026',
    time: '9:00 AM – 1:00 PM',
    location: 'Multiple Schools, Cairo',
    category: 'Education',
    spots: 15,
    total: 30,
    description: 'Visit schools and deliver fun, interactive water conservation lessons to students aged 8–14. Lesson plans provided. No teaching experience needed.',
    reward: 150,
    difficulty: 'Easy',
    color: 'from-emerald-600/40 to-emerald-900/60',
    accent: '#10b981',
    emoji: '📚',
  },
  {
    id: 5,
    title: 'Underground Pipe Mapping Expedition',
    date: 'April 20, 2026',
    time: '8:00 AM – 5:00 PM',
    location: 'Old Cairo District',
    category: 'Infrastructure',
    spots: 3,
    total: 15,
    description: 'Work with engineers to map aging water infrastructure in historic areas. Requires physical fitness. Data collected helps prioritize city maintenance budgets.',
    reward: 500,
    difficulty: 'Hard',
    color: 'from-violet-600/40 to-violet-900/60',
    accent: '#8b5cf6',
    emoji: '🔧',
  },
  {
    id: 6,
    title: 'Wetlands Restoration Day',
    date: 'May 3, 2026',
    time: '7:30 AM – 2:00 PM',
    location: 'Lake Manzala, Damietta',
    category: 'Restoration',
    spots: 20,
    total: 50,
    description: 'Plant native vegetation and remove invasive species in Egypt\'s largest natural lake. A hands-in-the-mud day that directly restores critical wetland habitat.',
    reward: 350,
    difficulty: 'Medium',
    color: 'from-green-600/40 to-green-900/60',
    accent: '#22c55e',
    emoji: '🌿',
  },
]

const DIFFICULTY_COLORS = {
  Easy:   'text-teal-300 bg-teal-500/15 border-teal-500/30',
  Medium: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
  Hard:   'text-red-300 bg-red-500/15 border-red-500/30',
}

const CATEGORY_COLORS = {
  Cleanup:        'text-ocean-300 bg-ocean-500/15',
  Education:      'text-emerald-300 bg-emerald-500/15',
  Survey:         'text-blue-300 bg-blue-500/15',
  Infrastructure: 'text-violet-300 bg-violet-500/15',
  Restoration:    'text-green-300 bg-green-500/15',
}

function EventCard({ event, onRegister, registered }) {
  const spotsLeft = event.total - event.spots
  const pct = (spotsLeft / event.total) * 100
  const full = event.spots === 0

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 hover:scale-[1.02] transition-all duration-400 group flex flex-col"
      style={{ background: 'linear-gradient(135deg,rgba(8,47,73,0.95),rgba(12,74,110,0.8))' }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-50 pointer-events-none`} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%,${event.accent}18 0%,transparent 70%)` }} />

      <div className="relative z-10 p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="text-3xl">{event.emoji}</div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            <span className={`badge text-[10px] border ${DIFFICULTY_COLORS[event.difficulty]}`}>{event.difficulty}</span>
            <span className={`badge text-[10px] ${CATEGORY_COLORS[event.category]}`}>{event.category}</span>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-1 leading-tight">{event.title}</h3>
          <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{event.description}</p>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-white/50">
          <div className="flex items-center gap-2"><Calendar size={12} style={{ color: event.accent }} />{event.date}</div>
          <div className="flex items-center gap-2"><Clock size={12} style={{ color: event.accent }} />{event.time}</div>
          <div className="flex items-center gap-2"><MapPin size={12} style={{ color: event.accent }} />{event.location}</div>
        </div>

        {/* Spots bar */}
        <div>
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span className="flex items-center gap-1"><Users size={10} />{spotsLeft}/{event.total} joined</span>
            <span style={{ color: event.accent }}>{event.spots} spots left</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: event.accent }} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-yellow-400" />
            <span className="text-yellow-300 text-sm font-bold">+{event.reward} pts</span>
          </div>

          {registered ? (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm">
              <Check size={13} />Registered!
            </div>
          ) : full ? (
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 text-sm cursor-not-allowed">
              Full
            </div>
          ) : (
            <button onClick={() => onRegister(event)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:brightness-110 active:scale-95"
              style={{ background: `${event.accent}25`, border: `1px solid ${event.accent}50`, color: event.accent }}>
              Join Event<ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function RegisterModal({ event, onClose, onSuccess }) {
  const { user, profile } = useAuth()
  const [form, setForm] = useState({ name: profile?.full_name || '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required'); return }
    setLoading(true)
    try {
      await supabase.from('volunteer_registrations').insert({
        event_id: event.id,
        event_title: event.title,
        user_id: user?.id || null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        registered_at: new Date().toISOString(),
      })
      onSuccess()
    } catch (err) {
      setError(err.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-light rounded-3xl p-7 max-w-md w-full border border-white/20 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">{event.emoji} {event.title}</h2>
            <p className="text-white/40 text-sm mt-0.5">{event.date} · {event.location}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 glass rounded-xl flex items-center justify-center hover:bg-red-500/20">
            <X size={15} className="text-white/60" />
          </button>
        </div>

        <div className="glass rounded-2xl p-4 mb-5 flex items-center justify-between">
          <div className="text-sm text-white/60">Volunteer reward</div>
          <div className="flex items-center gap-1.5 text-yellow-300 font-bold">
            <Star size={14} />{event.reward} pts after participation
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">{error}</div>}

        <div className="flex flex-col gap-4">
          {[
            { label: 'Full Name *', key: 'name', placeholder: 'Your full name' },
            { label: 'Email *', key: 'email', placeholder: 'your@email.com', type: 'email' },
            { label: 'Phone Number', key: 'phone', placeholder: '+20 xxx xxx xxxx', type: 'tel' },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label className="text-sm text-white/60 mb-1.5 block">{label}</label>
              <input type={type || 'text'} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder} className="input-field" />
            </div>
          ))}
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Why do you want to volunteer? (optional)</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us a bit about yourself..." rows={3} className="input-field resize-none" />
          </div>

          <div className="flex gap-3 mt-2">
            <button onClick={onClose} className="flex-1 btn-secondary py-3">Cancel</button>
            <button onClick={submit} disabled={loading} className="flex-1 btn-teal py-3 flex items-center justify-center gap-2">
              {loading ? <Loader size={15} className="animate-spin" /> : <Heart size={15} />}
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Volunteer() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('All')
  const [registerModal, setRegisterModal] = useState(null)
  const [registered, setRegistered] = useState(new Set())
  const [successMsg, setSuccessMsg] = useState(false)

  const categories = ['All', ...new Set(EVENTS.map(e => e.category))]
  const filtered = filter === 'All' ? EVENTS : EVENTS.filter(e => e.category === filter)

  const handleSuccess = (eventId) => {
    setRegistered(prev => new Set([...prev, eventId]))
    setRegisterModal(null)
    setSuccessMsg(true)
    setTimeout(() => setSuccessMsg(false), 4000)
  }

  return (
    <div className="min-h-screen pb-16">
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] animate-slide-up">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-teal-900/90 border border-teal-400/40 shadow-2xl backdrop-blur-xl">
            <Check size={20} className="text-teal-300" />
            <p className="text-white font-semibold">You're registered! We'll contact you closer to the event.</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-950 via-ocean-900/80 to-transparent" />
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-float opacity-10"
              style={{ width:`${20+i*12}px`, height:`${20+i*12}px`, left:`${5+i*9}%`, top:`${10+(i%4)*22}%`,
                background:['#0ea5e9','#14b8a6','#10b981','#f59e0b'][i%4], filter:'blur(4px)',
                animationDelay:`${i*0.4}s`, animationDuration:`${4+i*0.3}s` }} />
          ))}
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Heart size={14} className="text-rose-300" />
            <span className="text-rose-200 text-sm">Make a Real Difference</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Volunteer with
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 via-teal-300 to-emerald-300">
              MOYA
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Join our community events to clean, survey, and restore water bodies across Egypt.
            Earn AquaPoints for every hour you contribute.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Droplets, label: `${EVENTS.length} Active Events`, color: 'text-ocean-300' },
              { icon: Users, label: '500+ Volunteers', color: 'text-teal-300' },
              { icon: Globe, label: '12 Cities', color: 'text-emerald-300' },
              { icon: Star, label: 'Earn Points', color: 'text-yellow-300' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Icon size={14} className={color} />
                <span className="text-white/65 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* How it works */}
        <div className="glass rounded-3xl p-8 mb-12 grid sm:grid-cols-4 gap-6 text-center">
          {[
            { n:'1', title:'Browse Events', desc:'Find events near you that match your interests and schedule', icon:'📅' },
            { n:'2', title:'Register', desc:'Submit your details — we\'ll confirm your spot via email', icon:'✍️' },
            { n:'3', title:'Show Up', desc:'Attend the event and make a real impact on local water', icon:'🙌' },
            { n:'4', title:'Earn Points', desc:'Receive AquaPoints after the admin confirms your participation', icon:'⭐' },
          ].map(({ n, title, desc, icon }) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <div className="text-3xl mb-1">{icon}</div>
              <div className="w-7 h-7 rounded-lg bg-ocean-500/20 border border-ocean-400/30 flex items-center justify-center text-xs font-bold text-ocean-300">{n}</div>
              <h4 className="text-white font-semibold text-sm">{title}</h4>
              <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === cat ? 'bg-ocean-500 text-white shadow-lg' : 'glass text-white/55 hover:text-white'
              }`}>{cat}</button>
          ))}
        </div>

        {/* Events grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {filtered.map(event => (
            <EventCard key={event.id} event={event}
              registered={registered.has(event.id)}
              onRegister={e => {
                if (!user) { window.location.href = '/login'; return }
                setRegisterModal(e)
              }} />
          ))}
        </div>

        {/* Bottom CTA for non-users */}
        {!user && (
          <div className="glass rounded-3xl p-10 text-center border border-ocean-400/20">
            <div className="text-5xl mb-4">🌊</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Volunteer?</h2>
            <p className="text-white/55 mb-6 max-w-md mx-auto">Create a free MOYA account to register for events and start earning points for your contributions.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/signup" className="btn-teal px-8 py-3 flex items-center gap-2"><Heart size={16} />Join MOYA</Link>
              <Link to="/login" className="btn-secondary px-8 py-3">Login</Link>
            </div>
          </div>
        )}
      </div>

      {registerModal && (
        <RegisterModal event={registerModal}
          onClose={() => setRegisterModal(null)}
          onSuccess={() => handleSuccess(registerModal.id)} />
      )}
    </div>
  )
}