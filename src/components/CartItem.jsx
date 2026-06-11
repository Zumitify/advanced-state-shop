// Presentational cart line. Receives the line item and three callbacks; it has
// no knowledge of the reducer. Quantity controls emit events upward.
export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <li className="cart-item" data-testid={`cart-item-${item.id}`}>
      <div className="cart-item-info">
        <span className="cart-item-name">{item.name}</span>
        <span className="cart-item-price">
          ${item.price.toFixed(2)} each
        </span>
      </div>

      <div className="qty-controls">
        <button
          className="btn btn-icon"
          onClick={() => onDecrement(item.id)}
          aria-label={`Decrease ${item.name}`}
        >
          −
        </button>
        <span className="qty" data-testid={`qty-${item.id}`}>
          {item.quantity}
        </span>
        <button
          className="btn btn-icon"
          onClick={() => onIncrement(item.id)}
          aria-label={`Increase ${item.name}`}
        >
          +
        </button>
      </div>

      <div className="cart-item-subtotal">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <button
        className="btn btn-link"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
      >
        ✕
      </button>
    </li>
  )
}
