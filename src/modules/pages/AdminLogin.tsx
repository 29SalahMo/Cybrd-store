import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../../config/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('ChangeMe123!')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const resp = await api<{ token: string }>("/auth/login", {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      setAuthToken(resp.token)
      navigate('/admin/orders')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input className="px-3 py-2 rounded border border-white/20 bg-black/30" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="px-3 py-2 rounded border border-white/20 bg-black/30" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button disabled={loading} className="px-3 py-2 rounded bg-neon text-black font-semibold disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
