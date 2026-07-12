import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from './RichTextEditor'

describe('RichTextEditor', () => {
  it('renders a formatting toolbar with bold, italic, underline, lists, and link controls', () => {
    render(<RichTextEditor label="Question" value="" onChange={vi.fn()} />)

    expect(screen.getByRole('toolbar', { name: 'Text formatting' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Underline' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bullet list' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Numbered list' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument()
  })

  it('initializes the editable area from the value prop', () => {
    render(<RichTextEditor label="Question" value="<p>Hello there</p>" onChange={vi.fn()} />)

    expect(screen.getByLabelText('Question')).toHaveTextContent('Hello there')
  })

  it('emits onChange as the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RichTextEditor label="Question" value="" onChange={onChange} />)

    await user.type(screen.getByLabelText('Question'), 'What is 2 + 2?')

    expect(onChange).toHaveBeenCalled()
    expect(screen.getByLabelText('Question')).toHaveTextContent('What is 2 + 2?')
  })

  it('disables the editable area and every toolbar button when disabled', () => {
    render(<RichTextEditor label="Question" value="<p>Locked</p>" onChange={vi.fn()} disabled />)

    expect(screen.getByLabelText('Question')).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Link' })).toBeDisabled()
  })

  it('shows the error message and marks the editable area invalid', () => {
    render(
      <RichTextEditor
        label="Question"
        value=""
        onChange={vi.fn()}
        error="Question text is required"
      />,
    )

    expect(screen.getByText('Question text is required')).toBeInTheDocument()
    expect(screen.getByLabelText('Question')).toHaveAttribute('aria-invalid', 'true')
  })
})
