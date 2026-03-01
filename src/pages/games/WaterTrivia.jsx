import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Zap, Brain } from 'lucide-react'

const ALL_QUESTIONS = [
  { q: "What percentage of Earth's water is freshwater?", options: ["3%","10%","25%","50%"], answer: 0, fact: "Only 3% of Earth's water is freshwater, and most of that is frozen in glaciers!" },
  { q: "How many liters of water does a person need daily for basic survival?", options: ["0.5L","2–3L","8L","15L"], answer: 1, fact: "Adults need around 2–3 liters per day, though more in hot climates or with physical activity." },
  { q: "Which country has the world's largest freshwater reserves?", options: ["USA","China","Brazil","Russia"], answer: 2, fact: "Brazil holds about 12% of the world's freshwater, largely in the Amazon basin." },
  { q: "What is the main cause of water pollution globally?", options: ["Industrial waste","Agricultural runoff","Plastic dumping","Oil spills"], answer: 1, fact: "Agricultural runoff (fertilizers & pesticides) is the largest source of water quality problems worldwide." },
  { q: "How long can a human survive without water?", options: ["1 day","3–5 days","2 weeks","1 month"], answer: 1, fact: "Humans can typically survive only 3–5 days without water, though this varies by environment." },
  { q: "What does 'pH 7' mean for water?", options: ["Acidic","Neutral","Basic","Contaminated"], answer: 1, fact: "pH 7 is perfectly neutral. Safe drinking water is typically between 6.5 and 8.5." },
  { q: "Which disease is most commonly spread through contaminated water?", options: ["Malaria","Cholera","Tuberculosis","Dengue"], answer: 1, fact: "Cholera is caused by Vibrio cholerae bacteria in contaminated water and kills thousands yearly." },
  { q: "How much water does it take to produce 1 kg of beef?", options: ["500L","2,000L","15,000L","50,000L"], answer: 2, fact: "Producing 1 kg of beef requires approximately 15,000 liters of water — a massive water footprint!" },
  { q: "What is 'greywater'?", options: ["Ocean water","Wastewater from sinks/showers","Polluted rainwater","Groundwater"], answer: 1, fact: "Greywater from sinks and showers can often be recycled for irrigation, saving significant water." },
  { q: "What percentage of the world lacks access to safe drinking water?", options: ["5%","10%","26%","50%"], answer: 2, fact: "About 2.2 billion people (26%) lack access to safely managed drinking water services." },
  { q: "Which ocean is the saltiest?", options: ["Pacific","Atlantic","Indian","Arctic"], answer: 1, fact: "The Atlantic Ocean is the saltiest of the major oceans with an average salinity of about 37 parts per thousand." },
  { q: "What causes acid rain?", options: ["CO2 emissions","SO2 and NOx emissions","Ozone depletion","Methane gas"], answer: 1, fact: "Sulfur dioxide (SO2) and nitrogen oxides (NOx) from burning fossil fuels mix with water vapor to form acid rain." },
  { q: "How does deforestation affect water cycles?", options: ["No effect","Increases rainfall","Reduces rainfall & increases runoff","Purifies water"], answer: 2, fact: "Trees regulate water cycles. Deforestation causes less transpiration, disrupting rainfall patterns and increasing flood risk." },
  { q: "What is the water table?", options: ["A special filter","The level where soil is fully saturated","Ocean surface level","Maximum reservoir capacity"], answer: 1, fact: "The water table is the upper surface of groundwater. When it drops, wells run dry." },
  { q: "Which household activity uses the most water?", options: ["Cooking","Drinking","Toilet flushing","Dishwashing"], answer: 2, fact: "Toilet flushing accounts for about 30% of household water use. Low-flow toilets save thousands of liters per year!" },
]

export default function WaterTrivia({ onExit, onScoreEarned }) {
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [showFact, setShowFact] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [timerActive, setTimerActive] = useState(true)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [answers, setAnswers] = useState([])

  const startGame = useCallback(() => {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10)
    setQuestions(shuffled)
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setShowFact(false)
    setGameOver(false)
    setTimeLeft(20)
    setTimerActive(true)
    setPointsEarned(0)
    setAnswers([])
  }, [])

  useEffect(() => { startGame() }, [startGame])

  useEffect(() => {
    if (!timerActive || selected !== null || gameOver) return
    if (timeLeft <= 0) {
      handleAnswer(-1)
      return
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, timerActive, selected, gameOver])

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    setTimerActive(false)
    setShowFact(true)

    const q = questions[current]
    const correct = idx === q.answer
    const timeBonus = correct ? Math.floor(timeLeft / 4) : 0
    const streakBonus = correct && streak >= 2 ? streak * 2 : 0
    const pts = correct ? 10 + timeBonus + streakBonus : 0

    const newStreak = correct ? streak + 1 : 0
    setStreak(newStreak)
    setMaxStreak(s => Math.max(s, newStreak))
    setScore(s => s + pts)
    setPointsEarned(p => p + pts)
    setAnswers(a => [...a, { correct, pts }])

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setGameOver(true)
        if (pts + score > 0) onScoreEarned?.(Math.floor((pts + score) / 10))
      } else {
        setCurrent(c => c + 1)
        setSelected(null)
        setShowFact(false)
        setTimeLeft(20)
        setTimerActive(true)
      }
    }, 2200)
  }

  if (!questions.length) return null

  if (gameOver) {
    const accuracy = Math.round((answers.filter(a => a.correct).length / questions.length) * 100)
    const pointsToAward = Math.floor(score / 10)
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-fade-in text-center px-4">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400/30 to-orange-500/20 border border-yellow-400/30 flex items-center justify-center">
          <Trophy size={44} className="text-yellow-300" />
        </div>
        <div>
          <h2 className="font-display text-4xl font-bold text-white mb-1">Quiz Complete!</h2>
          <p className="text-white/50">You answered {answers.filter(a=>a.correct).length} out of {questions.length} correctly</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {[
            { label: 'Score', value: score, color: 'text-yellow-300' },
            { label: 'Accuracy', value: `${accuracy}%`, color: 'text-teal-300' },
            { label: 'Best Streak', value: `×${maxStreak}`, color: 'text-orange-300' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass rounded-2xl p-4 text-center">
              <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-white/40 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
        {pointsToAward > 0 && (
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-500/15 border border-teal-500/30">
            <Zap size={16} className="text-teal-300" />
            <span className="text-teal-200 font-medium">+{pointsToAward} AquaPoints earned!</span>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={startGame} className="btn-teal flex items-center gap-2">
            <RotateCcw size={16} />Play Again
          </button>
          <button onClick={onExit} className="btn-secondary">Back to Hub</button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="glass px-3 py-1.5 rounded-full text-sm font-mono font-bold text-yellow-300">
            {score} pts
          </div>
          {streak >= 2 && (
            <div className="flex items-center gap-1 glass px-3 py-1.5 rounded-full">
              <Zap size={13} className="text-orange-400" />
              <span className="text-orange-300 text-sm font-bold">{streak}× streak!</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <span>{current + 1}</span><span>/</span><span>{questions.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-ocean-400 to-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }} />
      </div>

      {/* Timer */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${
            timeLeft > 10 ? 'bg-teal-400' : timeLeft > 5 ? 'bg-yellow-400' : 'bg-red-400'
          }`} style={{ width: `${(timeLeft / 20) * 100}%` }} />
        </div>
        <span className={`font-mono text-sm font-bold w-6 text-right ${
          timeLeft > 10 ? 'text-teal-300' : timeLeft > 5 ? 'text-yellow-400' : 'text-red-400'
        }`}>{timeLeft}</span>
      </div>

      {/* Question */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-ocean-500/30 flex items-center justify-center flex-shrink-0">
            <Brain size={16} className="text-ocean-300" />
          </div>
          <p className="text-white font-display text-xl leading-snug">{q.q}</p>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          let style = 'glass border-white/10 text-white hover:bg-white/10 hover:border-ocean-400/40 cursor-pointer'
          if (selected !== null) {
            if (i === q.answer) style = 'bg-teal-500/25 border-teal-400/60 text-teal-200'
            else if (i === selected && selected !== q.answer) style = 'bg-red-500/25 border-red-400/60 text-red-300'
            else style = 'glass border-white/5 text-white/40'
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
              className={`border rounded-xl px-5 py-3.5 text-left text-sm font-medium transition-all duration-300 flex items-center gap-3 ${style}`}>
              <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-mono flex-shrink-0">
                {['A','B','C','D'][i]}
              </span>
              {opt}
              {selected !== null && i === q.answer && <CheckCircle size={16} className="text-teal-400 ml-auto" />}
              {selected !== null && i === selected && selected !== q.answer && <XCircle size={16} className="text-red-400 ml-auto" />}
            </button>
          )
        })}
      </div>

      {/* Fact reveal */}
      {showFact && (
        <div className={`rounded-2xl p-4 border text-sm leading-relaxed animate-slide-up ${
          selected === q.answer
            ? 'bg-teal-500/10 border-teal-500/30 text-teal-100'
            : 'bg-red-500/10 border-red-500/30 text-red-100'
        }`}>
          <span className="font-bold">{selected === q.answer ? '✓ Correct! ' : '✗ Incorrect. '}</span>
          {q.fact}
        </div>
      )}
    </div>
  )
}
