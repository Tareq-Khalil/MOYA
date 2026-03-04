import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { User, Star, MapPin, Clock, CheckCircle, XCircle, Clock3, Loader, Droplets } from 'lucide-react'

const StatusBadge = ({ status }) => {
  if (status === 'approved') return <span className="badge-approved flex items-center gap-1"><CheckCircle size={10} />Approved</span>
  if (status === 'rejected') return <span className="badge-rejected flex items-center gap-1"><XCircle size={10} />Rejected</span>
  return <span className="badge-pending flex items-center gap-1"><Clock3 size={10} />Pending</span>
}

export default function Profile() {
  const { user, profile } = useAuth()
  const [reports, setReports] = useState([])
  const [redemptions, setRedemptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('reports')

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: reps }, { data: reds }] = await Promise.all([
        supabase.from('reports').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('redemptions').select('*, shop_items(name, points_cost)').eq('user_id', user.id).order('created_at', { ascending: false })
      ])
      setReports(reps || [])
      setRedemptions(reds || [])
      setLoading(false)
    }
    fetchData()
  }, [user.id])

  const totalPointsEarned = reports.filter(r => r.status === 'approved').reduce((sum, r) => sum + (r.points_awarded || 0), 0)
  const approvedCount = reports.filter(r => r.status === 'approved').length

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Profile Header */}
        <div className="card p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ocean-500/5 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-ocean-500 to-teal-600 flex items-center justify-center text-white font-display text-2xl font-bold shadow-xl">
              {profile?.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-white mb-1">
                {profile?.full_name || 'Anonymous User'}
              </h1>
              <p className="text-white/50 mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
                  <Star size={13} className="text-yellow-400" />
                  <span className="text-yellow-300 text-sm font-mono font-bold">{profile?.points ?? 0} pts</span>
                </div>
                <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
                  <MapPin size={13} className="text-ocean-300" />
                  <span className="text-ocean-200 text-sm">{approvedCount} approved reports</span>
                </div>
                <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
                  <Droplets size={13} className="text-teal-300" />
                  <span className="text-teal-200 text-sm">{totalPointsEarned} pts earned</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Reports', value: reports.length, color: 'text-white' },
            { label: 'Approved', value: approvedCount, color: 'text-teal-300' },
            { label: 'Items Redeemed', value: redemptions.length, color: 'text-yellow-300' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card text-center">
              <div className={`font-display text-3xl font-bold ${color} mb-1`}>{value}</div>
              <div className="text-white/40 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 glass p-1.5 rounded-2xl w-fit">
          {[['reports', 'My Reports'], ['redemptions', 'Redemptions']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === key ? 'bg-ocean-600/60 text-white' : 'text-white/50 hover:text-white'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={28} className="text-ocean-300 animate-spin" />
          </div>
        ) : tab === 'reports' ? (
          <div className="flex flex-col gap-4">
            {reports.length === 0 ? (
              <div className="card text-center py-16">
                <MapPin size={40} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 font-display text-xl">No reports yet</p>
                <p className="text-white/25 text-sm mt-1">Head to the map to report your first water problem</p>
              </div>
            ) : reports.map(report => (
              <div key={report.id} className="card flex flex-col sm:flex-row gap-4">
                {report.image_urls?.[0] && (
                  <img src={report.image_urls[0]} alt="" className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-display font-semibold text-white truncate">{report.title}</h3>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-white/50 text-sm line-clamp-2 mb-2">{report.description}</p>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1"><Clock size={10} />{new Date(report.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} />{report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}</span>
                    {report.points_awarded > 0 && (
                      <span className="flex items-center gap-1 text-teal-300"><Star size={10} />+{report.points_awarded} pts</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {redemptions.length === 0 ? (
              <div className="card text-center py-16">
                <Star size={40} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 font-display text-xl">No redemptions yet</p>
                <p className="text-white/25 text-sm mt-1">Visit the shop to spend your earned points</p>
              </div>
            ) : redemptions.map(red => (
              <div key={red.id} className="card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
                  <Star size={20} className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{red.shop_items?.name || 'Item'}</h4>
                  <p className="text-white/40 text-sm">{new Date(red.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-red-400 font-mono text-sm font-bold">-{red.points_spent} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
