import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../ui/ToastContext'
import { useNavigate, Link } from 'react-router-dom'
import { validateEmail, validatePassword, validateName, getPasswordStrength } from '../utils/validation'
import { sanitizeEmail, sanitizeInput } from '../utils/sanitize'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; password: boolean }>({ name: false, email: false, password: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { show } = useToast()
  useEffect(() => { document.title = 'Sign up — C¥BRD' }, [])

  const passwordStrength = password ? getPasswordStrength(password) : null

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {}
    const nameResult = validateName(name)
    if (!nameResult.valid) newErrors.name = nameResult.error
    const emailResult = validateEmail(email)
    if (!emailResult.valid) newErrors.email = emailResult.error
    const passwordResult = validatePassword(password)
    if (!passwordResult.valid) newErrors.password = passwordResult.error
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field: 'name' | 'email' | 'password') => {
    setTouched({ ...touched, [field]: true })
    validate()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) {
      setTouched({ name: true, email: true, password: true })
      return
    }
    setIsSubmitting(true)
    try {
      const sanitizedName = sanitizeInput(name)
      const sanitizedEmail = sanitizeEmail(email)
      const sanitizedPassword = sanitizeInput(password)
      await signup(sanitizedEmail, sanitizedPassword, sanitizedName)
      show('Account created', 'success')
      navigate('/checkout')
    } catch (err: any) {
      setError(err?.message || 'Failed to sign up')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-6">Create account</h1>
      <form onSubmit={onSubmit} className="glass border border-white/10 rounded-xl p-6 space-y-4">
        {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded p-2">{error}</div>}
        <div>
          <input 
            value={name} 
            onChange={(e) => { setName(e.target.value); if (touched.name) validate() }}
            onBlur={() => handleBlur('name')}
            placeholder="Name" 
            className={`w-full px-4 py-2 rounded-md bg-black/40 border ${
              errors.name && touched.name ? 'border-red-500/50' : 'border-white/15'
            } focus:outline-none focus:ring-2 focus:ring-neon/50`}
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
          {password && passwordStrength && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                <div className={`h-1 flex-1 rounded ${
                  passwordStrength.strength === 'weak' ? 'bg-red-500' :
                  passwordStrength.strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className={`h-1 flex-1 rounded ${
                  passwordStrength.strength === 'weak' ? 'bg-black/20' :
                  passwordStrength.strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className={`h-1 flex-1 rounded ${
                  passwordStrength.strength === 'strong' ? 'bg-green-500' : 'bg-black/20'
                }`} />
              </div>
              <div className={`text-xs ${
                passwordStrength.strength === 'weak' ? 'text-red-400' :
                passwordStrength.strength === 'medium' ? 'text-yellow-400' : 'text-green-400'
              }`}>
                Password strength: {passwordStrength.strength}
              </div>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full px-4 py-2 rounded-md bg-neon text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon/90 transition"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
        <div className="text-sm text-bone/70">Have an account? <Link to="/login" className="text-neon hover:underline">Login</Link></div>
      </form>
    </div>
  )
}


