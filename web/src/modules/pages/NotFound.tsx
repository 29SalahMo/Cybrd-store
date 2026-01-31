import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Meta from '../seo/Meta'

export default function NotFound() {
  useEffect(() => { document.title = '404 — Not Found — C¥BRD' }, [])
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <Meta title="404 — Not Found — C¥BRD" description="Page not found." />
      <h1 className="font-display text-6xl md:text-8xl mb-4">404</h1>
      <p className="text-2xl text-bone/80 mb-6">Page not found</p>
      <p className="text-bone/60 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-4 justify-center">
        <Link to="/" className="px-6 py-3 rounded-md bg-neon text-black font-semibold hover:shadow-glowStrong">
          Go Home
        </Link>
        <Link to="/shop" className="px-6 py-3 rounded-md border border-white/15 hover:border-neon">
          Browse Shop
        </Link>
      </div>
    </div>
  )
}

