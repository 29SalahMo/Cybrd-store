import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'

export default function Breadcrumbs() {
  const location = useLocation()
  const crumbs = useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean)
    const items: Array<{ label: string; path: string }> = [{ label: 'Home', path: '/' }]
    
    let currentPath = ''
    paths.forEach((segment, idx) => {
      currentPath += `/${segment}`
      // Convert segment to readable label
      let label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
      
      // Special cases
      if (segment === 'product' && paths[idx + 1]) {
        label = `Product ${paths[idx + 1]}`
      } else if (segment === 'policy') {
        if (paths[idx + 1]) {
          label = paths[idx + 1].replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
        } else {
          label = 'Policies'
        }
      }
      
      items.push({ label, path: currentPath })
    })
    
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


