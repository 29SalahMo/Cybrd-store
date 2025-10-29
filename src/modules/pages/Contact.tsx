export default function Contact() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-6">Contact</h1>
      <form className="space-y-4">
        <input placeholder="Name" className="w-full bg-transparent border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-neon" />
        <input placeholder="Email" className="w-full bg-transparent border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-neon" />
        <textarea rows={5} placeholder="Message" className="w-full bg-transparent border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-neon" />
        <button className="px-6 py-3 rounded-md bg-neon text-black font-semibold hover:shadow-glowStrong">Send</button>
      </form>
    </div>
  )
}


