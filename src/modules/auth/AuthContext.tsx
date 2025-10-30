import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type User = {
  id: string
  email: string
  name?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function storageKey() { return 'cbrd.auth.v1' }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey())
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (user) localStorage.setItem(storageKey(), JSON.stringify(user))
      else localStorage.removeItem(storageKey())
    } catch {}
  }, [user])

  const login = useCallback(async (email: string, password: string) => {
    // Demo: accept any non-empty credentials
    if (!email || !password) throw new Error('Enter email and password')
    setUser({ id: crypto.randomUUID(), email })
  }, [])

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    if (!email || !password) throw new Error('Enter email and password')
    setUser({ id: crypto.randomUUID(), email, name })
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const value = useMemo(() => ({ user, login, signup, logout }), [user, login, signup, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


