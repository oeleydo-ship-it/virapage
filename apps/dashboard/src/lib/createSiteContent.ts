import type { Site } from '@uidesired/types'
import { aiApi, pagesApi, sitesApi } from './endpoints'

export type CreationProgress = { site?: Site; completed: Set<number>; prompt?: string }

/** Resume on the same seeded site after a provider failure; never reapply its template. */
export async function createSiteContent(
  progress: CreationProgress,
  input: Parameters<typeof sitesApi.create>[0],
  writeCopy: boolean,
  prompt: string | undefined,
  onProgress: (message: string) => void,
): Promise<Site> {
  if (!progress.site) progress.site = await sitesApi.create(input)
  const site = progress.site
  if (!writeCopy || !input.template_id) return site
  if (progress.prompt !== prompt) {
    progress.completed.clear()
    progress.prompt = prompt
  }
  const pages = await pagesApi.list(site.id)
  if (!pages.length) throw new Error('The site has no template pages to write. Open the builder to check the template.')
  for (const [index, page] of pages.entries()) {
    const pageId = Number(page.id)
    if (progress.completed.has(pageId)) continue
    onProgress(`Writing ${page.name} (${index + 1}/${pages.length})…`)
    const result = await aiApi.generateTemplateCopy({ site_id: site.id, page_id: pageId, prompt })
    if (result.pages < 1 || result.failed_pages.length) {
      throw new Error(`AI could not finish ${page.name}. Retry to continue on this same website.`)
    }
    progress.completed.add(pageId)
  }
  return site
}
