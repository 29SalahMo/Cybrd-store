import { Canvas, useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function SpinningLogo() {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/logo.png')
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [])
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!meshRef.current) return
    meshRef.current.rotation.y = t * 0.6
    meshRef.current.position.y = 1.2 + Math.sin(t * 1.2) * 0.06
  })
  return (
    <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.2}>
      <mesh ref={meshRef} position={[-2.3, 1.05, -1.5]} renderOrder={10}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial map={texture} metalness={0.35} roughness={0.35} emissive={new THREE.Color('#00E5FF')} emissiveIntensity={0.75} />
      </mesh>
    </Float>
  )
}

function HoodiePrimitive(props: { scale?: number, url?: string }) {
  const gltf = useGLTF(props.url ?? '/hoodie.glb')
  return <primitive object={gltf.scene} scale={props.scale ?? 1} />
}

function BackgroundHoodie({ scrollY }: { scrollY: number }) {
  const group = useRef<THREE.Group>(null)
  const [hasHoodie, setHasHoodie] = useState(false)
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    // 1) Try local hoodie.glb
    fetch('/hoodie.glb', { method: 'GET' })
      .then((r) => {
        if (!mounted) return
        const ct = r.headers.get('content-type') || ''
        const isModel = ct.includes('model') || ct.includes('application/octet-stream')
        const isHtml = ct.includes('text/html')
        const okLocal = r.ok && isModel && !isHtml
        setHasHoodie(okLocal)
        if (okLocal) return
        // 2) If not local, try remote URL config
        return fetch('/model-source.json').then(async (cfg) => {
          if (!cfg.ok) return
          const json = await cfg.json().catch(() => null)
          if (json && json.hoodieUrl) setRemoteUrl(json.hoodieUrl as string)
        })
      })
      .catch(() => mounted && setHasHoodie(false))
    return () => { mounted = false }
  }, [])

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    if (group.current) {
      const s = Math.max(0, Math.min(1, scrollY / 800))
      group.current.rotation.y = -0.3 + s * 0.6 + Math.sin(t * 0.15) * 0.05
      group.current.position.y = -1.2 + s * 0.3 + Math.sin(t * 0.25) * 0.03
    }
    camera.position.z = 3.6
  })
  return (
    <group ref={group} position={[0, -1.2, -1.6]}>
      {hasHoodie || remoteUrl ? (
        <HoodiePrimitive scale={1.8} url={remoteUrl ?? undefined} />
      ) : (
        <mesh rotation={[0.2, 0.4, 0]}>
          <torusKnotGeometry args={[1.0, 0.25, 180, 32]} />
          <meshStandardMaterial color={'#0f1113'} metalness={0.2} roughness={0.6} />
        </mesh>
      )}
    </group>
  )
}

function ColorLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 2]} intensity={1.1} color={new THREE.Color('#ffffff')} />
      <pointLight position={[-2.5, 1.2, -1]} intensity={1.6} color={new THREE.Color('#00E5FF')} />
      <pointLight position={[2.5, -0.2, -1]} intensity={1.2} color={new THREE.Color('#FF1177')} />
    </>
  )
}

export default function Scene({ children }: { children?: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0)
  const [webgl, setWebgl] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    // Initialize scroll position immediately
    setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    // Also listen for resize in case layout changes
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      const ok = !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
      setWebgl(ok)
    } catch {
      setWebgl(false)
    }
  }, [])

  return (
    <div className="relative">
      {/* Background 3D layer - must stay behind all content */}
      {webgl && (
        <div 
          className="fixed inset-0 pointer-events-none" 
          style={{ 
            zIndex: -9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none'
          }}
        >
          <Canvas 
            camera={{ position: [0, 0.6, 3.6], fov: 50 }} 
            dpr={[1, 2]}
            style={{ position: 'absolute', zIndex: -9999 }}
          >
            <Suspense fallback={null}>
              <BackgroundHoodie scrollY={scrollY} />
              <SpinningLogo />
              <ColorLights />
            </Suspense>
          </Canvas>
        </div>
      )}
      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}


