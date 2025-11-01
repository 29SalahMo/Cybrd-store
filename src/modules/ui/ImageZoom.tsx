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
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // Toggle zoom on click
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    // Prevent click if we just finished dragging
    if (isDragging) {
      return
    }
    
    // If not zoomed, activate zoom and center on click point
    if (!isZoomed) {
      setIsZoomed(true)
      const rect = containerRef.current.getBoundingClientRect()
      const clickX = ((e.clientX - rect.left) / rect.width) * 100
      const clickY = ((e.clientY - rect.top) / rect.height) * 100
      
      // Calculate offset to center the clicked point
      // When zoomed 2x, image is 200% size, so it extends 50% beyond container on each side
      // To center click point: offset = (click - 50) * zoomScale
      const maxOffset = 50 * (zoomScale - 1)
      setPosition({
        x: Math.max(-maxOffset, Math.min(maxOffset, (clickX - 50) * zoomScale)),
        y: Math.max(-maxOffset, Math.min(maxOffset, (clickY - 50) * zoomScale))
      })
    } else {
      // If zoomed, deactivate on click
      setIsZoomed(false)
      setPosition({ x: 0, y: 0 })
    }
  }

  // Handle drag start when zoomed
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current) return
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    })
  }

  // Handle drag - use global mouse move for better tracking
  useEffect(() => {
    if (!isDragging || !isZoomed || !containerRef.current) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect()
      const deltaXPixels = e.clientX - dragStart.x
      const deltaYPixels = e.clientY - dragStart.y
      
      // Convert pixel movement to percentage of container
      const deltaXPercent = (deltaXPixels / rect.width) * 100
      const deltaYPercent = (deltaYPixels / rect.height) * 100
      
      // Calculate bounds - when zoomed 2x, image extends 50% beyond container on each side
      const maxOffset = 50 * (zoomScale - 1)
      
      // Update position - mouse movement directly translates to image movement
      setPosition({
        x: Math.max(-maxOffset, Math.min(maxOffset, dragStart.posX + deltaXPercent)),
        y: Math.max(-maxOffset, Math.min(maxOffset, dragStart.posY + deltaYPercent))
      })
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)
    return () => document.removeEventListener('mousemove', handleGlobalMouseMove)
  }, [isDragging, isZoomed, dragStart, zoomScale])

  // Handle drag (local for initial click)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // This is handled by global mousemove when dragging
  }

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle mouse leave - only deactivate if not dragging
  const handleMouseLeave = () => {
    if (!isDragging) {
      // Keep zoomed but reset position on mouse leave
      // Or deactivate if user prefers
      // setIsZoomed(false)
    }
  }

  // Global mouse up handler for drag
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => {
        setIsDragging(false)
      }
      document.addEventListener('mouseup', handleGlobalMouseUp)
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging])

  // Escape key to deactivate zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false)
        setPosition({ x: 0, y: 0 })
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'} ${className}`}
      style={{ position: className.includes('absolute') ? 'absolute' : 'relative' }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={alt}
    >
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover select-none"
        style={{ 
          pointerEvents: 'none', 
          userSelect: 'none',
          transformOrigin: 'center center'
        }}
        animate={{
          scale: isZoomed ? zoomScale : 1,
          // When zoomed: center the scaled image, then offset by position
          // Position is in percentage of container size
          x: isZoomed ? `${position.x}%` : 0,
          y: isZoomed ? `${position.y}%` : 0,
        }}
        transition={{ 
          type: isDragging ? false : 'spring', 
          stiffness: 400, 
          damping: 30,
          duration: isDragging ? 0 : 0.3
        }}
      />
      
      {isZoomed && (
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-xs pointer-events-none z-10">
          {isDragging ? 'Drag to pan • Click to exit' : 'Zoom active • Drag to pan • Click to exit'}
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
