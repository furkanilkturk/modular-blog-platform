import { render, screen } from '@testing-library/react'
import { DynamicRenderer } from '@/blocks'
import type { Block } from '@/blocks'

describe('DynamicRenderer', () => {
  it('renders registered block types with their components', () => {
    const blocks: Block[] = [
      { id: 't1', type: 'text', data: { html: '<p>Hello world</p>' } },
      {
        id: 'i1',
        type: 'image',
        data: { src: 'https://example.com/x.jpg', alt: 'An example image' },
      },
    ]
    render(<DynamicRenderer blocks={blocks} />)

    expect(screen.getByText('Hello world')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'An example image' })).toBeInTheDocument()
  })

  it('falls back to UnknownBlock for a known-but-unregistered type', () => {
    // quiz is a valid block type but isn't registered until Sprint 6.
    const blocks: Block[] = [
      { id: 'q1', type: 'quiz', data: { title: '', questions: [] } },
    ]
    render(<DynamicRenderer blocks={blocks} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Unknown block type')
    expect(alert).toHaveTextContent('quiz')
  })

  it('falls back for a completely unknown type without crashing', () => {
    const blocks = [
      { id: 'x1', type: 'mystery', data: {} },
    ] as unknown as Block[]
    render(<DynamicRenderer blocks={blocks} />)

    expect(screen.getByRole('alert')).toHaveTextContent('mystery')
  })

  it('renders nothing for an empty block list', () => {
    const { container } = render(<DynamicRenderer blocks={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
