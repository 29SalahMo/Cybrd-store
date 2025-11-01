import { useEffect, useMemo, useState, useRef } from 'react'
import { useCart } from '../cart/CartContext'
import { useAuth } from '../auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../ui/ToastContext'
import Meta from '../seo/Meta'
import { logEvent } from '../analytics/analytics'
import { PaymentMethodOption } from '../ui/PaymentIcons'
import { validateName, validatePhone, validateRequired, validateEmail } from '../utils/validation'
import { sanitizeInput, sanitizeEmail } from '../utils/sanitize'
import { motion } from 'framer-motion'

type PaymentMethod = 'paypal' | 'instapay' | 'vodafone' | 'visa' | 'cod'

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

function usePaypal(clientId?: string, total?: number, onSuccess?: () => void) {
  const [ready, setReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!clientId || !containerRef.current) return
    
    const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture`
    const script = document.createElement('script')
    script.src = src
    script.async = true
    
    script.onload = () => {
      const paypal = (window as any).paypal
      if (paypal && containerRef.current) {
        try {
          paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: (total || 0).toFixed(2)
                  }
                }]
              })
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                try {
                  logEvent('purchase', { method: 'paypal', items: 0, total })
                } catch {}
                if (onSuccess) onSuccess()
              })
            },
            onError: (err: any) => {
              console.error('PayPal error:', err)
            }
          }).render(containerRef.current)
          setReady(true)
        } catch (err) {
          console.error('PayPal render error:', err)
        }
      }
    }
    
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [clientId, total, onSuccess])
  
  return { ready, containerRef }
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  const [method, setMethod] = useState<PaymentMethod>('paypal')
  const [note, setNote] = useState('')
  const [refId, setRefId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Egypt'
  })
  
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { document.title = 'Checkout — C¥BRD' }, [])

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const clientId = (import.meta as any).env?.VITE_PAYPAL_CLIENT_ID as string | undefined
  const total = useMemo(() => subtotal, [subtotal])
  
  const handlePaypalSuccess = () => {
    clear()
    show('Payment successful! Order placed.', 'success')
    navigate('/order-confirmation')
  }
  
  const { ready: paypalReady, containerRef: paypalContainerRef } = usePaypal(clientId, total, handlePaypalSuccess)
  useEffect(() => {
    if (items.length > 0) {
      try { logEvent('begin_checkout', { items: items.length, total }) } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateShipping = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    const nameResult = validateName(shipping.fullName)
    if (!nameResult.valid) newErrors.fullName = nameResult.error || ''
    
    const phoneResult = validatePhone(shipping.phone)
    if (!phoneResult.valid) newErrors.phone = phoneResult.error || ''
    
    const addressResult = validateRequired(shipping.address, 'Address')
    if (!addressResult.valid) newErrors.address = addressResult.error || ''
    
    const cityResult = validateRequired(shipping.city, 'City')
    if (!cityResult.valid) newErrors.city = cityResult.error || ''
    
    const postalResult = validateRequired(shipping.postalCode, 'Postal code')
    if (!postalResult.valid) newErrors.postalCode = postalResult.error || ''
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    const sanitized = field === 'fullName' || field === 'address' || field === 'city' 
      ? sanitizeInput(value) 
      : value
    setShipping(prev => ({ ...prev, [field]: sanitized }))
    if (touched[field] && errors[field]) {
      const result = field === 'fullName' 
        ? validateName(sanitized)
        : field === 'phone'
        ? validatePhone(sanitized)
        : validateRequired(sanitized, field)
      setErrors(prev => ({ ...prev, [field]: result.valid ? '' : (result.error || '') }))
    }
  }

  const placeManualOrder = async () => {
    setTouched({
      fullName: true, phone: true, address: true, city: true, postalCode: true, refId: true
    })
    
    if (!validateShipping()) {
      show('Please fill in all required shipping fields', 'error')
      return
    }
    
    if (!refId.trim()) {
      setErrors(prev => ({ ...prev, refId: 'Transaction reference ID is required' }))
      show('Please enter your transaction reference ID', 'error')
      return
    }
    
    setIsSubmitting(true)
    try {
      clear()
      console.log('[ORDER]', { method, refId: sanitizeInput(refId), note: sanitizeInput(note), shipping, items, total })
      logEvent('purchase', { method, items: items.length, total })
      show('Order placed successfully', 'success')
      navigate('/order-confirmation')
    } catch (err) {
      show('Failed to place order. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const placeCodOrder = async () => {
    setTouched({
      fullName: true, phone: true, address: true, city: true, postalCode: true
    })
    
    if (!validateShipping()) {
      show('Please fill in all required shipping fields', 'error')
      return
    }
    
    setIsSubmitting(true)
    try {
      clear()
      console.log('[ORDER]', { method: 'cod', shipping, items, total })
      logEvent('purchase', { method: 'cod', items: items.length, total })
      show('Order placed successfully (Cash on Delivery)', 'success')
      navigate('/order-confirmation')
    } catch (err) {
      show('Failed to place order. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <Meta title="Checkout — C¥BRD" description="Secure checkout for your order." />
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl mb-2">Checkout</h1>
        <div className="flex items-center gap-4 text-sm text-bone/60">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure Checkout
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            SSL Encrypted
          </span>
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="glass border border-white/10 rounded-xl p-8 text-center">
          <p className="text-bone/70 mb-4">Your cart is empty.</p>
          <Link to="/shop" className="text-neon hover:underline font-semibold">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Shipping */}
            <div className="glass border border-white/10 rounded-xl p-6">
              <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact & Shipping Information
              </h2>
              
              <div className="mb-4 p-3 rounded-md bg-black/30 border border-white/10">
                <div className="text-xs text-bone/60 mb-1">Email</div>
                <div className="text-sm text-bone">{user?.email}</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-bone/80 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={shipping.fullName}
                    onChange={(e) => handleShippingChange('fullName', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
                    className={`w-full px-4 py-2.5 rounded-md bg-black/40 border ${
                      errors.fullName ? 'border-red-500' : 'border-white/15'
                    } text-bone focus:outline-none focus:ring-2 focus:ring-neon/50`}
                    placeholder="Enter your full name"
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-bone/80 mb-1">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => handleShippingChange('phone', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    className={`w-full px-4 py-2.5 rounded-md bg-black/40 border ${
                      errors.phone ? 'border-red-500' : 'border-white/15'
                    } text-bone focus:outline-none focus:ring-2 focus:ring-neon/50`}
                    placeholder="01X XXX XXXX"
                  />
                  {touched.phone && errors.phone && (
                    <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-bone/80 mb-1">
                    Street Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={shipping.address}
                    onChange={(e) => handleShippingChange('address', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
                    className={`w-full px-4 py-2.5 rounded-md bg-black/40 border ${
                      errors.address ? 'border-red-500' : 'border-white/15'
                    } text-bone focus:outline-none focus:ring-2 focus:ring-neon/50`}
                    placeholder="Street address, apartment, suite, etc."
                  />
                  {touched.address && errors.address && (
                    <p className="mt-1 text-xs text-red-400">{errors.address}</p>
                  )}
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-bone/80 mb-1">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={shipping.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, city: true }))}
                      className={`w-full px-4 py-2.5 rounded-md bg-black/40 border ${
                        errors.city ? 'border-red-500' : 'border-white/15'
                      } text-bone focus:outline-none focus:ring-2 focus:ring-neon/50`}
                      placeholder="City"
                    />
                    {touched.city && errors.city && (
                      <p className="mt-1 text-xs text-red-400">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-bone/80 mb-1">
                      Postal Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      value={shipping.postalCode}
                      onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, postalCode: true }))}
                      className={`w-full px-4 py-2.5 rounded-md bg-black/40 border ${
                        errors.postalCode ? 'border-red-500' : 'border-white/15'
                      } text-bone focus:outline-none focus:ring-2 focus:ring-neon/50`}
                      placeholder="12345"
                    />
                    {touched.postalCode && errors.postalCode && (
                      <p className="mt-1 text-xs text-red-400">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-bone/80 mb-1">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={shipping.country}
                    onChange={(e) => handleShippingChange('country', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md bg-black/40 border border-white/15 text-bone focus:outline-none focus:ring-2 focus:ring-neon/50"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="glass border border-white/10 rounded-xl p-6">
              <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment Method
              </h2>
              <div className="space-y-3">
                <PaymentMethodOption
                  method="paypal"
                  isSelected={method === 'paypal'}
                  onSelect={() => setMethod('paypal')}
                  label="PayPal"
                  description="Pay securely with your PayPal account"
                />
                <PaymentMethodOption
                  method="instapay"
                  isSelected={method === 'instapay'}
                  onSelect={() => setMethod('instapay')}
                  label="Instapay"
                  description="Instant bank transfer via Instapay"
                />
                <PaymentMethodOption
                  method="vodafone"
                  isSelected={method === 'vodafone'}
                  onSelect={() => setMethod('vodafone')}
                  label="Vodafone Cash"
                  description="Mobile wallet payment"
                />
                <PaymentMethodOption
                  method="visa"
                  isSelected={method === 'visa'}
                  onSelect={() => setMethod('visa')}
                  label="Credit/Debit Card"
                  description="Visa, Mastercard, and more"
                  comingSoon={true}
                />
                <PaymentMethodOption
                  method="cod"
                  isSelected={method === 'cod'}
                  onSelect={() => setMethod('cod')}
                  label="Cash on Delivery"
                  description="Pay when your order arrives"
                />
              </div>
            </div>

            {/* Payment Details Section */}
            {method === 'paypal' && (
              <div className="glass border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Complete Payment with PayPal
                </h3>
                {!clientId ? (
                  <div className="p-4 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-sm text-bone/80">
                    <p className="mb-2">PayPal integration requires configuration.</p>
                    <p className="text-xs text-bone/60">Set <code className="px-1 py-0.5 rounded bg-black/30">VITE_PAYPAL_CLIENT_ID</code> in your environment variables to enable live PayPal buttons.</p>
                  </div>
                ) : !paypalReady ? (
                  <div className="flex items-center gap-3 p-4 rounded-md bg-black/30">
                    <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-bone/70">Loading PayPal...</span>
                  </div>
                ) : (
                  <div>
                    <div ref={paypalContainerRef} className="mb-4"></div>
                    <div className="text-xs text-bone/50 p-3 rounded-md bg-black/30">
                      Amount: <span className="font-semibold text-bone">{total.toFixed(2)} LE</span>
                      <span className="block mt-1">(Converted to USD at checkout)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(method === 'instapay' || method === 'vodafone') && (
              <div className="glass border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Transfer Instructions
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                    <div className="text-xs text-bone/60 mb-2">Send payment to:</div>
                    {method === 'instapay' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-bone">Instapay ID</div>
                          <div className="text-lg font-mono text-neon mt-1">cbrd@bank</div>
                        </div>
                      </div>
                    )}
                    {method === 'vodafone' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-bone">Vodafone Cash</div>
                          <div className="text-lg font-mono text-neon mt-1">0100 000 0000</div>
                        </div>
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="text-sm font-semibold text-bone">Amount to Send</div>
                      <div className="text-2xl font-bold text-neon mt-1">{total.toFixed(2)} LE</div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="refId" className="block text-sm font-medium text-bone/80 mb-1">
                      Transaction Reference ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="refId"
                      type="text"
                      value={refId}
                      onChange={(e) => {
                        setRefId(sanitizeInput(e.target.value))
                        if (touched.refId && errors.refId) {
                          setErrors(prev => ({ ...prev, refId: '' }))
                        }
                      }}
                      onBlur={() => setTouched(prev => ({ ...prev, refId: true }))}
                      className={`w-full px-4 py-2.5 rounded-md bg-black/40 border ${
                        errors.refId ? 'border-red-500' : 'border-white/15'
                      } text-bone focus:outline-none focus:ring-2 focus:ring-neon/50`}
                      placeholder="Enter transaction ID from your bank/mobile wallet"
                    />
                    {touched.refId && errors.refId && (
                      <p className="mt-1 text-xs text-red-400">{errors.refId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium text-bone/80 mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(sanitizeInput(e.target.value))}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-md bg-black/40 border border-white/15 text-bone focus:outline-none focus:ring-2 focus:ring-neon/50 resize-none"
                      placeholder="Special delivery instructions, gift message, etc."
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={placeManualOrder}
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 rounded-md bg-neon text-black font-bold hover:shadow-lg hover:shadow-neon/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </motion.button>
                  
                  <div className="flex items-start gap-2 text-xs text-bone/60">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>We will verify your payment and confirm your order via email within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}
            
            {method === 'cod' && (
              <div className="glass border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cash on Delivery
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                    <p className="text-sm text-bone/80 mb-3">
                      Pay in cash when your order arrives. Our delivery partner will collect the payment upon delivery.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-bone/60">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>We may contact you to confirm delivery details</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={placeCodOrder}
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 rounded-md bg-neon text-black font-bold hover:shadow-lg hover:shadow-neon/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </motion.button>
                </div>
              </div>
            )}
            
            {method === 'visa' && (
              <div className="glass border border-white/10 rounded-xl p-6">
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto mb-4 text-bone/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-lg mb-2">Credit/Debit Card Payment</h3>
                  <p className="text-sm text-bone/70">Card payments are coming soon. Please select another payment method for now.</p>
                </div>
              </div>
            )}
          </div>
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass border border-white/10 rounded-xl p-6 sticky top-4">
              <h2 className="font-semibold text-xl mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                {items.map(i => (
                  <div key={`${i.id}-${i.size}-${i.color || 'na'}`} className="flex items-start gap-3 pb-3 border-b border-white/10 last:border-0">
                    <img 
                      src={i.image} 
                      alt={i.name}
                      className="w-16 h-20 object-cover rounded-md flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-bone truncate">{i.name}</div>
                      <div className="text-xs text-bone/60 mt-1">
                        {i.size}
                        {i.color ? ` • ${i.color}` : ''}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-bone/60">Qty: {i.quantity}</div>
                        <div className="text-sm font-semibold text-bone">{i.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-bone/80">
                  <span>Subtotal</span>
                  <span className="font-semibold text-bone">{total.toFixed(2)} LE</span>
                </div>
                <div className="flex items-center justify-between text-sm text-bone/60">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between text-sm text-bone/60">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-lg font-bold text-bone">
                    <span>Total</span>
                    <span className="text-neon">{total.toFixed(2)} LE</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-start gap-2 text-xs text-bone/50">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p>Your payment information is secure and encrypted. We never store your card details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


