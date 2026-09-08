import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import { BlockRenderer, EDIT_PROP, PageRenderer } from '@uidesired/blocks'
import { marigoldBlocks } from '../../../packages/blocks/src/blocks/marigold'

afterEach(cleanup)

/**
 * The shared block-library suite covers these contracts for every block at
 * once, so a single broken block elsewhere in the registry hides the state of
 * this family. These assert the same things for Marigold on its own.
 */
describe('marigold blocks', () => {
  it('ships the whole family', () => {
    expect(marigoldBlocks.length).toBe(15)
  })

  it('renders every block with its default props', () => {
    for (const block of marigoldBlocks) {
      const { container, unmount } = render(<BlockRenderer type={block.type} props={block.defaultProps} />)
      expect(container.textContent, `${block.type} rendered nothing`).not.toBe('')
      expect(container.querySelector('[data-unknown-block]')).toBeNull()
      unmount()
    }
  }, 30_000)

  it('server-renders without touching the browser', () => {
    const sections = marigoldBlocks.map((block, index) => ({
      id: `s${index}`,
      type: block.type,
      version: block.version,
      hidden: false,
      props: block.defaultProps,
    }))
    const html = renderToStaticMarkup(<PageRenderer content={{ schemaVersion: 1, sections }} />)
    expect(html).not.toContain('data-unknown-block')
    expect(html.length).toBeGreaterThan(2000)
  })

  it('exposes an editable region on every block and never leaks the binding', () => {
    const edit = { commit: () => {}, pickImage: () => {} }
    for (const block of marigoldBlocks) {
      const html = renderToStaticMarkup(
        <PageRenderer
          content={{
            schemaVersion: 1,
            sections: [
              {
                id: 'edit',
                type: block.type,
                version: block.version,
                hidden: false,
                props: { ...block.defaultProps, [EDIT_PROP]: edit },
              },
            ],
          }}
        />,
      )
      expect(html, `${block.type} leaked the binding`).not.toContain('__edit')
      expect(html, `${block.type} has no inline editing`).toContain('data-edit-path')
    }
  }, 30_000)

  it('pins the navigation only when the sticky toggle is on', () => {
    const classesWith = (sticky: boolean) => {
      const { container, unmount } = render(
        <BlockRenderer type="navbar.marigold" props={{ ...marigoldBlocks[0].defaultProps, sticky }} />,
      )
      const html = [...container.querySelectorAll('[class]')].map((n) => n.getAttribute('class') ?? '').join(' ')
      unmount()
      return html
    }
    expect(classesWith(true)).toMatch(/sticky/i)
    expect(classesWith(false)).not.toMatch(/sticky/i)
  })

  it('switches the active program tab and its panel', () => {
    const block = marigoldBlocks.find((b) => b.type === 'programs.marigold')!
    render(<BlockRenderer type={block.type} props={block.defaultProps} />)
    expect(screen.getAllByText('Creative room').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('tab', { name: 'Learning games' }))
    expect(screen.getByRole('tab', { name: 'Learning games' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getAllByText(/strengthen memory/).length).toBeGreaterThan(0)
  })

  it('opens and closes a help-centre answer', () => {
    const block = marigoldBlocks.find((b) => b.type === 'faq.marigold')!
    render(<BlockRenderer type={block.type} props={block.defaultProps} />)
    const second = screen.getByRole('button', { name: /typical day/ })
    expect(second.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(second)
    expect(second.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(second)
    expect(second.getAttribute('aria-expanded')).toBe('false')
  })

  it('cycles parent quotes in both directions', () => {
    const block = marigoldBlocks.find((b) => b.type === 'testimonials.marigold')!
    render(<BlockRenderer type={block.type} props={block.defaultProps} />)
    expect(screen.getByText('Sasha Michel')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Next quote' }))
    expect(screen.getByText('Brooklyn Simmons')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Previous quote' }))
    expect(screen.getByText('Sasha Michel')).toBeTruthy()
  })

  it('draws each appeal bar from its own percentage', () => {
    const block = marigoldBlocks.find((b) => b.type === 'donations.marigold')!
    const { container } = render(<BlockRenderer type={block.type} props={block.defaultProps} />)
    const widths = [...container.querySelectorAll('.ud-mg-bar > i')].map((i) => (i as HTMLElement).style.width)
    expect(widths).toEqual(['50%', '60%', '90%'])
  })
})
