import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { imagePreviewBlocks } from '../../../packages/blocks/src/blocks/image-previews'
import { blockRegistry } from '../../../packages/blocks/src/registry'
import { imagePreviewCss } from '../../../packages/blocks/src/image-preview-styles'

afterEach(cleanup)
it.each(imagePreviewBlocks)('$type registers a reusable image block with editable preview links', block => {
  expect(blockRegistry[block.type]).toBe(block)
  const Component = block.component
  render(<Component {...block.defaultProps} />)
  const images = screen.getAllByRole('img')
  expect(images.length).toBeGreaterThan(0)
  expect(images.every(image => image.classList.contains('ip-full-image'))).toBe(true)
  expect(screen.getAllByRole('link', { name: /Preview site/ }).every(link => link.getAttribute('href') === 'https://hairlux-wbs.webflow.io/' && link.getAttribute('rel') === 'noopener noreferrer')).toBe(true)
})
it('uses natural image height with no crop for every image and gallery layout', () => {
  expect(imagePreviewCss).toContain('height:auto')
  expect(imagePreviewCss).toContain('max-height:none')
  expect(imagePreviewCss).toContain('aspect-ratio:auto')
  expect(imagePreviewCss).toContain('object-fit:contain')
})
it('honors a custom site URL and same-tab selection, hiding unsafe or absent links', () => {
  const block = imagePreviewBlocks[0]
  const Component = block.component
  const view = render(<Component {...block.defaultProps} previewUrl="https://example.com/demo" openInNewTab={false} />)
  expect(screen.getByRole('link').getAttribute('href')).toBe('https://example.com/demo')
  expect(screen.getByRole('link').hasAttribute('target')).toBe(false)
  view.rerender(<Component {...block.defaultProps} previewUrl="javascript:alert(1)" />)
  expect(screen.queryByRole('link')).toBeNull()
  view.rerender(<Component {...block.defaultProps} previewUrl="" />)
  expect(screen.queryByRole('link')).toBeNull()
})

it.each(['gallery.vertical_duo', 'gallery.full_masonry', 'gallery.preview_strip'])('%s applies row counts, responsive counts, spacing and section limits', type => {
  const block = blockRegistry[type]
  const Component = block.component
  const props = { ...block.defaultProps, columns: 4, tabletColumns: 3, mobileColumns: 2, columnGap: 18, rowGap: 32, maxImages: 1 }
  const view = render(<Component {...props} />)
  expect(screen.getAllByRole('img')).toHaveLength(1)
  const layout = view.container.querySelector('.ip-duo,.ip-masonry,.ip-strip') as HTMLElement
  expect(layout.style.getPropertyValue('--ip-columns')).toBe('4')
  expect(layout.style.getPropertyValue('--ip-tablet-columns')).toBe('3')
  expect(layout.style.getPropertyValue('--ip-mobile-columns')).toBe('2')
  expect(layout.style.getPropertyValue('--ip-column-gap')).toBe('18px')
  expect(layout.style.getPropertyValue('--ip-row-gap')).toBe('32px')
  view.rerender(<Component {...props} maxImages={0} />)
  expect(screen.getAllByRole('img')).toHaveLength((block.defaultProps.items as unknown[]).length)
})

it('combines category tabs, per-category style filters and search before applying the image limit', () => {
  const block = blockRegistry['gallery.filtered_tabs']
  const Component = block.component
  render(<Component {...block.defaultProps} maxImages={1} />)
  fireEvent.click(screen.getByRole('tab', { name: 'Styling' }))
  fireEvent.change(screen.getByLabelText('Filter by style'), { target: { value: 'Salon' } })
  expect(screen.getByRole('heading', { name: 'Styling inspiration' })).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'Salon inspiration' })).toBeNull()
  fireEvent.click(screen.getByRole('tab', { name: 'Colour' }))
  expect((screen.getByLabelText('Filter by style') as HTMLSelectElement).value).toBe('')
  expect(screen.queryByRole('option', { name: 'Portrait' })).toBeNull()
  expect(screen.getByRole('heading', { name: 'Colour inspiration' })).toBeTruthy()
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'does not exist' } })
  expect(screen.getByRole('status').textContent).toBe('No images match these filters.')
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } })
  expect(screen.getAllByRole('img')).toHaveLength(1)
})

it('supports keyboard tab navigation and recovers when an edited category disappears', () => {
  const block = blockRegistry['gallery.filtered_tabs']
  const Component = block.component
  const view = render(<Component {...block.defaultProps} />)
  const first = screen.getByRole('tab', { name: 'All images' })
  first.focus()
  fireEvent.keyDown(first, { key: 'End' })
  expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Colour' }))
  expect(screen.getByRole('tab', { name: 'Colour' }).getAttribute('aria-selected')).toBe('true')
  view.rerender(<Component {...block.defaultProps} items={[]} />)
  expect(screen.getByRole('tab', { name: 'All images' }).getAttribute('aria-selected')).toBe('true')
  expect(screen.getByRole('status')).toBeTruthy()
})
