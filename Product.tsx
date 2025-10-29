import { useParams } from 'react-router-dom'
import { getProductById, PRICE_LE } from '../../data/products'
import { useMemo, useState } from 'react'

export default function Product() {
  const { id } = useParams()
  const pid = Number(id)
  const product = Number.isFinite(pid) ? getProductById(pid) : undefined

  const colors = useMemo(() => (product?.variants ? Object.keys(product.variants) : []), [product])
  const [color, setColor] = useState(colors[0] || '')
  const active = product?.variants && color ? product.variants[color] : undefined
  const front = active?.front || product?.image
  const back = active?.back || product?.backImage

  return (
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

        <button className="mt-6 px-6 py-3 rounded-md bg-magenta font-semibold hover:shadow-glowStrong">Add to Cart</button>
      </div>
    </div>
  )
}


