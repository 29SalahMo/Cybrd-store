import { useEffect, RefObject } from 'react'

/**
 * Trap focus within a modal/dialog
 */
export function useFocusTrap(elementRef: RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
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

