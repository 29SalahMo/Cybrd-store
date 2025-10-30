import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'

export type CartItem = {
  id: number
  name: string
  price: string
  image: string
  size: 'M' | 'L' | 'XL' | '2XL'
  color?: string
  quantity: number
}

type CartState = {
  items: CartItem[]
}

type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: number; size: CartItem['size']; color?: string }
  | { type: 'SET_QTY'; id: number; size: CartItem['size']; color?: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'INIT'; state: CartState }

function cartKey() {
  return 'cbrd.cart.v1'
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'INIT':
      return action.state
    case 'ADD': {
      const idx = state.items.findIndex(
        (i) => i.id === action.item.id && i.size === action.item.size && i.color === action.item.color
      )
      if (idx >= 0) {
        const next = [...state.items]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + action.item.quantity }
        return { items: next }
      }
      return { items: [...state.items, action.item] }
    }
    case 'REMOVE':
      return {
        items: state.items.filter((i) => !(i.id === action.id && i.size === action.size && i.color === action.color))
      }
    case 'SET_QTY': {
      const next = state.items.map((i) =>
        i.id === action.id && i.size === action.size && i.color === action.color
          ? { ...i, quantity: Math.max(1, action.quantity) }
          : i
      )
      return { items: next }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

type CartContextType = {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (id: number, size: CartItem['size'], color?: string) => void
  setQuantity: (id: number, size: CartItem['size'], color: string | undefined, quantity: number) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(cartKey())
      if (raw) {
        const parsed = JSON.parse(raw) as CartState
        dispatch({ type: 'INIT', state: parsed })
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(cartKey(), JSON.stringify(state))
    } catch {}
  }, [state])

  const add = useCallback((item: CartItem) => dispatch({ type: 'ADD', item }), [])
  const remove = useCallback((id: number, size: CartItem['size'], color?: string) => dispatch({ type: 'REMOVE', id, size, color }), [])
  const setQuantity = useCallback((id: number, size: CartItem['size'], color: string | undefined, quantity: number) => dispatch({ type: 'SET_QTY', id, size, color, quantity }), [])
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const count = useMemo(() => state.items.reduce((sum, i) => sum + i.quantity, 0), [state.items])
  const subtotal = useMemo(() => {
    // price like "699 LE"; extract leading number
    return state.items.reduce((sum, i) => {
      const n = parseFloat(i.price.replace(/[^\d.]/g, '')) || 0
      return sum + n * i.quantity
    }, 0)
  }, [state.items])

  const value = useMemo(
    () => ({ items: state.items, add, remove, setQuantity, clear, count, subtotal }),
    [state.items, add, remove, setQuantity, clear, count, subtotal]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


