import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Shield, Check, X, ChevronLeft, ChevronRight, Star, Eye, Clock, Users, MapPin, Loader } from 'lucide-react'

function ReportReview({ report, onDecision }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [points, setPoints] = useState(10)
  const [loading, setLoading] = useState(false)
  const images = report.image_urls || []

  const decide = async (status) => {
    setLoading(true)
    const awardedPoints = status === 'approved' ? points : 0

    const { error: updateErr } = await supabase
      .from('reports')
      .update({ status, points_awarded: awardedPoints, reviewed_at: new Date().toISOString() })
      .eq('id', report.id)

    if (!updateErr && status === 'approved') {
      // Add points to user
      await supabase.rpc('increment_user_points', {
        user_id_param: report.user_id,
        points_param: points
      })
    }

    setLoading(false)
    onDecision()
  }

  return (
    <div className="card overflow-hidden">
      {images.length > 0 && (
        <div className="relative -m-6 mb-4">
          <img src={images[imgIdx]} alt="" className="w-full h-52 object-cover" />
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                <ChevronLeft size={16} className="text-white" />
              </button>
              <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                <ChevronRight size={16} className="text-white" />
              </button>
            </>
          )}
          <div className="absolute top-2 right-2">
            <span className="badge-pending">{images.length} photo{images.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      <h3 className="font-display text-xl font-semibold text-white mb-2">{report.title}</h3>
      <p className="text-white/60 text-sm leading-relaxed mb-4">{report.description}</p>

      <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-5">
        <span className="flex items-center gap-1"><MapPin size={11} />{report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}</span>
        <span className="flex items-center gap-1"><Clock size={11} />{new Date(report.created_at).toLocaleString()}</span>
        <span className="flex items-center gap-1"><Users size={11} />User: {report.user_id?.slice(0, 8)}...</span>
      </div>

      <div className="flex items-center gap-3 p-3 glass rounded-xl mb-4">
        <Star size={16} className="text-yellow-400 flex-shrink-0" />
        <label className="text-sm text-white/70">Points to Award:</label>
        <input
          type="number"
          min={0}
          max={500}
          value={points}
          onChange={e => setPoints(Number(e.target.value))}
          className="w-20 bg-white/10 rounded-lg px-3 py-1.5 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-ocean-400/50"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => decide('rejected')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
        >
          {loading ? <Loader size={14} className="animate-spin" /> : <X size={14} />}
          Reject
        </button>
        <button
          onClick={() => decide('approved')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 transition-colors text-sm font-medium"
        >
          {loading ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
          Approve (+{points}pts)
        </button>
      </div>
    </div>
  )
}

export default function Admin() {
  const { profile } = useAuth()
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false })
    if (data) {
      setReports(data)
      setStats({
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        approved: data.filter(r => r.status === 'approved').length,
        rejected: data.filter(r => r.status === 'rejected').length,
      })
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const filtered = reports.filter(r => r.status === filter)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center">
            <Shield size={24} className="text-teal-300" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/50">Review and manage water problem reports</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-white/5' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-300', bg: 'bg-yellow-500/10' },
            { label: 'Approved', value: stats.approved, color: 'text-teal-300', bg: 'bg-teal-500/10' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-400', bg: 'bg-red-500/10' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`card ${bg} text-center`}>
              <div className={`text-3xl font-display font-bold ${color} mb-1`}>{value}</div>
              <div className="text-white/50 text-sm">{label} Reports</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 glass p-1.5 rounded-2xl w-fit">
          {['pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-ocean-600/60 text-white shadow' : 'text-white/50 hover:text-white'
              }`}
            >
              {f}
              <span className="ml-2 text-xs opacity-70">
                ({reports.filter(r => r.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size={32} className="text-ocean-300 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16">
            <Eye size={40} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40 font-display text-xl">No {filter} reports</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(report => (
              <ReportReview key={report.id} report={report} onDecision={fetchData} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
