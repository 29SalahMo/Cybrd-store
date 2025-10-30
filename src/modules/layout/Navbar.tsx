import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../cart/CartContext'
import { useAuth } from '../auth/AuthContext'

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
  const { count } = useCart()
  const { user, logout } = useAuth()
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
          {user ? (
            <>
              <span className="hidden md:inline text-bone/70 text-sm">Hi, {user.email}</span>
              <button onClick={logout} className="text-sm text-bone/70 hover:text-bone">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-neon transition text-sm">Login</NavLink>
              <NavLink to="/signup" className="hover:text-neon transition text-sm">Sign up</NavLink>
            </>
          )}
          <NavLink to="/cart" className="relative hover:text-magenta transition">
            Cart
            {count > 0 && (
              <span className="absolute -right-3 -top-2 text-[10px] px-1.5 py-0.5 rounded-full bg-neon text-black font-bold">{count}</span>
            )}
          </NavLink>
        </div>
      </div>
      <BrandMark />
    </header>
  )
}


