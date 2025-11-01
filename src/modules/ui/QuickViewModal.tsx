import { useEffect, useState, useRef } from 'react'
import { useFocusTrap } from '../utils/useFocusTrap'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '../../data/products'
import { useCart } from '../cart/CartContext'
import { useWishlist } from '../wishlist/WishlistContext'
import { useToast } from './ToastContext'
import { flyToCart } from './flyToCart'
import { flyToWishlist } from './flyToWishlist'
import ImageWithFallback from './ImageWithFallback'
import { Link } from 'react-router-dom'

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const { show } = useToast()
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<'' | 'M' | 'L' | 'XL' | '2XL'>('')
  const modalRef = useRef<HTMLDivElement>(null)

  const colors = product?.variants ? Object.keys(product.variants) : []
  const sizes: Array<'M' | 'L' | 'XL' | '2XL'> = ['M', 'L', 'XL', '2XL']
  
  useFocusTrap(modalRef, isOpen)
  
  useEffect(() => {
    if (isOpen && colors.length > 0) {
      setSelectedColor(colors[0])
    }
  }, [isOpen, colors])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!product) return null

  const activeVariant = product.variants && selectedColor ? product.variants[selectedColor] : undefined
  const frontImage = activeVariant?.front || product.image
  const backImage = activeVariant?.back || product.backImage
  const isLoved = has(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedSize) {
      show('Please select a size', 'error')
      return
    }
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: frontImage,
      size: selectedSize,
      color: colors.length > 0 ? selectedColor : undefined,
      quantity: 1
    })
    show('Added to cart', 'success')
    const img = e.currentTarget.closest('.quick-view-content')?.querySelector('img') as HTMLElement | null
    flyToCart(img)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    const wasLoved = isLoved
    toggle(product.id)
    if (!wasLoved) {
      const img = e.currentTarget.closest('.quick-view-content')?.querySelector('img') as HTMLElement | null
      flyToWishlist(img)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            aria-modal="true"
            aria-labelledby="quick-view-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass border border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto quick-view-content"
              style={{ zIndex: 51 }}
              role="dialog"
              aria-modal="true"
            >
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Image Section */}
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-black/40">
                  {backImage ? (
                    <>
                      <ImageWithFallback
                        src={backImage}
                        alt={product.name + ' back'}
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                      />
                      <ImageWithFallback
                        src={frontImage}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-90 transition-opacity duration-300"
                      />
                    </>
                  ) : (
                    <ImageWithFallback
                      src={frontImage}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  
                  <button
                    onClick={handleWishlistToggle}
                    aria-label={isLoved ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`absolute right-3 top-3 p-2 rounded-full border ${
                      isLoved
                        ? 'bg-magenta text-black border-magenta'
                        : 'bg-black/30 text-white border-white/10'
                    } hover:scale-110 transition-transform`}
                  >
                    {isLoved ? '♥' : '♡'}
                  </button>
                  
                  <button
                    onClick={onClose}
                    aria-label="Close quick view"
                    className="absolute right-3 top-12 p-2 rounded-full bg-black/30 text-white border border-white/10 hover:bg-black/50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Info Section */}
                <div className="flex flex-col">
                  <h2 id="quick-view-title" className="font-display text-2xl md:text-3xl mb-2">{product.name}</h2>
                  <div className="text-2xl font-bold text-neon mb-4">{product.price}</div>
                  
                  {colors.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-bone/70 mb-2">Color</div>
                      <div className="flex gap-2">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-md border capitalize ${
                              selectedColor === color
                                ? 'border-neon text-neon bg-neon/10'
                                : 'border-white/15 text-bone/80 hover:border-neon/50'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="text-sm text-bone/70 mb-2">Size</div>
                    <div className="flex gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-md border ${
                            selectedSize === size
                              ? 'border-neon text-neon bg-neon/10'
                              : 'border-white/15 text-bone/80 hover:border-neon/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto space-y-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={!selectedSize}
                      className="w-full px-6 py-3 rounded-md bg-neon text-black font-bold hover:shadow-lg hover:shadow-neon/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </motion.button>
                    
                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="block w-full px-6 py-3 rounded-md border border-white/15 text-center hover:border-neon transition-colors"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

