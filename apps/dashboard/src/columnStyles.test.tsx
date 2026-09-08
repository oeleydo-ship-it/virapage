import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { BlockRenderer, blockRegistry } from '@uidesired/blocks'
import type { BlockField } from '@uidesired/types'

/** Every schema field that opens a "column appearance" panel in the inspector. */
function columnKeys(fields: BlockField[]): string[] {
  return fields.filter((field) => field.styleTarget === 'column').map((field) => field.key)
}

const withColumns = Object.entries(blockRegistry)
  .map(([type, block]) => ({ type, keys: columnKeys(block.schema?.fields || []) }))
  .filter((entry) => entry.keys.length > 0)

describe('column appearance controls', () => {
  it('covers at least the blocks that are meant to have them', () => {
    expect(withColumns.length).toBeGreaterThan(0)
  })

  /**
   * The failure this guards against is a silently dead control: a schema field
   * offering column settings on a block that never tags a matching element, so
   * every edit saves and nothing changes on the canvas.
   */
  /**
   * Blocks whose split only exists in one of several layouts. Their defaults
   * render a different arrangement, so the columns need the layout turned on
   * before there is anything to look for.
   */
  const LAYOUT_PROPS: Record<string, Record<string, unknown>> = {
    'cta.split': { layout: 'copy-media', image: 'https://example.com/x.jpg' },
  }

  it.each(withColumns)('$type marks an element for each column control it offers', ({ type, keys }) => {
    const block = blockRegistry[type]
    const { container } = render(
      <BlockRenderer type={type} props={{ ...(block.defaultProps || {}), ...(LAYOUT_PROPS[type] || {}) }} />,
    )
    const tagged = new Set(
      Array.from(container.querySelectorAll('[data-ud-style]')).map((node) => node.getAttribute('data-ud-style') || ''),
    )
    const missing = keys.filter((key) => !tagged.has(key))
    expect(missing).toEqual([])
  })

  it('paints a solid colour, a gradient and an image on the column it is set on', () => {
    const { container } = render(
      <BlockRenderer
        type="hero.marigold"
        props={{
          heading: 'Columns',
          elementStyles: {
            panelColumn: { backgroundType: 'gradient', gradientFrom: '#ff0000', gradientTo: '#0000ff', gradientAngle: 90 },
            mediaColumn: { backgroundType: 'image', backgroundImage: 'https://example.com/a.jpg', overlayColor: '#000000', overlayOpacity: 40 },
          },
        }}
      />,
    )
    const panel = container.querySelector('[data-ud-style="panelColumn"]') as HTMLElement
    const media = container.querySelector('[data-ud-style="mediaColumn"]') as HTMLElement

    expect(panel.style.backgroundImage).toContain('linear-gradient(90deg, #ff0000, #0000ff)')
    expect(media.style.backgroundImage).toContain('url("https://example.com/a.jpg")')
    expect(media.style.backgroundImage).toContain('color-mix(in srgb, #000000 40%, transparent)')
    expect(media.style.backgroundSize).toBe('cover')
  })

  it('leaves a column untouched when only the legacy colour is stored', () => {
    const { container } = render(
      <BlockRenderer
        type="hero.marigold"
        props={{ heading: 'Columns', elementStyles: { panelColumn: { backgroundColor: '#123456' } } }}
      />,
    )
    const panel = container.querySelector('[data-ud-style="panelColumn"]') as HTMLElement
    expect(panel.style.backgroundColor).toBe('rgb(18, 52, 86)')
    expect(panel.style.backgroundImage).toBe('')
  })
})
