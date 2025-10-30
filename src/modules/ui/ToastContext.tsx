import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type Toast = { id: string; message: string; type?: 'success' | 'error' | 'info' }

type ToastContextType = {
  toasts: Toast[]
  show: (message: string, type?: Toast['type']) => void
  remove: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const show = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, message, type }])
    window.setTimeout(() => remove(id), 3000)
  }, [remove])

  const value = useMemo(() => ({ toasts, show, remove }), [toasts, show, remove])
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastViewport() {
  const { toasts, remove } = useToast()
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-2 rounded-md shadow-glow glass border ${t.type==='error' ? 'border-red-400/40 text-red-300' : t.type==='success' ? 'border-neon/40 text-neon' : 'border-white/15 text-bone/90'}`} onClick={()=>remove(t.id)}>
          {t.message}
        </div>
      ))}
    </div>
  )
}


