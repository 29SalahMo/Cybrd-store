import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../ui/ToastContext'
import { useNavigate, Link } from 'react-router-dom'
import { validateEmail, validatePassword } from '../utils/validation'
import { sanitizeEmail, sanitizeInput } from '../utils/sanitize'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({ email: false, password: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { show } = useToast()
  useEffect(() => { document.title = 'Login — C¥BRD' }, [])

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    const emailResult = validateEmail(email)
    if (!emailResult.valid) newErrors.email = emailResult.error
    const passwordResult = validatePassword(password)
    if (!passwordResult.valid) newErrors.password = passwordResult.error
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field: 'email' | 'password') => {
    setTouched({ ...touched, [field]: true })
    validate()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) {
      setTouched({ email: true, password: true })
      return
    }
    setIsSubmitting(true)
    try {
      const sanitizedEmail = sanitizeEmail(email)
      const sanitizedPassword = sanitizeInput(password)
      await login(sanitizedEmail, sanitizedPassword)
      show('Logged in', 'success')
      navigate('/checkout')
    } catch (err: any) {
      setError(err?.message || 'Failed to login')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-6">Login</h1>
      <form onSubmit={onSubmit} className="glass border border-white/10 rounded-xl p-6 space-y-4">
        {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded p-2">{error}</div>}
        <div>
          <input 
            value={email} 
            onChange={(e) => { setEmail(e.target.value); if (touched.email) validate() }}
            onBlur={() => handleBlur('email')}
            placeholder="Email" 
            type="email" 
            className={`w-full px-4 py-2 rounded-md bg-black/40 border ${
              errors.email && touched.email ? 'border-red-500/50' : 'border-white/15'
            } focus:outline-none focus:ring-2 focus:ring-neon/50`}
            disabled={isSubmitting}
          />
          {errors.email && touched.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
        </div>
        <div>
          <input 
            value={password} 
            onChange={(e) => { setPassword(e.target.value); if (touched.password) validate() }}
            onBlur={() => handleBlur('password')}
            placeholder="Password" 
            type="password" 
            className={`w-full px-4 py-2 rounded-md bg-black/40 border ${
              errors.password && touched.password ? 'border-red-500/50' : 'border-white/15'
            } focus:outline-none focus:ring-2 focus:ring-neon/50`}
            disabled={isSubmitting}
          />
          {errors.password && touched.password && <div className="text-red-400 text-xs mt-1">{errors.password}</div>}
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full px-4 py-2 rounded-md bg-neon text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon/90 transition"
        >
          {isSubmitting ? 'Logging in...' : 'Continue'}
        </button>
        <div className="text-sm text-bone/70">No account? <Link to="/signup" className="text-neon hover:underline">Sign up</Link></div>
      </form>
    </div>
  )
}


