export type Product = {
  id: number
  name: string
  price: string
  image: string // front image
  backImage?: string // optional back image for hover
  gallery?: string[] // additional product images
  variants?: Record<string, { front: string; back: string; gallery?: string[] }>
}

export const PRICE_LE = '699 LE'

export const products: Product[] = Array.from({ length: 14 }).map((_, i) => {
  const id = i + 1
  return {
    id,
    name: id === 1 ? 'Flame Angel' : id === 2 ? 'Skelton' : id === 3 ? 'Rhuds' : id === 4 ? 'Vampire' : id === 5 ? 'Porshe' : id === 6 ? 'Gang' : id === 7 ? 'Ghost' : id === 8 ? 'subra' : id === 9 ? 'CyButter' : id === 10 ? 'Univrse' : `C¥BRD Hoodie ${id}`,
    price: PRICE_LE,
    image:
      id === 1 ? `/products/hoodie-1-front.png` :
      id === 2 ? `/products/hoodie-2-front.png` :
      id === 3 ? `/products/hoodie-3-front-black.png` :
      id === 4 ? `/products/hoodie-4-front-black.png` :
      id === 5 ? `/products/hoodie-5-front-black.png` :
      id === 6 ? `/products/hoodie-6-front.jpg` :
      id === 7 ? `/products/hoodie-7-front.png` :
      id === 8 ? `/products/hoodie-8-front.png` :
      id === 9 ? `/products/hoodie-9-front-white.png` :
      id === 10 ? `/products/hoodie-10-front-white.png` :
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
      id === 9 ? `/products/hoodie-9-back-white.png` :
      id === 10 ? `/products/hoodie-10-back-white.png` :
      undefined,
    gallery: id === 1 ? [
      '/products/hoodie-1-front.png',
      '/products/hoodie-1-back.png',
      '/products/hoodie-1-front-white.png',
      '/products/hoodie-1-back-white.png',
      // Add more images here: '/products/hoodie-1-detail-1.png',
      // '/products/hoodie-1-detail-2.png',
    ] : id === 2 ? [
      '/products/hoodie-2-front.png',
      '/products/hoodie-2-back.png',
      '/products/hoodie-2-front-white.png',
      '/products/hoodie-2-back-white.png',
      // Add more images here: '/products/hoodie-2-detail-1.png',
    ] : id === 3 ? [
      '/products/hoodie-3-front-black.png',
      '/products/hoodie-3-back-black.png',
      '/products/hoodie-3-front-white.png',
      '/products/hoodie-3-back-white.png',
      // Add more images here: '/products/hoodie-3-detail-1.png',
    ] : id === 4 ? [
      '/products/hoodie-4-front-black.png',
      '/products/hoodie-4-back-black.png',
      '/products/hoodie-4-front-white.png',
      '/products/hoodie-4-back-white.png',
      // Add more images here: '/products/hoodie-4-detail-1.png',
    ] : id === 5 ? [
      '/products/hoodie-5-front-black.png',
      '/products/hoodie-5-back-black.png',
      '/products/hoodie-5-front-white.png',
      '/products/hoodie-5-back-white.png',
      // Add more images here: '/products/hoodie-5-detail-1.png',
    ] : id === 6 ? [
      '/products/hoodie-6-front.jpg',
      '/products/hoodie-6-back.png',
      // Add more images here: '/products/hoodie-6-detail-1.png',
      // '/products/hoodie-6-detail-2.png',
    ] : id === 7 ? [
      '/products/hoodie-7-front.png',
      '/products/hoodie-7-back.png',
      // Add more images here: '/products/hoodie-7-detail-1.png',
      // '/products/hoodie-7-detail-2.png',
    ] : id === 8 ? [
      '/products/hoodie-8-front.png',
      '/products/hoodie-8-back.png',
      // Add more images here: '/products/hoodie-8-detail-1.png',
      // '/products/hoodie-8-detail-2.png',
    ] : id === 9 ? [
      '/products/hoodie-9-front-white.png',
      '/products/hoodie-9-back-white.png',
      // Add more images here: '/products/hoodie-9-detail-1.png',
    ] : id === 10 ? [
      '/products/hoodie-10-front-white.png',
      '/products/hoodie-10-back-white.png',
      // Add more images here: '/products/hoodie-10-detail-1.png',
    ] : [
      // Default gallery structure - add images for other products here
      // '/products/hoodie-11-front.png',
      // '/products/hoodie-11-back.png',
      // '/products/hoodie-11-detail-1.png',
    ],
    variants: id === 3 ? {
      black: { 
        front: '/products/hoodie-3-front-black.png', 
        back: '/products/hoodie-3-back-black.png',
        gallery: [
          '/products/hoodie-3-front-black.png', 
          '/products/hoodie-3-back-black.png',
          // Add more black variant images here:
          // '/products/hoodie-3-black-detail-1.png',
          // '/products/hoodie-3-black-detail-2.png',
        ]
      },
      white: { 
        front: '/products/hoodie-3-front-white.png', 
        back: '/products/hoodie-3-back-white.png',
        gallery: [
          '/products/hoodie-3-front-white.png', 
          '/products/hoodie-3-back-white.png',
          // Add more white variant images here:
          // '/products/hoodie-3-white-detail-1.png',
          // '/products/hoodie-3-white-detail-2.png',
        ]
      }
    } : id === 2 ? {
      black: { 
        front: '/products/hoodie-2-front.png', 
        back: '/products/hoodie-2-back.png',
        gallery: [
          '/products/hoodie-2-front.png', 
          '/products/hoodie-2-back.png',
          // Add more black variant images here:
          // '/products/hoodie-2-black-detail-1.png',
        ]
      },
      white: { 
        front: '/products/hoodie-2-front-white.png', 
        back: '/products/hoodie-2-back-white.png',
        gallery: [
          '/products/hoodie-2-front-white.png', 
          '/products/hoodie-2-back-white.png',
          // Add more white variant images here:
          // '/products/hoodie-2-white-detail-1.png',
        ]
      }
    } : id === 4 ? {
      black: { 
        front: '/products/hoodie-4-front-black.png', 
        back: '/products/hoodie-4-back-black.png',
        gallery: [
          '/products/hoodie-4-front-black.png', 
          '/products/hoodie-4-back-black.png',
          // Add more black variant images here:
          // '/products/hoodie-4-black-detail-1.png',
        ]
      },
      white: { 
        front: '/products/hoodie-4-front-white.png', 
        back: '/products/hoodie-4-back-white.png',
        gallery: [
          '/products/hoodie-4-front-white.png', 
          '/products/hoodie-4-back-white.png',
          // Add more white variant images here:
          // '/products/hoodie-4-white-detail-1.png',
        ]
      }
    } : id === 5 ? {
      black: { 
        front: '/products/hoodie-5-front-black.png', 
        back: '/products/hoodie-5-back-black.png',
        gallery: [
          '/products/hoodie-5-front-black.png', 
          '/products/hoodie-5-back-black.png',
          // Add more black variant images here:
          // '/products/hoodie-5-black-detail-1.png',
        ]
      },
      white: { 
        front: '/products/hoodie-5-front-white.png', 
        back: '/products/hoodie-5-back-white.png',
        gallery: [
          '/products/hoodie-5-front-white.png', 
          '/products/hoodie-5-back-white.png',
          // Add more white variant images here:
          // '/products/hoodie-5-white-detail-1.png',
        ]
      }
    } : id === 1 ? {
      black: { 
        front: '/products/hoodie-1-front.png', 
        back: '/products/hoodie-1-back.png',
        gallery: [
          '/products/hoodie-1-front.png', 
          '/products/hoodie-1-back.png',
          // Add more black variant images here:
          // '/products/hoodie-1-black-detail-1.png',
        ]
      },
      white: { 
        front: '/products/hoodie-1-front-white.png', 
        back: '/products/hoodie-1-back-white.png',
        gallery: [
          '/products/hoodie-1-front-white.png', 
          '/products/hoodie-1-back-white.png',
          // Add more white variant images here:
          // '/products/hoodie-1-white-detail-1.png',
        ]
      }
    } : id === 7 ? ({
      black: { 
        front: '/products/hoodie-7-front.png', 
        back: '/products/hoodie-7-back.png',
        gallery: [
          '/products/hoodie-7-front.png', 
          '/products/hoodie-7-back.png',
          // Add more black variant images here:
          // '/products/hoodie-7-black-detail-1.png',
        ]
      }
    } as Record<string, { front: string; back: string; gallery?: string[] }>) : id === 6 ? ({
      black: { 
        front: '/products/hoodie-6-front.jpg', 
        back: '/products/hoodie-6-back.png',
        gallery: [
          '/products/hoodie-6-front.jpg', 
          '/products/hoodie-6-back.png',
          // Add more black variant images here:
          // '/products/hoodie-6-black-detail-1.png',
        ]
      }
    } as Record<string, { front: string; back: string; gallery?: string[] }>) : id === 8 ? ({
      black: { 
        front: '/products/hoodie-8-front.png', 
        back: '/products/hoodie-8-back.png',
        gallery: [
          '/products/hoodie-8-front.png', 
          '/products/hoodie-8-back.png',
          // Add more black variant images here:
          // '/products/hoodie-8-black-detail-1.png',
        ]
      }
    } as Record<string, { front: string; back: string; gallery?: string[] }>) : id === 9 ? ({
      white: { 
        front: '/products/hoodie-9-front-white.png', 
        back: '/products/hoodie-9-back-white.png',
        gallery: [
          '/products/hoodie-9-front-white.png', 
          '/products/hoodie-9-back-white.png',
          // Add more white variant images here:
          // '/products/hoodie-9-white-detail-1.png',
        ]
      }
    } as Record<string, { front: string; back: string; gallery?: string[] }>) : id === 10 ? ({
      white: { 
        front: '/products/hoodie-10-front-white.png', 
        back: '/products/hoodie-10-back-white.png',
        gallery: [
          '/products/hoodie-10-front-white.png', 
          '/products/hoodie-10-back-white.png',
          // Add more white variant images here:
          // '/products/hoodie-10-white-detail-1.png',
        ]
      }
    } as Record<string, { front: string; back: string; gallery?: string[] }>) : undefined
  }
})

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id)
}


