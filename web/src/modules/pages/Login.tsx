import { FormEvent, useState, useEffect, useRef } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../ui/ToastContext'
import { useNavigate, Link } from 'react-router-dom'
import { validateEmail, validatePassword } from '../utils/validation'
import { sanitizeEmail, sanitizeInput } from '../utils/sanitize'

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:3000/api/v1'

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

  // Social SDKs
  const [googleLoading, setGoogleLoading] = useState(false)
  const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string | undefined
  const FACEBOOK_APP_ID = (import.meta as any).env?.VITE_FACEBOOK_APP_ID as string | undefined

  const triggerGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      // Check if Google SDK is loaded
      if (!(window as any).google) {
        // Load Google Identity Services
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
        
        await new Promise((resolve) => {
          script.onload = resolve
        })

        if (!GOOGLE_CLIENT_ID) {
          setError('Google login not configured')
          setGoogleLoading(false)
          return
        }

        await new Promise(resolve => setTimeout(resolve, 500))
      }

      if (!GOOGLE_CLIENT_ID) {
        setError('Google login not configured')
        setGoogleLoading(false)
        return
      }

      const google = (window as any).google
      if (google?.accounts?.oauth2) {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'openid email profile',
          callback: async (response: { access_token: string }) => {
            try {
              if (response.access_token) {
                const resp = await fetch(API_BASE + '/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ accessToken: response.access_token })
                })
                if (!resp.ok) throw new Error(await resp.text())
                const data = await resp.json()
                localStorage.setItem('auth_token', data.token)
                show('Logged in with Google', 'success')
                navigate('/checkout')
              } else {
                setError('Google login cancelled or failed')
              }
            } catch (e: any) {
              setError(e.message || 'Google login failed')
            } finally {
              setGoogleLoading(false)
            }
          }
        })
        client.requestAccessToken()
      } else {
        setError('Google SDK not loaded')
        setGoogleLoading(false)
      }
    } catch (error: any) {
      setError(error.message || 'Google login failed')
      setGoogleLoading(false)
    }
  }

  async function initFacebookAndLogin() {
    if (!FACEBOOK_APP_ID) {
      setError('Facebook App ID not configured')
      return
    }
    await new Promise<void>((resolve) => {
      if ((window as any).FB) return resolve()
      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.onload = () => resolve()
      document.body.appendChild(script)
    })
    const FB = (window as any).FB
    FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: false, version: 'v19.0' })
    FB.login(async (resp: any) => {
      try {
        if (!resp?.authResponse?.accessToken) throw new Error('Login cancelled')
        const accessToken = resp.authResponse.accessToken
        const r = await fetch(API_BASE + '/auth/facebook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken }) })
        if (!r.ok) throw new Error(await r.text())
        const data = await r.json()
        localStorage.setItem('auth_token', data.token)
        show('Logged in with Facebook', 'success')
        navigate('/checkout')
      } catch (e: any) {
        setError(e.message || 'Facebook login failed')
      }
    }, { scope: 'email' })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const provider = params.get('oauthSuccess')
    const token = params.get('token')
    if (provider && token) {
      localStorage.setItem('auth_token', token)
      show(`Logged in with ${provider}`, 'success')
      params.delete('oauthSuccess')
      params.delete('token')
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
      window.history.replaceState({}, '', newUrl)
      navigate('/checkout')
    }
  }, [navigate, show])

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

      {/* Social Logins */}
      <div className="mt-6 glass border border-white/10 rounded-xl p-6 space-y-4">
        <div className="text-sm text-bone/70">Or continue with</div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={triggerGoogleLogin}
            disabled={googleLoading}
            className="w-12 h-12 rounded-full border border-white/20 transition overflow-hidden hover:border-neon/60 hover:shadow-[0_0_12px_rgba(0,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Continue with Google"
          >
            {googleLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <img src="/images/social/google.png" alt="Google" className="w-full h-full object-cover" />
            )}
          </button>
          <button
            onClick={initFacebookAndLogin}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-neon/60 transition overflow-hidden hover:shadow-[0_0_12px_rgba(0,255,255,0.5)]"
            aria-label="Continue with Facebook"
          >
          <img src="/images/social/facebook.jpg" alt="Facebook" className="w-full h-full object-cover" />
          </button>
          <button
            onClick={() => {
              window.location.href = `${API_BASE}/auth/instagram/start`
            }}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-neon/60 transition overflow-hidden hover:shadow-[0_0_12px_rgba(0,255,255,0.5)]"
            aria-label="Continue with Instagram"
          >
          <img src="/images/social/instagram.jpg" alt="Instagram" className="w-full h-full object-cover" />
          </button>
        </div>
        {(!GOOGLE_CLIENT_ID || !FACEBOOK_APP_ID) && (
          <div className="text-xs text-bone/50">
            Tip: set VITE_GOOGLE_CLIENT_ID, VITE_FACEBOOK_APP_ID, and Instagram OAuth env vars to enable social login.
          </div>
        )}
      </div>
    </div>
  )
}


