// Form validation utilities

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { valid: false, error: 'Email is required' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }
  return { valid: true }
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, error: 'Password is required' }
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' }
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password must be less than 128 characters' }
  }
  // Optional: add strength requirements
  // const hasUpper = /[A-Z]/.test(password)
  // const hasLower = /[a-z]/.test(password)
  // const hasNumber = /\d/.test(password)
  // if (!hasUpper || !hasLower || !hasNumber) {
  //   return { valid: false, error: 'Password must contain uppercase, lowercase, and number' }
  // }
  return { valid: true }
}

export function getPasswordStrength(password: string): { strength: 'weak' | 'medium' | 'strong'; score: number } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { strength: 'weak', score }
  if (score <= 4) return { strength: 'medium', score }
  return { strength: 'strong', score }
}

export function validateName(name: string): ValidationResult {
  if (!name.trim()) {
    return { valid: false, error: 'Name is required' }
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  if (name.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' }
  }
  return { valid: true }
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone.trim()) {
    return { valid: false, error: 'Phone number is required' }
  }
  // Basic phone validation (allows international formats)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
    return { valid: false, error: 'Please enter a valid phone number' }
  }
  return { valid: true }
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value?.trim()) {
    return { valid: false, error: `${fieldName} is required` }
  }
  return { valid: true }
}

export function validateLength(value: string, min: number, max: number, fieldName: string): ValidationResult {
  if (value.length < min) {
    return { valid: false, error: `${fieldName} must be at least ${min} characters` }
  }
  if (value.length > max) {
    return { valid: false, error: `${fieldName} must be less than ${max} characters` }
  }
  return { valid: true }
}


