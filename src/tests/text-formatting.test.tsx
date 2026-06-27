import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AdminEditor } from '@/features/editor'

// Seed a local draft so the editor bootstraps with a known text block.
beforeEach(() => {
  localStorage.setItem(
    'modular-blog:draft',
    JSON.stringify({
      id: 'd1',
      version: 1,
      title: 'Draft',
      status: 'draft',
      blocks: [{ id: 't1', type: 'text', data: { html: '<p>hello world</p>' } }],
    }),
  )
})

describe('text formatting in the right panel', () => {
  it('reveals the formatting toolbar when a text block is selected', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AdminEditor />
      </MemoryRouter>,
    )

    // Nothing selected yet → generic prompt, no formatting controls.
    expect(await screen.findByText(/select a block to edit/i)).toBeInTheDocument()
    expect(screen.queryByLabelText('Bold')).not.toBeInTheDocument()

    await user.click(screen.getByText('hello world'))

    expect(await screen.findByLabelText('Bold')).toBeInTheDocument()
    expect(screen.getByLabelText('Align center')).toBeInTheDocument()
  })
})
