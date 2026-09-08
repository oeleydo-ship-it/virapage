import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { BlockRenderer, blockRegistry } from '@uidesired/blocks'
import type { BlockField } from '@uidesired/types'

/** The template kits built for this project, each of which ships a nav and a footer. */
const KITS = ['pawberry', 'marigold', 'lexara', 'sproutkind', 'concourse', 'corewave', 'havven', 'novalta']

function fieldKeys(fields: BlockField[]): string[] {
  return fields.map((field) => field.key)
}

const bars = KITS.flatMap((kit) =>
  ['navbar', 'footer'].map((slot) => ({ kit, slot, type: `${slot}.${kit}` })),
).filter((row) => blockRegistry[row.type])

describe('brand logo upload', () => {
  it('finds a nav and a footer for every kit', () => {
    expect(bars).toHaveLength(KITS.length * 2)
  })

  it.each(bars)('$type offers a logo image control', ({ type }) => {
    const keys = fieldKeys(blockRegistry[type].schema?.fields || [])
    // `logo` is Marigold's pre-existing key for the same control.
    expect(keys.some((key) => key === 'logoImage' || key === 'logo')).toBe(true)
  })

  /**
   * The control is only real if the uploaded file reaches the DOM. Guards the
   * case where a schema offers the field but the block never renders it.
   */
  it.each(bars)('$type renders an uploaded logo', ({ type }) => {
    const block = blockRegistry[type]
    const keys = fieldKeys(block.schema?.fields || [])
    const key = keys.includes('logoImage') ? 'logoImage' : 'logo'
    const { container } = render(
      <BlockRenderer type={type} props={{ ...(block.defaultProps || {}), [key]: 'https://example.com/logo.png' }} />,
    )
    const img = container.querySelector('img[src="https://example.com/logo.png"]')
    expect(img).not.toBeNull()
  })

  it('keeps the kit wordmark when no logo has been uploaded', () => {
    const { container } = render(
      <BlockRenderer type="footer.pawberry" props={{ ...blockRegistry['footer.pawberry'].defaultProps }} />,
    )
    expect(container.querySelector('.ud-brand-logo')).toBeNull()
    expect(container.textContent).toContain('Pawberry')
  })
})
