import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard.jsx'

const product = {
  id: 1,
  name: 'Mechanical Keyboard',
  price: 89.99,
  category: 'Electronics',
  stock: 3,
  emoji: '⌨️',
}

describe('<ProductCard />', () => {
  it('renders product details', () => {
    render(<ProductCard product={product} onAdd={() => {}} />)

    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument()
    expect(screen.getByText('$89.99')).toBeInTheDocument()
    expect(screen.getByText('3 in stock')).toBeInTheDocument()
  })

  it('calls onAdd with the product id when the button is clicked', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ProductCard product={product} onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith(1)
  })

  it('disables the button and shows a message when out of stock', () => {
    const onAdd = vi.fn()
    render(
      <ProductCard product={{ ...product, stock: 0 }} onAdd={onAdd} />
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
  })
})
