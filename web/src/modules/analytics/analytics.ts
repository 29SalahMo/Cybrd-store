type EventName =
  | 'view_item'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'login'
  | 'signup'
  | 'purchase'
  | 'cart_open'
  | 'select_color'
  | 'select_size'
  | 'remove_from_wishlist'

export function logEvent(name: EventName, params: Record<string, any> = {}) {
  try {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ event: name, ...params, ts: Date.now() })
    const isDev = ((import.meta as any)?.env?.DEV as boolean) === true
    if (isDev) console.debug('[ANALYTICS]', name, params)
  } catch {}
}


