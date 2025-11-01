import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

type IntroGateProps = {
  children: React.ReactNode
}

export default function IntroGate({ children }: IntroGateProps) {
  const { pathname } = useLocation()
  const skipIntro = pathname.startsWith('/policy')
  const [isMobile, setIsMobile] = useState(false)
  const [showIntro, setShowIntro] = useState(() => {
    // Check if intro was already shown this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('introSeen') === 'true') return false
    // Skip intro on mobile devices for better UX
    if (typeof window !== 'undefined') {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
      if (mobile) return false
    }
    return true
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  const baseUrl: string = ((import.meta as any)?.env?.BASE_URL as string) || '/'

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile && showIntro) {
        setShowIntro(false)
        sessionStorage.setItem('introSeen', 'true')
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [showIntro])

  // Prepare element without fetching data to avoid pre-download/IDM; enable ENTER immediately
  useEffect(() => {
    const v = videoRef.current
    if (!v || !showIntro) return
    
    // Auto-skip after 5 seconds if video doesn't load or start
    const timeout = setTimeout(() => {
      if (!isPlaying && !isStarting) {
        setShowIntro(false)
        sessionStorage.setItem('introSeen', 'true')
      }
    }, 5000)
    
    try {
      v.preload = 'metadata'
      // Ensure video stays paused - no autoplay attempts
      v.muted = true
      v.pause()
      v.currentTime = 0
    } catch {}
    
    return () => clearTimeout(timeout)
  }, [showIntro, isPlaying, isStarting])

  const startVideo = async () => {
    const v = videoRef.current
    if (!v) return
    setIsStarting(true)
    try {
      setErrorText(null)
      // Unmute on user gesture so audio plays
      v.muted = false
      v.volume = 1
      v.currentTime = 0
      await v.play()
      setIsPlaying(true)
    } catch {
      setIsStarting(false)
      setErrorText('Unable to start video. Check codec/support or try again.')
    }
  }

  const endIntro = () => {
    setShowIntro(false)
    sessionStorage.setItem('introSeen', 'true')
  }

  if (skipIntro || !showIntro) return <>{children}</>

  return (
    <div className="relative min-h-screen">
      <div className="invisible">{children}</div>

      <div className="fixed inset-0 z-50 bg-black">
        <video
          ref={videoRef}
          src={`${baseUrl}intro/intro.mp4`}
          className={`w-full h-full object-cover transition-[filter] duration-300 ${isPlaying ? '' : 'blur-md'}`}
          onEnded={endIntro}
          onError={() => {
            setErrorText('Intro video failed to load.')
            // Auto-skip if video fails to load
            setTimeout(() => {
              endIntro()
            }, 2000)
          }}
          playsInline
          preload="metadata"
          // Keep paused until user clicks ENTER
          muted
          controls={false}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={startVideo}
            disabled={isStarting}
            className={`pointer-events-auto px-6 py-3 md:px-10 md:py-4 border-2 border-white/60 text-white font-extrabold tracking-widest text-2xl md:text-5xl transition-opacity duration-200 touch-manipulation ${isStarting ? 'opacity-0' : 'opacity-100'}`}
            style={{ fontFamily: 'Oswald, system-ui, sans-serif', minHeight: '44px', minWidth: '120px' }}
          >
            ENTER
          </button>
        </div>
        {errorText ? (
          <div className="absolute bottom-4 left-4 right-4 text-center text-xs md:text-sm text-red-300 px-4">
            {errorText}
          </div>
        ) : null}
        <button
          onClick={endIntro}
          className="absolute left-2 top-2 md:left-4 md:top-4 text-xs md:text-sm uppercase tracking-wide text-white/80 hover:text-white active:text-white px-3 py-2 md:px-0 md:py-0 touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          Skip Intro
        </button>
      </div>
    </div>
  )
}


