import { useCart } from '../store/CartContext.jsx'
import CategoryFilter from './CategoryFilter.jsx'
import ProductCard from './ProductCard.jsx'

// Container component: pulls the filtered product list and the addToCart action
// from the store, then composes presentational children. Children receive only
// the data + callbacks they need.
export default function ProductList() {
  const { visibleProducts, addToCart } = useCart()

  return (
    <section className="product-list" aria-label="Products">
      <div className="section-head">
        <h2>Products</h2>
        <CategoryFilter />
      </div>

      {visibleProducts.length === 0 ? (
        <p className="empty">No products in this category.</p>
      ) : (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      )}
    </section>
  )
}
