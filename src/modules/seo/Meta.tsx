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
    set('description', description)
    setProperty('og:title', title)
    setProperty('og:description', description)
    setProperty('og:image', image)
    setProperty('og:url', url || window.location.href)
    setProperty('og:type', 'website')
    setProperty('og:site_name', 'C¥BRD')
    // Twitter cards
    set('twitter:card', 'summary_large_image')
    set('twitter:title', title)
    set('twitter:description', description)
    set('twitter:image', image)
    // Canonical URL
    const canonicalUrl = url || window.location.href
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)
  }, [title, description, image, url])
  return null
}


