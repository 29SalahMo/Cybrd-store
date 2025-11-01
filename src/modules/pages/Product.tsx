import { useParams, Link } from 'react-router-dom'
import { getProductById, products, PRICE_LE } from '../../data/products'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../cart/CartContext'
import { useToast } from '../ui/ToastContext'
import { useWishlist } from '../wishlist/WishlistContext'
import { flyToCart } from '../ui/flyToCart'
import { flyToWishlist } from '../ui/flyToWishlist'
import ImageWithFallback from '../ui/ImageWithFallback'
import Meta from '../seo/Meta'
import { logEvent } from '../analytics/analytics'
import { addRecentlyViewed, getRecentlyViewed } from '../utils/recentlyViewed'
import Breadcrumbs from '../ui/Breadcrumbs'
import { ProductStructuredData } from '../seo/StructuredData'
import SizeGuideModal from '../ui/SizeGuideModal'
import SocialShare from '../ui/SocialShare'

export default function Product() {
  const { id } = useParams()
  const pid = Number(id)
  const product = Number.isFinite(pid) ? getProductById(pid) : undefined
  const { add } = useCart()
  const { show } = useToast()
  const { has, toggle } = useWishlist()

  const colors = useMemo(() => (product?.variants ? Object.keys(product.variants) : []), [product])
  const [color, setColor] = useState(colors[0] || '')
  const active = product?.variants && color ? product.variants[color] : undefined
  const front = active?.front || product?.image
  const back = active?.back || product?.backImage

  // Recommend up to 4 random other products (excluding this one)
  const recommendations = useMemo(() => {
    const others = products.filter(p => p.id !== pid)
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]]
    }
    return others.slice(0, 4)
  }, [pid])

  const sizes: Array<'M' | 'L' | 'XL' | '2XL'> = ['M', 'L', 'XL', '2XL']
  const [size, setSize] = useState<'' | 'M' | 'L' | 'XL' | '2XL'>('')
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const canAdd = !!product && (!!color || colors.length === 0) && !!size

  const onAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!product) return
    if (!canAdd) {
      setSizeError(true)
      setTimeout(()=>setSizeError(false), 900)
      return
    }
    const finalSize = (size || 'M') as 'M' | 'L' | 'XL' | '2XL'
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: front || product.image,
      size: finalSize,
      color: colors.length > 0 ? color : undefined,
      quantity: qty
    })
    show('Added to cart', 'success')
    const container = (e.currentTarget.closest('.max-w-6xl') as HTMLElement) || (document.querySelector('.product-main') as HTMLElement | null)
    const img = container?.querySelector('.product-main img') as HTMLElement | null
    flyToCart(img)
    if (product) logEvent('add_to_cart', { id: product.id, name: product.name, price: product.price, qty: qty })
  }

  useEffect(() => {
    const t = product?.name ? `${product.name} — C¥BRD` : 'Product — C¥BRD'
    document.title = t
    if (product) {
      logEvent('view_item', { id: product.id, name: product.name, price: product.price })
      addRecentlyViewed(product.id)
    }
  }, [product])

  // Get recently viewed products (excluding current)
  const recentlyViewed = useMemo(() => {
    const ids = getRecentlyViewed().filter(id => id !== pid)
    return ids.slice(0, 4).map(id => getProductById(id)).filter(Boolean)
  }, [pid])

  return (
    <>
      <Meta title={`${product?.name ?? 'Product'} — C¥BRD`} description="Premium heavyweight fleece hoodie." image={front || product?.image} />
      {product && <ProductStructuredData product={product} />}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Breadcrumbs />
        <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-[4/5] glass rounded-xl border border-white/10 relative overflow-hidden group product-main">
          <button
            aria-label="Toggle wishlist"
            onClick={()=>{ if (!product) return; const wasLoved = has(product.id) ; toggle(product.id); if (!wasLoved) { const container = document.querySelector('.product-main') as HTMLElement | null; const img = container?.querySelector('img') as HTMLElement | null; flyToWishlist(img) } }}
            className={`absolute right-3 top-3 z-10 p-2 rounded-full border ${product && has(product.id) ? 'bg-magenta text-black border-magenta' : 'bg-black/30 text-white border-white/10'}`}
          >
            {product && has(product.id) ? '♥' : '♡'}
          </button>
          {back ? (
            <>
              <ImageWithFallback src={back} alt={(product?.name || 'Hoodie') + ' back'} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-0 transition-opacity duration-200" />
              <ImageWithFallback src={front!} alt={product?.name || ''} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </>
          ) : (
            front && <ImageWithFallback src={front} alt={product?.name || ''} className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="font-display text-3xl">{product?.name ?? `C¥BRD Hoodie ${id}`}</h1>
              <p className="text-bone/70 mt-2">Matte black heavyweight fleece with burgundy cyber-stitch and neon piping.</p>
              <div className="mt-4 text-2xl text-neon font-semibold">{product?.price ?? PRICE_LE}</div>
            </div>
            {product && typeof window !== 'undefined' && (
              <SocialShare
                url={window.location.href}
                title={product.name}
                description="Check out this hoodie from C¥BRD"
              />
            )}
          </div>

          {colors.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-bone/70 mb-2">Color</div>
              <div className="flex gap-2">
                {colors.map((c, idx) => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); logEvent('select_color', { id: product?.id, color: c }) }}
                    aria-label={`Select color ${c}`}
                    aria-pressed={color === c}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowLeft' && idx > 0) colors[idx - 1] && setColor(colors[idx - 1])
                      if (e.key === 'ArrowRight' && idx < colors.length - 1) colors[idx + 1] && setColor(colors[idx + 1])
                    }}
                    className={`px-4 py-2 rounded-md border transition ${color === c ? 'border-neon text-neon' : 'border-white/15 text-bone/80 hover:border-neon/50'} focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2 focus:ring-offset-black`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-bone/70">Size</div>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-neon hover:underline focus:outline-none focus:ring-2 focus:ring-neon/50 rounded px-1"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s, idx) => (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  key={s}
                  onClick={() => { setSize(s); logEvent('select_size', { id: product?.id, size: s }) }}
                  aria-label={`Select size ${s}`}
                  aria-pressed={size === s}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft' && idx > 0) setSize(sizes[idx - 1])
                    if (e.key === 'ArrowRight' && idx < sizes.length - 1) setSize(sizes[idx + 1])
                  }}
                  className={`px-4 py-2 rounded-md border transition-colors ${size === s ? 'border-neon text-neon' : 'border-white/15 text-bone/80 hover:border-neon/50 hover:text-bone'} focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2 focus:ring-offset-black`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="text-sm text-bone/70">Quantity</div>
            <input type="number" min={1} value={qty} onChange={(e)=>setQty(Math.max(1, Number(e.target.value)||1))} className="w-16 px-3 py-2 rounded-md bg-black/40 border border-white/15" />
          </div>

          <motion.button
            whileHover={canAdd ? { scale: 1.03 } : {}}
            whileTap={canAdd ? { scale: 0.97 } : {}}
            animate={sizeError ? { boxShadow: '0 0 18px rgba(255,0,0,0.6)', scale: 1.02 } : {}}
            onClick={onAdd}
            className={`mt-6 px-6 py-3 rounded-md font-semibold transition-shadow ${canAdd ? 'bg-magenta hover:shadow-glowStrong' : 'bg-gray-700'} ${sizeError ? 'ring-2 ring-red-500' : ''}`}
          >
            {canAdd ? 'Add to Cart' : 'Choose Size'}
          </motion.button>
          {!canAdd && sizeError && (
            <div className="mt-2 text-sm text-red-400">Choose your size first</div>
          )}
        </div>
        </div>
      </div>
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
      {recentlyViewed.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <h2 className="font-display text-2xl mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.map((rec) => (
              <Link key={rec.id} to={`/product/${rec.id}`} className="group block glass rounded-xl overflow-hidden border border-white/10 hover:shadow-glow transition">
                <div className="aspect-[4/5] bg-gradient-to-br from-black to-ink relative">
                  {rec.backImage ? (
                    <>
                      <ImageWithFallback src={rec.backImage} alt={rec.name + ' back'} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-0" />
                      <ImageWithFallback src={rec.image} alt={rec.name} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-90" />
                    </>
                  ) : (
                    <ImageWithFallback src={rec.image} alt={rec.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  )}
                </div>
                <div className="p-3 text-sm font-semibold text-bone/90 text-center">
                  {rec.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <h2 className="font-display text-2xl mb-3">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.01 * idx, type: 'spring', stiffness: 64 }}
            >
              <Link to={`/product/${rec.id}`} className="group block glass rounded-xl overflow-hidden border border-white/10 hover:shadow-glow transition">
                <div className="aspect-[4/5] bg-gradient-to-br from-black to-ink relative">
                  {rec.backImage ? (
                    <>
                      <ImageWithFallback src={rec.backImage} alt={rec.name + ' back'} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-0" />
                      <ImageWithFallback src={rec.image} alt={rec.name} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-90" />
                    </>
                  ) : (
                    <ImageWithFallback src={rec.image} alt={rec.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  )}
                </div>
                <div className="p-3 text-sm font-semibold text-bone/90 text-center">
                  {rec.name}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}


