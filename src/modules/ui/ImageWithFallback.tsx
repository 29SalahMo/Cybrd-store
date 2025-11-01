import { useState } from 'react'

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  skeletonClassName?: string
  fallbackClassName?: string
  eager?: boolean // Set to true to disable lazy loading
  srcSet?: string // Responsive srcset
  sizes?: string // Sizes attribute
}

export default function ImageWithFallback({ skeletonClassName, fallbackClassName, onError, onLoad, eager, srcSet: propSrcSet, sizes: propSizes, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  // Use provided srcSet/sizes, or fall back to defaults (note: rest won't have srcSet/sizes since we destructured them)
  const finalSrcSet = propSrcSet
  const finalSizes = propSizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  return (
    <>
      {!loaded && !failed && (
        <div className={skeletonClassName ?? 'absolute inset-0 animate-pulse bg-white/5'} />
      )}
      {!failed ? (
        <img
          {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
          loading={eager ? 'eager' : (rest.loading || 'lazy')}
          srcSet={finalSrcSet}
          sizes={finalSizes}
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


