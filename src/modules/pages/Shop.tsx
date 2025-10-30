import { Link } from 'react-router-dom'
import { products } from '../../data/products'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

export default function Shop() {
  const [q, setQ] = useState('')
  const [size, setSize] = useState<'' | 'M' | 'L' | 'XL' | '2XL'>('')
  const [color, setColor] = useState('')
  const [sort, setSort] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance')

  useEffect(() => { document.title = 'Shop — C¥BRD' }, [])

  const colors = useMemo(() => {
    const c = new Set<string>()
    products.forEach(p => {
      if (p.variants) Object.keys(p.variants).forEach(k => c.add(k))
    })
    return Array.from(c)
  }, [])

  const parsedPrice = (price: string) => parseFloat(price.replace(/[^\d.]/g, '')) || 0

  const filtered = useMemo(() => {
    let list = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
    if (color) {
      list = list.filter(p => p.variants && Object.keys(p.variants).includes(color))
    }
    // All sizes are available for now; keep filter UI for future inventory
    if (sort === 'price-asc') list = [...list].sort((a,b)=>parsedPrice(a.price)-parsedPrice(b.price))
    if (sort === 'price-desc') list = [...list].sort((a,b)=>parsedPrice(b.price)-parsedPrice(a.price))
    return list
  }, [q, color, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="font-display text-3xl mb-6">Shop</h2>

      <div className="glass border border-white/10 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search products" className="w-full md:max-w-sm px-4 py-2 rounded-md bg-black/40 border border-white/15" />
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs text-bone/60">Size</span>
              {(['M','L','XL','2XL'] as const).map(s => (
                <button key={s} onClick={()=>setSize(size===s?'':s)} className={`px-3 py-1.5 rounded-md border text-sm ${size===s? 'border-neon text-neon' : 'border-white/15 text-bone/80'}`}>{s}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-bone/60">Color</span>
              <button onClick={()=>setColor('')} className={`px-3 py-1.5 rounded-md border text-sm ${color===''? 'border-neon text-neon' : 'border-white/15 text-bone/80'}`}>All</button>
              {colors.map(c => (
                <button key={c} onClick={()=>setColor(color===c?'':c)} className={`px-3 py-1.5 rounded-md border text-sm capitalize ${color===c? 'border-neon text-neon' : 'border-white/15 text-bone/80'}`}>{c}</button>
              ))}
            </div>
            <div className="ml-auto">
              <select value={sort} onChange={(e)=>setSort(e.target.value as any)} className="px-3 py-2 rounded-md bg-black/40 border border-white/15 text-sm">
                <option value="relevance">Sort: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.13 }}
            transition={{ delay: idx * 0.08, type: 'spring', stiffness: 77 }}
          >
            <Link to={`/product/${p.id}`} className="group glass rounded-xl overflow-hidden border border-white/10 hover:shadow-glow transition">
              <div className="aspect-[4/5] bg-gradient-to-br from-black to-ink relative">
                {p.backImage ? (
                  <>
                    <img src={p.backImage} alt={p.name + ' back'} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-0" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
                    <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-90" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
                  </>
                ) : (
                  <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-90" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-bone/60 text-sm">Premium heavyweight fleece</div>
                </div>
                <div className="text-neon font-semibold">{p.price}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


