import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

// Integration test: a single "Add to cart" click must update THREE separate
// components that share state — the header badge, the cart list, and the
// product card's stock — proving the components are wired to one store.
describe('App — shared state across components', () => {
  it('updates the header badge, cart, and product stock from one action', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Header badge starts at 0.
    const badge = screen.getByTestId('cart-badge')
    expect(within(badge).getByLabelText(/items in cart/i)).toHaveTextContent('0')

    // The "Desk Lamp" card starts with 2 in stock.
    const lamp = screen.getByTestId('product-8')
    expect(within(lamp).getByText('2 in stock')).toBeInTheDocument()

    // One click on the Desk Lamp's add button.
    await user.click(within(lamp).getByRole('button', { name: /add to cart/i }))

    // 1) Header badge now reflects 1 item.
    expect(within(badge).getByLabelText(/items in cart/i)).toHaveTextContent('1')
    // 2) Product stock dropped to 1.
    expect(within(lamp).getByText('1 in stock')).toBeInTheDocument()
    // 3) The cart now contains the line item with a subtotal.
    expect(screen.getByTestId('cart-item-8')).toBeInTheDocument()
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$32.00')
  })

  it('filters products by category via the shared store', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Grocery filter should hide the Desk Lamp (an Electronics product).
    await user.click(screen.getByRole('button', { name: 'Grocery' }))

    expect(screen.queryByTestId('product-8')).not.toBeInTheDocument()
    expect(screen.getByTestId('product-4')).toBeInTheDocument() // Cold Brew
  })
})
