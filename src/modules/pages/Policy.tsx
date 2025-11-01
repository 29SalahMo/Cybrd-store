import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Meta from '../seo/Meta'
import Breadcrumbs from '../ui/Breadcrumbs'

type Props = { 
  title: string
  description?: string
  children: React.ReactNode 
}

export function PolicyLayout({ title, description, children }: Props) {
  useEffect(() => { document.title = `${title} — C¥BRD` }, [title])
  return (
    <>
      <Meta 
        title={`${title} — C¥BRD`} 
        description={description || `${title} for C¥BRD. Review our policies and terms.`}
      />
      <div className="max-w-3xl mx-auto px-4 py-12" style={{ position: 'relative', zIndex: 1 }}>
        <Breadcrumbs />
        <h1 className="font-display text-3xl mb-6">{title}</h1>
        <div className="prose prose-invert max-w-none text-bone/80 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </>
  )
}

export function ShippingReturns() {
  return (
    <PolicyLayout 
      title="Shipping & Returns"
      description="Shipping and returns policy for C¥BRD. Learn about delivery times, shipping locations, and return procedures."
    >
      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Shipping</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Orders ship to <strong>Cairo & Giza only</strong> within <strong>2–5 business days</strong>.</li>
          <li>You'll receive a tracking number via email once your order is dispatched.</li>
          <li>Processing time: 1–2 business days after order confirmation.</li>
          <li>Free shipping on orders over 500 LE.</li>
          <li>Standard shipping fee: 50 LE for orders under 500 LE.</li>
        </ul>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Returns & Exchanges</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Returns accepted within <strong>14 days</strong> of delivery.</li>
          <li>Items must be in <strong>original, unworn condition</strong> with tags attached.</li>
          <li>To initiate a return, contact our support team with your order ID.</li>
          <li>Return shipping costs are the responsibility of the customer unless the item is defective or incorrect.</li>
          <li>Refunds will be processed within 5–7 business days after we receive the returned item.</li>
          <li>Exchanges are available for size changes, subject to availability.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Contact</h2>
        <p>For shipping or returns inquiries, please contact us through our <Link to="/contact" className="text-neon hover:underline">contact page</Link> with your order details.</p>
      </section>
    </PolicyLayout>
  )
}

export function PrivacyPolicy() {
  return (
    <PolicyLayout 
      title="Privacy Policy"
      description="C¥BRD privacy policy. Learn how we collect, use, and protect your personal information."
    >
      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Information We Collect</h2>
        <p>We collect only the information necessary to fulfill your orders and provide our services:</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
          <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address when you place an order.</li>
          <li><strong>Payment Information:</strong> We do not store credit card details. Payment processing is handled by secure third-party providers.</li>
          <li><strong>Usage Data:</strong> We may collect information about how you interact with our website, such as pages visited and products viewed.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>To process and fulfill your orders</li>
          <li>To communicate with you about your orders and inquiries</li>
          <li>To send you marketing communications (only with your consent)</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Data Protection</h2>
        <p>We never sell your personal data to third parties. We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
        <p className="mt-3">To exercise these rights, please contact us through our <Link to="/contact" className="text-neon hover:underline">contact page</Link>.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Cookies</h2>
        <p>We use cookies to enhance your browsing experience and analyze website traffic. You can control cookie preferences through your browser settings.</p>
      </section>

      <section>
        <p className="mt-6 text-sm text-bone/60">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </section>
    </PolicyLayout>
  )
}

export function TermsOfService() {
  return (
    <PolicyLayout 
      title="Terms of Service"
      description="Terms of service for C¥BRD. Review the terms and conditions for using our website and purchasing products."
    >
      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Agreement to Terms</h2>
        <p>By accessing and using the C¥BRD website and making a purchase, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Products & Orders</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>All products are subject to availability. We reserve the right to discontinue any product at any time.</li>
          <li>Product descriptions and images are provided for informational purposes. While we strive for accuracy, we cannot guarantee that descriptions or images are completely accurate.</li>
          <li>Prices are subject to change without notice. However, the price you pay is the price displayed at the time of purchase.</li>
          <li>We reserve the right to refuse or cancel any order at our discretion.</li>
          <li>Products are for <strong>personal use only</strong> unless otherwise stated.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Payment</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Payment must be completed at the time of order placement.</li>
          <li>We accept PayPal, Vodafone Cash, Instapay, and Cash on Delivery (where available).</li>
          <li>All prices are displayed in Egyptian Pounds (LE) unless otherwise stated.</li>
          <li>You are responsible for providing accurate payment information.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Shipping & Delivery</h2>
        <p>Shipping terms are outlined in our <Link to="/policy/shipping-returns" className="text-neon hover:underline">Shipping & Returns</Link> policy. Estimated delivery times are provided as guidelines and are not guaranteed.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Intellectual Property</h2>
        <p>All content on this website, including designs, logos, text, graphics, and images, is the property of C¥BRD and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, C¥BRD shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-bone mb-3 mt-6">Contact</h2>
        <p>If you have questions about these terms, please contact us through our <Link to="/contact" className="text-neon hover:underline">contact page</Link>.</p>
      </section>

      <section>
        <p className="mt-6 text-sm text-bone/60">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </section>
    </PolicyLayout>
  )
}


