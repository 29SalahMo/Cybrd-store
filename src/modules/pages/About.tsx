export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-4">About C¥BRD</h1>
      <p className="text-bone/80 leading-relaxed">
        Born from the alleyways and neon-lit nights. C¥BRD merges utilitarian street silhouettes with
        a refined cyber aesthetic. Every piece is designed in-house and produced in limited runs.
      </p>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="glass border border-white/10 rounded-xl p-5">
          <div className="font-semibold mb-2">Materials</div>
          <div className="text-sm text-bone/70">Heavyweight fleece, double-stitched seams, soft-touch interior.</div>
        </div>
        <div className="glass border border-white/10 rounded-xl p-5">
          <div className="font-semibold mb-2">Care</div>
          <div className="text-sm text-bone/70">Cold wash, inside out. Hang dry. Avoid direct heat on prints.</div>
        </div>
        <div className="glass border border-white/10 rounded-xl p-5">
          <div className="font-semibold mb-2">Shipping & Returns</div>
          <div className="text-sm text-bone/70">3–7 days local. 14-day return window on unworn items.</div>
        </div>
      </div>
      <div className="mt-10">
        <div className="font-semibold mb-3">Follow us</div>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com" target="_blank" aria-label="Instagram" className="group inline-flex items-center gap-2 hover:text-neon">
            <span className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 shadow-glow">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm6.25-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z"/>
              </svg>
            </span>
            <span className="text-sm text-bone/80 group-hover:text-bone">Instagram</span>
          </a>
          <a href="http://www.tiktok.com/@cyprd2" target="_blank" aria-label="TikTok" className="group inline-flex items-center gap-2 hover:text-neon">
            <span className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 shadow-glow">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M13.5 3c.5 2.6 2.2 4.5 4.9 4.8v3.1c-1.6 0-3.1-.5-4.9-1.7v5.9c0 3.4-2.3 6-6 6A6.5 6.5 0 0 1 1 14.6C1 10.9 3.7 8.5 7 8.2v3.4c-1.3.2-2.2 1.1-2.2 2.4 0 1.5 1.1 2.6 2.7 2.6 1.6 0 2.5-1.1 2.5-2.6V3h3.5z"/>
              </svg>
            </span>
            <span className="text-sm text-bone/80 group-hover:text-bone">TikTok</span>
          </a>
          <a href="https://facebook.com" target="_blank" aria-label="Facebook" className="group inline-flex items-center gap-2 hover:text-neon">
            <span className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 shadow-glow">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M13 22V12h3.5l.5-3.5H13V6.3c0-1 .3-1.7 1.8-1.7H17V1.4C16.6 1.3 15.5 1 14.2 1 11.5 1 9.6 2.7 9.6 5.9V8.5H6.5V12h3.1v10H13z"/>
              </svg>
            </span>
            <span className="text-sm text-bone/80 group-hover:text-bone">Facebook</span>
          </a>
        </div>
        <div className="mt-6 text-xs text-bone/60">Streetwear • Cyberpunk — minimal hardware, neon edges, heavy textures.</div>
      </div>
    </div>
  )
}


