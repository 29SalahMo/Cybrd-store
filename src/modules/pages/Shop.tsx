import { Link } from 'react-router-dom'
import { products } from '../../data/products'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import ImageWithFallback from '../ui/ImageWithFallback'
import Meta from '../seo/Meta'
import { useCart } from '../cart/CartContext'
import ProductSkeleton from '../ui/ProductSkeleton'
import { useToast } from '../ui/ToastContext'
import { useWishlist } from '../wishlist/WishlistContext'
import { flyToCart } from '../ui/flyToCart'
import { flyToWishlist } from '../ui/flyToWishlist'
import { SearchAutocomplete } from '../ui/SearchAutocomplete'

export default function Shop() {
  const { add } = useCart()
  const { show } = useToast()
  const { has, toggle } = useWishlist()
  const [q, setQ] = useState('')
  const [size, setSize] = useState<'' | 'M' | 'L' | 'XL' | '2XL'>('')
  const [color, setColor] = useState('')
  const [sort, setSort] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest'>('relevance')
  const [showFilters, setShowFilters] = useState(false)

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
    
    // Sorting
    const sorted = [...list]
    if (sort === 'price-asc') {
      sorted.sort((a,b)=>parsedPrice(a.price)-parsedPrice(b.price))
    } else if (sort === 'price-desc') {
      sorted.sort((a,b)=>parsedPrice(b.price)-parsedPrice(a.price))
    } else if (sort === 'name-asc') {
      sorted.sort((a,b)=>a.name.localeCompare(b.name))
    } else if (sort === 'name-desc') {
      sorted.sort((a,b)=>b.name.localeCompare(a.name))
    } else if (sort === 'newest') {
      sorted.sort((a,b)=>b.id - a.id) // Higher ID = newer
    }
    // 'relevance' keeps original order
    return sorted
  }, [q, color, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Meta 
        title="Shop — C¥BRD" 
        description="Browse our collection of limited-run cyberpunk streetwear hoodies. Premium heavyweight fleece with unique designs. Fast shipping, easy returns." 
        image="/logo.png"
      />
      <h2 className="font-display text-3xl mb-6">Shop</h2>

      <div className="glass border border-white/10 rounded-xl p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchAutocomplete value={q} onChange={setQ} />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                showFilters || size || color
                  ? 'border-neon text-neon bg-neon/10'
                  : 'border-white/15 text-bone/80 hover:border-neon/50'
              }`}
              aria-expanded={showFilters}
              aria-label="Toggle filters"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {(size || color) && (
                  <span className="px-1.5 py-0.5 rounded-full bg-neon text-black text-xs font-bold">
                    {[size, color].filter(Boolean).length}
                  </span>
                )}
              </span>
            </button>
            <select 
              value={sort} 
              onChange={(e)=>setSort(e.target.value as any)} 
              className="px-4 py-2 rounded-md bg-black/40 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-neon/50"
              aria-label="Sort products"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-bone/80">Size:</span>
                  <div className="flex gap-2">
                    {(['M','L','XL','2XL'] as const).map(s => (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={()=>setSize(size===s?'':s)}
                        className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                          size===s
                            ? 'border-neon text-neon bg-neon/10'
                            : 'border-white/15 text-bone/80 hover:border-neon/50'
                        }`}
                        aria-pressed={size === s}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-bone/80">Color:</span>
                  <div className="flex gap-2 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>setColor('')}
                      className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                        color===''
                          ? 'border-neon text-neon bg-neon/10'
                          : 'border-white/15 text-bone/80 hover:border-neon/50'
                      }`}
                      aria-pressed={color === ''}
                    >
                      All
                    </motion.button>
                    {colors.map(c => (
                      <motion.button
                        key={c}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={()=>setColor(color===c?'':c)}
                        className={`px-3 py-1.5 rounded-md border text-sm capitalize transition-colors ${
                          color===c
                            ? 'border-neon text-neon bg-neon/10'
                            : 'border-white/15 text-bone/80 hover:border-neon/50'
                        }`}
                        aria-pressed={color === c}
                      >
                        {c}
                      </motion.button>
                    ))}
                  </div>
                </div>
                {(size || color) && (
                  <button
                    onClick={() => {
                      setSize('')
                      setColor('')
                    }}
                    className="ml-auto px-3 py-1.5 rounded-md border border-white/15 text-sm text-bone/60 hover:text-bone hover:border-white/30 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Active Filters Display */}
          {(size || color || q) && (
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="text-bone/60">Active:</span>
              {q && (
                <span className="px-2 py-1 rounded-md bg-neon/20 text-neon border border-neon/30">
                  Search: "{q}"
                  <button onClick={() => setQ('')} className="ml-1.5 hover:text-neon/70" aria-label="Clear search">
                    ×
                  </button>
                </span>
              )}
              {size && (
                <span className="px-2 py-1 rounded-md bg-neon/20 text-neon border border-neon/30">
                  Size: {size}
                  <button onClick={() => setSize('')} className="ml-1.5 hover:text-neon/70" aria-label="Clear size filter">
                    ×
                  </button>
                </span>
              )}
              {color && (
                <span className="px-2 py-1 rounded-md bg-neon/20 text-neon border border-neon/30">
                  Color: {color}
                  <button onClick={() => setColor('')} className="ml-1.5 hover:text-neon/70" aria-label="Clear color filter">
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-bone/70">
          <svg className="w-16 h-16 mx-auto mb-4 text-bone/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg mb-2">No products found</p>
          <p className="text-sm mb-4">Try adjusting your filters or search terms</p>
          {(q || size || color) && (
            <button
              onClick={() => {
                setQ('')
                setSize('')
                setColor('')
                setShowFilters(false)
              }}
              className="px-4 py-2 rounded-md border border-white/15 hover:border-neon text-sm transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="text-sm text-bone/60 mb-4">
            Showing {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {(q || size || color) && ` (filtered from ${products.length} total)`}
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
        </>
      )}
    </div>
  )
}


