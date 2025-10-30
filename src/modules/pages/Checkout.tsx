import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../cart/CartContext'
import { useAuth } from '../auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

type PaymentMethod = 'paypal' | 'instapay' | 'vodafone' | 'visa'

function usePaypal(clientId?: string) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!clientId) return
    const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture`
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => setReady(true)
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [clientId])
  return ready
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [method, setMethod] = useState<PaymentMethod>('paypal')
  const [note, setNote] = useState('')
  const [refId, setRefId] = useState('')

  useEffect(() => { document.title = 'Checkout — C¥BRD' }, [])

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const clientId = (import.meta as any).env?.VITE_PAYPAL_CLIENT_ID as string | undefined
  const paypalReady = usePaypal(clientId)

  const total = useMemo(() => subtotal, [subtotal])

  const placeManualOrder = () => {
    // For manual payments, we accept a transfer reference and "confirm" the order
    if (!refId.trim()) return alert('Enter transaction reference ID')
    clear()
    alert('Thank you! We will verify your payment and contact you shortly.')
    navigate('/')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-6">Checkout</h1>
      {items.length === 0 ? (
        <div className="glass border border-white/10 rounded-xl p-6">Your cart is empty. <Link to="/shop" className="text-neon">Continue shopping</Link></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass border border-white/10 rounded-xl p-5">
              <div className="font-semibold mb-3">Contact</div>
              <div className="text-sm text-bone/70">{user?.email}</div>
            </div>
            <div className="glass border border-white/10 rounded-xl p-5">
              <div className="font-semibold mb-3">Payment</div>
              <div className="flex flex-col gap-2">
                <label className={`border rounded-md p-3 cursor-pointer ${method==='paypal'?'border-neon':'border-white/15'}`}>
                  <input type="radio" name="pm" className="mr-2" checked={method==='paypal'} onChange={()=>setMethod('paypal')} />
                  PayPal
                </label>
                <label className={`border rounded-md p-3 cursor-pointer ${method==='instapay'?'border-neon':'border-white/15'}`}>
                  <input type="radio" name="pm" className="mr-2" checked={method==='instapay'} onChange={()=>setMethod('instapay')} />
                  Instapay (manual transfer)
                </label>
                <label className={`border rounded-md p-3 cursor-pointer ${method==='vodafone'?'border-neon':'border-white/15'}`}>
                  <input type="radio" name="pm" className="mr-2" checked={method==='vodafone'} onChange={()=>setMethod('vodafone')} />
                  Vodafone Cash (manual transfer)
                </label>
                <label className={`border rounded-md p-3 cursor-pointer ${method==='visa'?'border-neon':'border-white/15'}`}>
                  <input type="radio" name="pm" className="mr-2" checked={method==='visa'} onChange={()=>setMethod('visa')} />
                  Visa / Card (coming soon)
                </label>
              </div>
            </div>

            {method === 'paypal' && (
              <div className="glass border border-white/10 rounded-xl p-5">
                <div className="font-semibold mb-3">Pay with PayPal</div>
                {!clientId ? (
                  <div className="text-sm text-bone/70">Set <code>VITE_PAYPAL_CLIENT_ID</code> in your env to enable live PayPal buttons.</div>
                ) : !paypalReady ? (
                  <div className="text-sm text-bone/70">Loading PayPal…</div>
                ) : (
                  <div id="paypal-buttons-container"></div>
                )}
                <div className="text-xs text-bone/50 mt-2">Amount: {total.toFixed(2)} LE (displayed; USD capture on PayPal account setup)</div>
              </div>
            )}

            {(method === 'instapay' || method === 'vodafone') && (
              <div className="glass border border-white/10 rounded-xl p-5">
                <div className="font-semibold mb-3">Transfer details</div>
                <div className="text-sm text-bone/80 mb-2">Send the total to:</div>
                {method==='instapay' && (
                  <div className="text-sm">
                    <div>Instapay ID: <span className="font-semibold">cbrd@bank</span></div>
                  </div>
                )}
                {method==='vodafone' && (
                  <div className="text-sm">
                    <div>Vodafone Cash: <span className="font-semibold">0100 000 0000</span></div>
                  </div>
                )}
                <div className="mt-3 text-sm text-bone/70">After sending, enter your transaction reference below.</div>
                <input value={refId} onChange={(e)=>setRefId(e.target.value)} placeholder="Transaction reference ID" className="mt-2 w-full px-4 py-2 rounded-md bg-black/40 border border-white/15" />
                <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Notes (optional)" className="mt-2 w-full px-4 py-2 rounded-md bg-black/40 border border-white/15" />
                <button onClick={placeManualOrder} className="mt-3 px-5 py-2 rounded-md bg-neon text-black font-bold">Place Order</button>
                <div className="text-xs text-bone/50 mt-2">We will verify the payment and confirm your order via email.</div>
              </div>
            )}
          </div>
          <div className="glass border border-white/10 rounded-xl p-5 h-fit">
            <div className="font-semibold mb-3">Order Summary</div>
            <div className="divide-y divide-white/10">
              {items.map(i => (
                <div key={`${i.id}-${i.size}-${i.color || 'na'}`} className="py-3 flex items-center gap-3">
                  <img src={i.image} className="w-14 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{i.name}</div>
                    <div className="text-xs text-bone/60">{i.price} • {i.quantity} × {i.size}{i.color?` • ${i.color}`:''}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-bone/80">
              <div>Subtotal</div>
              <div className="font-semibold">{total.toFixed(2)} LE</div>
            </div>
            <div className="text-xs text-bone/50">Taxes and shipping calculated at fulfillment.</div>
          </div>
        </div>
      )}
    </div>
  )
}


