# React Store — Advanced State Management & Component Composition

A small but complete shopping-cart application that demonstrates **advanced
state management** and **clean component composition** in React. A single user
action (e.g. *Add to cart*) ripples through several independent components — the
header badge, the product grid, and the cart — all driven by one shared store.

🔗 **Live demo:** https://zumitify.github.io/advanced-state-shop/
🔗 **Repository:** https://github.com/Zumitify/advanced-state-shop

---

## ✨ What it demonstrates

| Requirement | Where it lives |
| --- | --- |
| Advanced state management | `src/store/cartReducer.js` (pure reducer) + `src/store/CartContext.jsx` (Context API + `useReducer`) |
| Two+ interactive components sharing state | `Header` (cart badge), `ProductList`/`ProductCard`, `Cart`/`CartItem`, `CategoryFilter` |
| Component composition (props down, events up) | Presentational components (`ProductCard`, `CartItem`) receive only needed props and emit callbacks; containers wire them to the store |
| Complex multi-component interaction | One *Add to cart* click updates the cart list, the running total, the header badge, **and** the product's stock display simultaneously |
| Unit tests | `cartReducer.test.js` (state logic), `ProductCard.test.jsx` (component), `App.test.jsx` (integration) |

## 🧠 State management approach

The app uses the **React Context API combined with `useReducer`** — a robust,
dependency-free pattern well suited to shared application state.

- **`cartReducer.js`** is a *pure* `(state, action) => newState` function with no
  React dependency. All mutation logic (add, increment, decrement, remove,
  clear, filter) and derived **selectors** live here, which makes the logic
  trivially unit-testable.
- **`CartContext.jsx`** owns the single `useReducer` instance, exposes bound
  action creators and memoized derived values, and provides a `useCart()` hook so
  no component ever drills props or touches the raw context.

```
ADD_TO_CART ─▶ reducer ─▶ new state ─▶ Context re-render
                                         ├─ Header badge (count + total)
                                         ├─ ProductCard (stock ↓, button state)
                                         └─ Cart (line item + total)
```

### Separation of concerns

- **Store layer** (`src/store`) — *what the state is and how it changes.*
- **Container components** (`ProductList`, `Cart`, `CategoryFilter`, `Header`) —
  *connect the store to the UI.*
- **Presentational components** (`ProductCard`, `CartItem`) — *pure UI, props in /
  events out, no store knowledge.*

## 🗂️ Project structure

```
src/
├── data/products.js          # seed catalogue (with per-product stock)
├── store/
│   ├── cartReducer.js        # pure reducer + selectors  (unit-tested)
│   ├── cartReducer.test.js
│   └── CartContext.jsx       # Context provider + useCart() hook
├── components/
│   ├── Header.jsx            # cart badge (reads shared state)
│   ├── ProductList.jsx       # container
│   ├── ProductCard.jsx       # presentational  (unit-tested)
│   ├── ProductCard.test.jsx
│   ├── CategoryFilter.jsx
│   ├── Cart.jsx              # container
│   └── CartItem.jsx          # presentational
├── App.jsx
├── App.test.jsx             # integration test (multi-component update)
└── main.jsx
```

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm test         # run the unit + integration test suite
npm run build    # production build into dist/
npm run preview  # preview the production build locally
```

## ✅ Tests

Built with **Vitest** + **React Testing Library**.

```bash
npm test
```

Coverage includes:
- **State logic** — adding, stock decrement/restore, quantity changes, removal,
  clearing, category filtering, and immutability guarantees.
- **Component** — `ProductCard` rendering, the `onAdd` callback contract, and the
  out-of-stock disabled state.
- **Integration** — one action updating the header badge, the cart, and product
  stock at once.

## 🌐 Deployment

The app is a static SPA (`vite build` → `dist/`) and `base` is set to `./`, so it
deploys to any static host.

**GitHub Pages** (workflow included at `.github/workflows/deploy.yml`):
push to `main` and enable Pages → "GitHub Actions" in repo settings.

**Netlify / Vercel:** build command `npm run build`, publish directory `dist`.

---

Built with React 18 · Vite · Vitest · Context API + `useReducer`.
