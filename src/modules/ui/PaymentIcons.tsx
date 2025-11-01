import { motion } from 'framer-motion'

type PaymentMethod = 'paypal' | 'instapay' | 'vodafone' | 'visa' | 'cod'

interface PaymentIconProps {
  method: PaymentMethod
  className?: string
  size?: number
}

export function PaymentIcon({ method, className = '', size = 32 }: PaymentIconProps) {
  const iconClass = `inline-block ${className}`

  switch (method) {
    case 'paypal':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={iconClass} aria-hidden="true">
          <rect width="32" height="32" rx="4" fill="#003087" />
          <path d="M12.5 10.5c-.2 1.5-.8 2.8-1.8 3.8-1 1-2.3 1.5-3.9 1.5H5.5v2.5h1.3c.5 0 .9.4.9.9s-.4.9-.9.9H4.5c-.5 0-.9-.4-.9-.9V7.5c0-.5.4-.9.9-.9h4.8c1.6 0 2.9.5 3.9 1.5 1 1 1.6 2.3 1.8 3.8zM22.5 10.5c-.2 1.5-.8 2.8-1.8 3.8-1 1-2.3 1.5-3.9 1.5h-1.3v2.5h1.3c.5 0 .9.4.9.9s-.4.9-.9.9h-2.3c-.5 0-.9-.4-.9-.9V7.5c0-.5.4-.9.9-.9h4.8c1.6 0 2.9.5 3.9 1.5 1 1 1.6 2.3 1.8 3.8z" fill="#fff" />
          <path d="M8.5 8.5h-2c-.5 0-.9.4-.9.9v4.8c0 .5.4.9.9.9h2c.5 0 .9-.4.9-.9V9.4c0-.5-.4-.9-.9-.9zM18.5 8.5h-2c-.5 0-.9.4-.9.9v4.8c0 .5.4.9.9.9h2c.5 0 .9-.4.9-.9V9.4c0-.5-.4-.9-.9-.9z" fill="#009CDE" />
        </svg>
      )
    
    case 'visa':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={iconClass} aria-hidden="true">
          <rect width="32" height="32" rx="4" fill="#1434CB" />
          <path d="M13.5 12.5l-2.8 7h-2l2-5.2-1.2-1.8h-2L7.2 19.5h-2l1.4-7h2.4l-.9 4.5 1.1 1.8h1.8l1.5-6.3h2z" fill="#fff" />
          <path d="M18.5 12.5h-1.8l-1.7 7h1.8l.3-1h2.2l.2 1h1.6l-1.4-7zm-1.1 4.5l.7-1.8.2-.5.4 2.3h-1.3z" fill="#fff" />
          <path d="M24.5 12.5h-1.7c-.3 0-.5.2-.6.4l-2.9 6.6h2l.4-1h2.5l.2 1h1.5l-1.4-7zm-2.2 4.5l.9-2.4.5 1.2-.2.6h-1.2l.1.1.5.5h1.5l-.6-1z" fill="#fff" />
          <path d="M9.5 12.5H7.7l-1.4 7h1.8l1.4-7z" fill="#FAA61A" />
        </svg>
      )
    
    case 'vodafone':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={iconClass} aria-hidden="true">
          <rect width="32" height="32" rx="4" fill="#E60000" />
          <path d="M16 10c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 9c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="#fff" />
          <circle cx="16" cy="16" r="2" fill="#fff" />
          <path d="M13 13h6v6h-6v-6zm1 1v4h4v-4h-4z" fill="#E60000" />
        </svg>
      )
    
    case 'instapay':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={iconClass} aria-hidden="true">
          <rect width="32" height="32" rx="4" fill="#00A8E8" />
          <path d="M10 11h12c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H10c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2zm0 1c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-6c0-.6-.4-1-1-1H10z" fill="#fff" />
          <circle cx="16" cy="16" r="2.5" fill="#fff" />
          <path d="M14 14h4v4h-4v-4zm1 1v2h2v-2h-2z" fill="#00A8E8" />
        </svg>
      )
    
    case 'cod':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={iconClass} aria-hidden="true">
          <rect width="32" height="32" rx="4" fill="#666" />
          <circle cx="16" cy="16" r="6" fill="none" stroke="#fff" strokeWidth="1.5" />
          <path d="M12 16l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="9" y="22" width="14" height="2" rx="1" fill="#fff" />
        </svg>
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
      <PaymentIcon method={method} size={40} />
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

