import { motion } from 'framer-motion'

type PaymentMethod = 'paypal' | 'instapay' | 'vodafone' | 'visa' | 'cod'

interface PaymentIconProps {
  method: PaymentMethod
  className?: string
}

export function PaymentIcon({ method, className = '' }: PaymentIconProps) {
  switch (method) {
    case 'paypal':
      return (
        <img src="/images/social/paypal.png" alt="PayPal" className={`h-10 object-contain ${className}`} />
      )
    case 'instapay':
      return (
        <div className={`h-10 w-24 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center ${className}`}>
          <span className="text-white font-semibold text-sm">InstaPay</span>
        </div>
      )
    case 'vodafone':
      return (
        <img src="/images/social/vodafone.jpg" alt="Vodafone Cash" className={`h-10 w-24 object-cover rounded-lg border border-white/10 ${className}`} />
      )
    case 'visa':
      return (
        <div className={`h-10 w-20 rounded-lg bg-[#1434CB] flex items-center justify-center ${className}`}>
          <span className="text-white font-bold text-base">VISA</span>
        </div>
      )
    case 'cod':
      return (
        <div className={`h-8 w-16 rounded-lg bg-zinc-700/80 border border-white/10 flex items-center justify-center ${className}`}>
          <span className="text-xs font-semibold text-white">COD</span>
        </div>
      )
    default:
      return null
  }
}

interface PaymentMethodOptionProps {
  method: PaymentMethod
  isSelected: boolean
  onSelect: () => void
  label: string
  description?: string
  comingSoon?: boolean
}

export function PaymentMethodOption({
  method,
  isSelected,
  onSelect,
  label,
  description,
  comingSoon = false
}: PaymentMethodOptionProps) {
  return (
    <motion.label
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-neon bg-neon/10 shadow-lg shadow-neon/20'
          : 'border-white/15 bg-black/20 hover:border-neon/50'
      } ${comingSoon ? 'opacity-60' : ''}`}
    >
      <input
        type="radio"
        name="payment-method"
        className="sr-only"
        checked={isSelected}
        onChange={onSelect}
        disabled={comingSoon}
        aria-label={`Select ${label}`}
      />
      <PaymentIcon method={method} />
      <div className="flex-1">
        <div className="font-semibold text-bone flex items-center gap-2">
          {label}
          {comingSoon && (
            <span className="text-xs px-2 py-0.5 rounded bg-bone/20 text-bone/70">
              Coming Soon
            </span>
          )}
        </div>
        {description && (
          <div className="text-sm text-bone/60 mt-0.5">{description}</div>
        )}
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-neon border-2 border-neon flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-black" />
        </motion.div>
      )}
    </motion.label>
  )
}

