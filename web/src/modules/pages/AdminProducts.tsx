import { useEffect, useState } from 'react'
import { api } from '../../config/api'

type Product = {
  id: number
  title: string
  priceCents: number
}

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const resp = await api<Product[]>(`/products`)
        setItems(resp)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="p-6">Loading…</div>
  if (error) return <div className="p-6 text-red-400">{error}</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(p => (
          <div key={p.id} className="border border-white/10 rounded p-4">
            <div className="font-semibold">{p.title}</div>
            <div className="text-bone/70">${(p.priceCents/100).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


