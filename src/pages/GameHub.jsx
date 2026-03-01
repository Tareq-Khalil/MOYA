import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import WaterTrivia from './games/WaterTrivia'
import PipelinePuzzle from './games/PipelinePuzzle'
import WaterSorter from './games/WaterSorter'
import WaterMemory from './games/WaterMemory'
import EcoDecisions from './games/EcoDecisions'
import {
  Gamepad2, Star, Lock, Play, Trophy, Zap, Users,
  Brain, Puzzle, Droplets, Shield, Heart, ChevronRight,
  X, ArrowLeft, TrendingUp, Award, Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'

// ─── Game Registry ───────────────────────────────────────────────────────────
const GAMES = [
  {
    id: 'trivia',
    name: 'Water Trivia',
    tagline: 'Test your water knowledge!',
    description: 'Answer 10 timed questions about water science, conservation, and global water issues. Beat the clock for bonus points!',
    icon: Brain,
    emoji: '🧠',
    cost: 0,
    category: 'FREE',
    difficulty: 'Easy',
    players: '1P',
    gradient: 'from-ocean-600/40 to-ocean-800/60',
    accent: 'ocean',
    accentColor: '#0ea5e9',
    tags: ['Educational', 'Trivia', 'Timed'],
    features: ['10 Random Questions', 'Streak Bonuses', 'Time Bonus Points', 'Water Facts'],
  },
  {
    id: 'memory',
    name: 'Memory Match',
    tagline: 'Find matching water pairs!',
    description: 'Flip cards to find matching water-themed pairs. Unlock premium card packs with your AquaPoints for more fun themes!',
    icon: Sparkles,
    emoji: '🃏',
    cost: 0,
    category: 'FREE',
    difficulty: 'Easy',
    players: '1P',
    gradient: 'from-teal-600/40 to-teal-900/60',
    accent: 'teal',
    accentColor: '#14b8a6',
    tags: ['Memory', 'Relaxing', 'Unlockable Packs'],
    features: ['8 Card Pairs', 'Premium Theme Packs', 'Combo Scoring', 'Ocean & Eco Themes'],
    premiumFeature: 'Card packs unlockable with points',
  },
  {
    id: 'pipeline',
    name: 'Pipeline Puzzle',
    tagline: 'Connect the water flow!',
    description: 'Rotate pipe segments to create a complete water pipeline from source to drain. Engineering puzzles that teach water infrastructure!',
    icon: Puzzle,
    emoji: '🔧',
    cost: 10,
    category: 'UNLOCK',
    difficulty: 'Medium',
    players: '1P',
    gradient: 'from-amber-700/40 to-orange-900/60',
    accent: 'amber',
    accentColor: '#f59e0b',
    tags: ['Puzzle', 'Engineering', 'Strategy'],
    features: ['3 Increasing Levels', 'Rotation Mechanics', 'Move Counter', 'Flow Simulation'],
  },
  {
    id: 'sorter',
    name: 'Water Sorter',
    tagline: 'Sort contaminated water!',
    description: 'Pour colored water between tubes to sort each tube into a single pure color. Represents water purification and separation!',
    icon: Droplets,
    emoji: '💧',
    cost: 10,
    category: 'UNLOCK',
    difficulty: 'Medium',
    players: '1P',
    gradient: 'from-cyan-600/40 to-blue-900/60',
    accent: 'cyan',
    accentColor: '#22d3ee',
    tags: ['Logic', 'Sorting', 'Purification'],
    features: ['3 Levels (3–5 colors)', 'Pour Mechanics', 'Undo System', 'Satisfying Animations'],
  },
  {
    id: 'flood',
    name: 'Flood Defense',
    tagline: 'Save homes from rising water!',
    description: 'Strategically place sandbags to protect houses from a rising flood. Race against time! Teaches real flood management strategies.',
    icon: Shield,
    emoji: '🌊',
    cost: 20,
    category: 'UNLOCK',
    difficulty: 'Hard',
    players: '1P',
    gradient: 'from-blue-700/40 to-indigo-900/60',
    accent: 'blue',
    accentColor: '#3b82f6',
    tags: ['Strategy', 'Real-time', 'Emergency'],
    features: ['60-Second Rounds', 'Flood Simulation', 'Sandbag Strategy', 'Home Protection'],
  },
  {
    id: 'eco',
    name: 'Eco Decisions',
    tagline: 'Make the right water choices!',
    description: 'Face real-world water management scenarios and make critical decisions. Every choice affects your eco-score and teaches you valuable lessons.',
    icon: Award,
    emoji: '🌍',
    cost: 20,
    category: 'UNLOCK',
    difficulty: 'Hard',
    players: '1P',
    gradient: 'from-emerald-700/40 to-green-900/60',
    accent: 'emerald',
    accentColor: '#10b981',
    tags: ['Scenarios', 'Decision-Making', 'Real-World'],
    features: ['5 Real Scenarios', 'Branching Outcomes', 'Eco-Score System', 'Expert Explanations'],
  },
]

const DIFFICULTY_COLORS = {
  Easy: 'text-teal-300 bg-teal-500/15 border-teal-500/30',
  Medium: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
  Hard: 'text-red-300 bg-red-500/15 border-red-500/30',
}

// ─── GameCard ─────────────────────────────────────────────────────────────────
function GameCard({ game, unlocked, userPoints, onPlay, onUnlock }) {
  const Icon = game.icon
  const canAfford = userPoints >= game.cost

  return (
    <div className={`relative rounded-3xl overflow-hidden border transition-all duration-500 group cursor-pointer ${
      unlocked
        ? 'border-white/15 hover:border-white/30 hover:scale-[1.02] hover:shadow-2xl'
        : canAfford
          ? 'border-yellow-500/20 hover:border-yellow-400/40 hover:scale-[1.02]'
          : 'border-white/8 opacity-75'
    }`}
      style={{ background: `linear-gradient(135deg, rgba(8,47,73,0.95) 0%, rgba(12,74,110,0.8) 100%)` }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-60`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${game.accentColor}15 0%, transparent 70%)` }} />

      {/* Category badge */}
      <div className="absolute top-4 right-4 z-10">
        {unlocked ? (
          <span className="badge bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] tracking-wider">
            ✓ UNLOCKED
          </span>
        ) : game.cost === 0 ? (
          <span className="badge bg-ocean-500/20 text-ocean-300 border border-ocean-400/30 text-[10px] tracking-wider">
            FREE
          </span>
        ) : (
          <div className="flex items-center gap-1 badge bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px]">
            <Star size={9} />
            {game.cost} pts
          </div>
        )}
      </div>

      <div className="relative z-10 p-6 flex flex-col gap-4">
        {/* Icon & title */}
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl
            group-hover:scale-110 transition-transform duration-300`}
            style={{ background: `${game.accentColor}20`, border: `1px solid ${game.accentColor}40` }}>
            {game.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-bold text-white leading-tight">{game.name}</h3>
            <p style={{ color: game.accentColor }} className="text-sm font-medium mt-0.5 opacity-90">{game.tagline}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed line-clamp-2">{game.description}</p>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`badge text-[10px] border ${DIFFICULTY_COLORS[game.difficulty]}`}>
            {game.difficulty}
          </span>
          {game.tags.slice(0, 2).map(t => (
            <span key={t} className="badge bg-white/5 text-white/50 border border-white/10 text-[10px]">{t}</span>
          ))}
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-2 gap-1">
          {game.features.slice(0, 4).map(f => (
            <div key={f} className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: game.accentColor, opacity: 0.7 }} />
              {f}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-1">
          {unlocked ? (
            <button onClick={() => onPlay(game.id)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${game.accentColor}30, ${game.accentColor}15)`,
                border: `1px solid ${game.accentColor}50`,
                color: game.accentColor
              }}>
              <Play size={15} />
              Play Now
              <ChevronRight size={14} />
            </button>
          ) : canAfford ? (
            <button onClick={() => onUnlock(game)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95">
              <Zap size={15} />
              Unlock for {game.cost} pts
            </button>
          ) : (
            <button disabled className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-white/5 border border-white/10 text-white/30 cursor-not-allowed">
              <Lock size={15} />
              Need {game.cost - userPoints} more points
            </button>
          )}
        </div>
      </div>

      {/* Locked overlay */}
      {!unlocked && !canAfford && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Lock size={24} className="text-white/30" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Unlock Confirm Modal ─────────────────────────────────────────────────────
function UnlockModal({ game, userPoints, onConfirm, onCancel, loading }) {
  if (!game) return null
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-light rounded-3xl p-7 max-w-sm w-full border border-white/20 shadow-2xl animate-slide-up">
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">{game.emoji}</div>
          <h2 className="font-display text-2xl font-bold text-white">{game.name}</h2>
          <p className="text-white/55 text-sm mt-1">Unlock this game permanently</p>
        </div>
        <div className="glass rounded-2xl p-4 mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Your points</span>
            <span className="text-teal-300 font-bold font-mono">{userPoints} pts</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Cost to unlock</span>
            <span className="text-yellow-300 font-bold font-mono">−{game.cost} pts</span>
          </div>
          <div className="border-t border-white/10 pt-2 mt-2 flex justify-between text-sm">
            <span className="text-white/60">Remaining</span>
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

// ─── Score Toast ──────────────────────────────────────────────────────────────
function ScoreToast({ points, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] animate-slide-up">
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-teal-900/90 border border-teal-400/40 shadow-2xl shadow-teal-900/50 backdrop-blur-xl">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
          <Zap size={20} className="text-teal-300" />
        </div>
        <div>
          <p className="text-white font-semibold">+{points} AquaPoints earned!</p>
          <p className="text-teal-300/70 text-xs">Points added to your wallet</p>
        </div>
        <button onClick={onDismiss} className="ml-2 text-white/30 hover:text-white/70">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Active Game Shell ────────────────────────────────────────────────────────
function GameShell({ gameId, onExit, onScoreEarned, userPoints, onSpendPoints }) {
  const game = GAMES.find(g => g.id === gameId)
  if (!game) return null

  const props = { onExit, onScoreEarned }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Game header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onExit}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} className="text-white/70" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{game.emoji}</span>
            <div>
              <h2 className="font-display text-xl font-bold text-white">{game.name}</h2>
              <p className="text-white/40 text-xs">{game.tagline}</p>
            </div>
          </div>
          <div className="ml-auto">
            <span className={`badge border text-xs ${DIFFICULTY_COLORS[game.difficulty]}`}>{game.difficulty}</span>
          </div>
        </div>

        {/* Game component */}
        <div className="glass rounded-3xl p-5 sm:p-8 border border-white/10">
          {gameId === 'trivia' && <WaterTrivia {...props} />}
          {gameId === 'pipeline' && <PipelinePuzzle {...props} />}
          {gameId === 'sorter' && <WaterSorter {...props} />}
          {gameId === 'flood' && <FloodDefense {...props} />}
          {gameId === 'memory' && <WaterMemory {...props} userPoints={userPoints} onSpendPoints={onSpendPoints} />}
          {gameId === 'eco' && <EcoDecisions {...props} />}
        </div>
      </div>
    </div>
  )
}

// lazy import FloodDefense inside component to avoid circular
import FloodDefense from './games/FloodDefense'

// ─── Main GameHub Page ────────────────────────────────────────────────────────
export default function GameHub() {
  const { user, profile, refreshProfile } = useAuth()
  const [unlockedGames, setUnlockedGames] = useState(new Set(['trivia', 'memory']))
  const [activeGame, setActiveGame] = useState(null)
  const [unlockModal, setUnlockModal] = useState(null)
  const [unlockLoading, setUnlockLoading] = useState(false)
  const [scoreToast, setScoreToast] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [filter, setFilter] = useState('all')

  const userPoints = profile?.points ?? 0

  // Load user's unlocked games
  useEffect(() => {
    if (!user) return
    const loadUnlocks = async () => {
      const { data } = await supabase
        .from('game_unlocks')
        .select('game_id')
        .eq('user_id', user.id)
      if (data) {
        setUnlockedGames(new Set(['trivia', 'memory', ...data.map(u => u.game_id)]))
      }
    }
    loadUnlocks()
  }, [user])

  // Load leaderboard
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('game_scores')
        .select('user_id, game_id, score, profiles(full_name)')
        .order('score', { ascending: false })
        .limit(5)
      setLeaderboard(data || [])
    }
    load()
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
    } catch (err) {
      console.error(err)
    }
    setUnlockLoading(false)
  }

  const handleScoreEarned = async (points) => {
    if (!user || points <= 0) return
    await supabase.rpc('increment_user_points', { user_id_param: user.id, points_param: points })
    // Record score
    await supabase.from('game_scores').upsert({
      user_id: user.id,
      game_id: activeGame,
      score: points,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,game_id', ignoreDuplicates: false })
    refreshProfile()
    setScoreToast(points)
  }

  const handleSpendPoints = async (cost) => {
    if (!user) return
    await supabase.rpc('decrement_user_points', { user_id_param: user.id, points_param: cost })
    refreshProfile()
  }

  const filteredGames = filter === 'all' ? GAMES
    : filter === 'free' ? GAMES.filter(g => g.cost === 0)
    : GAMES.filter(g => g.cost > 0)

  // ─── Active Game View ───────────────────────────────────────────────────────
  if (activeGame) {
    return (
      <>
        <GameShell
          gameId={activeGame}
          onExit={() => setActiveGame(null)}
          onScoreEarned={handleScoreEarned}
          userPoints={userPoints}
          onSpendPoints={handleSpendPoints}
        />
        {scoreToast && <ScoreToast points={scoreToast} onDismiss={() => setScoreToast(null)} />}
      </>
    )
  }

  // ─── Hub View ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16">
      {scoreToast && <ScoreToast points={scoreToast} onDismiss={() => setScoreToast(null)} />}

      {/* Hero Header */}
      <div className="relative overflow-hidden pt-24 pb-16">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-950 via-ocean-900/80 to-transparent" />
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-float opacity-20"
              style={{
                width: `${20 + i * 8}px`, height: `${20 + i * 8}px`,
                left: `${5 + i * 8}%`, top: `${10 + (i % 4) * 20}%`,
                background: i % 3 === 0 ? '#0ea5e9' : i % 3 === 1 ? '#14b8a6' : '#6366f1',
                filter: 'blur(2px)',
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${4 + i * 0.3}s`
              }} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-5">
            <Gamepad2 size={14} className="text-ocean-300" />
            <span className="text-ocean-200 text-sm">Educational Game Hub</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Learn Through
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 via-teal-300 to-cyan-300">
              Play & Discovery
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Earn AquaPoints from reporting, then spend them to unlock harder challenges.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {[
              { icon: Gamepad2, label: '6 Games', color: 'text-ocean-300' },
              { icon: Brain, label: 'Water Education', color: 'text-teal-300' },
              { icon: Trophy, label: 'Leaderboards', color: 'text-yellow-300' },
              { icon: Zap, label: 'Earn Points', color: 'text-orange-300' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Icon size={14} className={color} />
                <span className="text-white/70 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Points & login CTA */}
        {user ? (
          <div className="glass rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                <Star size={22} className="text-teal-300" />
              </div>
              <div>
                <p className="text-white font-semibold">Your AquaPoints Wallet</p>
                <p className="text-white/50 text-sm">Earned from water problem reports</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-teal-300">{userPoints}</div>
                <div className="text-white/40 text-xs">Available</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">{unlockedGames.size}</div>
                <div className="text-white/40 text-xs">Unlocked</div>
              </div>
              <Link to="/map" className="btn-teal py-2 px-5 text-sm flex items-center gap-1.5">
                <TrendingUp size={14} />Earn More
              </Link>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl p-5 mb-8 flex items-center justify-between gap-4 border border-ocean-400/20">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎮</div>
              <div>
                <p className="text-white font-semibold">Play all free games now!</p>
                <p className="text-white/50 text-sm">Sign up to earn points and unlock premium games</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Login</Link>
              <Link to="/signup" className="btn-primary py-2 px-4 text-sm">Sign Up</Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Games Grid */}
          <div>
            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6">
              {[['all', 'All Games'], ['free', 'Free'], ['premium', 'Unlock with Points']].map(([key, label]) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === key ? 'bg-ocean-500 text-white shadow-lg' : 'glass text-white/60 hover:text-white'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  unlocked={unlockedGames.has(game.id)}
                  userPoints={userPoints}
                  onPlay={setActiveGame}
                  onUnlock={() => {
                    if (!user) return
                    setUnlockModal(game)
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* How points work */}
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                How It Works
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { n: '1', text: 'Report water problems on the map', color: 'bg-ocean-500' },
                  { n: '2', text: 'Admins review & award you points', color: 'bg-teal-500' },
                  { n: '3', text: 'Spend points to unlock games', color: 'bg-yellow-500' },
                  { n: '4', text: 'Play, earn more pts, repeat!', color: 'bg-emerald-500' },
                ].map(({ n, text, color }) => (
                  <div key={n} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg ${color}/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white/80 flex-shrink-0`}>{n}</div>
                    <p className="text-white/60 text-sm">{text}</p>
                  </div>
                ))}
              </div>
              <Link to="/map" className="w-full btn-primary text-center block py-2.5 text-sm mt-4">
                Start Reporting →
              </Link>
            </div>

            {/* Points needed */}
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lock size={16} className="text-white/60" />
                Unlock Prices
              </h3>
              <div className="flex flex-col gap-2">
                {GAMES.filter(g => g.cost > 0).map(g => {
                  const unlocked = unlockedGames.has(g.id)
                  return (
                    <div key={g.id} className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 ${unlocked ? 'opacity-50' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span>{g.emoji}</span>
                        <span className="text-white/70 text-sm">{g.name}</span>
                      </div>
                      {unlocked ? (
                        <span className="text-teal-400 text-xs">✓ Done</span>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-300">
                          <Star size={10} />
                          <span className="text-xs font-mono font-bold">{g.cost}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-yellow-400" />
                Top Players
              </h3>
              {leaderboard.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">No scores yet — be the first!</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {leaderboard.map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                        i === 1 ? 'bg-white/10 text-white/60' :
                        'bg-white/5 text-white/40'
                      }`}>{i + 1}</div>
                      <span className="text-white/70 text-sm flex-1 truncate">{entry.profiles?.full_name || 'Player'}</span>
                      <span className="text-ocean-300 text-xs font-mono font-bold">{entry.score}pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unlock modal */}
      {unlockModal && (
        <UnlockModal
          game={unlockModal}
          userPoints={userPoints}
          onConfirm={() => handleUnlock(unlockModal)}
          onCancel={() => setUnlockModal(null)}
          loading={unlockLoading}
        />
      )}
    </div>
  )
}
