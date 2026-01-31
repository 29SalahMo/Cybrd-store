// Enhanced keyboard navigation utilities
import React from 'react'

/**
 * Handle arrow key navigation for horizontal lists
 */
export function useArrowKeyNavigation<T extends HTMLElement>(
  items: T[],
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) {
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
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

/**
 * Trap focus within a modal/dialog
 */
export function useFocusTrap(elementRef: React.RefObject<HTMLElement>, isActive: boolean) {
  React.useEffect(() => {
    if (!isActive || !elementRef.current) return
    
    const focusableElements = elementRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) return
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    // Focus first element when trap is activated
    firstElement.focus()
    
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isActive, elementRef])
}

/**
 * Skip to main content link handler (for accessibility)
 */
export const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault()
  const main = document.getElementById('main-content') || document.querySelector('main')
  if (main) {
    (main as HTMLElement).focus()
    main.scrollIntoView({ behavior: 'smooth' })
  }
}
