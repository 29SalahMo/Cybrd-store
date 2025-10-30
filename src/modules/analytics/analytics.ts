type EventName = 'view_item' | 'add_to_cart' | 'begin_checkout' | 'login' | 'signup' | 'purchase'

export function logEvent(name: EventName, params: Record<string, any> = {}) {
  try {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ event: name, ...params, ts: Date.now() })
    if (import.meta.env.DEV) console.debug('[ANALYTICS]', name, params)
  } catch {}
}


