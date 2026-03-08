import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
  X, Upload, MapPin, Image as ImageIcon, Plus, ChevronLeft, ChevronRight,
  Loader, AlertTriangle, Droplets, Locate, Video, CheckCircle2, Send
} from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const createCustomIcon = (color = '#0ea5e9') => L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
    background: ${color}; border: 3px solid white;
    transform: rotate(-45deg);
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
  "><div style="transform: rotate(45deg); color: white; font-size: 14px;">💧</div></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
})

const resolvedIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
    background: #22c55e; border: 3px solid white;
    transform: rotate(-45deg);
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
  "><div style="transform: rotate(45deg); color: white; font-size: 14px;">✅</div></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
})

const newPinIcon = createCustomIcon('#14b8a6')

function MapClickHandler({ onClick }) {
  useMapEvents({ click: e => onClick(e.latlng) })
  return null
}

function SubmitModal({ latlng, onClose, onSuccess }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ title: '', description: '' })
  const [images, setImages] = useState([])
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImages = e => {
    const newFiles = Array.from(e.target.files).slice(0, 5 - images.length)
    setImages(prev => [...prev, ...newFiles])
  }

  const handleVideo = e => {
    const file = e.target.files[0]
    if (file && file.size > 100 * 1024 * 1024) {
      setError('Video must be under 100MB')
      return
    }
    setVideo(file)
  }

  const submit = async () => {
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.description.trim()) { setError('Description is required'); return }
    setError('')
    setLoading(true)

    try {
      const imageUrls = []
      for (const file of images) {
        const ext = file.name.split('.').pop()
        const path = `reports/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('report-images').upload(path, file)
        if (uploadErr) throw uploadErr
        const { data } = supabase.storage.from('report-images').getPublicUrl(path)
        imageUrls.push(data.publicUrl)
      }

      let videoUrl = null
      if (video) {
        const ext = video.name.split('.').pop()
        const path = `reports/${user.id}/video-${Date.now()}.${ext}`
        const { error: vidErr } = await supabase.storage.from('report-images').upload(path, video)
        if (vidErr) throw vidErr
        const { data } = supabase.storage.from('report-images').getPublicUrl(path)
        videoUrl = data.publicUrl
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
      })

      if (insertErr) throw insertErr
      onSuccess()
    } catch (err) {
      setError(err.message || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-light rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Report Water Problem</h2>
            <p className="text-white/50 text-sm mt-0.5">
              📍 {latlng.lat.toFixed(4)}, {latlng.lng.toFixed(4)}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-red-500/20 transition-colors">
            <X size={16} className="text-white/60" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Problem Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Contaminated tap water in Block 5"
              className="input-field"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the water problem in detail..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Photos (max 5)</label>
            <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-ocean-400/50 transition-colors group">
              <ImageIcon size={22} className="text-white/30 group-hover:text-ocean-300 transition-colors" />
              <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Click to upload images</span>
              <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
            </label>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((f, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <button
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Video Proof (optional, max 100MB)</label>
            <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-teal-400/50 transition-colors group">
              <Video size={22} className="text-white/30 group-hover:text-teal-300 transition-colors" />
              <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Click to upload video</span>
              <input type="file" accept="video/*" onChange={handleVideo} className="hidden" />
            </label>
            {video && (
              <div className="mt-2 relative group w-fit">
                <video
                  src={URL.createObjectURL(video)}
                  className="w-32 h-20 object-cover rounded-lg bg-black"
                  muted
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => { e.target.pause(); e.target.currentTime = 0 }}
                />
                <button
                  onClick={() => setVideo(null)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} className="text-white" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1.5 py-0.5 text-white/70 text-[10px] flex items-center gap-1 pointer-events-none">
                  <Video size={9} /> Video
                </div>
              </div>
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

function SolveModal({ report, onClose, onSuccess }) {
  const { user } = useAuth()
  const [description, setDescription] = useState('')
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVideo = e => {
    const file = e.target.files[0]
    if (file && file.size > 100 * 1024 * 1024) { setError('Video must be under 100MB'); return }
    setVideo(file)
  }

  const submit = async () => {
    if (!description.trim()) { setError('Please describe what you did'); return }
    setError('')
    setLoading(true)

    try {
      let videoUrl = null
      if (video) {
        const ext = video.name.split('.').pop()
        const path = `solutions/${user.id}/video-${Date.now()}.${ext}`
        const { error: vidErr } = await supabase.storage.from('report-images').upload(path, video)
        if (vidErr) throw vidErr
        const { data } = supabase.storage.from('report-images').getPublicUrl(path)
        videoUrl = data.publicUrl
      }

      const { error: insertErr } = await supabase.from('solutions').insert({
        report_id: report.id,
        user_id: user.id,
        description,
        video_url: videoUrl,
        status: 'pending',
        points_awarded: 0,
      })

      if (insertErr) throw insertErr
      onSuccess()
    } catch (err) {
      setError(err.message || 'Failed to submit solution')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-light rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Report as Solved</h2>
            <p className="text-white/50 text-sm mt-0.5 truncate max-w-xs">"{report.title}"</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-red-500/20 transition-colors">
            <X size={16} className="text-white/60" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">What did you do to fix this? *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe how you solved this water problem in detail..."
              rows={5}
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Video Proof (recommended, max 100MB)</label>
            <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-400/50 transition-colors group">
              <Video size={22} className="text-white/30 group-hover:text-green-300 transition-colors" />
              <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Upload video evidence of your fix</span>
              <input type="file" accept="video/*" onChange={handleVideo} className="hidden" />
            </label>
            {video && (
              <div className="mt-2 relative group w-fit">
                <video
                  src={URL.createObjectURL(video)}
                  className="w-32 h-20 object-cover rounded-lg bg-black"
                  muted
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => { e.target.pause(); e.target.currentTime = 0 }}
                />
                <button
                  onClick={() => setVideo(null)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} className="text-white" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1.5 py-0.5 text-white/70 text-[10px] flex items-center gap-1 pointer-events-none">
                  <Video size={9} /> Video
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={submit} disabled={loading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30 transition-colors font-medium">
              {loading ? <><Loader size={16} className="animate-spin" />Submitting...</> : <><Send size={16} />Submit Solution</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportCard({ report, onSolveClick, currentUserId }) {
  const [imgIdx, setImgIdx] = useState(0)
  const images = report.image_urls || []
  const isResolved = report.status === 'resolved'

  return (
    <div className="w-72">
      {images.length > 0 && (
        <div className="relative mb-3 -mx-3 -mt-3">
          <img src={images[imgIdx]} alt="" className="w-full h-40 object-cover rounded-t-2xl" />
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
                <ChevronLeft size={14} className="text-white" />
              </button>
              <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
                <ChevronRight size={14} className="text-white" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display font-semibold text-white text-sm leading-tight">{report.title}</h3>
        <span className={`flex-shrink-0 badge ${isResolved ? 'badge-approved' : 'badge-pending'}`}>
          {isResolved ? '✅ Resolved' : report.status}
        </span>
      </div>
      <p className="text-white/60 text-xs leading-relaxed mb-3">{report.description}</p>

      {report.video_url && (
        <div className="mb-3">
          <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><Video size={10} />Video proof attached</p>
          <video src={report.video_url} controls className="w-full h-32 rounded-lg object-cover bg-black" />
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/10">
        <span>{new Date(report.created_at).toLocaleDateString()}</span>
        {report.points_awarded > 0 && (
          <span className="text-teal-300 font-medium">+{report.points_awarded} pts</span>
        )}
      </div>

      {!isResolved && report.status === 'approved' && currentUserId && (
        <button
          onClick={() => onSolveClick(report)}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-green-500/25 transition-colors text-xs font-medium"
        >
          <CheckCircle2 size={13} />
          I solved this problem
        </button>
      )}
    </div>
  )
}

export default function MapPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [pendingPin, setPendingPin] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [solveTarget, setSolveTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addMode, setAddMode] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)

  // Ref keeps handleMapClick from capturing a stale addMode value
  const addModeRef = useRef(false)
  useEffect(() => { addModeRef.current = addMode }, [addMode])

  const fetchReports = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reports')
      .select('*')
      .in('status', ['approved', 'resolved'])
    setReports(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  const handleMapClick = useCallback((latlng) => {
    if (!addModeRef.current || !user) return
    setPendingPin(latlng)
    setShowModal(true)
  }, [user])

  const handleUseMyLocation = () => {
    if (!user) return
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPendingPin(latlng)
        setShowModal(true)
        setAddMode(false)
        setGeoLoading(false)
      },
      () => {
        alert('Unable to retrieve your location. Please allow location access.')
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSuccess = (msg = 'Report submitted! It will appear on the map after admin approval.') => {
    setShowModal(false)
    setSolveTarget(null)
    setPendingPin(null)
    setAddMode(false)
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 5000)
    fetchReports()
  }

  return (
    <div className="flex flex-col h-screen pt-16">
      <div className="glass border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4 z-10 flex-wrap">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-ocean-300" />
          <span className="text-white font-medium text-sm">Water Problem Map</span>
          <span className="text-white/40 text-xs ml-2">{reports.length} reported issues</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {successMsg && (
            <div className="glass-light px-4 py-2 rounded-xl text-teal-300 text-sm flex items-center gap-2">
              <Droplets size={14} />
              {successMsg}
            </div>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleUseMyLocation}
                disabled={geoLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium glass border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                {geoLoading
                  ? <Loader size={14} className="animate-spin" />
                  : <Locate size={14} />}
                {geoLoading ? 'Locating...' : 'Use My Location'}
              </button>

              <button
                onClick={() => setAddMode(!addMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  addMode
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'btn-primary py-2'
                }`}
              >
                {addMode
                  ? <><AlertTriangle size={14} />Click on map...</>
                  : <><Plus size={14} />Report Problem</>}
              </button>
            </div>
          ) : (
            <a href="/login" className="btn-secondary py-2 px-4 text-sm">Login to Report</a>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-ocean-950/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader size={32} className="text-ocean-300 animate-spin" />
              <p className="text-white/60 text-sm">Loading map data...</p>
            </div>
          </div>
        )}
        <MapContainer
          center={[30.0444, 31.2357]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          className={addMode ? 'cursor-crosshair' : ''}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleMapClick} />

          {reports.map(report => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={report.status === 'resolved' ? resolvedIcon : createCustomIcon()}
            >
              <Popup minWidth={288} maxWidth={288} className="custom-popup">
                <ReportCard
                  report={report}
                  currentUserId={user?.id}
                  onSolveClick={(r) => setSolveTarget(r)}
                />
              </Popup>
            </Marker>
          ))}

          {pendingPin && (
            <Marker position={pendingPin} icon={newPinIcon}>
              <Popup>
                <p className="text-white text-sm">New report location</p>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        <div className="absolute bottom-6 left-6 z-[1000] glass rounded-xl p-3 flex flex-col gap-2">
          <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Legend</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ocean-400" />
            <span className="text-white/70 text-xs">Approved Report</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-white/70 text-xs">Resolved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-400" />
            <span className="text-white/70 text-xs">Your New Pin</span>
          </div>
        </div>
      </div>

      {showModal && pendingPin && (
        <SubmitModal
          latlng={pendingPin}
          onClose={() => { setShowModal(false); setPendingPin(null) }}
          onSuccess={() => handleSuccess()}
        />
      )}

      {solveTarget && (
        <SolveModal
          report={solveTarget}
          onClose={() => setSolveTarget(null)}
          onSuccess={() => handleSuccess('Solution submitted! Admin will review and award points.')}
        />
      )}
    </div>
  )
}