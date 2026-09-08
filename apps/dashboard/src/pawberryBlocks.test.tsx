import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { pawberryBlocks } from '../../../packages/blocks/src/blocks/pawberry'

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
function show(type: string, overrides = {}) {
  const block = pawberryBlocks.find(item => item.type === `${type}.pawberry`)!
  const Component = block.component
  return render(<Component {...block.defaultProps} {...overrides} />)
}
it('filters services and opens the matching service details', () => {
  show('services', { showFilters: true })
  fireEvent.click(screen.getByRole('button', { name: 'All pets' }))
  expect(screen.queryByRole('heading', { name: 'Full grooming' })).toBeNull()
  const trigger = screen.getByRole('button', { name: /Read more/ })
  trigger.focus(); fireEvent.click(trigger)
  expect(screen.getByRole('dialog', { name: 'Nail care' })).toBeTruthy()
  expect(screen.getByText('Allow 15–30 minutes')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Close details' }))
  expect(document.activeElement).toBe(trigger)
})
it('compares the actual features of every pricing package', () => {
  show('pricing')
  expect(screen.queryByRole('table')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: /Compare plans/ }))
  const row = screen.getByRole('row', { name: /Extra coat-care time/ })
  expect(row.textContent).toBe('Extra coat-care time——Included')
  fireEvent.click(screen.getByRole('button', { name: /Hide comparison/ }))
  expect(screen.queryByRole('table')).toBeNull()
})
it('searches journal stories and opens the full article', () => {
  show('journal', { showSearch: true })
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'first visit' } })
  expect(screen.queryByRole('button', { name: 'A comfortable corner for your companion' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Making their first visit feel familiar' }))
  expect(screen.getByRole('dialog')).toBeTruthy()
  expect(screen.getByText(/Start with a conversation/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Close details' }))
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'no matching story' } })
  expect(screen.getByRole('status').textContent).toBe('No stories match your search.')
})
it('opens team profiles and cycles testimonials', () => {
  const team = show('team', { layout: 'grid' })
  fireEvent.click(screen.getByRole('button', { name: /Maya Chen/ }))
  expect(screen.getByRole('dialog', { name: 'Maya Chen' })).toBeTruthy()
  team.unmount()
  show('testimonials')
  fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }))
  expect(screen.getByText('Alex & Milo')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Previous testimonial' }))
  expect(screen.getByText('Jamie & Willow')).toBeTruthy()
})
it('supports mobile navigation and pausing the video invitation', () => {
  const nav = show('navbar')
  fireEvent.click(screen.getByRole('button', { name: /Menu/ }))
  expect(screen.getByRole('button', { name: /Close/ }).getAttribute('aria-expanded')).toBe('true')
  nav.unmount()
  const view = show('video_cta')
  expect(view.container.querySelector('video')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Pause video' }))
  expect(view.container.querySelector('video')).toBeNull()
})
it('sends a booking inquiry using the connected form without confirming an appointment', async () => {
  const request = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 99, fields: [], success_message: 'Your inquiry was received.' } }) })
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) })
  vi.stubGlobal('fetch', request)
  show('form', { formId: '99' })
  await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Test Owner' } })
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'owner@example.com' } })
  fireEvent.change(screen.getByLabelText('Tell us about your pet and preferred visit'), { target: { value: 'A bath for our dog next week.' } })
  fireEvent.submit(screen.getByRole('button', { name: 'Send my inquiry' }).closest('form')!)
  await waitFor(() => expect(screen.getByText('Your inquiry was received.')).toBeTruthy())
  expect(request.mock.calls[1][0]).toBe('/api/forms/99/submit')
  expect(screen.getByText(/Your visit is confirmed when the team replies/)).toBeTruthy()
})
