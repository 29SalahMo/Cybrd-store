import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageZoom from './ImageZoom'

interface ProductImageGalleryProps {
  images: string[]
  alt: string
  className?: string
}

export default function ProductImageGallery({ images, alt, className = '' }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  // Ensure selected index is valid
  useEffect(() => {
    if (selectedIndex >= images.length) {
      setSelectedIndex(0)
    }
  }, [images.length, selectedIndex])

  // Scroll selected thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const selectedThumb = thumbnailsRef.current.children[selectedIndex] as HTMLElement
      if (selectedThumb) {
        selectedThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }
  }, [selectedIndex])

  if (images.length === 0) return null

  const selectedImage = images[selectedIndex]

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Main Image Display */}
      <div className="relative aspect-[4/5] glass rounded-xl border border-white/10 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ImageZoom
              src={selectedImage}
              alt={`${alt} - Image ${selectedIndex + 1}`}
              className="w-full h-full"
              zoomScale={1.5}
            />
          </motion.div>
        </AnimatePresence>

        {/* Image Counter - Bottom Left */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium z-10 border border-white/20">
          {selectedIndex + 1} / {images.length}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/20 hover:bg-black/80 hover:border-neon/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 z-10 group/btn"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/20 hover:bg-black/80 hover:border-neon/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 z-10 group/btn"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="relative">
          <div
            ref={thumbnailsRef}
            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {images.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  selectedIndex === index
                    ? 'border-neon shadow-[0_0_20px_rgba(0,255,255,0.4)] ring-2 ring-neon/50'
                    : 'border-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                }`}
                aria-label={`View image ${index + 1}`}
                aria-pressed={selectedIndex === index}
              >
                <img
                  src={img}
                  alt={`${alt} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Glowing overlay when selected */}
                {selectedIndex === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-neon/20 to-transparent pointer-events-none"
                  />
                )}
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-neon/0 hover:bg-neon/10 transition-colors duration-300 pointer-events-none" />
              </motion.button>
            ))}
          </div>

          {/* Gradient overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  )
}


