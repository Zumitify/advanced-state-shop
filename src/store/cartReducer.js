// Pure, framework-agnostic state logic for the store.
// Keeping the reducer separate from React makes it trivial to unit test:
// it is just (state, action) => newState with no side effects.

export const ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  SET_CATEGORY: 'SET_CATEGORY',
  CLEAR_CART: 'CLEAR_CART',
}

export function createInitialState(products) {
  return {
    // Products carry their own `stock`, which is decremented as items are
    // added to the cart. This is what lets a single "Add to cart" action
    // ripple across several components at once.
    products,
    cart: [], // [{ id, name, price, quantity }]
    category: 'All',
  }
}

function findProduct(products, id) {
  return products.find((p) => p.id === id)
}

export function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART: {
      const product = findProduct(state.products, action.payload.id)
      if (!product || product.stock <= 0) return state // guard: nothing to add

      const existing = state.cart.find((item) => item.id === product.id)
      const cart = existing
        ? state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...state.cart,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
            },
          ]

      const products = state.products.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      )

      return { ...state, cart, products }
    }

    case ACTIONS.INCREMENT: {
      const product = findProduct(state.products, action.payload.id)
      if (!product || product.stock <= 0) return state

      const cart = state.cart.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      const products = state.products.map((p) =>
        p.id === action.payload.id ? { ...p, stock: p.stock - 1 } : p
      )
      return { ...state, cart, products }
    }

    case ACTIONS.DECREMENT: {
      const existing = state.cart.find((item) => item.id === action.payload.id)
      if (!existing) return state

      // Return the unit to stock.
      const products = state.products.map((p) =>
        p.id === action.payload.id ? { ...p, stock: p.stock + 1 } : p
      )

      // Drop the line entirely when quantity hits zero.
      const cart =
        existing.quantity <= 1
          ? state.cart.filter((item) => item.id !== action.payload.id)
          : state.cart.map((item) =>
              item.id === action.payload.id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )

      return { ...state, cart, products }
    }

    case ACTIONS.REMOVE_FROM_CART: {
      const existing = state.cart.find((item) => item.id === action.payload.id)
      if (!existing) return state

      // Restore all reserved stock for this line.
      const products = state.products.map((p) =>
        p.id === action.payload.id
          ? { ...p, stock: p.stock + existing.quantity }
          : p
      )
      const cart = state.cart.filter((item) => item.id !== action.payload.id)
      return { ...state, cart, products }
    }

    case ACTIONS.SET_CATEGORY:
      return { ...state, category: action.payload.category }

    case ACTIONS.CLEAR_CART: {
      // Restore every reserved unit back to its product.
      const restore = new Map(state.cart.map((i) => [i.id, i.quantity]))
      const products = state.products.map((p) =>
        restore.has(p.id) ? { ...p, stock: p.stock + restore.get(p.id) } : p
      )
      return { ...state, cart: [], products }
    }

    default:
      return state
  }
}

// --- Derived selectors (pure helpers used by components & tests) ---

export const selectCartCount = (cart) =>
  cart.reduce((sum, item) => sum + item.quantity, 0)

export const selectCartTotal = (cart) =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const selectVisibleProducts = (products, category) =>
  category === 'All'
    ? products
    : products.filter((p) => p.category === category)
