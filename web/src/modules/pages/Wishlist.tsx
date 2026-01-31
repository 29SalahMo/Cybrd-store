import { Link } from 'react-router-dom'
import { useWishlist } from '../wishlist/WishlistContext'
import { products } from '../../data/products'
import Meta from '../seo/Meta'
import { useCart } from '../cart/CartContext'
import { useToast } from '../ui/ToastContext'
import { flyToCart } from '../ui/flyToCart'
import { useState } from 'react'
import { logEvent } from '../analytics/analytics'

export default function Wishlist() {
	const { ids, clear, remove } = useWishlist()
  const { add } = useCart()
  const { show } = useToast()
	const [showClearConfirm, setShowClearConfirm] = useState(false)
	const loved = products.filter(p => ids.includes(p.id))

	const handleMoveAll = () => {
		loved.forEach(p => {
			add({ id: p.id, name: p.name, price: p.price, image: p.image, size: 'M', quantity: 1 })
		})
		show(`Added ${loved.length} items to cart`, 'success')
		logEvent('add_to_cart', { source: 'wishlist_move_all', count: loved.length })
	}

	const handleClear = () => {
		clear()
		setShowClearConfirm(false)
		show('Wishlist cleared', 'success')
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-12">
			<Meta title="Wishlist — C¥BRD" description="Your loved streetwear pieces." />
			<div className="flex items-center justify-between mb-6">
				<h2 className="font-display text-3xl">Wishlist</h2>
				{loved.length > 0 && (
					<div className="flex items-center gap-3">
						<button onClick={handleMoveAll} className="px-4 py-2 text-sm rounded-md bg-magenta text-black font-semibold hover:shadow-glowStrong">
							Move all to cart
						</button>
						<button onClick={() => setShowClearConfirm(true)} className="text-sm text-bone/70 hover:text-bone">
							Clear all
						</button>
					</div>
				)}
			</div>
			{showClearConfirm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
					<div className="glass border border-white/10 rounded-xl p-6 max-w-sm mx-4">
						<p className="text-lg font-semibold mb-4">Remove all items from wishlist?</p>
						<div className="flex gap-3">
							<button onClick={handleClear} className="flex-1 px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700">
								Yes, remove all
							</button>
							<button onClick={() => setShowClearConfirm(false)} className="flex-1 px-4 py-2 rounded-md border border-white/15 hover:border-neon">
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
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
									<button onClick={()=>{ remove(p.id); logEvent('remove_from_wishlist', { id: p.id }) }} className="px-2 py-1 text-xs rounded border border-white/15 text-bone/80 hover:text-bone">Remove</button>
									<button onClick={(e)=>{ add({ id: p.id, name: p.name, price: p.price, image: p.image, size: 'M', quantity: 1 }); show('Added to cart', 'success'); logEvent('add_to_cart', { id: p.id, source: 'wishlist' }); const img = (e.currentTarget.closest('.group') as HTMLElement)?.querySelector('img') as HTMLElement | null; flyToCart(img) }} className="px-2 py-1 text-xs rounded bg-magenta text-black font-semibold">Add to Cart</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
