import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { ShoppingBag, Star, Lock, Check, Loader, Plus, X, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'

function ShopItem({ item, userPoints, onRedeem, loading }) {
  const canAfford = userPoints >= item.points_cost
  const [redeemed, setRedeemed] = useState(false)

  const handleRedeem = async () => {
    if (!canAfford || loading) return
    await onRedeem(item)
    setRedeemed(true)
    setTimeout(() => setRedeemed(false), 3000)
  }

  return (
    <div className={`card group flex flex-col overflow-hidden hover:scale-[1.02] transition-all ${!canAfford ? 'opacity-70' : ''}`}>
      {item.image_url ? (
        <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover rounded-xl mb-4" />
      ) : (
        <div className="w-full h-40 bg-ocean-800/60 rounded-xl mb-4 flex items-center justify-center border border-white/10">
          <ShoppingBag size={36} className="text-ocean-400/40" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display font-semibold text-white text-lg">{item.name}</h3>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/15 text-yellow-300 text-sm font-mono font-bold flex-shrink-0">
          <Star size={12} />
          {item.points_cost}
        </span>
      </div>

      <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">{item.description}</p>

      {item.stock !== null && (
        <p className="text-xs text-white/30 mb-3">{item.stock} remaining in stock</p>
      )}

      <button
        onClick={handleRedeem}
        disabled={!canAfford || loading || item.stock === 0}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
          canAfford && item.stock !== 0
            ? redeemed
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              : 'btn-teal'
            : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
        }`}
      >
        {redeemed ? (
          <><Check size={14} />Redeemed!</>
        ) : !canAfford ? (
          <><Lock size={14} />Need {item.points_cost - userPoints} more points</>
        ) : item.stock === 0 ? (
          'Out of Stock'
        ) : loading ? (
          <><Loader size={14} className="animate-spin" />Processing...</>
        ) : (
          <><ShoppingBag size={14} />Redeem for {item.points_cost} pts</>
        )}
      </button>
    </div>
  )
}

export default function Shop() {
  const { user, profile, refreshProfile } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [redeemLoading, setRedeemLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')
  const categories = ['all', 'voucher', 'merchandise', 'service', 'donation']

  const fetchItems = async () => {
    const { data } = await supabase.from('shop_items').select('*').eq('available', true).order('points_cost')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const handleRedeem = async (item) => {
    if (!user) return
    setRedeemLoading(true)
    try {
      const { error } = await supabase.from('redemptions').insert({
        user_id: user.id,
        item_id: item.id,
        points_spent: item.points_cost,
      })
      if (error) throw error

      // Deduct points
      await supabase.rpc('decrement_user_points', {
        user_id_param: user.id,
        points_param: item.points_cost
      })

      // Decrement stock
      if (item.stock !== null) {
        await supabase.from('shop_items').update({ stock: item.stock - 1 }).eq('id', item.id)
      }

      refreshProfile()
      fetchItems()
      setMessage(`🎉 Successfully redeemed "${item.name}"!`)
      setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      setMessage(`❌ ${err.message}`)
      setTimeout(() => setMessage(''), 4000)
    }
    setRedeemLoading(false)
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-5">
            <ShoppingBag size={14} className="text-ocean-300" />
            <span className="text-ocean-200 text-sm">Rewards Store</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Spend Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-ocean-300">Points</span>
          </h1>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Redeem the points you've earned from water problem reporting for real rewards
          </p>

          {user && profile && (
            <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-2xl mt-6">
              <Star size={18} className="text-yellow-400" />
              <div>
                <span className="text-white font-display font-bold text-2xl">{profile.points ?? 0}</span>
                <span className="text-white/60 text-sm ml-1">points available</span>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div className="glass-light border border-teal-500/30 rounded-xl px-6 py-4 text-center text-teal-200 mb-8 text-sm">
            {message}
          </div>
        )}

        {!user && (
          <div className="card text-center py-10 mb-8">
            <Lock size={36} className="text-white/30 mx-auto mb-3" />
            <p className="text-white/50 mb-4">Login to redeem items with your points</p>
            <Link to="/login" className="btn-primary inline-flex">Login to Shop</Link>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === cat ? 'bg-ocean-500 text-white' : 'glass text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size={32} className="text-ocean-300 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-20">
            <ShoppingBag size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/30 font-display text-2xl">No items available</p>
            <p className="text-white/20 text-sm mt-2">Check back later for new rewards</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <ShopItem
                key={item.id}
                item={item}
                userPoints={profile?.points ?? 0}
                onRedeem={handleRedeem}
                loading={redeemLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
