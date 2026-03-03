import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import {
  Heart,
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Check,
  Loader,
  Star,
  Globe,
  Droplets,
  X
} from 'lucide-react'
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
    reward: 200,
    difficulty: 'Easy',
    color: 'from-ocean-600/40 to-ocean-900/60',
    accent: '#0ea5e9',
    emoji: '🌊',
    description:
      "Join us for a major cleanup along the Nile bank. We provide gloves, bags, and refreshments."
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
    reward: 300,
    difficulty: 'Medium',
    color: 'from-teal-600/40 to-teal-900/60',
    accent: '#14b8a6',
    emoji: '🧪',
    description:
      'Learn to use professional water testing kits and help assess water quality.'
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
    reward: 250,
    difficulty: 'Medium',
    color: 'from-blue-600/40 to-blue-900/60',
    accent: '#3b82f6',
    emoji: '📍',
    description:
      "Document pollution sources and coastal erosion along Alexandria's coast."
  }
]

const DIFFICULTY_COLORS = {
  Easy: 'text-teal-300 bg-teal-500/15 border-teal-500/30',
  Medium: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
  Hard: 'text-red-300 bg-red-500/15 border-red-500/30'
}

function EventCard({ event, onRegister, registered }) {
  const spotsLeft = event.total - event.spots
  const pct = (spotsLeft / event.total) * 100
  const full = event.spots === 0

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 transition-all group flex flex-col">
      <div className="relative z-10 p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between">
          <div className="text-3xl">{event.emoji}</div>
          <span
            className={`badge text-[10px] border ${DIFFICULTY_COLORS[event.difficulty]}`}
          >
            {event.difficulty}
          </span>
        </div>

        <h3 className="font-bold text-white">{event.title}</h3>

        <div className="text-xs text-white/60 space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={12} /> {event.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} /> {event.time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} /> {event.location}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-yellow-300 font-bold">
            <Star size={13} /> +{event.reward} pts
          </div>

          {registered ? (
            <div className="text-teal-300 text-sm flex items-center gap-1">
              <Check size={13} /> Registered
            </div>
          ) : full ? (
            <div className="text-white/40 text-sm">Full</div>
          ) : (
            <button
              onClick={() => onRegister(event)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-500"
            >
              Join Event
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function RegisterModal({ event, onClose, onSuccess }) {
  const { user, profile } = useAuth()
  const [form, setForm] = useState({
    name: profile?.full_name || '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('volunteer_registrations')
        .insert({
          event_id: event.id,
          event_title: event.title,
          user_id: user?.id || null,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          registered_at: new Date().toISOString()
        })

      if (error) throw error

      onSuccess()
    } catch (err) {
      setError(err.message || 'Registration failed')
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold">
            {event.emoji} {event.title}
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="text-red-400 text-sm mb-3">{error}</div>
        )}

        <input
          className="w-full mb-3 p-2 rounded bg-slate-800 text-white"
          placeholder="Full Name"
          value={form.name}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full mb-3 p-2 rounded bg-slate-800 text-white"
          placeholder="Email"
          value={form.email}
          onChange={e =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-teal-600 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          {loading ? <Loader size={15} /> : <Heart size={15} />}
          Register
        </button>
      </div>
    </div>
  )
}

export default function Volunteer() {
  const { user } = useAuth()
  const [registerModal, setRegisterModal] = useState(null)
  const [registered, setRegistered] = useState(new Set())

  const handleSuccess = id => {
    setRegistered(prev => new Set([...prev, id]))
    setRegisterModal(null)
  }

  return (
    <div className="p-10 grid md:grid-cols-3 gap-6">
      {EVENTS.map(event => (
        <EventCard
          key={event.id}
          event={event}
          registered={registered.has(event.id)}
          onRegister={e => {
            if (!user) {
              window.location.href = '/login'
              return
            }
            setRegisterModal(e)
          }}
        />
      ))}

      {registerModal && (
        <RegisterModal
          event={registerModal}
          onClose={() => setRegisterModal(null)}
          onSuccess={() =>
            handleSuccess(registerModal.id)
          }
        />
      )}
    </div>
  )
}
