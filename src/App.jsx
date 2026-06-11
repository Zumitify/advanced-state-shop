import { CartProvider } from './store/CartContext.jsx'
import Header from './components/Header.jsx'
import ProductList from './components/ProductList.jsx'
import Cart from './components/Cart.jsx'

// The provider wraps the whole tree so Header, ProductList, and Cart all read
// and write the same shared state without any prop drilling between them.
export default function App() {
  return (
    <CartProvider>
      <Header />
      <main className="layout">
        <ProductList />
        <Cart />
      </main>
      <footer className="app-footer">
        Built with React + Context API &amp; useReducer · Vite · Vitest
      </footer>
    </CartProvider>
  )
}
