import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { logEvent } from '../analytics/analytics'
import { useFocusTrap } from '../utils/useFocusTrap'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function MiniCart({ isOpen, onClose }: Props) {
  const { items, subtotal, remove, setQuantity } = useCart()
  const navigate = useNavigate()
  const cartRef = useRef<HTMLDivElement>(null)
  
  useFocusTrap(cartRef, isOpen)

  useEffect(() => {
    if (isOpen) {
      logEvent('cart_open', { itemCount: items.length })
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, items.length])
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
    logEvent('begin_checkout', { itemCount: items.length, subtotal })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60"
          />
          <motion.div
            ref={cartRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass border-l border-white/10 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 id="cart-title" className="font-display text-xl">Cart ({items.length})</h2>
                <button
                  onClick={onClose}
                  aria-label="Close cart"
                  className="p-2 hover:bg-white/10 rounded-md transition focus:outline-none focus:ring-2 focus:ring-neon"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-bone/70">
                    <p className="mb-4">Your cart is empty</p>
                    <Link to="/shop" onClick={onClose} className="text-neon underline">
                      Start shopping
                    </Link>
                  </div>
                ) : (
                  items.map((i) => (
                    <div key={`${i.id}-${i.size}-${i.color || 'na'}`} className="flex gap-3 p-3 glass rounded-lg border border-white/10">
                      <img src={i.image} alt={i.name} className="w-16 h-20 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{i.name}</div>
                        <div className="text-xs text-bone/70">{i.size}{i.color ? ` • ${i.color}` : ''}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={i.quantity}
                            onChange={(e) => setQuantity(i.id, i.size, i.color, Math.max(1, Number(e.target.value) || 1))}
                            className="w-12 px-2 py-1 text-xs rounded bg-black/40 border border-white/15"
                          />
                          <button
                            onClick={() => remove(i.id, i.size, i.color)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-neon font-semibold text-sm">{i.price}</div>
                    </div>
                  ))
                )}
              </div>
              {items.length > 0 && (
                <div className="p-4 border-t border-white/10 space-y-3">
                  <div className="flex justify-between text-bone/80">
                    <span>Subtotal</span>
                    <span className="font-semibold">{subtotal.toFixed(2)} LE</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full px-4 py-3 rounded-md bg-neon text-black font-bold hover:shadow-glowStrong"
                  >
                    Checkout
                  </button>
                  <Link to="/cart" onClick={onClose} className="block text-center text-sm text-bone/70 hover:text-bone">
                    View full cart
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

