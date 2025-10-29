export type Product = {
  id: number
  name: string
  price: string
  image: string // front image
  backImage?: string // optional back image for hover
  variants?: Record<string, { front: string; back: string }>
}

export const PRICE_LE = '699 LE'

export const products: Product[] = Array.from({ length: 14 }).map((_, i) => {
  const id = i + 1
  return {
    id,
    name: id === 1 ? 'Flame Angel' : id === 2 ? 'Skelton' : id === 3 ? 'Rhuds' : id === 4 ? 'Vampire' : id === 5 ? 'Porshe' : id === 6 ? 'Gang' : id === 7 ? 'Ghost' : id === 8 ? 'subra' : `C¥BRD Hoodie ${id}`,
    price: PRICE_LE,
    image:
      id === 1 ? `/products/hoodie-1-front.png` :
      id === 2 ? `/products/hoodie-2-front.png` :
      id === 3 ? `/products/hoodie-3-front-black.png` :
      id === 4 ? `/products/hoodie-4-front-black.png` :
      id === 5 ? `/products/hoodie-5-front-black.png` :
      id === 6 ? `/products/hoodie-6-front.png` :
      id === 7 ? `/products/hoodie-7-front.png` :
      id === 8 ? `/products/hoodie-8-front.png` :
      `/products/hoodie-${id}.jpg`,
    backImage:
      id === 1 ? `/products/hoodie-1-back.png` :
      id === 2 ? `/products/hoodie-2-back.png` :
      id === 3 ? `/products/hoodie-3-back-black.png` :
      id === 4 ? `/products/hoodie-4-back-black.png` :
      id === 5 ? `/products/hoodie-5-back-black.png` :
      id === 6 ? `/products/hoodie-6-back.png` :
      id === 7 ? `/products/hoodie-7-back.png` :
      id === 8 ? `/products/hoodie-8-back.png` :
      undefined,
    variants: id === 3 ? {
      black: { front: '/products/hoodie-3-front-black.png', back: '/products/hoodie-3-back-black.png' },
      white: { front: '/products/hoodie-3-front-white.png', back: '/products/hoodie-3-back-white.png' }
    } : id === 2 ? {
      black: { front: '/products/hoodie-2-front.png', back: '/products/hoodie-2-back.png' },
      white: { front: '/products/hoodie-2-front-white.png', back: '/products/hoodie-2-back-white.png' }
    } : id === 4 ? {
      black: { front: '/products/hoodie-4-front-black.png', back: '/products/hoodie-4-back-black.png' },
      white: { front: '/products/hoodie-4-front-white.png', back: '/products/hoodie-4-back-white.png' }
    } : id === 5 ? {
      black: { front: '/products/hoodie-5-front-black.png', back: '/products/hoodie-5-back-black.png' },
      white: { front: '/products/hoodie-5-front-white.png', back: '/products/hoodie-5-back-white.png' }
    } : undefined
  }
})

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id)
}


