import { useCart } from '../store/CartContext.jsx'
import CartItem from './CartItem.jsx'

// Container for the cart. Wires store actions to each presentational CartItem
// and renders the running total — all derived from shared state.
export default function Cart() {
  const { cart, cartTotal, increment, decrement, removeFromCart, clearCart } =
    useCart()

  return (
    <section className="cart" aria-label="Shopping cart">
      <div className="section-head">
        <h2>Your Cart</h2>
        {cart.length > 0 && (
          <button className="btn btn-link" onClick={clearCart}>
            Clear all
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <p className="empty">Your cart is empty. Add something nice!</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrement={increment}
                onDecrement={decrement}
                onRemove={removeFromCart}
              />
            ))}
          </ul>

          <div className="cart-total" data-testid="cart-total">
            <span>Total</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <button className="btn btn-primary btn-block">Checkout</button>
        </>
      )}
    </section>
  )
}
