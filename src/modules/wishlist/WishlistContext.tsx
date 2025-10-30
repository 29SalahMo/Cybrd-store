import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type WishlistState = {
	ids: number[]
}

function storageKey() {
	return 'cbrd.wishlist.v1'
}

type WishlistContextType = {
	ids: number[]
	add: (id: number) => void
	remove: (id: number) => void
	toggle: (id: number) => void
	has: (id: number) => boolean
	clear: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
	const [ids, setIds] = useState<number[]>([])

	useEffect(() => {
		try {
			const raw = localStorage.getItem(storageKey())
			if (raw) {
				const parsed = JSON.parse(raw) as WishlistState
				if (Array.isArray(parsed.ids)) setIds(parsed.ids)
			}
		} catch {}
	}, [])

	useEffect(() => {
		try {
			localStorage.setItem(storageKey(), JSON.stringify({ ids }))
		} catch {}
	}, [ids])

	const add = useCallback((id: number) => setIds((prev) => (prev.includes(id) ? prev : [...prev, id])), [])
	const remove = useCallback((id: number) => setIds((prev) => prev.filter((x) => x !== id)), [])
	const toggle = useCallback((id: number) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])), [])
	const has = useCallback((id: number) => ids.includes(id), [ids])
	const clear = useCallback(() => setIds([]), [])

	const value = useMemo(() => ({ ids, add, remove, toggle, has, clear }), [ids, add, remove, toggle, has, clear])
	return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
	const ctx = useContext(WishlistContext)
	if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
	return ctx
}
