import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BlockRenderer, getBlock } from '@uidesired/blocks'
import { BlockPalette } from './components/BlockPalette'

beforeEach(() => {
  // Keep offscreen thumbnail previews lazy, as they are in the real browser.
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} unobserve() {} })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('Forma blocks and library', () => {
  it('keeps edited hero copy while changing composition and hiding artwork', () => {
    const def = getBlock('hero.forma')!
    const { container, rerender } = render(<BlockRenderer type={def.type} props={{ ...def.defaultProps, heading: 'Our own studio', layout: 'reverse' }} />)
    expect(container.querySelector('.ud-forma-hero--reverse')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Our own studio' })).toBeTruthy()
    rerender(<BlockRenderer type={def.type} props={{ ...def.defaultProps, heading: 'Our own studio', layout: 'centered', showArtwork: false }} />)
    expect(container.querySelector('.ud-forma-art')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Our own studio' })).toBeTruthy()
  })

  it('renders expandable process details with the saved steps', () => {
    const { container } = render(<BlockRenderer type="content.forma" props={{ layout: 'accordion', items: [{ title: 'Launch', description: 'Your next chapter.' }] }} />)
    const summary = screen.getByText('Launch')
    fireEvent.click(summary)
    expect(container.querySelector('details')?.open).toBe(true)
    expect(screen.getByText('Your next chapter.')).toBeTruthy()
  })

  it('makes a template kit available on a blank page and inserts the selected block', () => {
    const onAdd = vi.fn()
    render(<BlockPalette onAdd={onAdd} />)
    expect(screen.queryByTitle('Add Forma / Editorial hero')).toBeNull()
    fireEvent.change(screen.getByLabelText('Block library'), { target: { value: 'forma' } })
    expect(screen.getByRole('status').textContent).toContain('5 blocks')
    fireEvent.click(screen.getByTitle('Add Forma / Editorial hero'))
    expect(onAdd).toHaveBeenCalledWith('hero.forma')
    fireEvent.change(screen.getByLabelText('Search blocks'), { target: { value: 'nothing-matches-this' } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters and browse all blocks' }))
    expect(screen.getByTitle('Add Forma / Editorial hero')).toBeTruthy()
    expect((screen.getByLabelText('Search blocks') as HTMLInputElement).value).toBe('')
  })
})
