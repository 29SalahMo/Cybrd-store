import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function OrderConfirmation() {
  useEffect(() => { document.title = 'Order Confirmed — C¥BRD' }, [])
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-4xl">Thank you</h1>
      <p className="mt-3 text-bone/80">Your order has been placed. We sent a confirmation email and will update you when it ships.</p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link to="/shop" className="px-6 py-3 rounded-md bg-neon text-black font-semibold">Continue Shopping</Link>
        <Link to="/" className="px-6 py-3 rounded-md border border-white/15">Home</Link>
      </div>
    </div>
  )
}


