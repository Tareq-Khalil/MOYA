import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { X, Upload, MapPin, Image as ImageIcon, Plus, ChevronLeft, ChevronRight,
  Loader, AlertTriangle, Droplets, Navigation, Video, CheckCircle, AlertCircle, Info } from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const createCustomIcon = (color = '#0ea5e9') => L.divIcon({
  className: 'custom-marker',
  html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:${color};border:3px solid white;transform:rotate(-45deg);box-shadow:0 4px 15px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><div style="transform:rotate(45deg);color:white;font-size:14px">💧</div></div>`,
  iconSize:[36,36], iconAnchor:[18,36], popupAnchor:[0,-38],
})
const resolvedIcon = createCustomIcon('#10b981')
const pendingIcon  = createCustomIcon('#f59e0b')
const newPinIcon   = createCustomIcon('#14b8a6')

function MapClickHandler({ onClick }) {
  useMapEvents({ click: e => onClick(e.latlng) })
  return null
}

// ── Submit Report Modal ──────────────────────────────────────────────────────
function SubmitModal({ latlng, onClose, onSuccess }) {
  const { user, profile } = useAuth()
  const [form, setForm] = useState({ title:'', description:'' })
  const [images, setImages] = useState([])
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!profile?.can_report) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="glass-light rounded-2xl p-8 w-full max-w-md border border-yellow-500/30 text-center">
          <AlertCircle size={40} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white mb-2">ID Verification Pending</h2>
          <p className="text-white/60 mb-6">Your government ID is being reviewed by an admin. Reporting will be unlocked once approved — usually within 24 hours.</p>
          <button onClick={onClose} className="btn-secondary px-8">Close</button>
        </div>
      </div>
    )
  }

  const handleImages = e => {
    const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/')).slice(0, 5 - images.length)
    setImages(prev => [...prev, ...newFiles])
  }
  const handleVideo = e => {
    const f = e.target.files[0]
    if (f && f.type.startsWith('video/')) setVideo(f)
  }

  const submit = async () => {
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.description.trim()) { setError('Description is required'); return }
    setError('')
    setLoading(true)
    try {
      const imageUrls = []
      for (const file of images) {
        const path = `reports/${user.id}/${Date.now()}_${file.name}`
        const { error: e } = await supabase.storage.from('report-images').upload(path, file)
        if (e) throw e
        const { data } = supabase.storage.from('report-images').getPublicUrl(path)
        imageUrls.push(data.publicUrl)
      }
      let videoUrl = null
      if (video) {
        const vPath = `reports/${user.id}/vid_${Date.now()}_${video.name}`
        const { error: ve } = await supabase.storage.from('report-videos').upload(vPath, video)
        if (!ve) {
          const { data: vd } = supabase.storage.from('report-videos').getPublicUrl(vPath)
          videoUrl = vd.publicUrl
        }
      }
      const { error: insertErr } = await supabase.from('reports').insert({
        user_id: user.id,
        title: form.title,
        description: form.description,
        latitude: latlng.lat,
        longitude: latlng.lng,
        image_urls: imageUrls,
        video_url: videoUrl,
        status: 'pending',
        points_awarded: 0,
        fraud_warning: false,
      })
      if (insertErr) throw insertErr
      onSuccess()
    } catch (err) { setError(err.message || 'Submission failed') }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-light rounded-2xl p-6 w-full max-w-lg border border-white/20 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Report Water Problem</h2>
            <p className="text-white/50 text-sm">📍 {latlng.lat.toFixed(4)}, {latlng.lng.toFixed(4)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-red-500/20">
            <X size={16} className="text-white/60" />
          </button>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-yellow-200/80 text-xs mb-4 flex items-start gap-2">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          Submitting false or fraudulent reports is prohibited. You have 3 chances — after 3 fraud strikes your account will be banned.
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">{error}</div>}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Problem Title *</label>
            <input value={form.title} onChange={e => setForm({...form, title:e.target.value})}
              placeholder="e.g. Contaminated tap water in Block 5" className="input-field" />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Description *</label>
            <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})}
              placeholder="Describe the water problem in detail..." rows={3} className="input-field resize-none" />
          </div>

          {/* Image upload */}
          <div>
            <label className="text-sm text-white/60 mb-1.5 block flex items-center gap-1.5">
              <ImageIcon size={13} />Photos (up to 5) — shown on map
            </label>
            <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-ocean-400/50 transition-colors group">
              <ImageIcon size={22} className="text-white/30 group-hover:text-ocean-300 transition-colors" />
              <span className="text-sm text-white/40 group-hover:text-white/60">Click to upload images</span>
              <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
            </label>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((f, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <button onClick={() => setImages(images.filter((_,j)=>j!==i))}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video upload */}
          <div>
            <label className="text-sm text-white/60 mb-1.5 block flex items-center gap-1.5">
              <Video size={13} />Video Evidence (optional) — for admin review only
            </label>
            {video ? (
              <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <Video size={16} className="text-ocean-300 flex-shrink-0" />
                <span className="text-white/70 text-sm flex-1 truncate">{video.name}</span>
                <button onClick={() => setVideo(null)} className="text-red-400 hover:text-red-300">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 p-4 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-teal-400/40 transition-colors group">
                <Video size={20} className="text-white/25 group-hover:text-teal-300 transition-colors" />
                <span className="text-sm text-white/35 group-hover:text-white/55">Upload video evidence (MP4, MOV)</span>
                <input type="file" accept="video/*" onChange={handleVideo} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={submit} disabled={loading} className="btn-teal flex-1 flex items-center justify-center gap-2">
              {loading ? <><Loader size={16} className="animate-spin" />Submitting...</> : <><Upload size={16} />Submit Report</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Fix-Problem Modal ────────────────────────────────────────────────────────
function FixModal({ report, onClose, onSuccess }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ description: '' })
  const [video, setVideo] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.description.trim()) { setError('Please describe what you did to fix this'); return }
    if (!video && images.length === 0) { setError('Please upload at least a photo or video as proof'); return }
    setLoading(true)
    try {
      let videoUrl = null
      if (video) {
        const vPath = `fix-proofs/${user.id}/vid_${Date.now()}_${video.name}`
        const { error: ve } = await supabase.storage.from('report-videos').upload(vPath, video)
        if (!ve) { const { data } = supabase.storage.from('report-videos').getPublicUrl(vPath); videoUrl = data.publicUrl }
      }
      const imageUrls = []
      for (const f of images) {
        const path = `fix-proofs/${user.id}/${Date.now()}_${f.name}`
        const { error: e } = await supabase.storage.from('report-images').upload(path, f)
        if (!e) { const { data } = supabase.storage.from('report-images').getPublicUrl(path); imageUrls.push(data.publicUrl) }
      }
      await supabase.from('fix_submissions').insert({
        report_id: report.id,
        user_id: user.id,
        description: form.description,
        video_url: videoUrl,
        image_urls: imageUrls,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      })
      onSuccess()
    } catch (err) { setError(err.message || 'Submission failed') }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-light rounded-2xl p-6 w-full max-w-md border border-teal-400/20 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Report a Fix</h2>
            <p className="text-white/50 text-sm truncate max-w-[220px]">For: {report.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-red-500/20"><X size={15} /></button>
        </div>
        <p className="text-white/50 text-sm mb-5 leading-relaxed">
          Think this problem has been resolved? Submit proof below. An admin will review and award you points if confirmed.
        </p>
        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">{error}</div>}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">What did you do to fix it? *</label>
            <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})}
              placeholder="Describe the fix and how the problem was resolved..." rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1.5 block flex items-center gap-1"><Video size={13} />Video Proof (strongly recommended)</label>
            {video ? (
              <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <Video size={16} className="text-teal-300" />
                <span className="text-white/70 text-sm flex-1 truncate">{video.name}</span>
                <button onClick={() => setVideo(null)}><X size={13} className="text-red-400" /></button>
              </div>
            ) : (
              <label className="flex items-center gap-3 p-4 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-teal-400/40 transition-colors">
                <Video size={18} className="text-white/25" />
                <span className="text-sm text-white/35">Upload a video showing the fix</span>
                <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} className="hidden" />
              </label>
            )}
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1.5 block flex items-center gap-1"><ImageIcon size={13} />Photos (optional)</label>
            <label className="flex items-center gap-3 p-4 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-ocean-400/40 transition-colors">
              <ImageIcon size={18} className="text-white/25" />
              <span className="text-sm text-white/35">Before/after photos</span>
              <input type="file" accept="image/*" multiple onChange={e => setImages(prev => [...prev, ...Array.from(e.target.files)])} className="hidden" />
            </label>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((f,i)=>(
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <button onClick={()=>setImages(images.filter((_,j)=>j!==i))} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} className="text-white"/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={submit} disabled={loading} className="btn-teal flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader size={15} className="animate-spin" /> : <CheckCircle size={15} />}Submit Fix
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Report Card (popup) ──────────────────────────────────────────────────────
function ReportCard({ report, onFix }) {
  const [imgIdx, setImgIdx] = useState(0)
  const { user } = useAuth()
  const images = report.image_urls || []

  return (
    <div className="w-72">
      {images.length > 0 && (
        <div className="relative mb-3 -mx-3 -mt-3">
          <img src={images[imgIdx]} alt="" className="w-full h-40 object-cover rounded-t-2xl" />
          {images.length > 1 && (
            <>
              <button onClick={()=>setImgIdx(i=>(i-1+images.length)%images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center"><ChevronLeft size={14} className="text-white"/></button>
              <button onClick={()=>setImgIdx(i=>(i+1)%images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center"><ChevronRight size={14} className="text-white"/></button>
            </>
          )}
        </div>
      )}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display font-semibold text-white text-sm leading-tight">{report.title}</h3>
        <span className={`flex-shrink-0 badge ${report.status === 'approved' ? 'badge-approved' : report.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'badge-pending'}`}>
          {report.status}
        </span>
      </div>
      <p className="text-white/60 text-xs leading-relaxed mb-3">{report.description}</p>
      <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/10">
        <span>{new Date(report.created_at).toLocaleDateString()}</span>
        {report.points_awarded > 0 && <span className="text-teal-300 font-medium">+{report.points_awarded} pts</span>}
      </div>
      {user && report.status === 'approved' && (
        <button onClick={() => onFix(report)}
          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-medium hover:bg-emerald-500/25 transition-colors">
          <CheckCircle size={12} />I fixed this problem
        </button>
      )}
    </div>
  )
}

export default function MapPage() {
  const { user, profile } = useAuth()
  const [reports, setReports] = useState([])
  const [pendingPin, setPendingPin] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [fixModal, setFixModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addMode, setAddMode] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('reports').select('*').in('status', ['approved','resolved'])
    setReports(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  const handleMapClick = (latlng) => {
    if (!addMode || !user) return
    setPendingPin(latlng)
    setShowModal(true)
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false)
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPendingPin(latlng)
        setShowModal(true)
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const handleSuccess = (msg = 'Report submitted! Pending admin review.') => {
    setShowModal(false)
    setPendingPin(null)
    setAddMode(false)
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 5000)
  }

  return (
    <div className="flex flex-col h-screen pt-16">
      {/* Controls */}
      <div className="glass border-b border-white/10 px-6 py-3 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-ocean-300" />
          <span className="text-white font-medium text-sm">Water Problem Map</span>
          <span className="text-white/40 text-xs ml-2">{reports.length} issues</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {successMsg && (
            <div className="glass-light px-4 py-2 rounded-xl text-teal-300 text-sm flex items-center gap-2">
              <Droplets size={13} />{successMsg}
            </div>
          )}
          {user && profile?.can_report && (
            <button onClick={useMyLocation} disabled={gpsLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm glass text-white/70 hover:text-white hover:bg-white/10 transition-all">
              {gpsLoading ? <Loader size={13} className="animate-spin" /> : <Navigation size={13} className="text-teal-300" />}
              Use My Location
            </button>
          )}
          {user ? (
            <button onClick={() => setAddMode(!addMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                addMode ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'btn-primary py-2'
              }`}>
              {addMode ? <><AlertTriangle size={13} />Click map to pin</> : <><Plus size={13} />Report Problem</>}
            </button>
          ) : (
            <a href="/login" className="btn-secondary py-2 px-4 text-sm">Login to Report</a>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-ocean-950/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader size={32} className="text-ocean-300 animate-spin" />
              <p className="text-white/60 text-sm">Loading map...</p>
            </div>
          </div>
        )}
        <MapContainer center={[30.0444,31.2357]} zoom={10}
          style={{height:'100%',width:'100%'}}
          className={addMode ? 'cursor-crosshair' : ''}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler onClick={handleMapClick} />
          {reports.map(report => (
            <Marker key={report.id} position={[report.latitude, report.longitude]}
              icon={report.status === 'resolved' ? resolvedIcon : createCustomIcon()}>
              <Popup minWidth={288} maxWidth={288} className="custom-popup">
                <ReportCard report={report} onFix={r => setFixModal(r)} />
              </Popup>
            </Marker>
          ))}
          {pendingPin && (
            <Marker position={pendingPin} icon={newPinIcon}>
              <Popup><p className="text-white text-sm">New report location</p></Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-[1000] glass rounded-xl p-3 flex flex-col gap-2">
          <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Legend</p>
          {[['bg-ocean-400','Approved Report'],['bg-emerald-400','Resolved'],['bg-teal-400','Your New Pin']].map(([c,l])=>(
            <div key={l} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${c}`} /><span className="text-white/70 text-xs">{l}</span></div>
          ))}
        </div>
      </div>

      {showModal && pendingPin && (
        <SubmitModal latlng={pendingPin}
          onClose={() => { setShowModal(false); setPendingPin(null) }}
          onSuccess={() => handleSuccess()} />
      )}
      {fixModal && (
        <FixModal report={fixModal}
          onClose={() => setFixModal(null)}
          onSuccess={() => { setFixModal(null); handleSuccess('Fix submitted! Pending admin review.') }} />
      )}
    </div>
  )
}