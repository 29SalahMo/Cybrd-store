import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import Meta from '../seo/Meta'
import { useEffect } from 'react'

export default function Cart() {
  const { items, subtotal, setQuantity, remove, clear } = useCart()
  const navigate = useNavigate()
  const hasItems = items.length > 0
  useEffect(() => { document.title = 'Cart — C¥BRD' }, [])
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Meta title="Cart — C¥BRD" description="Your selected items." />
      <h1 className="font-display text-3xl mb-6">Cart</h1>
      {!hasItems ? (
        <div className="glass border border-white/10 rounded-xl p-6 flex items-center justify-between">
          <div className="text-bone/70">Your cart is empty.</div>
          <Link to="/shop" className="px-5 py-2 rounded-md bg-magenta font-semibold hover:shadow-glowStrong">Start shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass border border-white/10 rounded-xl divide-y divide-white/10">
            {items.map((i) => (
              <div key={`${i.id}-${i.size}-${i.color || 'na'}`} className="p-4 flex items-center gap-4">
                <img src={i.image} alt={i.name} className="w-20 h-24 object-cover rounded-md bg-black/40" />
                <div className="flex-1">
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-sm text-bone/70">{i.price} • Size {i.size}{i.color ? ` • ${i.color}` : ''}</div>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="text-sm text-bone/60">Qty</label>
                    <input type="number" min={1} value={i.quantity} onChange={(e)=>setQuantity(i.id, i.size, i.color, Math.max(1, Number(e.target.value)||1))} className="w-20 px-3 py-1.5 rounded-md bg-black/40 border border-white/15" />
                    <button onClick={() => remove(i.id, i.size, i.color)} className="text-sm text-red-400 hover:text-red-300">Remove</button>
                  </div>
                </div>
                <div className="text-neon font-semibold whitespace-nowrap">{i.price}</div>
              </div>
            ))}
          </div>
          <div className="glass border border-white/10 rounded-xl p-5 h-fit">
            <div className="space-y-2 border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center justify-between text-bone/80">
                <div>Subtotal</div>
                <div className="font-semibold">{subtotal.toFixed(2)} LE</div>
              </div>
              <div className="flex items-center justify-between text-bone/60 text-sm">
                <div>Shipping</div>
                <div className="text-bone/50">Calculated at checkout</div>
              </div>
              <div className="flex items-center justify-between text-bone/60 text-sm">
                <div>Tax</div>
                <div className="text-bone/50">Calculated at checkout</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold text-bone mb-4">
              <div>Estimated Total</div>
              <div className="text-neon">{subtotal.toFixed(2)} LE</div>
            </div>
            <button onClick={()=>navigate('/checkout')} className="mt-4 w-full px-5 py-3 rounded-md bg-neon text-black font-bold hover:shadow-glowStrong">Proceed to Checkout</button>
            <button onClick={clear} className="mt-2 w-full px-5 py-2 rounded-md border border-white/15 hover:border-magenta">Clear Cart</button>
            <Link to="/shop" className="mt-3 block text-center text-sm text-bone/70 hover:text-bone">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  )
}


