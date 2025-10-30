import { useParams, Link } from 'react-router-dom'
import { getProductById, products, PRICE_LE } from '../../data/products'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../cart/CartContext'

export default function Product() {
  const { id } = useParams()
  const pid = Number(id)
  const product = Number.isFinite(pid) ? getProductById(pid) : undefined
  const { add } = useCart()

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

  const canAdd = !!product && (!!color || colors.length === 0) && !!size

  const onAdd = () => {
    if (!product || !canAdd) return
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: front || product.image,
      size: size as 'M' | 'L' | 'XL' | '2XL',
      color: colors.length > 0 ? color : undefined,
      quantity: qty
    })
  }

  useEffect(() => {
    const t = product?.name ? `${product.name} — C¥BRD` : 'Product — C¥BRD'
    document.title = t
  }, [product])

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        <div className="aspect-[4/5] glass rounded-xl border border-white/10 relative overflow-hidden group">
          {back ? (
            <>
              <img src={back} alt={(product?.name || 'Hoodie') + ' back'} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-0 transition-opacity duration-200" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
              <img src={front} alt={product?.name || ''} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
            </>
          ) : (
            front && <img src={front} alt={product?.name || ''} className="absolute inset-0 w-full h-full object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl">{product?.name ?? `C¥BRD Hoodie ${id}`}</h1>
          <p className="text-bone/70 mt-2">Matte black heavyweight fleece with burgundy cyber-stitch and neon piping.</p>
          <div className="mt-4 text-2xl text-neon font-semibold">{product?.price ?? PRICE_LE}</div>

          {colors.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-bone/70 mb-2">Color</div>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className={`px-4 py-2 rounded-md border ${color === c ? 'border-neon text-neon' : 'border-white/15 text-bone/80'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="text-sm text-bone/70 mb-2">Size</div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`px-4 py-2 rounded-md border ${size === s ? 'border-neon text-neon' : 'border-white/15 text-bone/80'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="text-sm text-bone/70">Quantity</div>
            <input type="number" min={1} value={qty} onChange={(e)=>setQty(Math.max(1, Number(e.target.value)||1))} className="w-16 px-3 py-2 rounded-md bg-black/40 border border-white/15" />
          </div>

          <button onClick={onAdd} disabled={!canAdd} className={`mt-6 px-6 py-3 rounded-md font-semibold hover:shadow-glowStrong ${canAdd ? 'bg-magenta' : 'bg-gray-600 cursor-not-allowed'}`}>Add to Cart</button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-20">
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
                      <img src={rec.backImage} alt={rec.name + ' back'} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-0" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
                      <img src={rec.image} alt={rec.name} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-90" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
                    </>
                  ) : (
                    <img src={rec.image} alt={rec.name} className="absolute inset-0 w-full h-full object-cover opacity-90" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
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


