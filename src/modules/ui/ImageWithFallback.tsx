import { useState } from 'react'

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  skeletonClassName?: string
  fallbackClassName?: string
}

export default function ImageWithFallback({ skeletonClassName, fallbackClassName, onError, onLoad, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <>
      {!loaded && !failed && (
        <div className={skeletonClassName ?? 'absolute inset-0 animate-pulse bg-white/5'} />
      )}
      {!failed ? (
        <img
          {...rest}
          onLoad={(e)=>{ setLoaded(true); onLoad?.(e) }}
          onError={(e)=>{ setFailed(true); onError?.(e) }}
          style={{ ...(rest.style||{}), display: failed ? 'none' : undefined }}
        />
      ) : (
        <div className={fallbackClassName ?? 'absolute inset-0 bg-black/40 flex items-center justify-center text-bone/40 text-xs'}>
          image unavailable
        </div>
      )}
    </>
  )
}


