import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../utils/api'

export type User = {
  id: string
  email: string
  name?: string
  role?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  loginWithFacebook: (accessToken: string) => Promise<void>
  loginWithInstagram: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function storageKey() { return 'cbrd.auth.v1' }
function tokenKey() { return 'cbrd.auth.token' }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey())
      if (raw) {
        const userData = JSON.parse(raw)
        setUser(userData)
        // Try to refresh token if we have one
        const token = localStorage.getItem(tokenKey())
        if (token) {
          verifyToken(token)
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (user) localStorage.setItem(storageKey(), JSON.stringify(user))
      else {
        localStorage.removeItem(storageKey())
        localStorage.removeItem(tokenKey())
      }
    } catch {}
  }, [user])

  const verifyToken = async (token: string) => {
    try {
      const data = await apiRequest<{ user: User }>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(data.user)
      localStorage.setItem(tokenKey(), token)
    } catch {
      // Token invalid, clear auth
      setUser(null)
      localStorage.removeItem(tokenKey())
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem(tokenKey(), data.token)
    setUser(data.user)
  }, [])

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    const data = await apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
    localStorage.setItem(tokenKey(), data.token)
    setUser(data.user)
  }, [])

  const loginWithGoogle = useCallback(async (accessToken: string) => {
    const data = await apiRequest<{ token: string; user: User }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    })
    localStorage.setItem(tokenKey(), data.token)
    setUser(data.user)
  }, [])

  const loginWithFacebook = useCallback(async (accessToken: string) => {
    const data = await apiRequest<{ token: string; user: User }>('/auth/facebook', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    })
    localStorage.setItem(tokenKey(), data.token)
    setUser(data.user)
  }, [])

  const loginWithInstagram = useCallback(async () => {
    // Redirect to Instagram OAuth
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
    window.location.href = `${API_BASE_URL}/auth/instagram/start`
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch {}
    setUser(null)
    localStorage.removeItem(tokenKey())
  }, [])

  const value = useMemo(() => ({ 
    user, 
    login, 
    signup, 
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithInstagram,
    logout 
  }), [user, login, signup, loginWithGoogle, loginWithFacebook, loginWithInstagram, logout])
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


