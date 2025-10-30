import { Route, Routes } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import Navbar from './layout/Navbar'
import { CartProvider } from './cart/CartContext'
import Footer from './layout/Footer'
import IntroGate from './intro/IntroGate'
import { WishlistProvider } from './wishlist/WishlistContext'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider } from './auth/AuthContext'
import OrderConfirmation from './pages/OrderConfirmation'
import Wishlist from './pages/Wishlist'
import { ShippingReturns, PrivacyPolicy, TermsOfService } from './pages/Policy'
import { ToastProvider, ToastViewport } from './ui/ToastContext'

export default function App() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      console.error('[ERROR]', event.message)
    }
    const onRejection = (event: PromiseRejectionEvent) => {
      console.error('[UNHANDLED_REJECTION]', event.reason)
    }
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])
  return (
    <IntroGate>
      <AuthProvider>
      <WishlistProvider>
      <CartProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<div className="p-10">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/policy/shipping-returns" element={<ShippingReturns />} />
                <Route path="/policy/privacy" element={<PrivacyPolicy />} />
                <Route path="/policy/terms" element={<TermsOfService />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ToastViewport />
        </div>
      </ToastProvider>
      </CartProvider>
      </WishlistProvider>
      </AuthProvider>
    </IntroGate>
  )
}


