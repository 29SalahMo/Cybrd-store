import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

function BrandMark() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-12">
      <div className="w-12 h-12 rounded-full border border-white/10 glass shadow-glow floating flex items-center justify-center">
        <div className="w-8 h-8 animate-spin-slow" style={{animation: 'spin 12s linear infinite'}}>
          {/* Served from /public/logo.png */}
          <img src={'/logo.png'} alt="brand" className="w-8 h-8 object-contain" />
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 ${scrolled ? 'glass' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-display tracking-widest text-xl">
          <span className="text-bone">C</span>
          <span className="text-burgundy">¥</span>
          <span className="text-bone">BRD</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm">
          {[
            {to: '/shop', label: 'Shop'},
            {to: '/about', label: 'About'},
            {to: '/contact', label: 'Contact'}
          ].map((i) => (
            <NavLink key={i.to} to={i.to} className={({isActive})=>`uppercase tracking-wide hover:text-neon transition ${isActive ? 'text-neon' : 'text-bone/80'}`}>
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <NavLink to="/cart" className="hover:text-magenta transition">Cart</NavLink>
        </div>
      </div>
      <BrandMark />
    </header>
  )
}


