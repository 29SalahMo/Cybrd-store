// Enhanced keyboard navigation utilities

/**
 * Handle arrow key navigation for horizontal lists
 */
export function useArrowKeyNavigation<T extends HTMLElement>(
  items: T[],
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) {
  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    if (orientation === 'horizontal') {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault()
        items[currentIndex - 1]?.focus()
      } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        e.preventDefault()
        items[currentIndex + 1]?.focus()
      }
    } else {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault()
        items[currentIndex - 1]?.focus()
      } else if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
        e.preventDefault()
        items[currentIndex + 1]?.focus()
      }
    }
    
    // Home/End navigation
    if (e.key === 'Home') {
      e.preventDefault()
      items[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1]?.focus()
    }
  }
  
  return handleKeyDown
}
