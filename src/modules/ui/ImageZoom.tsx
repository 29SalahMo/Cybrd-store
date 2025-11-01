import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
  zoomScale?: number
}

export default function ImageZoom({ src, alt, className = '', zoomScale = 2 }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isZoomed) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      style={{ position: className.includes('absolute') ? 'absolute' : 'relative' }}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={alt}
    >
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ pointerEvents: 'none' }}
        animate={{
          scale: isZoomed ? zoomScale : 1,
          x: isZoomed ? `calc(-${position.x}% * ${zoomScale - 1})` : 0,
          y: isZoomed ? `calc(-${position.y}% * ${zoomScale - 1})` : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
      
      {isZoomed && (
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-xs pointer-events-none z-10">
          Zoom active
        </div>
      )}
    </div>
  )
}

// Fullscreen zoom modal
export function ImageZoomModal({ src, alt, isOpen, onClose }: { src: string; alt: string; isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          aria-modal="true"
          aria-label={`Zoomed view of ${alt}`}
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button
            onClick={onClose}
            aria-label="Close zoom"
            className="absolute top-4 right-4 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded bg-black/60 text-white text-sm">
            Press ESC or click outside to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

