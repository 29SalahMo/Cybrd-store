import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../ui/ToastContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { show } = useToast()
  useEffect(() => { document.title = 'Sign up — C¥BRD' }, [])
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await signup(email, password, name)
      show('Account created', 'success')
      navigate('/checkout')
    } catch (err: any) {
      setError(err?.message || 'Failed to sign up')
    }
  }
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-6">Create account</h1>
      <form onSubmit={onSubmit} className="glass border border-white/10 rounded-xl p-6 space-y-4">
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full px-4 py-2 rounded-md bg-black/40 border border-white/15" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-2 rounded-md bg-black/40 border border-white/15" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-4 py-2 rounded-md bg-black/40 border border-white/15" />
        <button type="submit" className="w-full px-4 py-2 rounded-md bg-neon text-black font-bold">Create Account</button>
        <div className="text-sm text-bone/70">Have an account? <Link to="/login" className="text-neon">Login</Link></div>
      </form>
    </div>
  )
}


