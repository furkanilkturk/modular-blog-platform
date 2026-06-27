import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('renders the sample document title and a block', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /react best practices/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/reusable blocks/i)).toBeInTheDocument()
  })
})
