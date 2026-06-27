import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('renders the editor shell with the block palette', () => {
    render(<App />)
    expect(screen.getByLabelText(/post title/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^text$/i }),
    ).toBeInTheDocument()
  })
})
