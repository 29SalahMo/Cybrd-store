import { Link } from 'react-router-dom'
import { products } from '../../data/products'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import ImageWithFallback from '../ui/ImageWithFallback'
import Meta from '../seo/Meta'
import { useCart } from '../cart/CartContext'
import { useToast } from '../ui/ToastContext'
import { useWishlist } from '../wishlist/WishlistContext'
import { flyToCart } from '../ui/flyToCart'
import { flyToWishlist } from '../ui/flyToWishlist'

export default function Shop() {
  const { add } = useCart()
  const { show } = useToast()
  const { has, toggle } = useWishlist()
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
      <Meta title="Shop — C¥BRD" description="Browse limited-run hoodies and streetwear." />
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
            <div className="group glass rounded-xl overflow-hidden border border-white/10 hover:shadow-glow transition">
              <Link to={`/product/${p.id}`} className="block">
              <div className="aspect-[4/5] bg-gradient-to-br from-black to-ink relative">
                <button
                  aria-label="Toggle wishlist"
                  onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); const wasLoved = has(p.id); toggle(p.id); if (!wasLoved) { const card = e.currentTarget.closest('.group') as HTMLElement | null; const img = card?.querySelector('img') as HTMLElement | null; flyToWishlist(img) } }}
                  className={`absolute right-2 top-2 z-10 p-2 rounded-full border ${has(p.id) ? 'bg-magenta text-black border-magenta' : 'bg-black/30 text-white border-white/10'}`}
                >
                  {has(p.id) ? '♥' : '♡'}
                </button>
                {p.backImage ? (
                  <>
                    <ImageWithFallback src={p.backImage} alt={p.name + ' back'} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-0" />
                    <ImageWithFallback src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-90" />
                  </>
                ) : (
                  <ImageWithFallback src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                )}
                {/* Quick Add button */}
                <div className="absolute right-2 bottom-2 z-10">
                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); add({ id: p.id, name: p.name, price: p.price, image: p.image, size: 'M', quantity: 1 }); show('Added to cart', 'success'); const img = (e.currentTarget.closest('.aspect-[4/5]') as HTMLElement)?.querySelector('img') as HTMLElement | null; flyToCart(img) }}
                    aria-label="Add to cart"
                    className="p-2 rounded-full bg-magenta/90 text-black border border-white/10 hover:shadow-glowStrong"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6h15l-1.5 9h-13L5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8v6M9 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </motion.button>
                </div>
              </div>
              </Link>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-bone/60 text-sm">Premium heavyweight fleece</div>
                </div>
                <div className="text-neon font-semibold">{p.price}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


