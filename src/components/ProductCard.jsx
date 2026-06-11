// Presentational component: it knows nothing about the store. It receives
// the product to render plus an `onAdd` callback, and emits an event upward.
// This keeps it trivial to test and reuse in isolation.
export default function ProductCard({ product, onAdd }) {
  const outOfStock = product.stock <= 0

  return (
    <article className="product-card" data-testid={`product-${product.id}`}>
      <div className="product-emoji" aria-hidden="true">
        {product.emoji}
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-category">{product.category}</p>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <p className={`product-stock ${outOfStock ? 'is-out' : ''}`}>
        {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
      </p>
      <button
        className="btn btn-primary"
        onClick={() => onAdd(product.id)}
        disabled={outOfStock}
      >
        {outOfStock ? 'Unavailable' : 'Add to cart'}
      </button>
    </article>
  )
}
