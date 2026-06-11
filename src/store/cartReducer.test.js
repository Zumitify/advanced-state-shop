import { describe, it, expect } from 'vitest'
import {
  ACTIONS,
  cartReducer,
  createInitialState,
  selectCartCount,
  selectCartTotal,
  selectVisibleProducts,
} from './cartReducer.js'

const PRODUCTS = [
  { id: 1, name: 'Keyboard', price: 100, category: 'Electronics', stock: 2 },
  { id: 2, name: 'Coffee', price: 10, category: 'Grocery', stock: 5 },
]

const initial = () => createInitialState(PRODUCTS)

const add = (state, id) =>
  cartReducer(state, { type: ACTIONS.ADD_TO_CART, payload: { id } })

describe('cartReducer', () => {
  it('adds a new product to the cart and decrements its stock', () => {
    const next = add(initial(), 1)

    expect(next.cart).toHaveLength(1)
    expect(next.cart[0]).toMatchObject({ id: 1, name: 'Keyboard', quantity: 1 })
    expect(next.products.find((p) => p.id === 1).stock).toBe(1)
  })

  it('increments quantity when the same product is added again', () => {
    const next = add(add(initial(), 1), 1)

    expect(next.cart).toHaveLength(1)
    expect(next.cart[0].quantity).toBe(2)
    expect(next.products.find((p) => p.id === 1).stock).toBe(0)
  })

  it('refuses to add when stock is depleted (no negative stock)', () => {
    const depleted = add(add(initial(), 1), 1) // stock now 0
    const next = add(depleted, 1)

    expect(next.cart[0].quantity).toBe(2) // unchanged
    expect(next.products.find((p) => p.id === 1).stock).toBe(0)
  })

  it('decrement removes the line and restores stock when quantity hits zero', () => {
    const withItem = add(initial(), 1)
    const next = cartReducer(withItem, {
      type: ACTIONS.DECREMENT,
      payload: { id: 1 },
    })

    expect(next.cart).toHaveLength(0)
    expect(next.products.find((p) => p.id === 1).stock).toBe(2) // restored
  })

  it('removeFromCart returns all reserved stock', () => {
    const withTwo = add(add(initial(), 1), 1) // qty 2, stock 0
    const next = cartReducer(withTwo, {
      type: ACTIONS.REMOVE_FROM_CART,
      payload: { id: 1 },
    })

    expect(next.cart).toHaveLength(0)
    expect(next.products.find((p) => p.id === 1).stock).toBe(2)
  })

  it('clearCart empties the cart and restores every product stock', () => {
    let state = add(initial(), 1)
    state = add(state, 2)
    const next = cartReducer(state, { type: ACTIONS.CLEAR_CART })

    expect(next.cart).toHaveLength(0)
    expect(next.products.find((p) => p.id === 1).stock).toBe(2)
    expect(next.products.find((p) => p.id === 2).stock).toBe(5)
  })

  it('SET_CATEGORY updates the active category filter', () => {
    const next = cartReducer(initial(), {
      type: ACTIONS.SET_CATEGORY,
      payload: { category: 'Grocery' },
    })
    expect(next.category).toBe('Grocery')
  })

  it('does not mutate the previous state (immutability)', () => {
    const state = initial()
    const next = add(state, 1)

    expect(state.cart).toHaveLength(0) // original untouched
    expect(next).not.toBe(state)
  })
})

describe('selectors', () => {
  it('selectCartCount sums quantities', () => {
    const cart = [
      { id: 1, quantity: 2, price: 100 },
      { id: 2, quantity: 3, price: 10 },
    ]
    expect(selectCartCount(cart)).toBe(5)
  })

  it('selectCartTotal sums price * quantity', () => {
    const cart = [
      { id: 1, quantity: 2, price: 100 },
      { id: 2, quantity: 3, price: 10 },
    ]
    expect(selectCartTotal(cart)).toBe(230)
  })

  it('selectVisibleProducts filters by category, "All" returns everything', () => {
    expect(selectVisibleProducts(PRODUCTS, 'All')).toHaveLength(2)
    expect(selectVisibleProducts(PRODUCTS, 'Grocery')).toEqual([
      expect.objectContaining({ id: 2 }),
    ])
  })
})
