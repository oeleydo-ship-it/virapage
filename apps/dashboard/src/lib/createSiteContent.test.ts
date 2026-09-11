import { beforeEach, expect, it, vi } from 'vitest'
import { aiApi, pagesApi, sitesApi } from './endpoints'
import { createSiteContent, type CreationProgress } from './createSiteContent'

vi.mock('./endpoints', () => ({
  sitesApi: { create: vi.fn() },
  pagesApi: { list: vi.fn() },
  aiApi: { generateTemplateCopy: vi.fn() },
}))
const input = { name: 'Bakery', template_id: 3 }
const success = { pages: 1, slots: 1, rewritten: 1, failed_pages: [] }
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(sitesApi.create).mockResolvedValue({ id: 10 } as never)
  vi.mocked(pagesApi.list).mockResolvedValue([{ id: 1, name: 'Home' }, { id: 2, name: 'About' }] as never)
})

it('sends the complete prompt and waits for every page to be saved', async () => {
  const prompt = 'Full business brief. '.repeat(2000)
  vi.mocked(aiApi.generateTemplateCopy).mockResolvedValue(success)
  const progress: CreationProgress = { completed: new Set() }
  await expect(createSiteContent(progress, input, true, prompt, vi.fn())).resolves.toEqual({ id: 10 })
  expect(aiApi.generateTemplateCopy).toHaveBeenNthCalledWith(1, { site_id: 10, page_id: 1, prompt })
  expect(aiApi.generateTemplateCopy).toHaveBeenNthCalledWith(2, { site_id: 10, page_id: 2, prompt })
})

it('surfaces failures and resumes without creating another site or overwriting completed pages', async () => {
  vi.mocked(aiApi.generateTemplateCopy).mockResolvedValueOnce(success).mockRejectedValueOnce(new Error('Provider timeout')).mockResolvedValue(success)
  const progress: CreationProgress = { completed: new Set() }
  await expect(createSiteContent(progress, input, true, 'Bakery details', vi.fn())).rejects.toThrow('Provider timeout')
  await createSiteContent(progress, input, true, 'Bakery details', vi.fn())
  expect(sitesApi.create).toHaveBeenCalledTimes(1)
  expect(aiApi.generateTemplateCopy).toHaveBeenCalledTimes(3)
  expect(aiApi.generateTemplateCopy).toHaveBeenLastCalledWith({ site_id: 10, page_id: 2, prompt: 'Bakery details' })
})

it('does not report partial generation as success', async () => {
  vi.mocked(aiApi.generateTemplateCopy).mockResolvedValue({ ...success, failed_pages: ['home'] })
  const progress: CreationProgress = { completed: new Set() }
  await expect(createSiteContent(progress, input, true, 'Details', vi.fn())).rejects.toThrow('could not finish Home')
  expect(progress.completed.size).toBe(0)
})
