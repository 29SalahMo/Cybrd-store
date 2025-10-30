import { Link } from 'react-router-dom'
import Scene from '../three/Scene'
import { products } from '../../data/products'
import { motion } from 'framer-motion'
import ImageWithFallback from '../ui/ImageWithFallback'
import Meta from '../seo/Meta'
import { useEffect } from 'react'
import { useWishlist } from '../wishlist/WishlistContext'
import { flyToWishlist } from '../ui/flyToWishlist'

export default function Home() {
  useEffect(() => { document.title = 'C¥BRD — Home' }, [])
  const { has, toggle } = useWishlist()
  return (
    <section>
      <Meta title="C¥BRD — Streetwear with a Cyberpunk Soul" description="Limited-run hoodies and streetwear engineered with a cyberpunk vibe." image="/logo.png" />
      <Scene />
      <div className="h-[85vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-5xl md:text-7xl tracking-wider">
            <span className="text-bone">C</span>
            <span className="text-burgundy">¥</span>
            <span className="text-bone">BRD</span>
          </h1>
          <p className="mt-4 text-bone/80 max-w-xl mx-auto">Not just a hoodie. It is who you are</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/shop" className="px-6 py-3 rounded-md bg-neon text-black font-semibold hover:shadow-glowStrong">Shop Now</Link>
            <Link to="/about" className="px-6 py-3 rounded-md border border-white/15 hover:border-neon">About</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 pb-16">
        {products.slice(0, 8).map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
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
                {/* Quick Add removed on Home page by request */}
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
    </section>
  )
}


