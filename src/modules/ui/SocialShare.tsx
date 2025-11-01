import { motion } from 'framer-motion'

type Props = {
  url: string
  title: string
  description?: string
}

export default function SocialShare({ url, title, description = '' }: Props) {
  const shareUrl = encodeURIComponent(url)
  const shareTitle = encodeURIComponent(title)
  const shareText = encodeURIComponent(description)

  const share = (platform: string, shareUrl: string) => {
    let targetUrl = ''
    switch (platform) {
      case 'twitter':
        targetUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`
        break
      case 'facebook':
        targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        break
      case 'whatsapp':
        targetUrl = `https://wa.me/?text=${shareTitle}%20${shareUrl}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        return
    }
    if (targetUrl) window.open(targetUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-bone/60">Share:</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => share('twitter', shareUrl)}
        aria-label="Share on Twitter"
        className="p-2 rounded-md bg-black/40 border border-white/10 hover:border-white/30 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => share('facebook', shareUrl)}
        aria-label="Share on Facebook"
        className="p-2 rounded-md bg-black/40 border border-white/10 hover:border-white/30 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => share('copy', '')}
        aria-label="Copy link"
        className="p-2 rounded-md bg-black/40 border border-white/10 hover:border-white/30 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      </motion.button>
    </div>
  )
}


