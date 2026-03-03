import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Shield, Check, X, ChevronLeft, ChevronRight, Star, Eye, Clock, Users,
  MapPin, Loader, AlertTriangle, Ban, UserCog, FileText, Video, Minus,
  RefreshCw, SlidersHorizontal, IdCard, CheckCircle, XCircle, Wrench } from 'lucide-react'

// ── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key:'reports',  label:'Reports',     icon: FileText },
  { key:'fixes',    label:'Fix Proofs',  icon: Wrench },
  { key:'users',    label:'Users',       icon: UserCog },
  { key:'ids',      label:'ID Review',   icon: IdCard },
]

// ── Report Review Card ────────────────────────────────────────────────────────
function ReportCard({ report, onDecision }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [points, setPoints] = useState(50)
  const [loading, setLoading] = useState(false)
  const [showRejectMenu, setShowRejectMenu] = useState(false)
  const images = report.image_urls || []

  const decide = async (status, strikeUser = false) => {
    setLoading(true)
    const awarded = status === 'approved' ? points : 0
    await supabase.from('reports').update({ status, points_awarded: awarded, reviewed_at: new Date().toISOString() }).eq('id', report.id)
    if (status === 'approved') {
      await supabase.rpc('increment_user_points', { user_id_param: report.user_id, points_param: points })
    }
    if (strikeUser) {
      // Decrement fraud_chances; ban if reaches 0
      const { data: prof } = await supabase.from('profiles').select('fraud_chances').eq('id', report.user_id).single()
      const newChances = (prof?.fraud_chances ?? 3) - 1
      if (newChances <= 0) {
        await supabase.from('profiles').update({ fraud_chances: 0, is_banned: true, can_report: false }).eq('id', report.user_id)
      } else {
        await supabase.from('profiles').update({ fraud_chances: newChances }).eq('id', report.user_id)
      }
    }
    setLoading(false)
    setShowRejectMenu(false)
    onDecision()
  }

  return (
    <div className="card overflow-hidden">
      {images.length > 0 && (
        <div className="relative -m-6 mb-4">
          <img src={images[imgIdx]} alt="" className="w-full h-52 object-cover" />
          {images.length > 1 && (
            <>
              <button onClick={()=>setImgIdx(i=>(i-1+images.length)%images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"><ChevronLeft size={16} className="text-white"/></button>
              <button onClick={()=>setImgIdx(i=>(i+1)%images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"><ChevronRight size={16} className="text-white"/></button>
            </>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <span className="badge-pending">{images.length} photo{images.length>1?'s':''}</span>
            {report.video_url && <span className="badge bg-purple-500/30 text-purple-300 border border-purple-500/40">📹 Video</span>}
          </div>
        </div>
      )}
      {report.video_url && (
        <a href={report.video_url} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-sm hover:bg-purple-500/20 transition-colors">
          <Video size={14} />Watch Video Evidence
        </a>
      )}
      <h3 className="font-display text-xl font-semibold text-white mb-2">{report.title}</h3>
      <p className="text-white/60 text-sm leading-relaxed mb-4">{report.description}</p>
      <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-5">
        <span className="flex items-center gap-1"><MapPin size={11}/>{report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}</span>
        <span className="flex items-center gap-1"><Clock size={11}/>{new Date(report.created_at).toLocaleString()}</span>
        <span className="flex items-center gap-1"><Users size={11}/>User: {report.user_id?.slice(0,8)}...</span>
      </div>
      <div className="flex items-center gap-3 p-3 glass rounded-xl mb-4">
        <Star size={16} className="text-yellow-400 flex-shrink-0" />
        <label className="text-sm text-white/70">Points to Award:</label>
        <input type="number" min={0} max={500} value={points} onChange={e=>setPoints(Number(e.target.value))}
          className="w-20 bg-white/10 rounded-lg px-3 py-1.5 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-ocean-400/50" />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <button onClick={() => setShowRejectMenu(!showRejectMenu)} disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium">
            {loading ? <Loader size={14} className="animate-spin"/> : <X size={14}/>}Reject ▾
          </button>
          {showRejectMenu && (
            <div className="absolute bottom-full mb-1 left-0 right-0 glass-light rounded-xl border border-white/15 overflow-hidden z-10">
              <button onClick={() => decide('rejected', false)} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 transition-colors">
                <XCircle size={13}/>Reject only
              </button>
              <button onClick={() => decide('rejected', true)} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-orange-300 hover:bg-orange-500/10 transition-colors border-t border-white/10">
                <Minus size={13}/>Reject + Fraud Strike (-1 chance)
              </button>
            </div>
          )}
        </div>
        <button onClick={() => decide('approved')} disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 transition-colors text-sm font-medium">
          {loading ? <Loader size={14} className="animate-spin"/> : <Check size={14}/>}Approve (+{points}pts)
        </button>
      </div>
    </div>
  )
}

// ── Fix Proof Card ────────────────────────────────────────────────────────────
function FixCard({ fix, onDecision }) {
  const [points, setPoints] = useState(75)
  const [loading, setLoading] = useState(false)

  const decide = async (status) => {
    setLoading(true)
    await supabase.from('fix_submissions').update({ status, points_awarded: status === 'approved' ? points : 0, reviewed_at: new Date().toISOString() }).eq('id', fix.id)
    if (status === 'approved') {
      await supabase.rpc('increment_user_points', { user_id_param: fix.user_id, points_param: points })
      await supabase.from('reports').update({ status: 'resolved' }).eq('id', fix.report_id)
    }
    setLoading(false)
    onDecision()
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Wrench size={16} className="text-emerald-300" />
        <span className="text-white font-medium text-sm">Fix Submission</span>
        <span className="text-white/40 text-xs ml-auto">Report ID: {fix.report_id?.slice(0,8)}...</span>
      </div>
      <p className="text-white/60 text-sm leading-relaxed mb-4">{fix.description}</p>
      {fix.video_url && (
        <a href={fix.video_url} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-sm hover:bg-purple-500/20 transition-colors">
          <Video size={14}/>Watch Fix Video
        </a>
      )}
      {fix.image_urls?.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {fix.image_urls.map((url,i) => <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-lg"/>)}
        </div>
      )}
      <div className="flex items-center gap-3 p-3 glass rounded-xl mb-4">
        <Star size={16} className="text-yellow-400 flex-shrink-0"/>
        <label className="text-sm text-white/70">Points to Award:</label>
        <input type="number" min={0} max={500} value={points} onChange={e=>setPoints(Number(e.target.value))}
          className="w-20 bg-white/10 rounded-lg px-3 py-1.5 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-ocean-400/50"/>
      </div>
      <div className="flex gap-3">
        <button onClick={() => decide('rejected')} disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm">
          {loading?<Loader size={14} className="animate-spin"/>:<X size={14}/>}Reject
        </button>
        <button onClick={() => decide('approved')} disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-sm">
          {loading?<Loader size={14} className="animate-spin"/>:<CheckCircle size={14}/>}Confirm Fix (+{points}pts)
        </button>
      </div>
    </div>
  )
}

// ── User Management Card ──────────────────────────────────────────────────────
function UserCard({ user: u, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [points, setPoints] = useState(u.points ?? 0)
  const [note, setNote] = useState(u.admin_note || '')
  const [loading, setLoading] = useState(false)

  const save = async () => {
    setLoading(true)
    await supabase.from('profiles').update({ points, admin_note: note }).eq('id', u.id)
    setLoading(false)
    setEditing(false)
    onUpdate()
  }
  const toggleBan = async () => {
    setLoading(true)
    const banned = !u.is_banned
    await supabase.from('profiles').update({ is_banned: banned, can_report: !banned }).eq('id', u.id)
    setLoading(false)
    onUpdate()
  }
  const resetStrikes = async () => {
    setLoading(true)
    await supabase.from('profiles').update({ fraud_chances: 3 }).eq('id', u.id)
    setLoading(false)
    onUpdate()
  }

  const chancesLeft = u.fraud_chances ?? 3

  return (
    <div className={`card ${u.is_banned ? 'border border-red-500/30 bg-red-500/5' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ocean-500/20 border border-ocean-400/30 flex items-center justify-center text-white font-bold">
            {(u.full_name||'?')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold">{u.full_name || 'Unnamed'}</p>
            <p className="text-white/40 text-xs">{u.email || u.id?.slice(0,16)+'...'}</p>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {u.is_banned && <span className="badge bg-red-500/20 text-red-300 border border-red-500/30 text-[10px]">BANNED</span>}
          {u.is_admin && <span className="badge bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px]">ADMIN</span>}
          {!u.id_verified && <span className="badge bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px]">ID PENDING</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label:'Points', value:u.points??0, color:'text-teal-300' },
          { label:'Reports', value:u.report_count??0, color:'text-ocean-300' },
          { label:'Fraud Chances', value:`${chancesLeft}/3`, color: chancesLeft<2?'text-red-400':chancesLeft<3?'text-yellow-300':'text-white' },
        ].map(({label,value,color}) => (
          <div key={label} className="glass rounded-xl p-2 text-center">
            <div className={`font-bold text-lg ${color}`}>{value}</div>
            <div className="text-white/35 text-[10px]">{label}</div>
          </div>
        ))}
      </div>

      {u.admin_note && !editing && (
        <div className="glass rounded-xl px-3 py-2 mb-3 text-white/50 text-xs italic">📝 {u.admin_note}</div>
      )}

      {editing && (
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/50 w-16">Points</label>
            <input type="number" value={points} onChange={e=>setPoints(Number(e.target.value))} min={0}
              className="flex-1 bg-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400/50"/>
          </div>
          <div>
            <label className="text-xs text-white/50 block mb-1">Admin Note</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={2}
              placeholder="Internal note about this user..." className="input-field resize-none text-sm"/>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex-1 btn-secondary py-2 text-xs">Cancel</button>
            <button onClick={save} disabled={loading} className="flex-1 btn-teal py-2 text-xs flex items-center justify-center gap-1">
              {loading?<Loader size={12} className="animate-spin"/>:<Check size={12}/>}Save
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setEditing(!editing)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl glass text-white/60 hover:text-white text-xs transition-colors">
          <SlidersHorizontal size={12}/>Edit
        </button>
        <button onClick={resetStrikes} disabled={loading || chancesLeft === 3}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 text-xs disabled:opacity-40 transition-colors">
          <RefreshCw size={12}/>Reset Strikes
        </button>
        <button onClick={toggleBan} disabled={loading}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs transition-colors ${
            u.is_banned
              ? 'bg-teal-500/10 border border-teal-500/20 text-teal-300 hover:bg-teal-500/20'
              : 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
          }`}>
          {loading?<Loader size={12} className="animate-spin"/>:<Ban size={12}/>}
          {u.is_banned ? 'Unban' : 'Ban'}
        </button>
      </div>
    </div>
  )
}

// ── ID Review Card ────────────────────────────────────────────────────────────
function IDCard({ profile: p, onUpdate }) {
  const [loading, setLoading] = useState(false)

  const decide = async (approved) => {
    setLoading(true)
    await supabase.from('profiles').update({
      id_verified: approved,
      can_report: approved,
    }).eq('id', p.id)
    setLoading(false)
    onUpdate()
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <IdCard size={18} className="text-yellow-300"/>
        </div>
        <div>
          <p className="text-white font-semibold">{p.full_name || 'Unnamed'}</p>
          <p className="text-white/40 text-xs">{p.id_type === 'birth_certificate' ? '🔖 Birth Certificate' : '🪪 Government ID'}</p>
        </div>
      </div>
      {p.id_document_url && (
        <a href={p.id_document_url} target="_blank" rel="noreferrer">
          <img src={p.id_document_url} alt="ID document" className="w-full h-48 object-cover rounded-xl mb-4 hover:opacity-90 transition-opacity border border-white/10"/>
        </a>
      )}
      <div className="flex gap-3">
        <button onClick={() => decide(false)} disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm">
          {loading?<Loader size={14} className="animate-spin"/>:<X size={14}/>}Reject ID
        </button>
        <button onClick={() => decide(true)} disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 text-sm">
          {loading?<Loader size={14} className="animate-spin"/>:<Check size={14}/>}Approve ID
        </button>
      </div>
    </div>
  )
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState('reports')
  const [reports, setReports] = useState([])
  const [fixes, setFixes] = useState([])
  const [users, setUsers] = useState([])
  const [pendingIDs, setPendingIDs] = useState([])
  const [reportFilter, setReportFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalReports:0, pending:0, approved:0, users:0, banned:0, pendingIDs:0 })

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: rData }, { data: fData }, { data: uData }] = await Promise.all([
      supabase.from('reports').select('*').order('created_at', { ascending: false }),
      supabase.from('fix_submissions').select('*').eq('status','pending').order('submitted_at',{ascending:false}),
      supabase.from('profiles').select('*').order('created_at',{ascending:false}),
    ])
    const reports = rData || []
    const users = uData || []
    const fixes = fData || []
    const pendingIDs = users.filter(u => !u.id_verified && u.id_document_url)
    setReports(reports)
    setFixes(fixes)
    setUsers(users)
    setPendingIDs(pendingIDs)
    setStats({
      totalReports: reports.length,
      pending: reports.filter(r=>r.status==='pending').length,
      approved: reports.filter(r=>r.status==='approved').length,
      users: users.length,
      banned: users.filter(u=>u.is_banned).length,
      pendingIDs: pendingIDs.length,
    })
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const filteredReports = reports.filter(r => r.status === reportFilter)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center">
            <Shield size={24} className="text-teal-300"/>
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/50">MOYA by WaterWorks — 2026</p>
          </div>
          <button onClick={fetchAll} className="ml-auto glass p-2.5 rounded-xl hover:bg-white/10 transition-colors">
            <RefreshCw size={16} className="text-white/60"/>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          {[
            { label:'Reports', value:stats.totalReports, color:'text-white', bg:'bg-white/5' },
            { label:'Pending', value:stats.pending, color:'text-yellow-300', bg:'bg-yellow-500/10' },
            { label:'Approved', value:stats.approved, color:'text-teal-300', bg:'bg-teal-500/10' },
            { label:'Users', value:stats.users, color:'text-ocean-300', bg:'bg-ocean-500/10' },
            { label:'Banned', value:stats.banned, color:'text-red-400', bg:'bg-red-500/10' },
            { label:'IDs Pending', value:stats.pendingIDs, color:'text-yellow-300', bg:'bg-yellow-500/10' },
          ].map(({label,value,color,bg}) => (
            <div key={label} className={`card ${bg} text-center py-3`}>
              <div className={`text-2xl font-display font-bold ${color}`}>{value}</div>
              <div className="text-white/40 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div className="flex gap-2 mb-6 glass p-1.5 rounded-2xl w-fit flex-wrap">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === key ? 'bg-ocean-600/60 text-white shadow' : 'text-white/50 hover:text-white'
              }`}>
              <Icon size={14}/>{label}
              {key === 'ids' && stats.pendingIDs > 0 && (
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 text-yellow-300 text-[10px] flex items-center justify-center">{stats.pendingIDs}</span>
              )}
              {key === 'fixes' && fixes.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center">{fixes.length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size={32} className="text-ocean-300 animate-spin"/>
</div>
) : (
<>
{/* Reports tab */}
{tab === 'reports' && (
<>
<div className="flex gap-2 mb-5 flex-wrap">
{['pending','approved','rejected'].map(f => (
<button key={f} onClick={() => setReportFilter(f)}
className={px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${                         reportFilter===f ? 'bg-ocean-600/60 text-white' : 'glass text-white/50 hover:text-white'                       }}>
{f} <span className="ml-1 text-xs opacity-70">({reports.filter(r=>r.status===f).length})</span>
</button>
))}
</div>
{filteredReports.length === 0
? <div className="card text-center py-16"><Eye size={40} className="text-white/20 mx-auto mb-3"/><p className="text-white/40 font-display text-xl">No {reportFilter} reports</p></div>
: <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
{filteredReports.map(r => <ReportCard key={r.id} report={r} onDecision={fetchAll}/>)}
</div>}
</>
)}
{/* Fix proofs tab */}
        {tab === 'fixes' && (
          fixes.length === 0
            ? <div className="card text-center py-16"><Wrench size={40} className="text-white/20 mx-auto mb-3"/><p className="text-white/40 font-display text-xl">No pending fix submissions</p></div>
            : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {fixes.map(f => <FixCard key={f.id} fix={f} onDecision={fetchAll}/>)}
              </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          users.length === 0
            ? <div className="card text-center py-16"><Users size={40} className="text-white/20 mx-auto mb-3"/><p className="text-white/40 font-display text-xl">No users found</p></div>
            : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {users.map(u => <UserCard key={u.id} user={u} onUpdate={fetchAll}/>)}
              </div>
        )}

        {/* ID Review tab */}
        {tab === 'ids' && (
          pendingIDs.length === 0
            ? <div className="card text-center py-16"><IdCard size={40} className="text-white/20 mx-auto mb-3"/><p className="text-white/40 font-display text-xl">All IDs reviewed!</p></div>
            : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {pendingIDs.map(p => <IDCard key={p.id} profile={p} onUpdate={fetchAll}/>)}
              </div>
        )}
      </>
    )}
  </div>
</div>
) 
} 