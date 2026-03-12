import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { GAME_REGISTRY, FREE_GAME_IDS, ENGINE_LABELS } from './gameRegistry'
// import IframeGame from './games/IframeGame'
import {
  Gamepad2, Star, Lock, Play, Trophy,
  ChevronRight, ArrowLeft, TrendingUp, Award,
  Clock, ExternalLink, Zap, Crown, Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'

const DIFFICULTY_COLORS = {
  Easy:   'text-teal-300   bg-teal-500/15   border-teal-500/30',
  Medium: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
  Hard:   'text-red-300    bg-red-500/15    border-red-500/30',
  Expert: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
}

// ── Featured Hero Card (large, cover image, hover reveal play button) ──────
function FeaturedGameCard({ game, unlocked, userPoints, onUnlock }) {
  const canAfford = userPoints >= game.cost

  const handlePlay = () => {
    if (game.type === 'external' && game.externalUrl) {
      window.open(game.externalUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-white/15 group cursor-pointer"
      style={{ minHeight: '420px' }}
      onClick={unlocked ? handlePlay : undefined}
    >
      {/* Cover image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url(${game.coverImage})`,
          backgroundPosition: 'center',
        }}
      />

      {/* Fallback gradient when no image loads */}
      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-80`} />

      {/* Dark overlay — lightens on hover to reveal more of image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 transition-opacity duration-500 group-hover:opacity-80" />

      {/* Animated shimmer border on hover */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `0 0 0 2px ${game.accentColor}60, 0 0 60px ${game.accentColor}20`,
        }}
      />

      {/* Top badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider"
          style={{ background: `${game.accentColor}30`, border: `1px solid ${game.accentColor}60`, color: game.accentColor }}>
          <Crown size={11} />
          FEATURED
        </div>
        {game.newBadge && (
          <span className="px-3 py-1.5 rounded-full bg-orange-500/30 text-orange-300 border border-orange-500/50 text-xs font-bold tracking-wider">NEW</span>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10">
        {unlocked
          ? <span className="px-3 py-1.5 rounded-full bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs font-bold">✓ UNLOCKED</span>
          : <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/25 border border-yellow-500/40 text-yellow-300 text-xs font-bold">
              <Star size={10} />{game.cost} pts
            </div>
        }
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${DIFFICULTY_COLORS[game.difficulty]}`}>
                {game.difficulty}
              </span>
              {game.tags.slice(0,2).map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white/50 border border-white/10">{t}</span>
              ))}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-1 drop-shadow-lg">
              {game.name}
            </h2>
            <p style={{ color: game.accentColor }} className="text-sm font-medium opacity-90 mb-2">{game.tagline}</p>
            <p className="text-white/55 text-sm leading-relaxed max-w-lg hidden sm:block line-clamp-2">{game.description}</p>
          </div>

          {/* Play / Unlock button — slides up on hover */}
          <div className="flex-shrink-0 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
            {unlocked ? (
              <button
                onClick={(e) => { e.stopPropagation(); handlePlay() }}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${game.accentColor}, ${game.accentColor}cc)`,
                  color: '#000',
                  boxShadow: `0 8px 32px ${game.accentColor}50`,
                }}
              >
                <Play size={16} fill="currentColor" />
                Play Now
                <ExternalLink size={13} />
              </button>
            ) : canAfford ? (
              <button
                onClick={(e) => { e.stopPropagation(); onUnlock(game) }}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/35 transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl backdrop-blur-sm"
              >
                <Star size={15} />
                Unlock — {game.cost} pts
              </button>
            ) : (
              <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/40 border border-white/15 text-white/40 text-sm backdrop-blur-sm">
                <Lock size={13} />
                Need {game.cost - userPoints} more pts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lock overlay when can't afford */}
      {!unlocked && !canAfford && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Lock size={22} className="text-white/30" />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Medium External Game Card ─────────────────────────────────────────────
function MediumGameCard({ game, unlocked, userPoints, onUnlock }) {
  const canAfford = userPoints >= game.cost

  const handlePlay = () => {
    if (game.type === 'external' && game.externalUrl) {
      window.open(game.externalUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 group cursor-pointer"
      style={{ minHeight: '260px' }}
      onClick={unlocked ? handlePlay : undefined}
    >
      {/* Cover image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${game.coverImage})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-75`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-75" />

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `0 0 0 2px ${game.accentColor}50, 0 0 40px ${game.accentColor}15` }}
      />

      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {game.newBadge && (
          <span className="px-2.5 py-1 rounded-full bg-orange-500/30 text-orange-300 border border-orange-500/40 text-[10px] font-bold tracking-wider">NEW</span>
        )}
      </div>
      <div className="absolute top-3 right-3 z-10">
        {unlocked
          ? <span className="px-2.5 py-1 rounded-full bg-teal-500/25 text-teal-300 border border-teal-500/40 text-[10px] font-bold">✓ UNLOCKED</span>
          : <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/35 text-yellow-300 text-[10px] font-bold">
              <Star size={8} />{game.cost} pts
            </div>
        }
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border inline-block mb-2 ${DIFFICULTY_COLORS[game.difficulty]}`}>
              {game.difficulty}
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight mb-0.5 drop-shadow">{game.name}</h3>
            <p style={{ color: game.accentColor }} className="text-xs font-medium opacity-90">{game.tagline}</p>
          </div>

          {/* Play button — slides in on hover */}
          <div className="flex-shrink-0 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 ease-out">
            {unlocked ? (
              <button
                onClick={(e) => { e.stopPropagation(); handlePlay() }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${game.accentColor}, ${game.accentColor}cc)`,
                  color: '#000',
                  boxShadow: `0 6px 20px ${game.accentColor}45`,
                }}
              >
                <Play size={12} fill="currentColor" />
                Play
                <ExternalLink size={10} />
              </button>
            ) : canAfford ? (
              <button
                onClick={(e) => { e.stopPropagation(); onUnlock(game) }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-yellow-500/20 border border-yellow-400/45 text-yellow-300 hover:bg-yellow-500/30 transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                <Star size={11} />
                Unlock
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white/35 text-xs backdrop-blur-sm">
                <Lock size={11} />
                {game.cost - userPoints} pts needed
              </div>
            )}
          </div>
        </div>
      </div>

      {!unlocked && !canAfford && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-black/45 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Lock size={16} className="text-white/25" />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Standard Game Card ────────────────────────────────────────────────────
function GameCard({ game, unlocked, userPoints, onPlay, onUnlock }) {
  const Icon = game.icon || Gamepad2
  const canAfford = userPoints >= game.cost

  return (
    <div
      className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-500 group flex flex-col
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

      <div className="relative z-10 p-4 sm:p-5 flex flex-col gap-3 sm:gap-3.5 flex-1">
        <div className="flex items-start gap-3 sm:gap-3.5">
          <div className="rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0
            group-hover:scale-110 transition-transform duration-300"
            style={{ width:44, height:44, background:`${game.accentColor}20`, border:`1px solid ${game.accentColor}40` }}>
            {game.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base sm:text-[1.1rem] font-bold text-white leading-tight">{game.name}</h3>
            <p style={{ color: game.accentColor }} className="text-xs font-medium mt-0.5 opacity-90 truncate">{game.tagline}</p>
          </div>
        </div>

        <p className="text-white/55 text-xs sm:text-sm leading-relaxed line-clamp-2">{game.description}</p>

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
        {game.comingSoon ? (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white/30 text-xs sm:text-sm">
            <Clock size={13} />Coming Soon
          </div>
        ) : unlocked ? (
          <button onClick={() => onPlay(game.id)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:brightness-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${game.accentColor}30, ${game.accentColor}15)`,
              border: `1px solid ${game.accentColor}50`,
              color: game.accentColor,
            }}>
            <Play size={13} />Play Now<ChevronRight size={12} />
          </button>
        ) : canAfford ? (
          <button onClick={() => onUnlock(game)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/25 transition-all active:scale-95">
            <Star size={13} />Unlock — {game.cost} pts
          </button>
        ) : (
          <button disabled
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm bg-white/5 border border-white/8 text-white/25 cursor-not-allowed">
            <Lock size={12} />Need {game.cost - userPoints} more pts
          </button>
        )}
      </div>

      {!game.comingSoon && !unlocked && !canAfford && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Lock size={18} className="text-white/25" />
          </div>
        </div>
      )}
    </div>
  )
}

function UnlockModal({ game, userPoints, onConfirm, onCancel, loading }) {
  if (!game) return null
  return (
    <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-light rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 w-full sm:max-w-sm border border-white/20 shadow-2xl animate-slide-up">
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">{game.emoji}</div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">{game.name}</h2>
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
          <button onClick={onCancel} className="flex-1 btn-secondary py-3 text-sm">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 btn-teal py-3 text-sm flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={15} />}
            Unlock!
          </button>
        </div>
      </div>
    </div>
  )
}

function GameShell({ gameId, onExit, onScoreEarned, userPoints, onSpendPoints }) {
  const game = GAME_REGISTRY.find(g => g.id === gameId)
  if (!game) return null
  const reactProps = { onExit, onScoreEarned, userPoints, onSpendPoints }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
          <button onClick={onExit} className="w-9 h-9 sm:w-10 sm:h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0">
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <span className="text-xl sm:text-2xl">{game.emoji}</span>
            <div className="min-w-0">
              <h2 className="font-display text-base sm:text-xl font-bold text-white truncate">{game.name}</h2>
              <p className="text-white/40 text-xs truncate">{game.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {game.type === 'iframe' && game.engine && (
              <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] hidden sm:inline-flex">
                {ENGINE_LABELS[game.engine] || 'Engine'} Game
              </span>
            )}
            <span className={`badge border text-[10px] sm:text-xs ${DIFFICULTY_COLORS[game.difficulty] || DIFFICULTY_COLORS.Easy}`}>
              {game.difficulty}
            </span>
          </div>
        </div>

        <div className={`glass rounded-2xl sm:rounded-3xl border border-white/10 ${game.type === 'iframe' ? 'p-2 sm:p-4' : 'p-4 sm:p-8'}`}>
          {game.type === 'react' && game.component && (
            <game.component {...reactProps} />
          )}
          {game.type === 'iframe' && (
            <IframeGame game={game} userPoints={userPoints} onScoreEarned={onScoreEarned} onExit={onExit} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function GameHub() {
  const { user, profile, refreshProfile } = useAuth()
  const [unlockedGames, setUnlockedGames] = useState(FREE_GAME_IDS)
  const [activeGame,    setActiveGame]    = useState(null)
  const [unlockModal,   setUnlockModal]   = useState(null)
  const [unlockLoading, setUnlockLoading] = useState(false)
  const [leaderboard,   setLeaderboard]   = useState([])
  const [filter,        setFilter]        = useState('all')
  const [showSidebar,   setShowSidebar]   = useState(false)

  const userPoints = profile?.points ?? 0

  // Separate game types
  const featuredGame = GAME_REGISTRY.find(g => g.featured)
  const mediumGame   = GAME_REGISTRY.find(g => g.mediumCard)
  const standardGames = GAME_REGISTRY.filter(g => !g.featured && !g.mediumCard)

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

  const filtered = standardGames.filter(g => {
    if (filter === 'free')    return g.cost === 0
    if (filter === 'premium') return g.cost > 0
    if (filter === 'engine')  return g.type === 'iframe'
    return true
  })

  if (activeGame) {
    return (
      <GameShell gameId={activeGame} onExit={() => setActiveGame(null)}
        onScoreEarned={handleScoreEarned} userPoints={userPoints} onSpendPoints={handleSpendPoints} />
    )
  }

  return (
    <div className="min-h-screen pb-16">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden pt-20 sm:pt-24 pb-10 sm:pb-14">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-950 via-ocean-900/80 to-transparent" />
          {[...Array(14)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-float opacity-[0.15]"
              style={{
                width: `${12 + i * 7}px`, height: `${12 + i * 7}px`,
                left: `${4 + i * 7}%`, top: `${8 + (i % 4) * 22}%`,
                background: ['#0ea5e9','#14b8a6','#6366f1','#f59e0b'][i % 4],
                filter: 'blur(3px)',
                animationDelay: `${i * 0.35}s`,
                animationDuration: `${3.5 + i * 0.25}s`,
              }} />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-5">
            <Gamepad2 size={13} className="text-ocean-300" />
            <span className="text-ocean-200 text-xs sm:text-sm">Educational Game Hub</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Learn Through<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 via-teal-300 to-cyan-300">
              Play & Discovery
            </span>
          </h1>
          <p className="text-white/55 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            Earn AquaPoints from reporting, then spend them to unlock harder challenges.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-5 sm:mt-7 px-2">
            {[
              { icon: Gamepad2, label: `${GAME_REGISTRY.filter(g=>!g.comingSoon).length} Games`, color: 'text-ocean-300' },
              { icon: Award,    label: 'Water Education',    color: 'text-teal-300' },
              { icon: Trophy,   label: 'Leaderboards',       color: 'text-yellow-300' },
              { icon: Lock,     label: 'Unlock with Points', color: 'text-orange-300' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1.5 glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <Icon size={12} className={color} />
                <span className="text-white/65 text-xs sm:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── AquaPoints wallet / guest banner ── */}
        {user ? (
          <div className="glass rounded-2xl p-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center flex-shrink-0">
                  <Star size={18} className="text-teal-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">AquaPoints Wallet</p>
                  <p className="text-white/45 text-xs">Earned by reporting water problems</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="text-center">
                    <div className="font-display text-xl sm:text-2xl font-bold text-teal-300">{userPoints}</div>
                    <div className="text-white/35 text-[10px]">Available</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="font-display text-xl sm:text-2xl font-bold text-white">{unlockedGames.size}</div>
                    <div className="text-white/35 text-[10px]">Unlocked</div>
                  </div>
                </div>
                <Link to="/map" className="btn-teal py-2 px-3 sm:px-4 text-xs sm:text-sm flex items-center gap-1.5 flex-shrink-0">
                  <TrendingUp size={12} />Earn More
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-ocean-400/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">🎮</span>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Free games available right now!</p>
                  <p className="text-white/45 text-xs sm:text-sm">Sign up to earn points and unlock premium games</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/login"  className="btn-secondary py-2 px-4 text-sm flex-1 sm:flex-none text-center">Login</Link>
                <Link to="/signup" className="btn-primary  py-2 px-4 text-sm flex-1 sm:flex-none text-center">Sign Up</Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_270px] gap-6 sm:gap-8">
          <div>

            {/* ── Featured Hero Card ── */}
            {featuredGame && (
              <div className="mb-5 sm:mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={14} className="text-amber-400" />
                  <span className="text-white/60 text-xs font-semibold tracking-wider uppercase">Featured Game</span>
                </div>
                <FeaturedGameCard
                  game={featuredGame}
                  unlocked={unlockedGames.has(featuredGame.id)}
                  userPoints={userPoints}
                  onUnlock={g => { if (user) setUnlockModal(g) }}
                />
              </div>
            )}

            {/* ── Medium Game Card ── */}
            {mediumGame && (
              <div className="mb-5 sm:mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-indigo-400" />
                  <span className="text-white/60 text-xs font-semibold tracking-wider uppercase">Premium Pick</span>
                </div>
                <MediumGameCard
                  game={mediumGame}
                  unlocked={unlockedGames.has(mediumGame.id)}
                  userPoints={userPoints}
                  onUnlock={g => { if (user) setUnlockModal(g) }}
                />
              </div>
            )}

            {/* ── Filter tabs ── */}
            <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              {[['all','All Games'],['free','Free'],['premium','Premium'],['engine','🎮 Engine']].map(([key, label]) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    filter === key ? 'bg-ocean-500 text-white shadow-lg' : 'glass text-white/55 hover:text-white'
                  }`}>
                  {label}
                  {key === 'engine' && (
                    <span className="ml-1 text-[10px] text-purple-400">
                      ({GAME_REGISTRY.filter(g => g.type === 'iframe').length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Standard game grid ── */}
            {filtered.length === 0 ? (
              <div className="card text-center py-12 sm:py-16">
                <Gamepad2 size={36} className="text-white/15 mx-auto mb-3" />
                <p className="text-white/30 font-display text-lg sm:text-xl">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {filtered.map(game => (
                  <GameCard key={game.id} game={game}
                    unlocked={unlockedGames.has(game.id)} userPoints={userPoints}
                    onPlay={id => setActiveGame(id)}
                    onUnlock={g => { if (user) setUnlockModal(g) }} />
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div>
            <button
              onClick={() => setShowSidebar(s => !s)}
              className="lg:hidden w-full glass rounded-2xl px-4 py-3 flex items-center justify-between mb-3 text-sm font-medium text-white/70"
            >
              <span className="flex items-center gap-2"><Trophy size={15} className="text-yellow-400" />Stats & Info</span>
              <ChevronRight size={15} className={`transition-transform ${showSidebar ? 'rotate-90' : ''}`} />
            </button>

            <div className={`flex flex-col gap-4 sm:gap-5 ${showSidebar ? 'flex' : 'hidden'} lg:flex`}>
              <div className="glass rounded-2xl p-4 sm:p-5">
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-400" />How It Works
                </h3>
                {[
                  { n:'1', text:'Report water problems on the map', color:'bg-ocean-500' },
                  { n:'2', text:'Admins review & award points',     color:'bg-teal-500' },
                  { n:'3', text:'Spend points to unlock games',     color:'bg-yellow-500' },
                  { n:'4', text:'Play, learn, and have fun!',       color:'bg-emerald-500' },
                ].map(({ n, text, color }) => (
                  <div key={n} className="flex items-center gap-3 py-1.5">
                    <div className={`w-6 h-6 rounded-lg ${color}/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white/75 flex-shrink-0`}>{n}</div>
                    <p className="text-white/55 text-xs sm:text-sm">{text}</p>
                  </div>
                ))}
                <Link to="/map" className="w-full btn-primary text-center block py-2.5 text-xs sm:text-sm mt-4">Start Reporting →</Link>
              </div>

              <div className="glass rounded-2xl p-4 sm:p-5">
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Lock size={14} className="text-white/50" />Unlock Prices
                </h3>
                {GAME_REGISTRY.filter(g => g.cost > 0 && !g.comingSoon).map(g => {
                  const unlocked = unlockedGames.has(g.id)
                  return (
                    <div key={g.id} className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 ${unlocked ? 'opacity-45' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{g.emoji}</span>
                        <span className="text-white/65 text-xs sm:text-sm">{g.name}</span>
                        {g.featured && <Crown size={9} className="text-amber-400" />}
                        {g.mediumCard && <Sparkles size={9} className="text-indigo-400" />}
                        {g.type === 'iframe' && <span className="text-purple-400 text-[10px]">⚙️</span>}
                      </div>
                      {unlocked
                        ? <span className="text-teal-400 text-xs">✓</span>
                        : <div className="flex items-center gap-1 text-yellow-300"><Star size={10}/><span className="text-xs font-mono font-bold">{g.cost}</span></div>}
                    </div>
                  )
                })}
              </div>

              <div className="glass rounded-2xl p-4 sm:p-5">
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Trophy size={15} className="text-yellow-400" />Top Players
                </h3>
                {leaderboard.length === 0 ? (
                  <p className="text-white/25 text-sm text-center py-4">No scores yet!</p>
                ) : leaderboard.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-300' : i === 1 ? 'bg-white/10 text-white/55' : 'bg-white/5 text-white/35'
                    }`}>{i+1}</div>
                    <span className="text-white/65 text-xs sm:text-sm flex-1 truncate">{e.profiles?.full_name || 'Player'}</span>
                    <span className="text-ocean-300 text-xs font-mono font-bold">{e.score}pts</span>
                  </div>
                ))}
              </div>
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