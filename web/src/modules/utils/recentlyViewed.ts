// Recently viewed products tracking

const STORAGE_KEY = 'cbrd.recentlyViewed'

export function addRecentlyViewed(productId: number) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const ids: number[] = stored ? JSON.parse(stored) : []
    // Remove if already exists, then add to front
    const filtered = ids.filter(id => id !== productId)
    filtered.unshift(productId)
    // Keep only last 10
    const limited = filtered.slice(0, 10)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
  } catch (e) {
    console.error('[recentlyViewed]', e)
  }
}

export function getRecentlyViewed(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('[recentlyViewed]', e)
  }
}


