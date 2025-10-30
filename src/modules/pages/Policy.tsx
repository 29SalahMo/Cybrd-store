import { useEffect } from 'react'

type Props = { title: string; children: React.ReactNode }

export function PolicyLayout({ title, children }: Props) {
  useEffect(() => { document.title = `${title} — C¥BRD` }, [title])
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-4">{title}</h1>
      <div className="prose prose-invert max-w-none text-bone/80">
        {children}
      </div>
    </div>
  )
}

export function ShippingReturns() {
  return (
    <PolicyLayout title="Shipping & Returns">
      <p>Orders ship at Cairo & Giza only within 2–5 business days. You’ll receive tracking once dispatched.</p>
      <p>Returns accepted within 14 days in original condition. Contact support with your order ID.</p>
    </PolicyLayout>
  )
}

export function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>We collect only what is necessary to fulfill your order. We never sell your data.</p>
      <p>Contact us to request deletion of your data.</p>
    </PolicyLayout>
  )
}

export function TermsOfService() {
  return (
    <PolicyLayout title="Terms of Service">
      <p>By purchasing, you agree to our terms regarding payment, shipping, and returns.</p>
      <p>Products are for personal use only unless otherwise stated.</p>
    </PolicyLayout>
  )
}


