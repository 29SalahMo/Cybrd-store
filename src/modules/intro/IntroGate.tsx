import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

type IntroGateProps = {
  children: React.ReactNode
}

export default function IntroGate({ children }: IntroGateProps) {
  const { pathname } = useLocation()
  const skipIntro = pathname.startsWith('/policy')
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('introSeen') === 'true') return false
    return true
  })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errorText, setErrorText] = useState<string | null>(null)

  const baseUrl: string = ((import.meta as any)?.env?.BASE_URL as string) || '/'
  const videoSrc = `${baseUrl}intro/intro.mp4`

  // Fast preloading and frame preparation
  useEffect(() => {
    const v = videoRef.current
    if (!v || !showIntro) return
    
    v.preload = 'auto'
    v.muted = true
    
    const handleCanPlay = () => {
      setIsLoaded(true)
    }

    const showFirstFrame = () => {
      if (v && !isPlaying) {
        v.currentTime = 0
        v.pause()
        setIsLoaded(true)
      }
    }
    
    v.addEventListener('canplay', handleCanPlay)
    v.addEventListener('loadeddata', showFirstFrame)
    v.load()
    
    return () => {
      v.removeEventListener('canplay', handleCanPlay)
      v.removeEventListener('loadeddata', showFirstFrame)
    }
  }, [showIntro])

  // Track video progress
  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (v && v.duration) {
      setProgress((v.currentTime / v.duration) * 100)
    }
  }

  const startVideo = async () => {
    const v = videoRef.current
    if (!v) return
    
    setIsStarting(true)
    setErrorText(null)
    
    try {
      v.currentTime = 0
      v.muted = isMuted
      v.volume = 1
      await v.play()
      setIsPlaying(true)
      setIsStarting(false)
    } catch (err) {
      console.warn('Playback error with audio, trying muted:', err)
      // Fallback: Autoplay with audio might be blocked by browser policy
      try {
        v.muted = true
        setIsMuted(true)
        await v.play()
        setIsPlaying(true)
        setIsStarting(false)
      } catch (fallbackErr) {
        setIsStarting(false)
        setErrorText('Unable to start video automatically. Click Skip to proceed.')
        console.error('Final play error:', fallbackErr)
      }
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (v) {
      v.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleEndIntro = () => {
    setIsExiting(true)
    setTimeout(() => {
      setShowIntro(false)
      sessionStorage.setItem('introSeen', 'true')
    }, 600) // smooth fade-out duration
  }

  if (skipIntro || !showIntro) return <>{children}</>

  return (
    <div className="relative min-h-screen overflow-hidden bg-black select-none">
      {/* Background Main Site Content (invisible until intro completes) */}
      <div className={`transition-opacity duration-700 ${isExiting ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>

      {/* Intro Gate Fullscreen Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-all duration-700 ease-out ${
          isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Intro Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onEnded={handleEndIntro}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setErrorText('Video stream unavailable. Click Skip to enter.')}
          playsInline
          preload="auto"
          muted={isMuted}
          controls={false}
        />

        {/* Ambient Dark Overlay Gradients for Depth & Cinematic Contrast */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80 pointer-events-none transition-opacity duration-500 ${
            isPlaying ? 'opacity-40' : 'opacity-90'
          }`}
        />

        {/* Brand Header Tagline (Visible before video starts) */}
        {!isPlaying && (
          <div className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 transition-all duration-500">
            <div className="text-neon text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-1 drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">
              Welcome to
            </div>
            <h1 className="text-white font-extrabold text-3xl md:text-5xl tracking-[0.25em] font-display neon-text">
              C¥BRD STORE
            </h1>
          </div>
        )}

        {/* Interactive Motion ENTER Button Container */}
        <div
          className={`relative z-20 flex flex-col items-center justify-center transition-all duration-500 ${
            isStarting || isPlaying ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          {/* Subtle Outer Glowing Halo */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-neon/30 via-magenta/20 to-neon/30 blur-2xl animate-pulse opacity-70 pointer-events-none" />

          {/* Dynamic Interactive ENTER Button */}
          <button
            onClick={startVideo}
            disabled={isStarting || isPlaying}
            className="group relative enter-btn animate-neon-pulse px-8 py-4 md:px-14 md:py-5 rounded-sm border-2 border-neon/70 text-white font-extrabold tracking-[0.25em] text-2xl md:text-4xl transition-all duration-300 transform active:scale-95 touch-manipulation cursor-pointer flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(0,229,255,0.4)]"
            style={{ fontFamily: 'Oswald, system-ui, sans-serif' }}
          >
            {/* Shimmer Light Sweep Effect */}
            <span className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer pointer-events-none" />

            {/* Glowing Corner Accents */}
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white group-hover:scale-125 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white group-hover:scale-125 transition-transform duration-300" />
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white group-hover:scale-125 transition-transform duration-300" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white group-hover:scale-125 transition-transform duration-300" />

            {/* Interactive Button Text with Motion & Hover Expansion */}
            <span className="relative z-10 transition-all duration-300 group-hover:tracking-[0.4em] group-hover:text-cyan-300 drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]">
              ENTER
            </span>

            {/* Sliding Arrow Icon on Hover */}
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-neon transform transition-all duration-300 group-hover:translate-x-2 group-hover:text-white drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Subtext Prompt */}
          <span className="mt-4 text-xs md:text-sm tracking-[0.2em] text-neutral-400 font-medium uppercase transition-opacity duration-300 group-hover:text-white">
            Click to start experience
          </span>
        </div>

        {/* Video Controls (Visible during playback) */}
        {isPlaying && (
          <>
            {/* Audio Mute / Unmute Toggle Button */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-30 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 hover:text-neon hover:border-neon hover:scale-110 active:scale-95 transition-all duration-200"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>

            {/* Sleek Bottom Video Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30 pointer-events-none">
              <div
                className="h-full bg-gradient-to-r from-neon via-cyan-400 to-magenta transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {/* Error notification if video fails */}
        {errorText && (
          <div className="absolute bottom-16 left-4 right-4 z-30 text-center text-xs md:text-sm text-red-400 bg-black/80 py-2 px-4 rounded border border-red-500/40 backdrop-blur-md max-w-md mx-auto">
            {errorText}
          </div>
        )}

        {/* Interactive Skip Intro Button */}
        <button
          onClick={handleEndIntro}
          className="absolute top-4 left-4 z-30 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-neutral-300 hover:text-neon active:text-white px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:border-neon/50 transition-all duration-300 hover:scale-105"
        >
          Skip Intro
        </button>
      </div>
    </div>
  )
}

