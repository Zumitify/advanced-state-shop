import { useCart } from '../store/CartContext.jsx'

// Reads the list of categories + active selection from the store and dispatches
// a category change. Because filtering lives in the reducer/selectors, this
// component stays purely about presentation of the filter controls.
export default function CategoryFilter() {
  const { categories, category, setCategory } = useCart()

  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`chip ${cat === category ? 'chip-active' : ''}`}
          onClick={() => setCategory(cat)}
          aria-pressed={cat === category}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
