import { Link } from 'react-router-dom'
import { useWishlist } from '../wishlist/WishlistContext'
import { products } from '../../data/products'
import Meta from '../seo/Meta'
import { useCart } from '../cart/CartContext'
import { useToast } from '../ui/ToastContext'
import { flyToCart } from '../ui/flyToCart'

export default function Wishlist() {
	const { ids, clear, remove } = useWishlist()
  const { add } = useCart()
  const { show } = useToast()
	const loved = products.filter(p => ids.includes(p.id))
	return (
		<div className="max-w-7xl mx-auto px-4 py-12">
			<Meta title="Wishlist — C¥BRD" description="Your loved streetwear pieces." />
			<div className="flex items-center justify-between mb-6">
				<h2 className="font-display text-3xl">Wishlist</h2>
				{loved.length > 0 && (
					<button onClick={clear} className="text-sm text-bone/70 hover:text-bone">Clear all</button>
				)}
			</div>
			{loved.length === 0 ? (
				<div className="text-bone/70">No loved items yet. Browse the <Link to="/shop" className="text-neon underline">shop</Link>.</div>
			) : (
				<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
					{loved.map(p => (
						<div key={p.id} className="group glass rounded-xl overflow-hidden border border-white/10 hover:shadow-glow transition">
							<Link to={`/product/${p.id}`} className="block">
								<div className="aspect-[4/5] bg-gradient-to-br from-black to-ink relative">
									<img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
								</div>
							</Link>
							<div className="p-4 flex items-center justify-between">
								<div className="font-medium">{p.name}</div>
								<div className="flex items-center gap-2">
									<button onClick={()=>{ remove(p.id) }} className="px-2 py-1 text-xs rounded border border-white/15 text-bone/80 hover:text-bone">Remove</button>
									<button onClick={(e)=>{ add({ id: p.id, name: p.name, price: p.price, image: p.image, size: 'M', quantity: 1 }); show('Added to cart', 'success'); const img = (e.currentTarget.closest('.group') as HTMLElement)?.querySelector('img') as HTMLElement | null; flyToCart(img) }} className="px-2 py-1 text-xs rounded bg-magenta text-black font-semibold">Add to Cart</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
