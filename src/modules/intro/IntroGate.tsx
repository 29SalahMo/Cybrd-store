import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

type IntroGateProps = {
  children: React.ReactNode
}

export default function IntroGate({ children }: IntroGateProps) {
  const { pathname } = useLocation()
  const skipIntro = pathname.startsWith('/policy')
  const [showIntro, setShowIntro] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [canPlay, setCanPlay] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  const baseUrl: string = ((import.meta as any)?.env?.BASE_URL as string) || '/'

  // Always show intro (unless bypassed by route) and render video; avoid prefetch checks

  // Prepare element without fetching data to avoid pre-download/IDM; enable ENTER immediately
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    try {
      v.preload = 'metadata'
      const onCanPlay = () => setCanPlay(true)
      v.addEventListener('canplay', onCanPlay, { once: true })
      return () => v.removeEventListener('canplay', onCanPlay)
    } catch {}
  }, [])

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

  const endIntro = () => setShowIntro(false)

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
          onPlaying={() => setIsPlaying(true)}
          onError={() => {
            setErrorText('Intro video failed to load.')
            endIntro()
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
            disabled={isStarting || !canPlay}
            className={`pointer-events-auto px-10 py-4 border border-white/60 text-white font-extrabold tracking-widest text-3xl md:text-5xl transition-opacity duration-200 ${isStarting ? 'opacity-0' : 'opacity-100'}`}
            style={{ fontFamily: 'Oswald, system-ui, sans-serif' }}
          >
            ENTER
          </button>
        </div>
        {errorText ? (
          <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-red-300">
            {errorText}
          </div>
        ) : null}
        <button
          onClick={endIntro}
          className="absolute left-4 top-4 text-xs md:text-sm uppercase tracking-wide text-white/80 hover:text-white"
        >
          Skip Intro
        </button>
      </div>
    </div>
  )
}


