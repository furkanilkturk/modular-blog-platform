import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  it('renders the blog list at /', async () => {
    renderAt('/')
    expect(
      screen.getByRole('heading', { name: /the blog/i }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/designing a modular block architecture/i),
    ).toBeInTheDocument()
  })

  it('renders the editor at /admin', () => {
    renderAt('/admin')
    expect(screen.getByLabelText(/post title/i)).toBeInTheDocument()
  })

  it('shows a 404 for unknown routes', () => {
    renderAt('/nope')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
