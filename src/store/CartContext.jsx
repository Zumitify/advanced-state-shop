import { createContext, useContext, useMemo, useReducer } from 'react'
import {
  ACTIONS,
  cartReducer,
  createInitialState,
  selectCartCount,
  selectCartTotal,
  selectVisibleProducts,
} from './cartReducer.js'
import { PRODUCTS } from '../data/products.js'

// A single Context holds the shared application state. Any component in the
// tree can read state and dispatch actions without prop-drilling, while the
// reducer keeps all mutation logic in one well-tested place.
const CartContext = createContext(null)

export function CartProvider({ children, initialProducts = PRODUCTS }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialProducts,
    createInitialState
  )

  // Bind action creators once so child components get stable callbacks.
  const value = useMemo(() => {
    const addToCart = (id) =>
      dispatch({ type: ACTIONS.ADD_TO_CART, payload: { id } })
    const increment = (id) =>
      dispatch({ type: ACTIONS.INCREMENT, payload: { id } })
    const decrement = (id) =>
      dispatch({ type: ACTIONS.DECREMENT, payload: { id } })
    const removeFromCart = (id) =>
      dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: { id } })
    const setCategory = (category) =>
      dispatch({ type: ACTIONS.SET_CATEGORY, payload: { category } })
    const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART })

    return {
      ...state,
      visibleProducts: selectVisibleProducts(state.products, state.category),
      cartCount: selectCartCount(state.cart),
      cartTotal: selectCartTotal(state.cart),
      categories: ['All', ...new Set(state.products.map((p) => p.category))],
      addToCart,
      increment,
      decrement,
      removeFromCart,
      setCategory,
      clearCart,
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook so consumers never touch the raw context and we can guard usage.
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>')
  }
  return ctx
}
