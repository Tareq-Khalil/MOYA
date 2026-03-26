import { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Trophy, Zap, Lock, Star } from 'lucide-react'

const CARD_SETS = {
  free: {
    name: 'Water Basics',
    cards: [
      { id: 'drop', emoji: '💧', label: 'Water Drop' },
      { id: 'wave', emoji: '🌊', label: 'Wave' },
      { id: 'fish', emoji: '🐟', label: 'Fish' },
      { id: 'frog', emoji: '🐸', label: 'Frog' },
      { id: 'turtle', emoji: '🐢', label: 'Turtle' },
      { id: 'rain', emoji: '🌧️', label: 'Rain' },
      { id: 'snowflake', emoji: '❄️', label: 'Snowflake' },
      { id: 'cloud', emoji: '☁️', label: 'Cloud' },
    ]
  },
  premium1: {
    name: 'Ocean Life',
    cost: 30,
    cards: [
      { id: 'whale', emoji: '🐋', label: 'Whale' },
      { id: 'octopus', emoji: '🐙', label: 'Octopus' },
      { id: 'shark', emoji: '🦈', label: 'Shark' },
      { id: 'dolphin', emoji: '🐬', label: 'Dolphin' },
      { id: 'crab', emoji: '🦀', label: 'Crab' },
      { id: 'seahorse', emoji: '🦄', label: 'Seahorse' },
      { id: 'shrimp', emoji: '🦐', label: 'Shrimp' },
      { id: 'coral', emoji: '🪸', label: 'Coral' },
    ]
  },
  premium2: {
    name: 'Eco World',
    cost: 50,
    cards: [
      { id: 'earth', emoji: '🌍', label: 'Earth' },
      { id: 'plant', emoji: '🌿', label: 'Plant' },
      { id: 'sun', emoji: '☀️', label: 'Sun' },
      { id: 'moon', emoji: '🌙', label: 'Moon' },
      { id: 'mountain', emoji: '⛰️', label: 'Mountain' },
      { id: 'waterfall', emoji: '🏞️', label: 'Waterfall' },
      { id: 'tornado', emoji: '🌪️', label: 'Storm' },
      { id: 'tree', emoji: '🌳', label: 'Tree' },
    ]
  }
}

function buildDeck(cards, pairs = 8) {
  const selected = cards.slice(0, pairs)
  const deck = [...selected, ...selected].map((card, i) => ({
    ...card,
    uid: `${card.id}-${i < pairs ? 'a' : 'b'}`,
    flipped: false,
    matched: false,
  }))
  return deck.sort(() => Math.random() - 0.5)
}

export default function WaterMemory({ onExit, onScoreEarned, userPoints, onSpendPoints }) {
  const [activeSet, setActiveSet] = useState('free')
  const [unlockedSets, setUnlockedSets] = useState(new Set(['free']))
  const [deck, setDeck] = useState(() => buildDeck(CARD_SETS.free.cards))
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [canFlip, setCanFlip] = useState(true)
  const [unlocking, setUnlocking] = useState(null)
  const [showSetPicker, setShowSetPicker] = useState(false)

  const startGame = useCallback((setKey) => {
    const cards = CARD_SETS[setKey].cards
    setDeck(buildDeck(cards))
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setScore(0)
    setGameOver(false)
    setCanFlip(true)
    setShowSetPicker(false)
  }, [])

  useEffect(() => { startGame('free') }, [])

  const handleCardClick = (idx) => {
    if (!canFlip || gameOver) return
    if (flipped.includes(idx) || matched.has(deck[idx].id)) return
    if (flipped.length === 2) return

    const newFlipped = [...flipped, idx]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      setCanFlip(false)
      const [a, b] = newFlipped
      if (deck[a].id === deck[b].id) {
        const newMatched = new Set(matched)
        newMatched.add(deck[a].id)
        setTimeout(() => {
          setMatched(newMatched)
          setFlipped([])
          setCanFlip(true)
          const pts = Math.max(2, 10 - Math.floor(moves / 3))
          setScore(s => s + pts)
          if (newMatched.size === CARD_SETS[activeSet].cards.length) {
            setGameOver(true)
            const finalPts = Math.floor((score + pts) / 5)
            onScoreEarned?.(finalPts)
          }
        }, 600)
      } else {
        setTimeout(() => {
          setFlipped([])
          setCanFlip(true)
        }, 1000)
      }
    }
  }

  const unlockSet = async (setKey) => {
    const cost = CARD_SETS[setKey].cost
    if (userPoints < cost) return
    setUnlocking(setKey)
    await onSpendPoints?.(cost)
    setUnlockedSets(prev => new Set([...prev, setKey]))
    setUnlocking(null)
    setActiveSet(setKey)
    startGame(setKey)
  }

  const pairs = CARD_SETS[activeSet].cards.length
  const progress = matched.size / pairs

  return (
    <div className="flex flex-col items-center gap-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSetPicker(!showSetPicker)}
            className="glass px-3 py-1.5 rounded-full text-sm text-ocean-300 hover:bg-white/10 transition-colors">
            {CARD_SETS[activeSet].name} ▾
          </button>
          <div className="glass px-3 py-1.5 rounded-full text-sm font-mono font-bold text-yellow-300">{score} pts</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-sm">{matched.size}/{pairs} pairs · {moves} moves</span>
          <button onClick={() => startGame(activeSet)} className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10">
            <RotateCcw size={15} className="text-white/60" />
          </button>
        </div>
      </div>

      {showSetPicker && (
        <div className="w-full glass-light rounded-2xl p-3 flex flex-col gap-2 border border-white/10">
          {Object.entries(CARD_SETS).map(([key, set]) => {
            const unlocked = unlockedSets.has(key)
            const canAfford = !set.cost || userPoints >= set.cost
            return (
              <button key={key} onClick={() => unlocked ? (setActiveSet(key), startGame(key)) : unlockSet(key)}
                disabled={!unlocked && !canAfford}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  key === activeSet ? 'bg-ocean-500/30 border border-ocean-400/40' :
                  unlocked ? 'hover:bg-white/5' :
                  canAfford ? 'hover:bg-yellow-500/10 border border-yellow-500/10' :
                  'opacity-50 cursor-not-allowed'
                }`}>
                <div className="text-left">
                  <span className="text-white font-medium text-sm">{set.name}</span>
                  {!unlocked && <span className="text-white/40 text-xs ml-2">• {set.cards.slice(0,3).map(c=>c.emoji).join('')}</span>}
                </div>
                {!unlocked ? (
                  <div className="flex items-center gap-1.5">
                    <Star size={12} className="text-yellow-400" />
                    <span className={`text-sm font-bold ${canAfford ? 'text-yellow-300' : 'text-red-400'}`}>{set.cost} pts</span>
                    <Lock size={12} className="text-white/40" />
                  </div>
                ) : key === activeSet ? (
                  <span className="badge-approved">Active</span>
                ) : (
                  <span className="text-teal-400 text-xs">✓ Unlocked</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-ocean-400 to-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((card, i) => {
          const isFlipped = flipped.includes(i)
          const isMatched = matched.has(card.id)
          return (
            <button key={card.uid} onClick={() => handleCardClick(i)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 select-none ${
                isMatched ? 'bg-teal-500/20 border-teal-400/50 scale-95 opacity-70' :
                isFlipped ? 'bg-ocean-500/30 border-ocean-400/50 scale-105 shadow-lg shadow-ocean-500/30' :
                'glass border-white/15 hover:border-ocean-400/40 hover:bg-white/10 hover:scale-105'
              }`}
              style={{
                transform: isFlipped || isMatched ? 'rotateY(0deg)' : 'rotateY(0deg)',
              }}
            >
              {(isFlipped || isMatched) ? card.emoji : (
                <span className="text-white/20 text-lg font-bold">?</span>
              )}
            </button>
          )
        })}
      </div>

      {gameOver && (
        <div className="w-full animate-slide-up">
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
            <Trophy size={32} className="text-yellow-400" />
            <div>
              <h3 className="font-display text-2xl font-bold text-white">All Matched! 🎉</h3>
              <p className="text-white/50 text-sm">{pairs} pairs in {moves} moves</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/15 border border-teal-500/30">
              <Zap size={14} className="text-teal-300" />
              <span className="text-teal-200 text-sm">🏆 Score: {Math.floor(score/5)}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startGame(activeSet)} className="btn-teal flex items-center gap-2">
                <RotateCcw size={15}/>Play Again
              </button>
              <button onClick={onExit} className="btn-secondary">Back to Hub</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}