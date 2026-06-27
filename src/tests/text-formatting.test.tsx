import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminEditor, createEmptyDocument, useEditorStore } from '@/features/editor'

beforeEach(() => {
  useEditorStore.setState({
    document: {
      ...createEmptyDocument(),
      blocks: [{ id: 't1', type: 'text', data: { html: '<p>hello world</p>' } }],
    },
    selectedBlockId: null,
  })
  useEditorStore.temporal.getState().clear()
})

describe('text formatting in the right panel', () => {
  it('reveals the formatting toolbar when a text block is selected', async () => {
    const user = userEvent.setup()
    render(<AdminEditor />)

    // Nothing selected yet → generic prompt, no formatting controls.
    expect(
      screen.getByText(/select a block to edit/i),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Bold')).not.toBeInTheDocument()

    await user.click(screen.getByText('hello world'))

    expect(await screen.findByLabelText('Bold')).toBeInTheDocument()
    expect(screen.getByLabelText('Align center')).toBeInTheDocument()
  })
})
