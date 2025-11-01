// Sentry error tracking setup
// To enable: Install @sentry/react and configure with your DSN

export function initSentry() {
  // Check if Sentry is available
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    // Sentry is already initialized
    return
  }

  // Uncomment and configure when ready:
  /*
  import * as Sentry from '@sentry/react'
  
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0, // Adjust based on traffic
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE || 'production',
  })
  */
}

// Helper to manually capture exceptions
export function captureException(error: Error, context?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    ;(window as any).Sentry.captureException(error, { contexts: { custom: context } })
  }
  console.error('[ERROR]', error, context)
}

// Helper to capture messages
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    ;(window as any).Sentry.captureMessage(message, level)
  }
}

