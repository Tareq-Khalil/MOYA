import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Eye, EyeOff, Waves, Upload, X, AlertCircle, CheckCircle, IdCard, Baby } from 'lucide-react'

export default function SignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1=account info, 2=ID verification
  const [form, setForm] = useState({ fullName:'', email:'', password:'', confirm:'' })
  const [showPass, setShowPass] = useState(false)
  const [ageGroup, setAgeGroup] = useState(null) // 'adult' | 'minor'
  const [idFile, setIdFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateStep1 = () => {
    if (!form.fullName.trim()) return 'Full name is required'
    if (!form.email.includes('@')) return 'Enter a valid email'
    if (form.password.length < 8) return 'Password must be at least 8 characters'
    if (form.password !== form.confirm) return 'Passwords do not match'
    return ''
  }

  const handleStep1 = () => {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError('')
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!ageGroup) { setError('Please select your age group'); return }
    if (!idFile) { setError('Please upload your ID / birth certificate photo'); return }
    setLoading(true)
    setError('')
    try {
      // 1. Create auth user
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.fullName } }
      })
      if (authErr) throw authErr

      const userId = authData.user.id

      // 2. Upload ID document
      const ext = idFile.name.split('.').pop()
      const idPath = `id-documents/${userId}/id.${ext}`
      const { error: uploadErr } = await supabase.storage.from('id-documents').upload(idPath, idFile)
      if (uploadErr) throw uploadErr
      const { data: idUrlData } = supabase.storage.from('id-documents').getPublicUrl(idPath)

      // 3. Update profile with ID info
      await supabase.from('profiles').upsert({
        id: userId,
        full_name: form.fullName,
        id_document_url: idUrlData.publicUrl,
        id_verified: false,
        id_type: ageGroup === 'minor' ? 'birth_certificate' : 'government_id',
        can_report: false, // blocked until admin approves ID
        points: 0,
      })

      navigate('/login', { state: { msg: 'Account created! You can log in, but reporting is locked until an admin verifies your ID — usually within 24 hours.' } })
    } catch (err) {
      setError(err.message || 'Sign up failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-ocean-500/20 border border-ocean-400/30 flex items-center justify-center">
              <Waves size={24} className="text-ocean-300" />
            </div>
            <div className="text-left">
              <div className="font-display text-2xl font-bold text-white tracking-widest">MOYA</div>
              <div className="text-ocean-400/60 text-[10px] tracking-widest uppercase">by WaterWorks</div>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-white/50">Step {step} of 2 — {step === 1 ? 'Account Details' : 'Identity Verification'}</p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {[1,2].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-ocean-400' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="glass-light rounded-3xl p-7 border border-white/15 shadow-2xl">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-5">
              <AlertCircle size={15} />{error}
            </div>
          )}

          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Full Name</label>
                <input value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})}
                  placeholder="As on your ID" className="input-field" />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                  placeholder="your@email.com" className="input-field" />
              </div>
              <div className="relative">
                <label className="text-sm text-white/60 mb-1.5 block">Password</label>
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  placeholder="Minimum 8 characters" className="input-field pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-[38px] text-white/40 hover:text-white/70">
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e => setForm({...form, confirm:e.target.value})}
                  placeholder="Repeat your password" className="input-field" />
              </div>
              <button onClick={handleStep1} className="btn-teal py-3 mt-2 flex items-center justify-center gap-2">
                Continue to ID Verification →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="bg-ocean-500/10 border border-ocean-400/20 rounded-2xl p-4 text-sm text-white/70 leading-relaxed">
                <p className="font-medium text-white mb-1">🔒 Why we verify your identity</p>
                To prevent fake and fraudulent reports, all users must submit a government-issued ID.
                You can log in immediately, but reporting is locked until an admin approves your ID (within 24 hours).
              </div>

              {/* Age group */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">Are you 15 years or older?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setAgeGroup('adult')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      ageGroup === 'adult' ? 'bg-ocean-500/25 border-ocean-400/60' : 'glass border-white/10 hover:border-white/25'
                    }`}>
                    <IdCard size={26} className={ageGroup === 'adult' ? 'text-ocean-300' : 'text-white/40'} />
                    <span className="text-sm font-medium text-white">15+ Years</span>
                    <span className="text-[10px] text-white/40 text-center">Government ID</span>
                  </button>
                  <button onClick={() => setAgeGroup('minor')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      ageGroup === 'minor' ? 'bg-teal-500/25 border-teal-400/60' : 'glass border-white/10 hover:border-white/25'
                    }`}>
                    <Baby size={26} className={ageGroup === 'minor' ? 'text-teal-300' : 'text-white/40'} />
                    <span className="text-sm font-medium text-white">Under 15</span>
                    <span className="text-[10px] text-white/40 text-center">Birth Certificate</span>
                  </button>
                </div>
              </div>

              {/* ID upload */}
              {ageGroup && (
                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    {ageGroup === 'adult'
                      ? 'Upload your National ID / Passport'
                      : 'Upload a photo holding your Birth Certificate (face must be visible)'}
                  </label>
                  {ageGroup === 'minor' && (
                    <div className="text-xs text-yellow-300/70 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-3 leading-relaxed">
                      📸 Please take a photo of yourself holding your birth certificate. Your face and the certificate must both be clearly visible.
                    </div>
                  )}
                  {idFile ? (
                    <div className="relative group">
                      <img src={URL.createObjectURL(idFile)} alt="ID preview"
                        className="w-full h-40 object-cover rounded-2xl border border-white/15" />
                      <button onClick={() => setIdFile(null)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} className="text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-lg">
                        <CheckCircle size={11} className="text-teal-400" />
                        <span className="text-white/70 text-xs">{idFile.name}</span>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-ocean-400/50 transition-colors">
                      <Upload size={28} className="text-white/30" />
                      <div className="text-center">
                        <p className="text-sm text-white/50">Click to upload photo</p>
                        <p className="text-xs text-white/30 mt-0.5">JPG, PNG or HEIC — max 10MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={e => setIdFile(e.target.files[0])} className="hidden" />
                    </label>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary py-3 px-5">← Back</button>
                <button onClick={handleSubmit} disabled={loading || !ageGroup || !idFile}
                  className="flex-1 btn-teal py-3 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</>
                    : '🚀 Create My Account'}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-white/40 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-ocean-300 hover:text-ocean-200 transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}