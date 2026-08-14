import { useEffect, useState } from 'react'
import { api } from '../../config/api'

type Order = {
  id: number
  number: string
  status: 'PENDING'|'PAID'|'FULFILLED'|'CANCELLED'|'REFUNDED'
  totalCents: number
  createdAt: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const resp = await api<{ items: Order[] }>(`/orders`)
        setOrders(resp.items)
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
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <div className="overflow-x-auto border border-white/10 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t border-white/10">
                <td className="p-3">{o.number}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">${(o.totalCents/100).toFixed(2)}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
