import { useEffect, useState } from 'react'

export default function Footer() {
  const [credit, setCredit] = useState<{text: string, url: string}>({text: '', url: ''})
  useEffect(() => {
    fetch('/model-source.json').then(async r => {
      if (!r.ok) return
      const j = await r.json().catch(() => null)
      if (j && j.creditText) setCredit({text: j.creditText, url: j.creditUrl || ''})
    }).catch(()=>{})
  }, [])

  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm text-bone/70">
        <div>
          <div className="font-display text-xl">
            <span className="text-bone">C</span>
            <span className="text-burgundy">¥</span>
            <span className="text-bone">BRD</span>
          </div>
          <p className="mt-2 max-w-sm">Streetwear engineered with a cyberpunk soul. Drops, capsules and limited collabs.</p>
          {credit.text && (
            <p className="mt-2 text-xs text-bone/50">3D hoodie courtesy of <a className="underline hover:text-neon" href={credit.url || '#'} target="_blank" rel="noreferrer">{credit.text}</a></p>
          )}
        </div>
        <ul className="space-y-2">
          <li><a className="hover:text-neon" href="/policy/shipping-returns">Shipping & Returns</a></li>
          <li><a className="hover:text-neon" href="/policy/privacy">Privacy</a></li>
          <li><a className="hover:text-neon" href="/policy/terms">Terms</a></li>
        </ul>
        <div>
          <p className="mb-2">Join the drop list</p>
          <form className="flex gap-2">
            <input type="email" placeholder="you@domain" className="bg-transparent border border-white/10 px-3 py-2 rounded-md w-full focus:outline-none focus:border-neon" />
            <button className="px-4 py-2 rounded-md bg-neon text-black font-medium hover:shadow-glowStrong">Join</button>
          </form>
        </div>
      </div>
      <div className="text-center py-6 text-xs text-bone/50">© {new Date().getFullYear()} C¥BRD. All rights reserved.</div>
    </footer>
  )
}


