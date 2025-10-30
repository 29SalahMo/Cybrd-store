import { Route, Routes } from 'react-router-dom'
import { Suspense } from 'react'
import Navbar from './layout/Navbar'
import { CartProvider } from './cart/CartContext'
import Footer from './layout/Footer'
import IntroGate from './intro/IntroGate'
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

export default function App() {
  return (
    <IntroGate>
      <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<div className="p-10">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </CartProvider>
      </AuthProvider>
    </IntroGate>
  )
}


