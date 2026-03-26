import { useState, useCallback, useEffect } from 'react'
import { RotateCcw, Trophy, ArrowLeft, Zap, ChevronRight, Droplets } from 'lucide-react'

const PIPE_TYPES = {
  straight_h: { connections: [0,1,0,1], symbol: '━', rotate: 0 },
  straight_v: { connections: [1,0,1,0], symbol: '┃', rotate: 0 },
  elbow_tr: { connections: [1,1,0,0], symbol: '┗', rotate: 0 },
  elbow_br: { connections: [0,1,1,0], symbol: '┏', rotate: 0 },
  elbow_bl: { connections: [0,0,1,1], symbol: '┓', rotate: 0 },
  elbow_tl: { connections: [1,0,0,1], symbol: '┛', rotate: 0 },
  tee_tbr: { connections: [1,1,1,0], symbol: '┣', rotate: 0 },
  tee_tbl: { connections: [1,0,1,1], symbol: '┫', rotate: 0 },
  tee_rbl: { connections: [0,1,1,1], symbol: '┳', rotate: 0 },
  tee_trl: { connections: [1,1,0,1], symbol: '┻', rotate: 0 },
}

const LEVELS = [
  {
    id: 1, name: "Trickle", size: 4,
    grid: [
      ['elbow_br','straight_h','straight_h','elbow_bl'],
      ['straight_v', null, null,'straight_v'],
      ['straight_v', null, null,'straight_v'],
      ['elbow_tr','straight_h','straight_h','elbow_tl'],
    ],
    source: {row:0,col:0}, sink: {row:3,col:3},
  },
  {
    id: 2, name: "Creek", size: 5,
    grid: [
      ['elbow_br','straight_h','elbow_bl', null, null],
      ['straight_v', null,'straight_v', null, null],
      ['elbow_tr','elbow_br','tee_tbr','straight_h','elbow_bl'],
      [null,'straight_v','straight_v', null,'straight_v'],
      [null,'elbow_tr','elbow_tl', null,'elbow_tr'],
    ],
    source: {row:0,col:0}, sink: {row:4,col:4},
  },
  {
    id: 3, name: "River", size: 5,
    grid: [
      ['elbow_br','straight_h','straight_h','straight_h','elbow_bl'],
      ['straight_v', null,'elbow_br','elbow_bl','straight_v'],
      ['straight_v', null,'straight_v','straight_v','straight_v'],
      ['straight_v','elbow_br','tee_trl','elbow_bl','straight_v'],
      ['elbow_tr','elbow_tl',null,'elbow_tr','elbow_tl'],
    ],
    source: {row:0,col:0}, sink: {row:4,col:4},
  }
]

function PipeCell({ type, rotations, flowing, isSource, isSink, onClick }) {
  const symbols = {
    straight_h:'━', straight_v:'┃',
    elbow_tr:'┗', elbow_br:'┏', elbow_bl:'┓', elbow_tl:'┛',
    tee_tbr:'┣', tee_tbl:'┫', tee_rbl:'┳', tee_trl:'┻'
  }

  const totalRotation = (rotations || 0) * 90

  if (!type) return <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-ocean-950/50 border border-white/5" />

  return (
    <button onClick={onClick}
      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold transition-all duration-300 select-none border ${
        isSource ? 'bg-teal-500/30 border-teal-400/60 shadow-lg shadow-teal-500/20' :
        isSink ? 'bg-yellow-500/30 border-yellow-400/60 shadow-lg shadow-yellow-500/20' :
        flowing ? 'bg-ocean-500/30 border-ocean-400/50 shadow-md shadow-ocean-500/20' :
        'glass border-white/10 hover:bg-white/10 hover:border-ocean-400/30'
      }`}
      style={{ transform: `rotate(${totalRotation}deg)`, transition: 'transform 0.2s ease' }}
    >
      <span className={flowing ? 'text-ocean-300' : isSource ? 'text-teal-300' : isSink ? 'text-yellow-300' : 'text-white/40'}>
        {symbols[type] || '?'}
      </span>
    </button>
  )
}

function traceFlow(grid, rotations, source, size) {
  const getConnections = (type, rots) => {
    if (!type) return [0,0,0,0]
    const base = PIPE_TYPES[type]?.connections || [0,0,0,0]
    const r = ((rots || 0) % 4 + 4) % 4
    let conn = [...base]
    for (let i = 0; i < r; i++) {
      conn = [conn[3], conn[0], conn[1], conn[2]] // rotate left
    }
    return conn
  }

  const flowing = new Set()
  const queue = [source]
  flowing.add(`${source.row},${source.col}`)

  while (queue.length > 0) {
    const {row, col} = queue.shift()
    const key = `${row},${col}`
    const type = grid[row]?.[col]
    const conn = getConnections(type, rotations[key])
    const dirs = [[-1,0,2],[0,1,3],[1,0,0],[0,-1,1]]
    dirs.forEach(([dr,dc,neighborSide], side) => {
      if (!conn[side]) return
      const nr = row+dr, nc = col+dc
      if (nr<0||nr>=size||nc<0||nc>=size) return
      const nkey = `${nr},${nc}`
      if (flowing.has(nkey)) return
      const ntype = grid[nr]?.[nc]
      const nconn = getConnections(ntype, rotations[nkey])
      if (nconn[neighborSide]) {
        flowing.add(nkey)
        queue.push({row:nr,col:nc})
      }
    })
  }
  return flowing
}

export default function PipelinePuzzle({ onExit, onScoreEarned }) {
  const [levelIdx, setLevelIdx] = useState(0)
  const [rotations, setRotations] = useState({})
  const [flowing, setFlowing] = useState(new Set())
  const [solved, setSolved] = useState(false)
  const [moves, setMoves] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [allDone, setAllDone] = useState(false)

  const level = LEVELS[levelIdx]

  const updateFlow = useCallback((grid, rots, source, size, sink) => {
    const f = traceFlow(grid, rots, source, size)
    setFlowing(f)
    if (f.has(`${sink.row},${sink.col}`)) {
      setSolved(true)
    }
  }, [])

  const resetLevel = useCallback(() => {
    const newRots = {}
    level.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell && !(r===level.source.row&&c===level.source.col) && !(r===level.sink.row&&c===level.sink.col)) {
          newRots[`${r},${c}`] = Math.floor(Math.random() * 4)
        }
      })
    })
    setRotations(newRots)
    setMoves(0)
    setSolved(false)
    updateFlow(level.grid, newRots, level.source, level.size, level.sink)
  }, [level, updateFlow])

  useEffect(() => { resetLevel() }, [levelIdx])

  const rotate = (row, col) => {
    if (solved) return
    const key = `${row},${col}`
    const newRots = { ...rotations, [key]: ((rotations[key]||0) + 1) % 4 }
    setRotations(newRots)
    setMoves(m => m + 1)
    updateFlow(level.grid, newRots, level.source, level.size, level.sink)
  }

  const nextLevel = () => {
    const bonus = Math.max(0, 50 - moves) * (levelIdx + 1)
    const pts = 30 + bonus
    setTotalScore(s => s + pts)
    if (levelIdx + 1 >= LEVELS.length) {
      onScoreEarned?.(Math.floor((totalScore + pts) / 10))
      setAllDone(true)
    } else {
      setLevelIdx(i => i + 1)
    }
  }

  if (allDone) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 min-h-[400px] text-center animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
          <Droplets size={44} className="text-teal-300" />
        </div>
        <div>
          <h2 className="font-display text-4xl font-bold text-white mb-2">All Pipes Connected!</h2>
          <p className="text-white/50">You've mastered all the pipeline puzzles</p>
        </div>
        <div className="glass rounded-2xl px-8 py-4 text-center">
          <div className="font-display text-3xl font-bold text-yellow-300">{totalScore}</div>
          <div className="text-white/40 text-sm">Total Score</div>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/25">
          <Trophy size={16} className="text-yellow-300" />
          <span className="text-yellow-200 font-medium">🏆 Final Score: {Math.floor(totalScore/10)}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setLevelIdx(0); setTotalScore(0); setAllDone(false) }} className="btn-teal flex items-center gap-2">
            <RotateCcw size={16}/>Play Again
          </button>
          <button onClick={onExit} className="btn-secondary">Back to Hub</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between w-full">
        <div>
          <h3 className="font-display text-xl font-bold text-white">Level {levelIdx+1}: {level.name}</h3>
          <p className="text-white/40 text-sm">Rotate pipes to connect source to drain</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-3 py-1.5 rounded-full text-sm text-white/60">
            {moves} moves
          </div>
          <button onClick={resetLevel} className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
            <RotateCcw size={15} className="text-white/60" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-white/50">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-teal-500/50 border border-teal-400/50" />Source</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-yellow-500/50 border border-yellow-400/50" />Drain</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-ocean-500/50 border border-ocean-400/50" />Flowing</div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }}>
          {level.grid.map((row, r) =>
            row.map((cell, c) => (
              <PipeCell
                key={`${r}-${c}`}
                type={cell}
                rotations={rotations[`${r},${c}`] || 0}
                flowing={flowing.has(`${r},${c}`)}
                isSource={r===level.source.row && c===level.source.col}
                isSink={r===level.sink.row && c===level.sink.col}
                onClick={() => rotate(r, c)}
              />
            ))
          )}
        </div>
      </div>

      {solved && (
        <div className="w-full animate-slide-up">
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={22} className="text-yellow-400" />
              <div>
                <p className="text-teal-200 font-semibold">Level Solved! 🎉</p>
                <p className="text-teal-300/60 text-sm">Completed in {moves} moves</p>
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