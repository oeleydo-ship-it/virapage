import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { BlockRenderer, blockRegistry, ElementStyleProvider, EditableText, responsiveSectionCss } from '@uidesired/blocks'
import { Button, Media } from '../../../packages/blocks/src/primitives'
import { FieldControl } from './components/FieldControls'

vi.mock('./components/MediaLibrary', () => ({ MediaPicker: () => <div>Image picker</div> }))
afterEach(cleanup)

it('saves dimensions to the selected nested image without replacing its source or other appearance', () => {
  const change = vi.fn()
  const contentChange = vi.fn()
  render(<FieldControl field={{ key: 'image', label: 'Image', type: 'image' }} value="/photo.jpg" values={{}} onChange={contentChange} context={{ pathPrefix: ['items', 2], elementStyles: { 'items.2.image': { borderRadius: 12 } }, onElementStyleChange: change }} />)
  fireEvent.click(screen.getByText('Individual image settings'))
  const width = screen.getByLabelText('Custom width')
  fireEvent.change(width, { target: { value: '75%' } })
  expect(change).not.toHaveBeenCalled()
  fireEvent.blur(width)
  expect(change).toHaveBeenLastCalledWith(['items', 2, 'image'], { borderRadius: 12, width: '75%' })
  fireEvent.change(screen.getByLabelText('Height'), { target: { value: '420' } })
  fireEvent.blur(screen.getByLabelText('Height'))
  expect(change).toHaveBeenLastCalledWith(['items', 2, 'image'], { borderRadius: 12, height: '420px' })
  expect(contentChange).not.toHaveBeenCalled()
})

it('rejects invalid dimensions and resets just the chosen image appearance', () => {
  const change = vi.fn()
  render(<FieldControl field={{ key: 'image', label: 'Image', type: 'image' }} value="/photo.jpg" values={{}} onChange={vi.fn()} context={{ elementStyles: { image: { height: '200px' }, heading: { color: '#123456' } }, onElementStyleChange: change }} />)
  fireEvent.click(screen.getByText('Individual image settings'))
  fireEvent.change(screen.getByLabelText('Height'), { target: { value: '-100px' } })
  fireEvent.blur(screen.getByLabelText('Height'))
  expect(screen.getByRole('alert')).toBeTruthy()
  expect(change).not.toHaveBeenCalled()
  fireEvent.click(screen.getByText('Image border and spacing appearance'))
  fireEvent.click(screen.getByText('Reset appearance'))
  expect(change).toHaveBeenLastCalledWith(['image'], undefined)
})

it('renders independent image, card, heading and preview-button adjustments in a saved gallery', () => {
  const block = blockRegistry['gallery.vertical_duo']
  const view = render(<BlockRenderer type={block.type} props={{ ...block.defaultProps, elementStyles: {
    'items.0.image': { width: '70%', height: '360px', objectFit: 'cover', objectPosition: 'top', borderRadius: 20, marginLeft: 'auto', marginRight: 'auto', opacity: 0.8 },
    'items.0.cardStyle': { backgroundColor: '#eeeeee', paddingTop: 10 },
    'items.0.title': { fontSize: 30, marginBottom: 16 },
    'items.0.buttonLabel.$box': { backgroundColor: '#112233', borderRadius: 8, paddingLeft: 22 },
  } }} />)
  const first = view.container.querySelector('[data-ud-style="items.0.image"]') as HTMLElement
  const second = view.container.querySelector('[data-ud-style="items.1.image"]') as HTMLElement
  expect(first.style.width).toBe('70%')
  expect(first.style.height).toBe('360px')
  expect(first.style.getPropertyValue('--ud-element-image-fit')).toBe('cover')
  expect(first.style.getPropertyValue('--ud-element-image-height')).toBe('100%')
  expect(second.style.height).toBe('')
  expect(second.style.getPropertyValue('--ud-natural-image-height')).toBe('auto')
  expect((view.container.querySelector('[data-ud-style="items.0.title"]') as HTMLElement).style.fontSize).toBe('30px')
  expect((view.container.querySelector('[data-ud-style="items.0.buttonLabel.$box"]') as HTMLElement).style.paddingLeft).toBe('22px')
  expect(view.container.querySelector('[data-edit-path]')).toBeNull()
})

it('applies image controls to shared Media without losing its column style target', () => {
  const view = render(<ElementStyleProvider styles={{ image: { height: '280px', aspectRatio: '1 / 1', objectFit: 'contain' } }}><Media src="/photo.jpg" path={['image']} styleKey="mediaColumn" /></ElementStyleProvider>)
  const frame = view.container.querySelector('[data-ud-image-style="image"]') as HTMLElement
  expect(frame.getAttribute('data-ud-style')).toBe('mediaColumn')
  expect(frame.style.height).toBe('280px')
  expect(frame.style.aspectRatio).toBe('1 / 1')
})

it('infers button appearance from its editable label and supports independent text-box dimensions', () => {
  const view = render(<ElementStyleProvider styles={{ 'label.$box': { paddingTop: 20 }, label: { color: '#123456', width: '100px' } }}><Button href="/contact"><EditableText path={['label']} value="Contact" /></Button></ElementStyleProvider>)
  expect(screen.getByRole('link').style.paddingTop).toBe('20px')
  expect(screen.getByRole('link').getAttribute('data-ud-style')).toBe('label.$box')
  const label = view.container.querySelector('[data-ud-style="label"]') as HTMLElement
  expect(label.style.width).toBe('100px')
  expect(label.style.display).toBe('inline-block')
})

it('publishes responsive image settings and explicit text resets', () => {
  const css = responsiveSectionCss('sample', { responsive: { mobile: { elementStyles: { 'items.0.image': { height: '200px', objectFit: 'contain', objectPosition: 'bottom', marginTop: 12, opacity: 0 }, heading: { fontStyle: 'normal', textDecoration: 'none' } } } } })
  expect(css).toContain('max-width:480px')
  expect(css).toContain('[data-ud-image-style="items.0.image"]')
  expect(css).toContain('--ud-element-image-height:100% !important')
  expect(css).toContain('--ud-element-image-fit:contain !important')
  expect(css).toContain('opacity:0 !important')
  expect(css).toContain('font-style:normal !important')
})

it('keeps original-height Media images in normal flow and scales logos by their own width', () => {
  const view = render(<ElementStyleProvider styles={{ image: { aspectRatio: 'auto' } }}><Media src="/portrait.jpg" path={['image']} /></ElementStyleProvider>)
  const frame = view.container.querySelector('[data-ud-image-style="image"]') as HTMLElement
  expect(frame.style.aspectRatio).toBe('auto')
  expect(frame.style.getPropertyValue('--ud-element-image-height')).toBe('auto')
  expect(frame.style.getPropertyValue('--ud-element-image-layout')).toBe('relative')
  view.unmount()
  const block = blockRegistry['navbar.veloura']
  const logo = render(<BlockRenderer type={block.type} props={{ ...block.defaultProps, logoImage: '/logo.png', elementStyles: { logoImage: { width: '120px' } } }} />)
  const logoFrame = logo.container.querySelector('[data-ud-style="logoImage"]') as HTMLElement
  expect(logoFrame.style.width).toBe('120px')
  expect(logoFrame.style.getPropertyValue('--ud-element-image-width')).toBe('100%')
  expect(logoFrame.style.getPropertyValue('--ud-element-logo-height')).toBe('auto')
})

it('applies individual styles to gallery tabs and their filter controls', () => {
  const block = blockRegistry['gallery.filtered_tabs']
  render(<BlockRenderer type={block.type} props={{ ...block.defaultProps, elementStyles: { 'allLabel.$box': { borderRadius: 4 }, searchControlStyle: { height: '60px' }, filterControlStyle: { backgroundColor: '#eeeeee' }, tabsStyle: { paddingBottom: 20 } } }} />)
  expect(screen.getByRole('tab', { name: 'All images' }).style.borderRadius).toBe('4px')
  expect(screen.getByRole('searchbox').style.height).toBe('60px')
  expect(screen.getByRole('combobox').style.backgroundColor).toBe('rgb(238, 238, 238)')
  expect(screen.getByRole('tablist').style.paddingBottom).toBe('20px')
})
