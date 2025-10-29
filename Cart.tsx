export default function Cart() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-4">Cart</h1>
      <div className="glass border border-white/10 rounded-xl p-6 flex items-center justify-between">
        <div className="text-bone/70">Your cart is empty.</div>
        <button className="px-5 py-2 rounded-md bg-magenta font-semibold hover:shadow-glowStrong">Start shopping</button>
      </div>
    </div>
  )
}


