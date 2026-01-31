function pickVisibleImage(container: HTMLElement): HTMLElement | null {
	const imgs = Array.from(container.querySelectorAll('img')) as HTMLElement[]
	if (imgs.length === 0) return null
	let best: { el: HTMLElement; score: number } | null = null
	for (const el of imgs) {
		const style = getComputedStyle(el)
		const opacity = parseFloat(style.opacity || '1')
		const display = style.display !== 'none' ? 1 : 0
		const vis = opacity * display
		if (!best || vis > best.score) best = { el, score: vis }
	}
	return best?.el || imgs[0]
}

export function flyToCart(sourceEl: HTMLElement | null) {
	if (!sourceEl) return
	const target = document.getElementById('cart-target')
	if (!target) return
	const baseContainer = (sourceEl.tagName.toLowerCase() === 'img' ? sourceEl.parentElement || sourceEl : sourceEl) as HTMLElement
	const visibleImg = sourceEl.tagName.toLowerCase() === 'img' ? (sourceEl as HTMLElement) : pickVisibleImage(baseContainer)
	const anchor = visibleImg || baseContainer
	const srcRect = anchor.getBoundingClientRect()
	const dstRect = target.getBoundingClientRect()
	const clone = (anchor.tagName.toLowerCase() === 'img' ? anchor : pickVisibleImage(baseContainer) || baseContainer).cloneNode(true) as HTMLElement

	function styleNode(node: HTMLElement) {
		node.style.position = 'fixed'
		node.style.left = `${srcRect.left}px`
		node.style.top = `${srcRect.top}px`
		node.style.width = `${srcRect.width}px`
		node.style.height = `${srcRect.height}px`
		node.style.pointerEvents = 'none'
		node.style.zIndex = '9999'
		node.style.transformOrigin = 'center center'
		node.style.borderRadius = '12px'
		node.style.boxShadow = '0 10px 28px rgba(0,0,0,0.55)'
		node.style.filter = 'drop-shadow(0 0 10px rgba(0,255,255,0.45)) drop-shadow(0 0 16px rgba(255,0,153,0.35))'
	}

	styleNode(clone)
	document.body.appendChild(clone)

	// temporarily fade the original so it looks like it launched
	const el = anchor as HTMLElement
	const prevOpacity = el.style.opacity
	const prevTransition = el.style.transition
	el.style.transition = prevTransition ? prevTransition + ', opacity 120ms' : 'opacity 120ms'
	el.style.opacity = '0.2'

	const dx = dstRect.left + dstRect.width / 2 - (srcRect.left + srcRect.width / 2)
	const dy = dstRect.top + dstRect.height / 2 - (srcRect.top + srcRect.height / 2)

	clone.style.transition = 'transform 600ms cubic-bezier(0.22,0.61,0.36,1), opacity 600ms, filter 600ms'
	requestAnimationFrame(() => {
		clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.05)`
		clone.style.opacity = '0'
		clone.style.filter = 'drop-shadow(0 0 4px rgba(0,255,255,0.3)) drop-shadow(0 0 8px rgba(255,0,153,0.25))'
	})

	// Restore original visibility a bit before the clone is removed for a snappier feel
	setTimeout(() => {
		el.style.opacity = prevOpacity
		el.style.transition = prevTransition
	}, 520)

	setTimeout(() => {
		clone.remove()
		// cart bump + glow pulse
		const prevT = target.style.transition
		const prevF = target.style.filter
		target.style.transition = 'transform 140ms ease, filter 260ms ease'
		target.style.transform += ' scale(1.12)'
		target.style.filter = 'drop-shadow(0 0 8px rgba(0,255,255,0.45)) drop-shadow(0 0 10px rgba(255,0,153,0.35))'
		setTimeout(() => {
			target.style.transform = target.style.transform.replace(' scale(1.12)', '')
			target.style.filter = prevF
			target.style.transition = prevT
		}, 200)
	}, 620)
}
