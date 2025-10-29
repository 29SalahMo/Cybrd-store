import { useEffect, useRef, useState } from 'react'

type IntroGateProps = {
  children: React.ReactNode
}

export default function IntroGate({ children }: IntroGateProps) {
  const [showIntro, setShowIntro] = useState(true)
  const [videoExists, setVideoExists] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [canPlay, setCanPlay] = useState(false)

  useEffect(() => {
    let mounted = true
    fetch('/intro/intro.mp4', { method: 'HEAD' })
      .then((r) => mounted && setVideoExists(r.ok))
      .catch(() => mounted && setVideoExists(false))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (videoExists === false) setShowIntro(false)
  }, [videoExists])

  // Preload without playing to avoid lag
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    try {
      v.preload = 'auto'
      v.load() // start fetching/buffering metadata and data
      const onCanPlayThrough = () => setCanPlay(true)
      v.addEventListener('canplaythrough', onCanPlayThrough, { once: true })
      return () => v.removeEventListener('canplaythrough', onCanPlayThrough)
    } catch {}
  }, [videoExists])

  const startVideo = async () => {
    const v = videoRef.current
    if (!v) return
    setIsStarting(true)
    try {
      v.currentTime = 0
      await v.play()
      setIsPlaying(true)
    } catch {
      setIsStarting(false)
    }
  }

  const endIntro = () => setShowIntro(false)

  if (!showIntro) return <>{children}</>

  return (
    <div className="relative min-h-screen">
      <div className="invisible">{children}</div>

      <div className="fixed inset-0 z-50 bg-black">
        {videoExists ? (
          <video
            ref={videoRef}
            src="/intro/intro.mp4"
            className={`w-full h-full object-cover transition-[filter] duration-300 ${isPlaying ? '' : 'blur-md'}`}
            onEnded={endIntro}
            onPlaying={() => setIsPlaying(true)}
            playsInline
            preload="auto"
            // Keep paused until user clicks ENTER
            muted={false}
            controls={false}
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={startVideo}
            disabled={!canPlay && !isStarting}
            className={`pointer-events-auto px-10 py-4 border border-white/60 text-white font-extrabold tracking-widest text-3xl md:text-5xl transition-opacity duration-200 ${isStarting ? 'opacity-0' : 'opacity-100'}`}
            style={{ fontFamily: 'Oswald, system-ui, sans-serif' }}
          >
            ENTER
          </button>
        </div>
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


