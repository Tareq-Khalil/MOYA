import { useState, useEffect, useCallback } from 'react'
import { Trophy, RotateCcw, Zap, CheckCircle, XCircle, Brain, Target } from 'lucide-react'

const SCENARIOS = [
  {
    title: "The Leaking Tap",
    scenario: "A tap drips 1 drop per second. How much water is wasted in a month?",
    choices: [
      { text: "Fix it immediately — every drop counts", pts: 50, correct: true, result: "✅ Right! A dripping tap wastes ~1,000 liters/month. Always fix leaks ASAP!" },
      { text: "It's just a few drops, ignore it", pts: -20, correct: false, result: "❌ Wrong! That tiny drip wastes about 1,000 liters per month — enough to drink for a year!" },
      { text: "Put a bucket under it to collect", pts: 20, correct: false, result: "🟡 Good thinking but incomplete! Collecting helps short-term, but fixing the leak is far better." },
    ]
  },
  {
    title: "Factory Discharge",
    scenario: "A nearby factory is dumping untreated wastewater into the river. You have 3 options:",
    choices: [
      { text: "Report to environmental authorities immediately", pts: 50, correct: true, result: "✅ Perfect! Reporting triggers official investigation and enforcement — the most impactful action." },
      { text: "Post about it on social media", pts: 15, correct: false, result: "🟡 Helpful for awareness, but direct reporting to authorities is faster and more effective." },
      { text: "Ignore it — not your problem", pts: -30, correct: false, result: "❌ Ignoring polluters allows harm to spread to downstream communities and ecosystems." },
    ]
  },
  {
    title: "Irrigation Decision",
    scenario: "You manage a farm. Which irrigation method saves the most water?",
    choices: [
      { text: "Flood irrigation — cheap and easy", pts: -10, correct: false, result: "❌ Flood irrigation wastes 60–70% of water to evaporation and runoff. Very inefficient!" },
      { text: "Drip irrigation — water at roots", pts: 50, correct: true, result: "✅ Drip irrigation delivers water directly to roots, using up to 90% less water than flood methods!" },
      { text: "Sprinkler system at noon", pts: 10, correct: false, result: "🟡 Sprinklers are OK but lose lots of water to midday evaporation. Drip is still better." },
    ]
  },
  {
    title: "Community Crisis",
    scenario: "Your town has a water shortage. What's the BEST immediate community action?",
    choices: [
      { text: "Everyone fills up personal stockpiles", pts: -20, correct: false, result: "❌ Panic-buying depletes shared resources and hurts the most vulnerable community members." },
      { text: "Organize water rationing and sharing", pts: 50, correct: true, result: "✅ Community rationing ensures fair distribution and helps everyone survive the shortage together." },
      { text: "Drill a new well immediately", pts: 20, correct: false, result: "🟡 Long-term solution, but drilling takes time. Immediate rationing is the urgent priority." },
    ]
  },
  {
    title: "Household Savings",
    scenario: "Which single change saves the most water at home?",
    choices: [
      { text: "Shorter showers (5 min vs 15 min)", pts: 40, correct: false, result: "🟡 Great! Saves ~60L per shower. But there's an even bigger win..." },
      { text: "Installing a low-flow toilet", pts: 50, correct: true, result: "✅ Toilets use 30% of household water. A low-flow toilet saves ~20,000 liters per year!" },
      { text: "Turning off tap while brushing teeth", pts: 30, correct: false, result: "🟡 Saves 6L per brush — good habit! But toilets waste much more overall." },
    ]
  },
]

const LETTERS = ['A', 'B', 'C']

export default function EcoDecisions({ onExit, onScoreEarned }) {
  const [scenarios, setScenarios] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [results, setResults] = useState([])

  const startGame = useCallback(() => {
    const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5)
    setScenarios(shuffled)
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setGameOver(false)
    setResults([])
  }, [])

  useEffect(() => { startGame() }, [startGame])

  const handleChoice = (choiceIdx) => {
    if (selected !== null) return
    setSelected(choiceIdx)
    const choice = scenarios[current].choices[choiceIdx]
    const newScore = score + choice.pts
    setScore(newScore)
    setResults(r => [...r, { correct: choice.correct, pts: choice.pts }])

    setTimeout(() => {
      if (current + 1 >= scenarios.length) {
        setGameOver(true)
        const finalPts = Math.max(0, Math.floor(newScore / 8))
        onScoreEarned?.(finalPts)
      } else {
        setCurrent(c => c + 1)
        setSelected(null)
      }
    }, 2400)
  }

  if (!scenarios.length) return null

  if (gameOver) {
    const correct = results.filter(r => r.correct).length
    const rating = score >= 200 ? '🌟 Water Champion' : score >= 100 ? '💧 Water Advocate' : score >= 0 ? '🌱 Learning' : '📚 Keep Practicing'
    return (
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto text-center animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-ocean-500/30 to-teal-500/20 border border-ocean-400/30 flex items-center justify-center text-4xl">
          {score >= 200 ? '🌟' : score >= 100 ? '💧' : '🌱'}
        </div>
        <div>
          <h2 className="font-display text-4xl font-bold text-white mb-1">Results</h2>
          <p className="text-ocean-300 font-medium text-lg">{rating}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { label: 'Score', value: score, color: score >= 0 ? 'text-teal-300' : 'text-red-400' },
            { label: 'Correct', value: `${correct}/${scenarios.length}`, color: 'text-yellow-300' },
            { label: 'Score',   value: `+${Math.max(0, Math.floor(score/8))}`, color: 'text-ocean-300' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass rounded-2xl p-4">
              <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-white/40 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
        <div className="w-full glass rounded-2xl p-4 text-sm text-white/60 text-left">
          <p className="text-white/80 font-medium mb-2">Your eco-score breakdown:</p>
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 py-1 border-b border-white/5 last:border-0">
              {r.correct ? <CheckCircle size={13} className="text-teal-400"/> : <XCircle size={13} className="text-red-400"/>}
              <span className={r.pts >= 0 ? 'text-teal-300' : 'text-red-400'}>{r.pts >= 0 ? '+' : ''}{r.pts} pts</span>
              <span className="text-white/40 text-xs">Scenario {i+1}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={startGame} className="btn-teal flex items-center gap-2">
            <RotateCcw size={15}/>Play Again
          </button>
          <button onClick={onExit} className="btn-secondary">Back to Hub</button>
        </div>
      </div>
    )
  }

  const s = scenarios[current]
  if (!s) return null

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-ocean-300" />
          <span className="text-white/60 text-sm">{current + 1} / {scenarios.length}</span>
        </div>
        <div className={`glass px-3 py-1.5 rounded-full text-sm font-mono font-bold ${score >= 0 ? 'text-teal-300' : 'text-red-400'}`}>
          {score >= 0 ? '+' : ''}{score} eco-pts
        </div>
      </div>

      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-ocean-400 to-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${((current) / scenarios.length) * 100}%` }} />
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-ocean-500/25 flex items-center justify-center flex-shrink-0">
            <Brain size={20} className="text-ocean-300" />
          </div>
          <div>
            <p className="text-ocean-300 text-xs font-medium uppercase tracking-wider mb-1">{s.title}</p>
            <p className="text-white font-display text-lg leading-snug">{s.scenario}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {s.choices.map((choice, i) => {
          let style = 'glass border border-white/10 text-white hover:bg-white/10 hover:border-ocean-400/40 cursor-pointer text-left'
          if (selected !== null) {
            if (choice.correct) style = 'bg-teal-500/20 border border-teal-400/50 text-teal-200'
            else if (i === selected && !choice.correct) style = 'bg-red-500/20 border border-red-400/50 text-red-300'
            else style = 'glass border border-white/5 text-white/30'
          }
          return (
            <button key={i} onClick={() => handleChoice(i)} disabled={selected !== null}
              className={`rounded-xl px-5 py-4 transition-all duration-300 flex items-start gap-3 ${style}`}>
              <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-mono flex-shrink-0 mt-0.5">
                {LETTERS[i]}
              </span>
              <span className="text-sm leading-relaxed flex-1">{choice.text}</span>
              {selected !== null && choice.correct && <CheckCircle size={16} className="text-teal-400 flex-shrink-0 mt-0.5" />}
              {selected !== null && i === selected && !choice.correct && <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className={`rounded-2xl p-4 border text-sm leading-relaxed animate-slide-up ${
          s.choices[selected].correct
            ? 'bg-teal-500/10 border-teal-500/30 text-teal-100'
            : s.choices[selected].pts > 0
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-100'
              : 'bg-red-500/10 border-red-500/30 text-red-100'
        }`}>
          {s.choices[selected].result}
          <span className="ml-2 font-bold">
            {s.choices[selected].pts >= 0 ? '+' : ''}{s.choices[selected].pts} pts
          </span>
        </div>
      )}
    </div>
  )
}