// Image optimization utilities for WebP support and responsive images

/**
 * Generates a WebP version of an image path if supported
 * Note: In production, you would use a CDN or image optimization service
 * For now, this is a helper that can be extended
 */
export function getOptimizedImage(src: string, format: 'webp' | 'png' | 'jpg' = 'webp'): string {
  if (!src) return src
  
  // If already absolute URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  
  // In a real app, you'd convert to WebP via:
  // 1. CDN service (Cloudinary, ImageKit, etc.)
  // 2. Build-time conversion
  // 3. Server-side conversion
  
  // For now, return original (can be extended later)
  // Example: if (supportsWebP && format === 'webp') return src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  return src
}

/**
 * Generates responsive srcset for images
 */
export function generateSrcSet(
  baseSrc: string,
  widths: number[] = [400, 800, 1200, 1600]
): string {
  if (!baseSrc) return ''
  
  // In production, use an image optimization service
  // For now, return single source
  // Example: return widths.map(w => `${getOptimizedImage(baseSrc)}?w=${w} ${w}w`).join(', ')
  
  return baseSrc
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * Get appropriate image format based on browser support
 */
export function getBestImageFormat(src: string): string {
  if (supportsWebP() && (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg'))) {
    // In production, return WebP version
    // return src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  }
  return src
}

/**
 * Generates picture element sources for responsive images with format fallbacks
 */
export function generatePictureSources(src: string, alt: string): {
  webp?: string
  fallback: string
  srcSet?: string
  sizes?: string
} {
  const basePath = src.replace(/\.(png|jpg|jpeg|webp)$/i, '')
  
  return {
    // webp: `${basePath}.webp`, // Enable when WebP conversion is set up
    fallback: src,
    srcSet: generateSrcSet(src),
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}

