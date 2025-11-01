import { FormEvent, useState, useEffect } from 'react'
import { validateEmail, validateName, validateRequired } from '../utils/validation'
import { sanitizeInput, sanitizeEmail } from '../utils/sanitize'
import { useToast } from '../ui/ToastContext'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; message: boolean }>({ name: false, email: false, message: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { show } = useToast()

  useEffect(() => { document.title = 'Contact — C¥BRD' }, [])

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {}
    const nameResult = validateName(name)
    if (!nameResult.valid) newErrors.name = nameResult.error
    const emailResult = validateEmail(email)
    if (!emailResult.valid) newErrors.email = emailResult.error
    const messageResult = validateRequired(message, 'Message')
    if (!messageResult.valid) newErrors.message = messageResult.error
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field: 'name' | 'email' | 'message') => {
    setTouched({ ...touched, [field]: true })
    validate()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setTouched({ name: true, email: true, message: true })
      return
    }
    setIsSubmitting(true)
    try {
      // In production, send to API
      const sanitizedName = sanitizeInput(name)
      const sanitizedEmail = sanitizeEmail(email)
      const sanitizedMessage = sanitizeInput(message)
      console.log('[CONTACT]', { name: sanitizedName, email: sanitizedEmail, message: sanitizedMessage })
      show('Message sent! We\'ll get back to you soon.', 'success')
      setName('')
      setEmail('')
      setMessage('')
      setTouched({ name: false, email: false, message: false })
    } catch (err: any) {
      show('Failed to send message. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-6">Contact</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input 
            value={name} 
            onChange={(e) => { setName(e.target.value); if (touched.name) validate() }}
            onBlur={() => handleBlur('name')}
            placeholder="Name" 
            className={`w-full bg-transparent border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon/50 ${
              errors.name && touched.name ? 'border-red-500/50' : 'border-white/10 focus:border-neon'
            }`}
            disabled={isSubmitting}
          />
          {errors.name && touched.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
        </div>
        <div>
          <input 
            value={email} 
            onChange={(e) => { setEmail(e.target.value); if (touched.email) validate() }}
            onBlur={() => handleBlur('email')}
            placeholder="Email" 
            type="email"
            className={`w-full bg-transparent border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon/50 ${
              errors.email && touched.email ? 'border-red-500/50' : 'border-white/10 focus:border-neon'
            }`}
            disabled={isSubmitting}
          />
          {errors.email && touched.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
        </div>
        <div>
          <textarea 
            value={message} 
            onChange={(e) => { setMessage(e.target.value); if (touched.message) validate() }}
            onBlur={() => handleBlur('message')}
            rows={5} 
            placeholder="Message" 
            className={`w-full bg-transparent border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon/50 ${
              errors.message && touched.message ? 'border-red-500/50' : 'border-white/10 focus:border-neon'
            }`}
            disabled={isSubmitting}
          />
          {errors.message && touched.message && <div className="text-red-400 text-xs mt-1">{errors.message}</div>}
        </div>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-md bg-neon text-black font-semibold hover:shadow-glowStrong disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}


