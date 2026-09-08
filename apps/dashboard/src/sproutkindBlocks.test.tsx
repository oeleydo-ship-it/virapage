import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { sproutkindBlocks } from '../../../packages/blocks/src/blocks/sproutkind'

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
function show(type: string, overrides = {}) {
  const block = sproutkindBlocks.find(entry => entry.type === `${type}.sproutkind`)!
  const Component = block.component
  return render(<Component {...block.defaultProps} {...overrides} />)
}
it('filters programs by age and opens the matching details', () => {
  show('programs')
  fireEvent.click(screen.getByRole('button', { name: '4–5 years' }))
  expect(screen.queryByRole('heading', { name: 'Little explorers' })).toBeNull()
  expect(screen.getByRole('heading', { name: 'Ready for tomorrow' })).toBeTruthy()
  // A real click focuses the button first; fireEvent does not, and the modal
  // restores focus to whatever was focused when it opened.
  const trigger = screen.getByRole('button', { name: 'Explore program' })
  trigger.focus()
  fireEvent.click(trigger)
  expect(screen.getByRole('dialog', { name: 'Ready for tomorrow' })).toBeTruthy()
  expect(screen.getByText(/Our oldest learners investigate/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Close details' }))
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Explore program' }))
})
it('moves through only the filtered photos with keyboard controls', () => {
  show('gallery')
  fireEvent.click(screen.getByRole('button', { name: 'Creative play' }))
  expect(screen.queryByRole('button', { name: 'View Learning together' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'View Colorful discoveries' }))
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowRight' })
  expect(screen.getByRole('dialog', { name: 'A world of imagination' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
  expect(screen.getByRole('dialog', { name: 'Colorful discoveries' })).toBeTruthy()
})
it('filters events and shows their time and location', () => {
  show('events')
  fireEvent.click(screen.getByRole('button', { name: 'Families' }))
  expect(screen.queryByRole('heading', { name: 'A morning of making' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Event details' }))
  expect(screen.getByText('Sproutkind classroom')).toBeTruthy()
  expect(screen.getByText(/09:30–11:00/)).toBeTruthy()
})
it('switches admission step content and parent stories', () => {
  const steps = show('steps')
  fireEvent.click(screen.getByRole('button', { name: /Find your rhythm/ }))
  expect(screen.getByText(/Talk through program options/)).toBeTruthy()
  steps.unmount()
  show('testimonials')
  fireEvent.click(screen.getByRole('button', { name: 'Next story' }))
  expect(screen.getByText('Taylor family')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Previous story' }))
  expect(screen.getByText('Morgan family')).toBeTruthy()
})
it('supports pausing video and respects reduced motion', () => {
  const view = show('hero')
  expect(view.container.querySelector('video')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Pause background video' }))
  expect(view.container.querySelector('video')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Play background video' }))
  expect(view.container.querySelector('video')).toBeTruthy()
  view.unmount()
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  expect(show('hero').container.querySelector('video')).toBeNull()
})
it('submits connected inquiries through the existing public form endpoint', async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 42, fields: [], success_message: 'Inquiry received.' } }) })
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) })
  vi.stubGlobal('fetch', fetchMock)
  show('form', { formId: '42' })
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Test Parent' } })
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'parent@example.com' } })
  fireEvent.change(screen.getByLabelText('How can we help?'), { target: { value: 'Please tell me about visits.' } })
  fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form')!)
  await waitFor(() => expect(screen.getByText('Inquiry received.')).toBeTruthy())
  expect(fetchMock.mock.calls[1][0]).toBe('/api/forms/42/submit')
  expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ name: 'Test Parent', email: 'parent@example.com', message: 'Please tell me about visits.' })
})
