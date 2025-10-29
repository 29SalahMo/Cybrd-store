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
    name: id === 1 ? 'Flame Angel' : id === 2 ? 'Skelton' : id === 3 ? 'Rhuds' : `C¥BRD Hoodie ${id}`,
    price: PRICE_LE,
    image:
      id === 1 ? `/products/hoodie-1-front.png` :
      id === 2 ? `/products/hoodie-2-front.png` :
      id === 3 ? `/products/hoodie-3-front-black.png` :
      `/products/hoodie-${id}.jpg`,
    backImage:
      id === 1 ? `/products/hoodie-1-back.png` :
      id === 2 ? `/products/hoodie-2-back.png` :
      id === 3 ? `/products/hoodie-3-back-black.png` :
      undefined,
    variants: id === 3 ? {
      black: { front: '/products/hoodie-3-front-black.png', back: '/products/hoodie-3-back-black.png' },
      white: { front: '/products/hoodie-3-front-white.png', back: '/products/hoodie-3-back-white.png' }
    } : undefined
  }
})

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id)
}


