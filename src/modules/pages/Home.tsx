import { Link } from 'react-router-dom'
import Scene from '../three/Scene'
import { products } from '../../data/products'

export default function Home() {
  return (
    <section>
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
        {products.slice(0, 8).map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="group glass rounded-xl overflow-hidden border border-white/10 hover:shadow-glow transition">
            <div className="aspect-[4/5] bg-gradient-to-br from-black to-ink relative">
              {p.backImage ? (
                <>
                  {/* show back by default */}
                  <img src={p.backImage} alt={p.name + ' back'} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-0" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
                  {/* front on hover */}
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
                <div className="text-bone/60 text-sm">Matte black • Burgundy</div>
              </div>
              <div className="text-neon font-semibold">{p.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}


