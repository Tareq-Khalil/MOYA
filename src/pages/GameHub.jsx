import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { GAME_REGISTRY, FREE_GAME_IDS, ENGINE_LABELS } from './gameRegistry'
// import IframeGame from './games/IframeGame'
import {
  Gamepad2, Star, Lock, Play, Trophy,
  ChevronRight, ArrowLeft, TrendingUp, Award,
  Clock, ExternalLink
} from 'lucide-react'
import { Link } from 'react-router-dom'

const DIFFICULTY_COLORS = {
  Easy:   'text-teal-300   bg-teal-500/15   border-teal-500/30',
  Medium: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
  Hard:   'text-red-300    bg-red-500/15    border-red-500/30',
  Expert: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
}

// ─── Single Game Card ─────────────────────────────────────────────────────────
function GameCard({ game, unlocked, userPoints, onPlay, onUnlock }) {
  const Icon = game.icon || Gamepad2
  const canAfford = userPoints >= game.cost

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border transition-all duration-500 group flex flex-col
        ${game.comingSoon
          ? 'border-white/8 opacity-60 cursor-default'
          : unlocked
            ? 'border-white/15 hover:border-white/30 hover:scale-[1.02] hover:shadow-2xl cursor-pointer'
            : canAfford
              ? 'border-yellow-500/20 hover:border-yellow-400/40 hover:scale-[1.02] cursor-pointer'
              : 'border-white/8 cursor-default'
        }`}
      style={{ background: 'linear-gradient(135deg, rgba(8,47,73,0.95) 0%, rgba(12,74,110,0.8) 100%)' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-60 pointer-events-none`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {!game.comingSoon && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${game.accentColor}18 0%, transparent 70%)` }} />
      )}

      {/* Top badges */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5 flex-wrap justify-end max-w-[65%]">
        {game.newBadge && (
          <span className="badge bg-orange-500/30 text-orange-300 border border-orange-500/40 text-[10px] tracking-wider">NEW</span>
        )}
        {game.comingSoon && (
          <span className="badge bg-white/10 text-white/50 border border-white/10 text-[10px]">SOON</span>
        )}
        {game.engineBadge && game.engine && (
          <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
            {ENGINE_LABELS[game.engine] || 'Engine'}
          </span>
        )}
        {!game.comingSoon && (
          unlocked
            ? <span className="badge bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px]">✓ UNLOCKED</span>
            : game.cost === 0
              ? <span className="badge bg-ocean-500/20 text-ocean-300 border border-ocean-400/30 text-[10px]">FREE</span>
              : <div className="flex items-center gap-1 badge bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px]">
                  <Star size={9} />{game.cost} pts
                </div>
        )}
      </div>

      <div className="relative z-10 p-5 flex flex-col gap-3.5 flex-1">
        {/* Icon + title */}
        <div className="flex items-start gap-3.5">
          <div className="rounded-2xl flex items-center justify-center text-2xl flex-shrink-0
            group-hover:scale-110 transition-transform duration-300"
            style={{ width:52, height:52, background:`${game.accentColor}20`, border:`1px solid ${game.accentColor}40` }}>
            {game.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[1.1rem] font-bold text-white leading-tight">{game.name}</h3>
            <p style={{ color: game.accentColor }} className="text-xs font-medium mt-0.5 opacity-90 truncate">{game.tagline}</p>
          </div>
        </div>

        <p className="text-white/55 text-sm leading-relaxed line-clamp-2">{game.description}</p>

        <div className="flex flex-wrap gap-1.5">
          <span className={`badge text-[10px] border ${DIFFICULTY_COLORS[game.difficulty] || DIFFICULTY_COLORS.Easy}`}>
            {game.difficulty}
          </span>
          {game.type === 'iframe' && (
            <span className="badge bg-purple-500/15 text-purple-300 border border-purple-500/20 text-[10px]">🎮 Engine</span>
          )}
          {game.tags.slice(0, 2).map(t => (
            <span key={t} className="badge bg-white/5 text-white/40 border border-white/8 text-[10px]">{t}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          {game.features.slice(0, 4).map(f => (
            <div key={f} className="flex items-center gap-1.5 text-[11px] text-white/35">
              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: game.accentColor, opacity: 0.6 }} />
              <span className="truncate">{f}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* CTA */}
        {game.comingSoon ? (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/30 text-sm">
            <Clock size={14} />Coming Soon
          </div>
        ) : unlocked ? (
          <button onClick={() => onPlay(game.id)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 hover:brightness-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${game.accentColor}30, ${game.accentColor}15)`,
              border: `1px solid ${game.accentColor}50`,
              color: game.accentColor,
            }}>
            <Play size={14} />Play Now<ChevronRight size={13} />
          </button>
        ) : canAfford ? (
          <button onClick={() => onUnlock(game)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/25 transition-all active:scale-95">
            <Star size={14} />Unlock — {game.cost} pts
          </button>
        ) : (
          <button disabled
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm bg-white/5 border border-white/8 text-white/25 cursor-not-allowed">
            <Lock size={13} />Need {game.cost - userPoints} more pts
          </button>
        )}
      </div>

      {!game.comingSoon && !unlocked && !canAfford && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Lock size={22} className="text-white/25" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Unlock Modal ─────────────────────────────────────────────────────────────
function UnlockModal({ game, userPoints, onConfirm, onCancel, loading }) {
  if (!game) return null
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-light rounded-3xl p-7 max-w-sm w-full border border-white/20 shadow-2xl animate-slide-up">
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">{game.emoji}</div>
          <h2 className="font-display text-2xl font-bold text-white">{game.name}</h2>
          <p className="text-white/50 text-sm mt-1">Unlock this game permanently</p>
        </div>
        <div className="glass rounded-2xl p-4 mb-5 space-y-2">
          {[['Your balance', `${userPoints} pts`, 'text-teal-300'], ['Unlock cost', `−${game.cost} pts`, 'text-yellow-300']].map(([label, val, color]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-white/55">{label}</span>
              <span className={`font-bold font-mono ${color}`}>{val}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-2 flex justify-between text-sm">
            <span className="text-white/55">After unlock</span>
            <span className={`font-bold font-mono ${userPoints - game.cost >= 0 ? 'text-white' : 'text-red-400'}`}>
              {userPoints - game.cost} pts
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 btn-secondary py-3">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 btn-teal py-3 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={15} />}
            Unlock!
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Game Shell ───────────────────────────────────────────────────────────────
function GameShell({ gameId, onExit, onScoreEarned, userPoints, onSpendPoints }) {
  const game = GAME_REGISTRY.find(g => g.id === gameId)
  if (!game) return null
  const reactProps = { onExit, onScoreEarned, userPoints, onSpendPoints }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-5">
          <button onClick={onExit} className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0">
            <ArrowLeft size={18} className="text-white/70" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl">{game.emoji}</span>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold text-white truncate">{game.name}</h2>
              <p className="text-white/40 text-xs truncate">{game.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {game.type === 'iframe' && game.engine && (
              <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
                {ENGINE_LABELS[game.engine] || 'Engine'} Game
              </span>
            )}
            <span className={`badge border text-xs ${DIFFICULTY_COLORS[game.difficulty] || DIFFICULTY_COLORS.Easy}`}>
              {game.difficulty}
            </span>
          </div>
        </div>

        <div className={`glass rounded-3xl border border-white/10 ${game.type === 'iframe' ? 'p-3 sm:p-4' : 'p-5 sm:p-8'}`}>
          {/* React game */}
          {game.type === 'react' && game.component && (
            <game.component {...reactProps} />
          )}
          {/* Engine / iframe game */}
          {game.type === 'iframe' && (
            <IframeGame game={game} userPoints={userPoints} onScoreEarned={onScoreEarned} onExit={onExit} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GameHub() {
  const { user, profile, refreshProfile } = useAuth()
  const [unlockedGames, setUnlockedGames] = useState(FREE_GAME_IDS)
  const [activeGame,    setActiveGame]    = useState(null)
  const [unlockModal,   setUnlockModal]   = useState(null)
  const [unlockLoading, setUnlockLoading] = useState(false)
  const [leaderboard,   setLeaderboard]   = useState([])
  const [filter,        setFilter]        = useState('all')

  const userPoints = profile?.points ?? 0

  useEffect(() => {
    if (!user) return
    supabase.from('game_unlocks').select('game_id').eq('user_id', user.id).then(({ data }) => {
      if (data) setUnlockedGames(new Set([...FREE_GAME_IDS, ...data.map(u => u.game_id)]))
    })
  }, [user])

  useEffect(() => {
    supabase.from('game_scores')
      .select('user_id, game_id, score, profiles(full_name)')
      .order('score', { ascending: false }).limit(5)
      .then(({ data }) => setLeaderboard(data || []))
  }, [])

  const handleUnlock = async (game) => {
    if (!user) return
    setUnlockLoading(true)
    try {
      await supabase.rpc('decrement_user_points', { user_id_param: user.id, points_param: game.cost })
      await supabase.from('game_unlocks').upsert({ user_id: user.id, game_id: game.id })
      setUnlockedGames(prev => new Set([...prev, game.id]))
      refreshProfile()
      setUnlockModal(null)
    } catch (err) { console.error(err) }
    setUnlockLoading(false)
  }

  const handleScoreEarned = async (points) => {
    if (!user || points <= 0) return
    // Scores are tracked for leaderboard display only — they do NOT add to AquaPoints wallet
    await supabase.from('game_scores').upsert(
      { user_id: user.id, game_id: activeGame, score: points, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,game_id' }
    )
  }

  const handleSpendPoints = async (cost) => {
    if (!user) return
    await supabase.rpc('decrement_user_points', { user_id_param: user.id, points_param: cost })
    refreshProfile()
  }

  const filtered = GAME_REGISTRY.filter(g => {
    if (filter === 'free')    return g.cost === 0
    if (filter === 'premium') return g.cost > 0
    if (filter === 'engine')  return g.type === 'iframe'
    return true
  })

  // Active game
  if (activeGame) {
    return (
      <GameShell gameId={activeGame} onExit={() => setActiveGame(null)}
        onScoreEarned={handleScoreEarned} userPoints={userPoints} onSpendPoints={handleSpendPoints} />
    )
  }

  // Hub
  return (
    <div className="min-h-screen pb-16">

      {/* Hero */}
      <div className="relative overflow-hidden pt-24 pb-14">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-950 via-ocean-900/80 to-transparent" />
          {[...Array(14)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-float opacity-[0.15]"
              style={{
                width: `${16 + i * 9}px`, height: `${16 + i * 9}px`,
                left: `${4 + i * 7}%`, top: `${8 + (i % 4) * 22}%`,
                background: ['#0ea5e9','#14b8a6','#6366f1','#f59e0b'][i % 4],
                filter: 'blur(3px)',
                animationDelay: `${i * 0.35}s`,
                animationDuration: `${3.5 + i * 0.25}s`,
              }} />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-5">
            <Gamepad2 size={14} className="text-ocean-300" />
            <span className="text-ocean-200 text-sm">Educational Game Hub</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Learn Through<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 via-teal-300 to-cyan-300">
              Play & Discovery
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Earn AquaPoints from reporting, then spend them to unlock harder challenges.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            {[
              { icon: Gamepad2, label: `${GAME_REGISTRY.filter(g=>!g.comingSoon).length} Games`, color: 'text-ocean-300' },
              { icon: Award,    label: 'Water Education',  color: 'text-teal-300' },
              { icon: Trophy,   label: 'Leaderboards',     color: 'text-yellow-300' },
              { icon: Lock,     label: 'Unlock with Points', color: 'text-orange-300' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Icon size={13} className={color} />
                <span className="text-white/65 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Wallet / login CTA */}
        {user ? (
          <div className="glass rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                <Star size={20} className="text-teal-300" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AquaPoints Wallet</p>
                <p className="text-white/45 text-xs">Earned by reporting water problems</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-center"><div className="font-display text-2xl font-bold text-teal-300">{userPoints}</div><div className="text-white/35 text-[10px]">Available</div></div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center"><div className="font-display text-2xl font-bold text-white">{unlockedGames.size}</div><div className="text-white/35 text-[10px]">Unlocked</div></div>
              <Link to="/map" className="btn-teal py-2 px-4 text-sm flex items-center gap-1.5"><TrendingUp size={13} />Earn More</Link>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl p-5 mb-8 flex items-center justify-between gap-4 border border-ocean-400/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎮</span>
              <div>
                <p className="text-white font-semibold">Free games available right now!</p>
                <p className="text-white/45 text-sm">Sign up to earn points and unlock premium games</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link to="/login"  className="btn-secondary py-2 px-4 text-sm">Login</Link>
              <Link to="/signup" className="btn-primary  py-2 px-4 text-sm">Sign Up</Link>
            </div>
          </div>
        )}

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1fr_270px] gap-8">
          <div>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[['all','All Games'],['free','Free'],['premium','Unlock with Points'],['engine','🎮 Engine Games']].map(([key, label]) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === key ? 'bg-ocean-500 text-white shadow-lg' : 'glass text-white/55 hover:text-white'
                  }`}>
                  {label}
                  {key === 'engine' && (
                    <span className="ml-1.5 text-[10px] text-purple-400">
                      ({GAME_REGISTRY.filter(g => g.type === 'iframe').length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="card text-center py-16">
                <Gamepad2 size={40} className="text-white/15 mx-auto mb-3" />
                <p className="text-white/30 font-display text-xl">
                  {filter === 'engine' ? 'No engine games yet — check back soon!' : 'No games found'}
                </p>
                {filter === 'engine' && (
                  <p className="text-white/20 text-sm mt-2 max-w-xs mx-auto">
                    Engine-exported games (Unity, Godot…) will appear here once added to{' '}
                    <code className="text-ocean-400/60">gameRegistry.js</code>.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(game => (
                  <GameCard key={game.id} game={game}
                    unlocked={unlockedGames.has(game.id)} userPoints={userPoints}
                    onPlay={id => setActiveGame(id)}
                    onUnlock={g => { if (user) setUnlockModal(g) }} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy size={17} className="text-yellow-400" />How It Works
              </h3>
              {[
                { n:'1', text:'Report water problems on the map', color:'bg-ocean-500' },
                { n:'2', text:'Admins review & award points',     color:'bg-teal-500' },
                { n:'3', text:'Spend points to unlock games',     color:'bg-yellow-500' },
                { n:'4', text:'Play, learn, and have fun!',       color:'bg-emerald-500' },
              ].map(({ n, text, color }) => (
                <div key={n} className="flex items-center gap-3 py-1.5">
                  <div className={`w-6 h-6 rounded-lg ${color}/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white/75 flex-shrink-0`}>{n}</div>
                  <p className="text-white/55 text-sm">{text}</p>
                </div>
              ))}
              <Link to="/map" className="w-full btn-primary text-center block py-2.5 text-sm mt-4">Start Reporting →</Link>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lock size={15} className="text-white/50" />Unlock Prices
              </h3>
              {GAME_REGISTRY.filter(g => g.cost > 0 && !g.comingSoon).map(g => {
                const unlocked = unlockedGames.has(g.id)
                return (
                  <div key={g.id} className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 ${unlocked ? 'opacity-45' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span>{g.emoji}</span>
                      <span className="text-white/65 text-sm">{g.name}</span>
                      {g.type === 'iframe' && <span className="text-purple-400 text-[10px]">⚙️</span>}
                    </div>
                    {unlocked
                      ? <span className="text-teal-400 text-xs">✓</span>
                      : <div className="flex items-center gap-1 text-yellow-300"><Star size={10}/><span className="text-xs font-mono font-bold">{g.cost}</span></div>}
                  </div>
                )
              })}
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-yellow-400" />Top Players
              </h3>
              {leaderboard.length === 0 ? (
                <p className="text-white/25 text-sm text-center py-4">No scores yet!</p>
              ) : leaderboard.map((e, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-yellow-500/20 text-yellow-300' : i === 1 ? 'bg-white/10 text-white/55' : 'bg-white/5 text-white/35'
                  }`}>{i+1}</div>
                  <span className="text-white/65 text-sm flex-1 truncate">{e.profiles?.full_name || 'Player'}</span>
                  <span className="text-ocean-300 text-xs font-mono font-bold">{e.score}pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {unlockModal && (
        <UnlockModal game={unlockModal} userPoints={userPoints}
          onConfirm={() => handleUnlock(unlockModal)}
          onCancel={() => setUnlockModal(null)}
          loading={unlockLoading} />
      )}
    </div>
  )
}