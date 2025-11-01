// Input sanitization utilities to prevent XSS attacks

/**
 * Sanitize HTML string to prevent XSS
 * For production, consider using DOMPurify library
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html
  
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Sanitize user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim()
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
    return '#'
  }
  return trimmed
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  return sanitizeInput(email.toLowerCase().trim())
}

/**
 * Escape special characters for use in HTML attributes
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}


