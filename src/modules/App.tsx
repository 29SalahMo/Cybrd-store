import { Route, Routes } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Navbar from './layout/Navbar'
import { CartProvider } from './cart/CartContext'
import Footer from './layout/Footer'
import IntroGate from './intro/IntroGate'
import { WishlistProvider } from './wishlist/WishlistContext'
import { AuthProvider } from './auth/AuthContext'
// Lazy load routes for code splitting
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const Product = lazy(() => import('./pages/Product'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const NotFound = lazy(() => import('./pages/NotFound'))
import { ShippingReturns, PrivacyPolicy, TermsOfService } from './pages/Policy'
import { ToastProvider, ToastViewport, useToast } from './ui/ToastContext'
import { ErrorBoundary } from './ui/ErrorBoundary'
import { trackWebVitals, trackPageLoad } from './utils/performance'
import { initSentry } from './ui/SentrySetup'

// Initialize Sentry if configured
if (typeof window !== 'undefined') {
  initSentry()
}

function GlobalErrorHandler({ children }: { children: React.ReactNode }) {
  const { show } = useToast()
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onError = (event: ErrorEvent) => {
      console.error('[ERROR]', event.message)
      if (event.message?.includes('fetch') || event.message?.includes('network') || event.message?.includes('Network')) {
        show('Network error. Please check your connection.', 'error')
      }
    }
    const onRejection = (event: PromiseRejectionEvent) => {
      console.error('[UNHANDLED_REJECTION]', event.reason)
      if (event.reason?.message?.includes('fetch') || event.reason?.message?.includes('network')) {
        show('Network error. Please try again.', 'error')
      }
    }
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [show])
  return <>{children}</>
}

export default function App() {
  useEffect(() => {
    trackWebVitals()
    trackPageLoad()
  }, [])

  return (
    <IntroGate>
      <AuthProvider>
      <WishlistProvider>
      <CartProvider>
      <ToastProvider>
        <GlobalErrorHandler>
        <ErrorBoundary>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main id="main-content" className="flex-1" style={{ position: 'relative', zIndex: 1 }} tabIndex={-1}>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ToastViewport />
        </div>
        </ErrorBoundary>
        </GlobalErrorHandler>
      </ToastProvider>
      </CartProvider>
      </WishlistProvider>
      </AuthProvider>
    </IntroGate>
  )
}


