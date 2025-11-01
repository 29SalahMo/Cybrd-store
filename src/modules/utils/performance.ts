// Performance monitoring and Web Vitals tracking

export function trackWebVitals() {
  if (typeof window === 'undefined') return

  // Track Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    const lastEntry = entries[entries.length - 1] as any
    if (lastEntry) {
      const metric = {
        name: 'LCP',
        value: lastEntry.renderTime || lastEntry.loadTime,
        rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs-improvement' : 'poor'
      }
      logMetric(metric)
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // Track First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    entries.forEach((entry: any) => {
      const metric = {
        name: 'FID',
        value: entry.processingStart - entry.startTime,
        rating: entry.processingStart - entry.startTime < 100 ? 'good' : entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor'
      }
      logMetric(metric)
    })
  }).observe({ entryTypes: ['first-input'] })

  // Track Cumulative Layout Shift (CLS)
  let clsValue = 0
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries() as any[]) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
      }
    }
    const metric = {
      name: 'CLS',
      value: clsValue,
      rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
    }
    logMetric(metric)
  }).observe({ entryTypes: ['layout-shift'] })
}

function logMetric(metric: { name: string; value: number; rating: string }) {
  // Log to analytics
  if ((window as any).dataLayer) {
    ;(window as any).dataLayer.push({
      event: 'web_vital',
      metric: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating
    })
  }
  
  // Log to console in dev
  if (((import.meta as any)?.env?.DEV as boolean) === true) {
    console.debug(`[PERF] ${metric.name}:`, Math.round(metric.value), `(${metric.rating})`)
  }
}

// Measure page load time
export function trackPageLoad() {
  if (typeof window === 'undefined') return
  window.addEventListener('load', () => {
    const perfData = performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    
    if ((window as any).dataLayer) {
      ;(window as any).dataLayer.push({
        event: 'page_load',
        loadTime: pageLoadTime
      })
    }
  })
}


