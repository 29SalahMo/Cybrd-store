import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../cart/CartContext'
import { useAuth } from '../auth/AuthContext'
import { useWishlist } from '../wishlist/WishlistContext'

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
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const { user, logout } = useAuth()
  const { ids } = useWishlist()
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
          <button className="md:hidden px-3 py-2 border border-white/15 rounded-md" onClick={()=>setOpen((o)=>!o)} aria-label="Menu">☰</button>
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
          <NavLink id="wishlist-target" to="/wishlist" className="relative hover:text-neon transition flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12.1 21s-6.6-3.9-9-7.5C1 10 2.5 7 5.5 7c2 0 3.1 1.3 3.6 2.2.5-.9 1.6-2.2 3.6-2.2 3 0 4.5 3 2.4 6.5-2.4 3.6-9 7.5-9 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {ids.length > 0 && (
              <span key={ids.length} className="absolute -right-3 -top-2 text-[10px] px-1.5 py-0.5 rounded-full bg-magenta text-black font-bold animate-pulse">{ids.length}</span>
            )}
          </NavLink>
          <NavLink id="cart-target" to="/cart" className="relative hover:text-magenta transition flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-13L5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="21" r="1" fill="currentColor"/>
              <circle cx="18" cy="21" r="1" fill="currentColor"/>
            </svg>
            {count > 0 && (
              <span key={count} className="absolute -right-3 -top-2 text-[10px] px-1.5 py-0.5 rounded-full bg-neon text-black font-bold animate-pulse">{count}</span>
            )}
          </NavLink>
        </div>
      </div>
      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={()=>setOpen(false)}></div>
        <div className={`absolute left-0 top-0 h-full w-72 glass border-r border-white/10 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div className="font-display">C¥BRD</div>
            <button onClick={()=>setOpen(false)} aria-label="Close">✕</button>
          </div>
          <nav className="p-4 flex flex-col gap-3">
            <NavLink to="/shop" onClick={()=>setOpen(false)} className="uppercase tracking-wide text-bone/90">Shop</NavLink>
            <NavLink to="/about" onClick={()=>setOpen(false)} className="uppercase tracking-wide text-bone/90">About</NavLink>
            <NavLink to="/contact" onClick={()=>setOpen(false)} className="uppercase tracking-wide text-bone/90">Contact</NavLink>
            <div className="h-px bg-white/10 my-2"></div>
            {user ? (
              <button onClick={()=>{logout(); setOpen(false)}} className="text-left text-bone/80">Logout</button>
            ) : (
              <>
                <NavLink to="/login" onClick={()=>setOpen(false)} className="text-bone/80">Login</NavLink>
                <NavLink to="/signup" onClick={()=>setOpen(false)} className="text-bone/80">Sign up</NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
      <BrandMark />
    </header>
  )
}


