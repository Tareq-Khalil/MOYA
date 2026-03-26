import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import {
  Heart, Calendar, MapPin, Users, Clock, ArrowRight, Check,
  Loader, Globe, Droplets, X,
  Mail, Phone, User, Cake, AlertCircle, CheckCircle2
} from 'lucide-react'
import { Link } from 'react-router-dom'

const EVENTS = [
  {
    id: 1,
    title: 'Nile River Cleanup Drive',
    date: 'March 15, 2026',
    time: '8:00 AM - 1:00 PM',
    location: 'Cairo Corniche, Maadi',
    category: 'Cleanup',
    spots: 12,
    total: 40,
    description:
      "Join us for a major cleanup along the Nile bank. We provide gloves, bags, and refreshments. Help restore one of the world's most iconic waterways.",
    color: 'from-ocean-600/40 to-ocean-900/60',
    accent: '#0ea5e9',
  },
  {
    id: 2,
    title: 'Water Quality Testing Workshop',
    date: 'March 22, 2026',
    time: '10:00 AM - 3:00 PM',
    location: 'Cairo University, Giza',
    category: 'Education',
    spots: 5,
    total: 20,
    description:
      'Learn to use professional water testing kits and help assess water quality in local communities. Training provided. Results feed directly into our database.',
    color: 'from-teal-600/40 to-teal-900/60',
    accent: '#14b8a6',
  },
  {
    id: 3,
    title: 'Alexandria Coastline Survey',
    date: 'April 5, 2026',
    time: '7:00 AM - 12:00 PM',
    location: 'Stanley Beach, Alexandria',
    category: 'Survey',
    spots: 8,
    total: 25,
    description:
      "Document pollution sources and coastal erosion along Alexandria's coast. GPS devices and datasheets provided. Your data helps shape city policy.",
    color: 'from-blue-600/40 to-blue-900/60',
    accent: '#3b82f6',
  },
  {
    id: 4,
    title: 'School Water Awareness Program',
    date: 'April 12, 2026',
    time: '9:00 AM - 1:00 PM',
    location: 'Multiple Schools, Cairo',
    category: 'Education',
    spots: 15,
    total: 30,
    description:
      'Visit schools and deliver fun, interactive water conservation lessons to students aged 8-14. Lesson plans provided. No teaching experience needed.',
    color: 'from-emerald-600/40 to-emerald-900/60',
    accent: '#10b981',
  },
  {
    id: 5,
    title: 'Underground Pipe Mapping Expedition',
    date: 'April 20, 2026',
    time: '8:00 AM - 5:00 PM',
    location: 'Old Cairo District',
    category: 'Infrastructure',
    spots: 3,
    total: 15,
    description:
      'Work with engineers to map aging water infrastructure in historic areas. Requires physical fitness. Data collected helps prioritize city maintenance budgets.',
    difficulty: 'Hard',
    color: 'from-violet-600/40 to-violet-900/60',
    accent: '#8b5cf6',
  },
  {
    id: 6,
    title: 'Wetlands Restoration Day',
    date: 'May 3, 2026',
    time: '7:30 AM - 2:00 PM',
    location: 'Lake Manzala, Damietta',
    category: 'Restoration',
    spots: 20,
    total: 50,
    description:
      "Plant native vegetation and remove invasive species in Egypt's largest natural lake. A hands-in-the-mud day that directly restores critical wetland habitat.",
    difficulty: 'Medium',
    color: 'from-green-600/40 to-green-900/60',
    accent: '#22c55e',
  },
]

const DIFFICULTY_COLORS = {
  Easy:   'text-teal-300 bg-teal-500/15 border-teal-500/30',
  Medium: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
  Hard:   'text-red-300 bg-red-500/15 border-red-500/30',
}

const CATEGORY_COLORS = {
  Cleanup:        'text-sky-300 bg-sky-500/15',
  Education:      'text-emerald-300 bg-emerald-500/15',
  Survey:         'text-blue-300 bg-blue-500/15',
  Infrastructure: 'text-violet-300 bg-violet-500/15',
  Restoration:    'text-green-300 bg-green-500/15',
}

async function sendConfirmationEmail({ firstName, lastName, email, eventTitle, eventDate, eventLocation }) {

  const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'YOUR_SERVICE_ID'
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
  const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'YOUR_PUBLIC_KEY'

  const payload = {
    service_id:  SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id:     PUBLIC_KEY,
    template_params: {
      to_name:        `${firstName} ${lastName}`,
      to_email:       email,
      event_title:    eventTitle,
      event_date:     eventDate,
      event_location: eventLocation,
    },
  }

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    console.warn('EmailJS warning:', text)
  }
}

function EventCard({ event, onRegister, registered }) {
  const spotsLeft = event.total - event.spots
  const pct       = (spotsLeft / event.total) * 100
  const full      = event.spots === 0

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 hover:scale-[1.02] transition-all duration-400 group flex flex-col"
      style={{ background: 'linear-gradient(135deg,rgba(8,47,73,0.95),rgba(12,74,110,0.8))' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-50 pointer-events-none`} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%,${event.accent}18 0%,transparent 70%)` }}
      />

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
          <div className="flex items-center gap-2"><Clock    size={12} style={{ color: event.accent }} />{event.time}</div>
          <div className="flex items-center gap-2"><MapPin   size={12} style={{ color: event.accent }} />{event.location}</div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span className="flex items-center gap-1"><Users size={10} />{spotsLeft}/{event.total} joined</span>
            <span style={{ color: event.accent }}>{event.spots} spots left</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: event.accent }} />
          </div>
        </div>

        <div className="flex items-center justify-end mt-auto pt-2 border-t border-white/10">
          {registered ? (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm">
              <Check size={13} /> Registered!
            </div>
          ) : full ? (
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 text-sm cursor-not-allowed">Full</div>
          ) : (
            <button
              onClick={() => onRegister(event)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:brightness-110 active:scale-95"
              style={{ background: `${event.accent}25`, border: `1px solid ${event.accent}50`, color: event.accent }}
            >
              Join Event <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, icon: Icon, accent = '#0ea5e9', error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-white/55 uppercase tracking-wide">
        {Icon && <Icon size={11} style={{ color: accent }} />}
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400 mt-0.5">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  )
}

function RegisterModal({ event, onClose, onSuccess }) {
  const { user, profile } = useAuth()

  const nameParts = (profile?.full_name || '').split(' ')
  const [form, setForm] = useState({
    firstName: nameParts[0] || '',
    lastName:  nameParts.slice(1).join(' ') || '',
    birthDate: '',
    email:     '',
    phone:     '',
    message:   '',
  })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [step,    setStep]    = useState('form') 

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n })
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim())  e.lastName  = 'Last name is required'
    if (!form.birthDate)        e.birthDate = 'Birth date is required'
    else {
      const age = (new Date() - new Date(form.birthDate)) / (1000 * 60 * 60 * 24 * 365.25)
      if (age < 16) e.birthDate = 'You must be at least 16 years old'
    }
    if (!form.email.trim())                      e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email = 'Enter a valid email address'
    if (form.phone && !/^[+\d\s\-()]{7,20}$/.test(form.phone)) e.phone = 'Enter a valid phone number'
    return e
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setLoading(true)
    try {
      const { error: dbErr } = await supabase.from('volunteer_registrations').insert({
        event_id:       event.id,
        event_title:    event.title,
        user_id:        user?.id || null,
        first_name:     form.firstName,
        last_name:      form.lastName,
        birth_date:     form.birthDate,
        email:          form.email,
        phone:          form.phone || null,
        message:        form.message || null,
        registered_at:  new Date().toISOString(),
      })
      if (dbErr) throw dbErr

      await sendConfirmationEmail({
        firstName:     form.firstName,
        lastName:      form.lastName,
        email:         form.email,
        eventTitle:    event.title,
        eventDate:     `${event.date} · ${event.time}`,
        eventLocation: event.location,
      }).catch(err => console.warn('Email send failed (non-fatal):', err))

      setStep('success')
    } catch (err) {
      setErrors({ _global: err.message || 'Registration failed. Please try again.' })
    }
    setLoading(false)
  }

  const accent = event.accent

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="relative rounded-3xl p-0 max-w-lg w-full border border-white/15 shadow-2xl animate-slide-up max-h-[92vh] overflow-hidden flex flex-col"
        style={{ background: 'linear-gradient(160deg,rgba(6,40,68,0.98),rgba(10,60,95,0.95))' }}
      >
        <div
          className="absolute top-0 inset-x-0 h-40 pointer-events-none rounded-t-3xl"
          style={{ background: `linear-gradient(180deg,${accent}22 0%,transparent 100%)` }}
        />
        {step === 'success' ? (
          <div className="relative z-10 flex flex-col items-center justify-center gap-5 px-8 py-12 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
              style={{ background: `${accent}25`, border: `1px solid ${accent}50` }}
            >
              ✅
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">You're In!</h2>
              <p className="text-white/55 leading-relaxed text-sm">
                Thanks, <span className="text-white font-medium">{form.firstName}</span>! Your registration for{' '}
                <span className="font-medium" style={{ color: accent }}>{event.title}</span> is confirmed.
              </p>
            </div>
            <div
              className="w-full rounded-2xl p-4 flex items-start gap-3 text-left"
              style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}
            >
              <Mail size={16} style={{ color: accent }} className="mt-0.5 shrink-0" />
              <p className="text-white/65 text-xs leading-relaxed">
                A confirmation email has been sent to <span className="text-white">{form.email}</span>. Check your inbox (and spam folder) for event details.
              </p>
            </div>
            <button
              onClick={onSuccess}
              className="mt-2 w-full py-3 rounded-2xl font-semibold text-sm transition-all hover:brightness-110 active:scale-95"
              style={{ background: accent, color: '#fff' }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="relative z-10 flex items-start justify-between gap-3 px-7 pt-7 pb-4 shrink-0">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Volunteer Registration</p>
                <h2 className="font-display text-xl font-bold text-white leading-tight">
                  {event.emoji} {event.title}
                </h2>
                <p className="text-white/40 text-xs mt-1">{event.date} · {event.location}</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 glass rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-colors mt-0.5"
              >
                <X size={14} className="text-white/60" />
              </button>
            </div>

            <div className="relative z-10 overflow-y-auto flex-1 px-7 pb-7">
              {errors._global && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-5">
                  <AlertCircle size={14} /> {errors._global}
                </div>
              )}

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" icon={User} accent={accent} error={errors.firstName}>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={e => set('firstName', e.target.value)}
                      placeholder="Yasmine"
                      className="input-field"
                    />
                  </Field>
                  <Field label="Last Name" accent={accent} error={errors.lastName}>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={e => set('lastName', e.target.value)}
                      placeholder="El-Sayed"
                      className="input-field"
                    />
                  </Field>
                </div>
                <Field label="Date of Birth" icon={Cake} accent={accent} error={errors.birthDate}>
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={e => set('birthDate', e.target.value)}
                    max={new Date(Date.now() - 16 * 365.25 * 86400000).toISOString().split('T')[0]}
                    className="input-field"
                    style={{ colorScheme: 'dark' }}
                  />
                </Field>
                <Field label="Email Address" icon={Mail} accent={accent} error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="yasmine@example.com"
                    className="input-field"
                  />
                  <p className="text-white/30 text-[11px]">A confirmation email will be sent here.</p>
                </Field>
                <Field label="Phone Number" icon={Phone} accent={accent} error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="+20 100 000 0000"
                    className="input-field"
                  />
                </Field>
                <Field label="Why do you want to volunteer? (optional)" accent={accent}>
                  <textarea
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Tell us a bit about yourself and your motivation..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </Field>
                <div className="flex gap-3 pt-1">
                  <button onClick={onClose} className="flex-1 btn-secondary py-3 text-sm">
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="flex-2 flex-[2] py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                    style={{ background: accent, color: '#fff' }}
                  >
                    {loading ? (
                      <><Loader size={14} className="animate-spin" /> Registering…</>
                    ) : (
                      <><Heart size={14} /> Register Now</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Volunteer() {
  const { user } = useAuth()
  const [filter,        setFilter]        = useState('All')
  const [registerModal, setRegisterModal] = useState(null)
  const [registered,    setRegistered]    = useState(new Set())
  const [successBanner, setSuccessBanner] = useState(false)

  const categories = ['All', ...new Set(EVENTS.map(e => e.category))]
  const filtered   = filter === 'All' ? EVENTS : EVENTS.filter(e => e.category === filter)

  const handleSuccess = (eventId) => {
    setRegistered(prev => new Set([...prev, eventId]))
    setRegisterModal(null)
    setSuccessBanner(true)
    setTimeout(() => setSuccessBanner(false), 5000)
  }

  return (
    <div className="min-h-screen pb-16">
      {successBanner && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] animate-slide-up pointer-events-none">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-teal-900/95 border border-teal-400/40 shadow-2xl backdrop-blur-xl">
            <CheckCircle2 size={20} className="text-teal-300 shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">You're registered!</p>
              <p className="text-teal-300/70 text-xs">Check your email for confirmation details.</p>
            </div>
          </div>
        </div>
      )}
      <div className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-950 via-ocean-900/80 to-transparent" />
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float opacity-10"
              style={{
                width: `${20 + i * 12}px`, height: `${20 + i * 12}px`,
                left: `${5 + i * 9}%`, top: `${10 + (i % 4) * 22}%`,
                background: ['#0ea5e9','#14b8a6','#10b981','#f59e0b'][i % 4],
                filter: 'blur(4px)',
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${4 + i * 0.3}s`,
              }}
            />
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
            Every hour you give makes a direct impact on communities and nature.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Droplets, label: `${EVENTS.length} Active Events`, color: 'text-ocean-300' },
              { icon: Users,    label: '500+ Volunteers',                color: 'text-teal-300'  },
              { icon: Globe,    label: '12 Cities',                      color: 'text-emerald-300'},
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
        <div className="glass rounded-3xl p-8 mb-12 grid sm:grid-cols-4 gap-6 text-center">
          {[
            { n: '1', title: 'Browse Events', desc: 'Find events near you that match your interests and schedule' },
            { n: '2', title: 'Register',      desc: 'Fill in your details — a confirmation email is sent instantly' },
            { n: '3', title: 'Show Up',       desc: 'Attend the event and make a real impact on local water' },
            { n: '4', title: 'Make a Change', desc: 'Your efforts directly help restore and protect water across Egypt' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-ocean-500/20 border border-ocean-400/30 flex items-center justify-center text-xs font-bold text-ocean-300">
                {n}
              </div>
              <h4 className="text-white font-semibold text-sm">{title}</h4>
              <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === cat ? 'bg-ocean-500 text-white shadow-lg' : 'glass text-white/55 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {filtered.map(event => (
            <EventCard
              key={event.id}
              event={event}
              registered={registered.has(event.id)}
              onRegister={e => {
                if (!user) { window.location.href = '/login'; return }
                setRegisterModal(e)
              }}
            />
          ))}
        </div>
        {!user && (
          <div className="glass rounded-3xl p-10 text-center border border-ocean-400/20">
            <div className="text-5xl mb-4">🌊</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Volunteer?</h2>
            <p className="text-white/55 mb-6 max-w-md mx-auto">
              Create a free MOYA account to register for events and contribute to water conservation across Egypt.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/signup" className="btn-teal px-8 py-3 flex items-center gap-2">
                <Heart size={16} /> Join MOYA
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-3">Login</Link>
            </div>
          </div>
        )}
      </div>
      {registerModal && (
        <RegisterModal
          event={registerModal}
          onClose={() => setRegisterModal(null)}
          onSuccess={() => handleSuccess(registerModal.id)}
        />
      )}
    </div>
  )
}