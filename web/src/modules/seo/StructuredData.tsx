// JSON-LD structured data for SEO

export function ProductStructuredData({ product }: { 
  product: { id: number; name: string; price: string; image?: string; description?: string } 
}) {
  const price = parseFloat(product.price.replace(/[^\d.]/g, '')) || 0
  const imageUrl = product.image?.startsWith('http') ? product.image : `${window.location.origin}${product.image || ''}`
  
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || 'Premium heavyweight fleece hoodie',
    image: imageUrl,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'EGP',
      availability: 'https://schema.org/InStock',
      url: `${window.location.origin}/product/${product.id}`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'C¥BRD',
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    description: 'Limited-run cyberpunk streetwear and hoodies'
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}


