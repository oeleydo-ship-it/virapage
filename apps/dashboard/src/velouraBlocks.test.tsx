import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { velouraBlocks } from '../../../packages/blocks/src/blocks/veloura'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })
function show(type: string, overrides = {}) {
  const block = velouraBlocks.find(item => item.type === `${type}.veloura`)!
  const Component = block.component
  return render(<Component {...block.defaultProps} {...overrides} />)
}
it('filters the lookbook by category and restores all photographs', () => {
  show('gallery')
  fireEvent.click(screen.getByRole('button', { name: 'Colour' }))
  expect(screen.queryByText('Soft movement')).toBeNull()
  expect(screen.getByText('Fresh dimension')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'All' }))
  expect(screen.getAllByRole('figure')).toHaveLength(3)
})
it('cycles client stories in both directions and tolerates an empty list', () => {
  const view = show('testimonials')
  fireEvent.click(screen.getByRole('button', { name: 'Previous testimonial' }))
  expect(screen.getByText('Jordan M.')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }))
  expect(screen.getByText('Alex R.')).toBeTruthy()
  view.unmount()
  show('testimonials', { items: [] })
  expect(screen.queryByRole('button')).toBeNull()
})
it('opens mobile navigation and closes it after a page is selected', () => {
  show('navbar')
  fireEvent.click(screen.getByRole('button', { name: /Menu/ }))
  expect(screen.getByRole('button', { name: /Close/ }).getAttribute('aria-expanded')).toBe('true')
  fireEvent.click(screen.getByRole('link', { name: 'Services' }))
  expect(screen.getByRole('button', { name: /Menu/ }).getAttribute('aria-expanded')).toBe('false')
})
it('renders service details and appointment destinations', () => {
  const { container } = show('services')
  expect(container.querySelectorAll('details')).toHaveLength(3)
  expect(screen.getAllByRole('link', { name: /Request this service/ }).every(link => link.getAttribute('href') === '/appointment')).toBe(true)
  expect(screen.getByText(/Start with a consultation/)).toBeTruthy()
})
it('submits a connected appointment inquiry and shows the real success response', async () => {
  const request = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 99, fields: [], success_message: 'Your inquiry was received.' } }) })
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) })
  vi.stubGlobal('fetch', request)
  show('form', { formId: '99' })
  await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Test Guest' } })
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'guest@example.com' } })
  fireEvent.change(screen.getByLabelText('Service and preferred appointment time'), { target: { value: 'A cut next Friday afternoon.' } })
  fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form')!)
  await waitFor(() => expect(screen.getByText('Your inquiry was received.')).toBeTruthy())
  expect(request.mock.calls[1][0]).toBe('/api/forms/99/submit')
  expect(screen.getByText(/confirmed only when the salon replies/)).toBeTruthy()
})
