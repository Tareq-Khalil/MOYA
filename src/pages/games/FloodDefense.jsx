import { useState, useEffect, useCallback, useRef } from 'react'
import { RotateCcw, Trophy, Zap, AlertTriangle, Shield, Droplets } from 'lucide-react'

const GRID_COLS = 8
const GRID_ROWS = 6
const FLOOD_INTERVAL = 1200 // ms
const HOME_POSITIONS = [
  { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }
]

function createGrid() {
  const g = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill('empty'))
  HOME_POSITIONS.forEach(({ r, c }) => { g[r][c] = 'home' })
  return g
}

function getFloodStart() {
  return Array.from({ length: GRID_ROWS }, (_, r) => ({ r, c: 0 }))
}

const CELL_COLORS = {
  empty: 'bg-ocean-950/60 border-white/5 hover:bg-ocean-700/40 hover:border-ocean-400/30 cursor-pointer',
  sandbag: 'bg-amber-700/60 border-amber-600/50 cursor-pointer hover:bg-amber-600/70',
  flooded: 'bg-blue-500/70 border-blue-400/50',
  home: 'bg-red-500/40 border-red-400/60',
  home_flooded: 'bg-red-600/90 border-red-400 animate-pulse',
  sandbag_flooded: 'bg-amber-700/60 border-amber-600/50', // water blocked
}

export default function FloodDefense({ onExit, onScoreEarned }) {
  const [grid, setGrid] = useState(createGrid)
  const [flooded, setFlooded] = useState(new Set())
  const [wave, setWave] = useState(0)
  const [score, setScore] = useState(0)
  const [homesDestroyed, setHomesDestroyed] = useState(0)
  const [gameState, setGameState] = useState('playing') // playing, lost, won
  const [timeLeft, setTimeLeft] = useState(60)
  const [sandbags, setSandbags] = useState(20)
  const intervalRef = useRef(null)
  const timerRef = useRef(null)

  const flood = useCallback((currentFlooded, currentGrid) => {
    const newFlooded = new Set(currentFlooded)
    const newGrid = currentGrid.map(r => [...r])
    let newHomesDestroyed = 0

    // Spread from left and from existing flood
    const toSpread = []

    // Start from left edge
    for (let r = 0; r < GRID_ROWS; r++) {
      if (!newFlooded.has(`${r},0`) && newGrid[r][0] !== 'sandbag') {
        toSpread.push({ r, c: 0 })
      }
    }

    // Spread from existing flood
    newFlooded.forEach(key => {
      const [r, c] = key.split(',').map(Number)
      const dirs = [[0,1],[1,0],[-1,0],[0,-1]]
      dirs.forEach(([dr, dc]) => {
        const nr = r+dr, nc = c+dc
        if (nr>=0&&nr<GRID_ROWS&&nc>=0&&nc<GRID_COLS) {
          if (!newFlooded.has(`${nr},${nc}`) && newGrid[nr][nc] !== 'sandbag') {
            toSpread.push({ r: nr, c: nc })
          }
        }
      })
    })

    // Add only a limited spread per wave
    const spreadLimit = Math.min(toSpread.length, 2 + wave)
    const shuffled = toSpread.sort(() => Math.random() - 0.5).slice(0, spreadLimit)

    shuffled.forEach(({ r, c }) => {
      if (newGrid[r][c] !== 'sandbag') {
        newFlooded.add(`${r},${c}`)
        if (newGrid[r][c] === 'home') {
          newGrid[r][c] = 'home_flooded'
          newHomesDestroyed++
        } else if (newGrid[r][c] !== 'home_flooded') {
          newGrid[r][c] = 'flooded'
        }
      }
    })

    return { newFlooded, newGrid, newHomesDestroyed }
  }, [wave])

  const startFloodTimer = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setFlooded(prev => {
        setGrid(prevGrid => {
          const { newFlooded, newGrid, newHomesDestroyed } = flood(prev, prevGrid)
          setFlooded(newFlooded)
          if (newHomesDestroyed > 0) {
            setHomesDestroyed(h => {
              const total = h + newHomesDestroyed
              if (total >= HOME_POSITIONS.length) {
                clearInterval(intervalRef.current)
                clearInterval(timerRef.current)
                setGameState('lost')
              }
              return total
            })
          }
          return newGrid
        })
        return prev
      })
      setWave(w => w + 1)
    }, FLOOD_INTERVAL)
  }, [flood])

  useEffect(() => {
    startFloodTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          clearInterval(timerRef.current)
          setGameState('won')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      clearInterval(intervalRef.current)
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (gameState === 'won') {
      const pts = Math.floor(score / 10) + Math.max(0, timeLeft) + sandbags
      onScoreEarned?.(pts)
    }
  }, [gameState])

  const handleCellClick = (r, c) => {
    if (gameState !== 'playing') return
    if (sandbags <= 0) return
    const cell = grid[r][c]
    if (cell === 'empty') {
      const newGrid = grid.map(row => [...row])
      newGrid[r][c] = 'sandbag'
      setGrid(newGrid)
      setSandbags(s => s - 1)
      setScore(s => s + 5)
    } else if (cell === 'sandbag') {
      // Remove sandbag
      const newGrid = grid.map(row => [...row])
      newGrid[r][c] = 'empty'
      setGrid(newGrid)
      setSandbags(s => s + 1)
    }
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    clearInterval(timerRef.current)
    setGrid(createGrid())
    setFlooded(new Set())
    setWave(0)
    setScore(0)
    setHomesDestroyed(0)
    setGameState('playing')
    setTimeLeft(60)
    setSandbags(20)
    startFloodTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          clearInterval(timerRef.current)
          setGameState('won')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const finalPts = Math.floor(score/10) + timeLeft + sandbags

  return (
    <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
      {/* Header stats */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Shield size={13} className="text-amber-400" />
            <span className="text-amber-300 text-sm font-mono font-bold">{sandbags} bags</span>
          </div>
          <div className="glass px-3 py-1.5 rounded-full text-sm font-mono font-bold text-yellow-300">{score} pts</div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`glass px-3 py-1.5 rounded-full text-sm font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white/70'}`}>
            {timeLeft}s
          </div>
          <div className="flex gap-1">
            {HOME_POSITIONS.map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm text-xs flex items-center justify-center ${
                i < homesDestroyed ? 'text-red-400' : 'text-white/60'
              }`}>{i < homesDestroyed ? '🏚️' : '🏠'}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-white/40 text-xs text-center">
        Click cells to place sandbags 🪣 — protect the 🏠 homes from flooding! Click sandbag to remove it.
      </p>

      {/* Grid */}
      <div className="glass rounded-2xl p-3">
        <div className="relative">
          {/* Water source indicator */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <Droplets size={16} className="text-blue-400 animate-bounce" />
            <div className="text-blue-400 text-xs">←</div>
          </div>

          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <button key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  disabled={gameState !== 'playing' || cell === 'flooded' || cell === 'home' || cell === 'home_flooded'}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition-all duration-300 text-sm flex items-center justify-center ${
                    CELL_COLORS[cell] || CELL_COLORS.empty
                  }`}
                >
                  {cell === 'sandbag' && '🪣'}
                  {(cell === 'home' || cell === 'home_flooded') && '🏠'}
                  {cell === 'flooded' && <div className="w-full h-full rounded-lg bg-blue-400/20 flex items-center justify-center text-blue-300 text-xs">~</div>}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Game Over overlays */}
      {gameState !== 'playing' && (
        <div className="w-full animate-fade-in">
          <div className={`rounded-2xl p-5 flex flex-col items-center gap-3 text-center border ${
            gameState === 'won'
              ? 'bg-teal-500/10 border-teal-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="text-4xl">{gameState === 'won' ? '🏆' : '🌊'}</div>
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                {gameState === 'won' ? 'Homes Protected!' : 'Flood Won...'}
              </h3>
              <p className="text-white/50 text-sm">
                {gameState === 'won'
                  ? `You defended all homes for 60 seconds!`
                  : `${homesDestroyed} home${homesDestroyed > 1 ? 's' : ''} were flooded`}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="glass rounded-xl px-4 py-2 text-center">
                <div className="text-yellow-300 font-bold text-xl">{score}</div>
                <div className="text-white/40 text-xs">Score</div>
              </div>
              {gameState === 'won' && (
                <div className="glass rounded-xl px-4 py-2 text-center">
                  <div className="text-teal-300 font-bold text-xl">+{finalPts}</div>
                  <div className="text-white/40 text-xs">AquaPoints</div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="btn-teal flex items-center gap-2">
                <RotateCcw size={15}/>Try Again
              </button>
              <button onClick={onExit} className="btn-secondary">Back to Hub</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
