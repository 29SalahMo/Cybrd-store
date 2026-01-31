import { useEffect } from 'react'

type Props = {
  title?: string
  description?: string
  image?: string
  url?: string
}

export default function Meta({ title, description, image, url }: Props) {
  useEffect(() => {
    if (title) document.title = title
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
    
    // Helper to create absolute URL for images
    const getAbsoluteImageUrl = (img?: string): string => {
      if (!img) return ''
      if (img.startsWith('http://') || img.startsWith('https://')) return img
      if (img.startsWith('//')) return `https:${img}`
      if (img.startsWith('/')) return `${baseUrl}${img}`
      return `${baseUrl}/${img}`
    }
    
    const absoluteImage = getAbsoluteImageUrl(image)
    
    const set = (name: string, content?: string) => {
      if (!content) return
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }
    const setProperty = (property: string, content?: string) => {
      if (!content) return
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }
    
    // Basic meta tags
    set('description', description)
    
    // Open Graph tags
    setProperty('og:title', title)
    setProperty('og:description', description)
    if (absoluteImage) {
      setProperty('og:image', absoluteImage)
      setProperty('og:image:width', '1200')
      setProperty('og:image:height', '630')
      setProperty('og:image:type', 'image/png')
    }
    setProperty('og:url', fullUrl)
    setProperty('og:type', 'website')
    setProperty('og:site_name', 'C¥BRD')
    setProperty('og:locale', 'en_US')
    
    // Twitter Card tags
    set('twitter:card', 'summary_large_image')
    set('twitter:title', title)
    set('twitter:description', description)
    if (absoluteImage) {
      set('twitter:image', absoluteImage)
    }
    set('twitter:site', '@cybrd') // Update with your actual Twitter handle if you have one
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)
  }, [title, description, image, url])
  return null
}


