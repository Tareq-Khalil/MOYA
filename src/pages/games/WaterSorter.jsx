import { useState, useCallback } from 'react'
import { RotateCcw, Trophy, Zap, ChevronRight, Info } from 'lucide-react'

const COLORS = [
  { name: 'cyan',    bg: 'bg-cyan-400',    border: 'border-cyan-300',    text: 'text-cyan-300',    glow: 'shadow-cyan-500/40' },
  { name: 'blue',    bg: 'bg-blue-500',    border: 'border-blue-400',    text: 'text-blue-300',    glow: 'shadow-blue-500/40' },
  { name: 'teal',    bg: 'bg-teal-400',    border: 'border-teal-300',    text: 'text-teal-300',    glow: 'shadow-teal-500/40' },
  { name: 'emerald', bg: 'bg-emerald-400', border: 'border-emerald-300', text: 'text-emerald-300', glow: 'shadow-emerald-500/40' },
  { name: 'indigo',  bg: 'bg-indigo-400',  border: 'border-indigo-300',  text: 'text-indigo-300',  glow: 'shadow-indigo-500/40' },
]

const TUBE_CAPACITY = 4

function generatePuzzle(numColors) {
  const colors = COLORS.slice(0, numColors)
  let layers = []
  colors.forEach(c => {
    for (let i = 0; i < TUBE_CAPACITY; i++) layers.push(c.name)
  })
  // Shuffle
  for (let i = layers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [layers[i], layers[j]] = [layers[j], layers[i]]
  }
  const tubes = []
  for (let i = 0; i < numColors; i++) {
    tubes.push(layers.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY))
  }
  tubes.push([])
  if (numColors > 3) tubes.push([])
  return tubes
}

function Tube({ layers, isSelected, isSolved, onClick }) {
  const colorMap = {}
  COLORS.forEach(c => { colorMap[c.name] = c })

  return (
    <button onClick={onClick}
      className={`relative flex flex-col-reverse items-center justify-start w-12 sm:w-14 h-44 sm:h-52 rounded-b-full rounded-t-3xl border-2 overflow-hidden transition-all duration-300 ${
        isSolved ? 'border-teal-400/80 shadow-lg shadow-teal-500/30 scale-105' :
        isSelected ? 'border-ocean-300 shadow-xl shadow-ocean-500/40 scale-105 -translate-y-2' :
        'border-white/20 hover:border-white/40 hover:scale-[1.03]'
      }`}
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      {[...Array(TUBE_CAPACITY)].map((_, i) => {
        const colorName = layers[i]
        const color = colorMap[colorName]
        return (
          <div key={i} className={`w-full flex-shrink-0 transition-all duration-400 ${
            color ? color.bg : 'bg-transparent'
          }`} style={{ height: '25%', opacity: color ? 0.85 : 0 }} />
        )
      })}

      {isSelected && layers.length > 0 && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full animate-bounce ${
          colorMap[layers[layers.length - 1]]?.bg || 'bg-white'
        }`} />
      )}

      {isSolved && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-teal-500/30 border border-teal-400/50 flex items-center justify-center">
            <span className="text-teal-300 text-sm">✓</span>
          </div>
        </div>
      )}
    </button>
  )
}

function isTubeSolved(tube) {
  if (tube.length === 0) return false
  if (tube.length !== TUBE_CAPACITY) return false
  return tube.every(c => c === tube[0])
}

function canPour(from, to) {
  if (from.length === 0) return false
  if (to.length >= TUBE_CAPACITY) return false
  if (to.length === 0) return true
  return from[from.length - 1] === to[to.length - 1]
}

function getTopColor(tube) {
  return tube.length > 0 ? tube[tube.length - 1] : null
}

function getTopCount(tube) {
  if (tube.length === 0) return 0
  const top = tube[tube.length - 1]
  let count = 0
  for (let i = tube.length - 1; i >= 0 && tube[i] === top; i--) count++
  return count
}

const LEVELS = [
  { numColors: 3, name: 'Puddle', pts: 20 },
  { numColors: 4, name: 'Pond', pts: 35 },
  { numColors: 5, name: 'Lake', pts: 50 },
]

export default function WaterSorter({ onExit, onScoreEarned }) {
  const [levelIdx, setLevelIdx] = useState(0)
  const [tubes, setTubes] = useState(() => generatePuzzle(3))
  const [selected, setSelected] = useState(null)
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [allDone, setAllDone] = useState(false)
  const [showTip, setShowTip] = useState(true)

  const level = LEVELS[levelIdx]

  const resetLevel = useCallback(() => {
    setTubes(generatePuzzle(LEVELS[levelIdx].numColors))
    setSelected(null)
    setMoves(0)
    setSolved(false)
  }, [levelIdx])

  const checkSolved = (newTubes) => {
    const nonEmpty = newTubes.filter(t => t.length > 0)
    return nonEmpty.every(t => isTubeSolved(t))
  }

  const handleTubeClick = (idx) => {
    if (solved) return
    if (selected === null) {
      if (tubes[idx].length === 0) return
      setSelected(idx)
    } else if (selected === idx) {
      setSelected(null)
    } else {
      if (canPour(tubes[selected], tubes[idx])) {
        const newTubes = tubes.map(t => [...t])
        const topColor = getTopColor(newTubes[selected])
        const count = getTopCount(newTubes[selected])
        const space = TUBE_CAPACITY - newTubes[idx].length
        const pour = Math.min(count, space)
        for (let i = 0; i < pour; i++) {
          newTubes[selected].pop()
          newTubes[idx].push(topColor)
        }
        setTubes(newTubes)
        setMoves(m => m + 1)
        setSelected(null)
        if (checkSolved(newTubes)) setSolved(true)
      } else {
        setSelected(idx)
      }
    }
  }

  const nextLevel = () => {
    const bonus = Math.max(0, 30 - moves)
    const pts = level.pts + bonus
    setTotalScore(s => s + pts)
    if (levelIdx + 1 >= LEVELS.length) {
      onScoreEarned?.(Math.floor((totalScore + pts) / 10))
      setAllDone(true)
    } else {
      setLevelIdx(i => i + 1)
      setTubes(generatePuzzle(LEVELS[levelIdx + 1].numColors))
      setSelected(null)
      setMoves(0)
      setSolved(false)
    }
  }

  if (allDone) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 min-h-[400px] text-center animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-5xl">🌊</div>
        <div>
          <h2 className="font-display text-4xl font-bold text-white mb-2">Waters Sorted!</h2>
          <p className="text-white/50">All levels conquered!</p>
        </div>
        <div className="glass rounded-2xl px-8 py-4">
          <div className="font-display text-3xl font-bold text-yellow-300">{totalScore}</div>
          <div className="text-white/40 text-sm">Total Score</div>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/25">
          <Trophy size={16} className="text-yellow-300" />
          <span className="text-yellow-200 font-medium">🏆 Final Score: {Math.floor(totalScore/10)}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setLevelIdx(0); setTotalScore(0); setAllDone(false); setTubes(generatePuzzle(3)); setMoves(0); setSolved(false) }} className="btn-teal flex items-center gap-2">
            <RotateCcw size={16}/>Play Again
          </button>
          <button onClick={onExit} className="btn-secondary">Back to Hub</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-between w-full max-w-lg">
        <div>
          <h3 className="font-display text-xl font-bold text-white">Level {levelIdx+1}: {level.name}</h3>
          <p className="text-white/40 text-sm">Sort water colors into single-color tubes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass px-3 py-1.5 rounded-full text-sm text-white/60 font-mono">{moves} moves</div>
          <button onClick={resetLevel} className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10">
            <RotateCcw size={15} className="text-white/60" />
          </button>
        </div>
      </div>

      {showTip && (
        <div className="w-full max-w-lg flex items-start gap-2 px-4 py-3 rounded-xl bg-ocean-500/10 border border-ocean-400/20 text-sm text-white/60">
          <Info size={14} className="text-ocean-300 mt-0.5 flex-shrink-0" />
          <span>Click a tube to select it, then click another to pour. Only matching colors stack!</span>
          <button onClick={() => setShowTip(false)} className="ml-auto text-white/30 hover:text-white/60">✕</button>
        </div>
      )}

      <div className="flex items-end justify-center gap-3 py-8 px-4">
        {tubes.map((tube, i) => (
          <Tube
            key={i}
            layers={tube}
            isSelected={selected === i}
            isSolved={isTubeSolved(tube)}
            onClick={() => handleTubeClick(i)}
          />
        ))}
      </div>

      {solved && (
        <div className="w-full max-w-lg animate-slide-up">
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={22} className="text-yellow-400" />
              <div>
                <p className="text-teal-200 font-semibold">Level Solved! 🎉</p>
                <p className="text-teal-300/60 text-sm">{moves} moves · +{Math.max(0, 30-moves) + level.pts} pts</p>
              </div>
            </div>
            <button onClick={nextLevel} className="btn-teal py-2 px-5 flex items-center gap-2">
              {levelIdx+1 < LEVELS.length ? <><span>Next</span><ChevronRight size={16}/></> : 'Finish!'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}