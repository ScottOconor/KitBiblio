"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react"

export interface CartItem {
  id: string
  type: "book" | "course"
  title: string
  price: number
  cover?: string
  paymentLink?: string
  author?: string
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: string; itemType: "book" | "course" }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.some(
        (i) => i.id === action.item.id && i.type === action.item.type
      )
      if (exists) return state
      return { items: [...state.items, action.item] }
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) => !(i.id === action.id && i.type === action.itemType)
        ),
      }
    case "CLEAR_CART":
      return { items: [] }
    case "LOAD_CART":
      return { items: action.items }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: string, type: "book" | "course") => void
  clearCart: () => void
  isInCart: (id: string, type: "book" | "course") => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_KEY = "bookshelf_cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) {
        const items = JSON.parse(stored) as CartItem[]
        dispatch({ type: "LOAD_CART", items })
      }
    } catch {}
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", item })
  const removeItem = (id: string, type: "book" | "course") =>
    dispatch({ type: "REMOVE_ITEM", id, itemType: type })
  const clearCart = () => dispatch({ type: "CLEAR_CART" })
  const isInCart = (id: string, type: "book" | "course") =>
    state.items.some((i) => i.id === id && i.type === type)

  const total = state.items.reduce((sum, i) => sum + i.price, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        count: state.items.length,
        total,
        addItem,
        removeItem,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
