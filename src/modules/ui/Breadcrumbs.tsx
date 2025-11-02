import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'

export default function Breadcrumbs() {
  const location = useLocation()
  const crumbs = useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean)
    const items: Array<{ label: string; path: string }> = [{ label: 'Home', path: '/' }]
    
    let currentPath = ''
    let i = 0
    while (i < paths.length) {
      const segment = paths[i]
      const isProductWithId = segment === 'product' && paths[i + 1]
      const isPolicyWithSub = segment === 'policy' && paths[i + 1]
      
      if (isProductWithId) {
        // Combine product and ID into one breadcrumb
        currentPath += `/${segment}/${paths[i + 1]}`
        const label = `Product ${paths[i + 1]}`
        items.push({ label, path: currentPath })
        i += 2 // Skip both 'product' and the ID
      } else if (isPolicyWithSub) {
        // Combine policy and sub-page into one breadcrumb
        currentPath += `/${segment}/${paths[i + 1]}`
        const label = paths[i + 1].replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
        items.push({ label, path: currentPath })
        i += 2 // Skip both 'policy' and the sub-page
      } else {
        // Regular segment
        currentPath += `/${segment}`
        let label = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
        
        if (segment === 'policy') {
          label = 'Policies'
        }
        
        items.push({ label, path: currentPath })
        i++
      }
    }
    
    return items
  }, [location.pathname])

  if (crumbs.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-bone/60">
        {crumbs.map((crumb, idx) => (
          <li key={crumb.path} className="flex items-center gap-2">
            {idx > 0 && <span className="text-bone/40">/</span>}
            {idx === crumbs.length - 1 ? (
              <span className="text-bone/90 font-medium" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-neon transition-colors focus:outline-none focus:ring-2 focus:ring-neon/50 rounded px-1"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}


