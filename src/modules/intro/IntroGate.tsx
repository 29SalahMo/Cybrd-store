import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

type IntroGateProps = {
  children: React.ReactNode
}

export default function IntroGate({ children }: IntroGateProps) {
  const { pathname } = useLocation()
  const skipIntro = pathname.startsWith('/policy')
  const [showIntro, setShowIntro] = useState(() => {
    // Check if intro was already shown this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('introSeen') === 'true') return false
    return true
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)

  const baseUrl: string = ((import.meta as any)?.env?.BASE_URL as string) || '/'

  // Prepare element without fetching data to avoid pre-download/IDM; enable ENTER immediately
  useEffect(() => {
    const v = videoRef.current
    if (!v || !showIntro) return
    let timeoutId: ReturnType<typeof setTimeout>
    
    const ensureFirstFrame = () => {
      if (v) {
        // Force seek to 0 to show first frame on mobile
        v.currentTime = 0
        v.pause()
        // Small delay then seek again to ensure frame is rendered
        timeoutId = setTimeout(() => {
          if (v && v.readyState >= 2) { // HAVE_CURRENT_DATA
            v.currentTime = 0
            v.pause()
          }
        }, 50)
      }
    }
    
    try {
      // Load video to show first frame (paused and blurred)
      v.preload = 'auto'
      v.muted = true
      v.currentTime = 0
      v.pause()
      
      // Force load on mobile to display first frame
      v.load()
      
      // Set up handlers to ensure first frame shows
      v.addEventListener('loadeddata', ensureFirstFrame, { once: true })
      v.addEventListener('canplay', ensureFirstFrame, { once: true })
      
      return () => {
        v.removeEventListener('loadeddata', ensureFirstFrame)
        v.removeEventListener('canplay', ensureFirstFrame)
        if (timeoutId) clearTimeout(timeoutId)
      }
    } catch {}
  }, [showIntro])

  // Handle video loaded - ensure first frame is visible
  const handleLoadedMetadata = () => {
    const v = videoRef.current
    if (v) {
      setVideoLoading(false)
      // Set to first frame and ensure it's displayed
      v.currentTime = 0
      v.muted = true
      v.pause()
      // Force seek to show first frame on mobile
      setTimeout(() => {
        if (v) {
          v.currentTime = 0
          v.pause()
        }
      }, 100)
    }
  }

  const handleCanPlay = () => {
    const v = videoRef.current
    if (v) {
      setVideoLoading(false)
      setVideoReady(true)
      // Ensure first frame is displayed
      v.currentTime = 0
      v.muted = true
      v.pause()
    }
  }

  const handleLoadedData = () => {
    const v = videoRef.current
    if (v) {
      // Show first frame immediately
      v.currentTime = 0
      v.muted = true
      v.pause()
      setVideoReady(true)
      setVideoLoading(false)
    }
  }

  const handleSeeked = () => {
    // First frame should now be visible
    setVideoReady(true)
    setVideoLoading(false)
    const v = videoRef.current
    if (v) {
      v.pause()
      // Ensure video stays visible (not black) on mobile
      v.style.opacity = '1'
    }
  }

  const startVideo = async () => {
    const v = videoRef.current
    if (!v) return
    setIsStarting(true)
    try {
      setErrorText(null)
      // Reset to start and unmute on user gesture so audio plays
      v.currentTime = 0
      v.muted = false
      v.volume = 1
      await v.play()
      setIsPlaying(true)
      setIsStarting(false)
    } catch (err) {
      setIsStarting(false)
      setErrorText('Unable to start video. Check codec/support or try again.')
      console.error('Play error:', err)
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
          style={{ 
            display: 'block',
            visibility: 'visible',
            backgroundColor: 'transparent',
            opacity: videoReady ? 1 : 0.8,
            minHeight: '100%',
            minWidth: '100%'
          }}
          onEnded={endIntro}
          onLoadedMetadata={handleLoadedMetadata}
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onSeeked={handleSeeked}
          onError={(e) => {
            setVideoLoading(false)
            setErrorText('Intro video failed to load. You can still skip manually.')
            console.error('Video error:', e)
          }}
          onLoadStart={() => setVideoLoading(true)}
          playsInline
          preload="auto"
          // Keep paused until user clicks ENTER - but show first frame
          muted
          controls={false}
        />
        {videoLoading && !errorText && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white/60 text-sm">Loading video...</div>
          </div>
        )}
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


