import { Link } from 'react-router-dom'
import { products } from '../../data/products'

export default function Shop() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="font-display text-3xl mb-6">Shop</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="group glass rounded-xl overflow-hidden border border-white/10 hover:shadow-glow transition">
            <div className="aspect-[4/5] bg-gradient-to-br from-black to-ink relative">
              {p.backImage ? (
                <>
                  <img src={p.backImage} alt={p.name + ' back'} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-0" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
                  <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-90" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
                </>
              ) : (
                <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-90" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
              )}
              {p.id !== 1 && p.id !== 2 && p.id !== 3 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-bone/50 group-hover:text-neon transition">{p.name}</span>
                </div>
              )}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-bone/60 text-sm">Burgundy accent • Glow stitch</div>
              </div>
              <div className="text-neon font-semibold">{p.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


