import { handleSkipToContent } from '../utils/keyboardNavigation'

/**
 * Skip to main content link (for accessibility)
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-neon focus:text-black focus:font-bold focus:rounded-md focus:outline-none focus:ring-2 focus:ring-neon"
      onClick={handleSkipToContent}
    >
      Skip to main content
    </a>
  )
}
