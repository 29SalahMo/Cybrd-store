import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ERROR_BOUNDARY]', error, errorInfo)
    this.setState({ errorInfo })
    
    // Log to error tracking service (Sentry-ready)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-black">
          <div className="max-w-2xl w-full glass border border-red-500/30 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">⚠</div>
            <h1 className="font-display text-3xl md:text-4xl mb-4 text-red-400">SYSTEM_ERROR</h1>
            <p className="text-bone/70 mb-6">
              Something went wrong. Our team has been notified.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-black/40 p-4 rounded border border-white/10">
                <summary className="cursor-pointer text-red-400 mb-2">Error Details</summary>
                <pre className="text-xs text-bone/60 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-neon text-black font-bold rounded-md hover:bg-neon/90 transition"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className="px-6 py-3 border border-white/20 text-white rounded-md hover:bg-white/5 transition"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}


