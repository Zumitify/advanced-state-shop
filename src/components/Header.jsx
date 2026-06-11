import { useCart } from '../store/CartContext.jsx'

// The header's cart badge is a third component that reacts to the same shared
// state: adding a product updates the product card, the cart list, AND this
// badge from a single action.
export default function Header() {
  const { cartCount, cartTotal } = useCart()

  return (
    <header className="app-header">
      <div className="brand">
        <span className="logo" aria-hidden="true">🛍️</span>
        <span>React Store</span>
      </div>
      <div className="cart-badge" data-testid="cart-badge">
        <span className="cart-badge-icon" aria-hidden="true">🛒</span>
        <span className="cart-badge-count" aria-label={`${cartCount} items in cart`}>
          {cartCount}
        </span>
        <span className="cart-badge-total">${cartTotal.toFixed(2)}</span>
      </div>
    </header>
  )
}
