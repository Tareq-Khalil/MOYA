import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Minimize2, Maximize2 } from 'lucide-react'

const SYSTEM_PROMPT = `You are AquaBot, a friendly AI assistant for MOYA — a water problem reporting and management platform. 
You help users with:
- How to report water problems on the map
- Understanding the points and rewards system
- Water conservation tips and education
- How to use the platform features
- General water management information

Be concise, helpful, and encouraging. Use water-related metaphors occasionally. Keep responses short (2-4 sentences max unless detailed explanation is needed).`

export default function AICompanion() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m AquaBot💧! Your water management companion. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MOYA'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
            userMsg
          ],
          max_tokens: 300
        })
      })

      const data = await response.json()
      const aiMsg = data.choices?.[0]?.message?.content || 'I\'m having trouble connecting right now. Please try again!'
      setMessages(prev => [...prev, { role: 'assistant', content: aiMsg }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Please check your API key or try again later.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-ocean-500 hover:bg-ocean-400 shadow-2xl shadow-ocean-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <Bot size={24} className="text-white group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-400 animate-pulse border-2 border-ocean-900" />
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-80 sm:w-96'}`}>
          <div className="glass-light rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/20">
            {/* Header */}
            <div className="bg-ocean-700/50 px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-ocean-500/40 flex items-center justify-center">
                  <Bot size={16} className="text-ocean-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AquaBot</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <p className="text-xs text-teal-300">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  {isMinimized ? <Maximize2 size={14} className="text-white/60" /> : <Minimize2 size={14} className="text-white/60" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                  <X size={14} className="text-white/60 hover:text-red-400" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="h-72 overflow-y-auto p-4 flex flex-col gap-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-ocean-500/40 text-white rounded-tr-sm'
                          : 'glass text-white/90 rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-2 h-2 rounded-full bg-ocean-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask AquaBot..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-ocean-400/50 transition-colors"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading || !input.trim()}
                      className="w-10 h-10 rounded-xl bg-ocean-500 hover:bg-ocean-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Send size={15} className="text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
