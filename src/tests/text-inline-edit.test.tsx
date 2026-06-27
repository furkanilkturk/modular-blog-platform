import { render, screen } from '@testing-library/react'
import { TextBlockInlineEdit } from '@/blocks/text/TextBlockInlineEdit'

describe('TextBlockInlineEdit', () => {
  it('mounts the inline rich-text editor with its initial content', async () => {
    render(
      <TextBlockInlineEdit
        data={{ html: '<p>Hello editor</p>' }}
        onChange={() => {}}
      />,
    )
    expect(await screen.findByText('Hello editor')).toBeInTheDocument()
  })
})
