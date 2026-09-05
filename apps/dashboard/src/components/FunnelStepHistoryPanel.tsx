import type { PageSection } from '@uidesired/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { History, RotateCcw, X } from 'lucide-react'
import { funnelStepRevisionsApi } from '../lib/endpoints'
import { timeAgo } from '../lib/timeAgo'
import { Badge, Button } from '../ui/primitives'
import type { BadgeTone } from '../ui/primitives'

/** How a revision came to exist, in words an editor would use. */
function reasonLabel(reason?: string | null): { text: string; tone: BadgeTone } {
  switch (reason) {
    case 'published':
      return { text: 'Published', tone: 'success' }
    case 'restore':
      return { text: 'Restored', tone: 'info' }
    case 'created':
      return { text: 'Created', tone: 'neutral' }
    default:
      return { text: 'Edited', tone: 'neutral' }
  }
}

/**
 * Version history for the funnel step being edited.
 *
 * Restoring is immediate rather than a preview-then-commit, the same as
 * undoing any other change here - it becomes the new draft, and is itself
 * one more entry in the history rather than a rewrite of it.
 */
export function FunnelStepHistoryPanel({
  funnelId,
  stepId,
  onRestored,
  onClose,
}: {
  funnelId: string | number
  stepId: string | number
  onRestored: (sections: PageSection[]) => void
  onClose: () => void
}) {
  const qc = useQueryClient()

  const revisions = useQuery({
    queryKey: ['funnel-step-revisions', funnelId, stepId],
    queryFn: () => funnelStepRevisionsApi.list(funnelId, stepId),
  })

  const restore = useMutation({
    mutationFn: (revisionId: number) => funnelStepRevisionsApi.restore(funnelId, stepId, revisionId),
    onSuccess: (step) => {
      void qc.invalidateQueries({ queryKey: ['funnel-step-revisions', funnelId, stepId] })
      onRestored((step.draft_content?.sections ?? []) as PageSection[])
    },
  })

  const rows = revisions.data ?? []

  return (
    <aside className="absolute inset-y-0 right-0 z-40 flex w-[22rem] flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <History size={16} className="text-zinc-400" />
          <h2 className="text-sm font-medium text-white">Version history</h2>
        </div>
        <button type="button" aria-label="Close history" onClick={onClose} className="rounded p-1 text-zinc-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {restore.isError ? (
        <p className="px-4 pt-3 text-xs text-red-400">The restore failed. Nothing was changed.</p>
      ) : null}

      <div className="min-h-0 flex-1 overflow-auto p-2">
        {revisions.isLoading ? <p className="p-3 text-sm text-zinc-500">Loading…</p> : null}
        {!revisions.isLoading && rows.length === 0 ? (
          <p className="p-3 text-sm text-zinc-500">
            No history yet. Versions are recorded as you save and each time you publish.
          </p>
        ) : null}

        <ul className="space-y-1">
          {rows.map((revision, index) => {
            const badge = reasonLabel(revision.reason)
            const isLatest = index === 0
            return (
              <li key={revision.id} className="rounded-lg border border-transparent px-3 py-2.5 hover:border-zinc-800 hover:bg-zinc-900">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-white">Version {revision.version_number}</span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {isLatest ? <Badge tone="info">latest</Badge> : null}
                    <Badge tone={badge.tone}>{badge.text}</Badge>
                  </div>
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {timeAgo(revision.created_at)}
                  {revision.author ? ` · ${revision.author}` : ''}
                  {typeof revision.section_count === 'number'
                    ? ` · ${revision.section_count} section${revision.section_count === 1 ? '' : 's'}`
                    : ''}
                </div>
                {!isLatest ? (
                  <Button
                    className="mt-2"
                    variant="outline"
                    disabled={restore.isPending}
                    onClick={() => {
                      if (window.confirm(`Restore version ${revision.version_number}? This replaces the current draft.`)) {
                        restore.mutate(revision.id)
                      }
                    }}
                  >
                    <RotateCcw size={13} />
                    {restore.isPending ? 'Restoring…' : 'Restore this version'}
                  </Button>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
