import type { BlockCategory, BlockFieldGroup, PageContent, PageSection } from '@uidesired/types'
import { BlockRenderer, BlockStyles, getBlock } from '@uidesired/blocks'
import { defaultThemeTokens, themeToCssVars } from '@uidesired/design-system'
import { createId } from '@uidesired/utilities'
import { DndContext } from '@dnd-kit/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  History,
  Monitor,
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  PanelRightClose,
  Plus,
  Redo2,
  Rocket,
  Trash2,
  Undo2,
} from 'lucide-react'
import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BlockPalette } from '../components/BlockPalette'
import { FieldControl, fieldVisible } from '../components/FieldControls'
import { FunnelStepHistoryPanel } from '../components/FunnelStepHistoryPanel'
import { funnelsApi, productsApi } from '../lib/endpoints'
import { standaloneFunnelUrl } from '../lib/siteUrls'
import { useHistoryStore } from '../stores/historyStore'
import { Button } from '../ui/primitives'
import { publishFunnelWithRenders } from '@/lib/publishSite'

const LANDING_CATEGORIES: BlockCategory[] = [
  'navigation',
  'hero',
  'features',
  'services',
  'content',
  'gallery',
  'pricing',
  'faq',
  'cta',
  'form',
  'testimonials',
  'team',
  'footer',
]
const TABS: Array<{ id: BlockFieldGroup; label: string }> = [
  { id: 'content', label: 'Content' },
  { id: 'design', label: 'Design' },
  { id: 'layout', label: 'Layout' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'typography', label: 'Type' },
  { id: 'animation', label: 'Motion' },
  { id: 'background', label: 'Background' },
]

function readPanel(key: string) {
  if (typeof window === 'undefined') return true
  const stored = window.localStorage.getItem(key)
  if (stored === '0') return false
  if (stored === '1') return true
  return window.innerWidth >= 1100
}

export function FunnelStepEditorPage() {
  const { id, stepId } = useParams()
  const qc = useQueryClient()
  const funnel = useQuery({ queryKey: ['funnel', id], queryFn: () => funnelsApi.get(id!) })
  const products = useQuery({ queryKey: ['products'], queryFn: () => productsApi.list() })
  const step = funnel.data?.steps?.find((item) => String(item.id) === stepId)
  const [content, setContent] = useState<PageContent>({ schemaVersion: 1, sections: [] })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tab, setTab] = useState<BlockFieldGroup>('content')
  const [dirty, setDirty] = useState(false)
  const [leftOpen, setLeftOpen] = useState(() => readPanel('ud-funnel-editor-left'))
  const [rightOpen, setRightOpen] = useState(() => readPanel('ud-funnel-editor-right'))
  const [historyOpen, setHistoryOpen] = useState(false)
  const pushHistory = useHistoryStore((s) => s.push)
  const undoHistory = useHistoryStore((s) => s.undo)
  const redoHistory = useHistoryStore((s) => s.redo)
  const resetHistory = useHistoryStore((s) => s.reset)
  const canUndo = useHistoryStore((s) => s.past.length > 0)
  const canRedo = useHistoryStore((s) => s.future.length > 0)

  useEffect(() => {
    if (step) {
      setContent(step.draft_content || { schemaVersion: 1, sections: [] })
      setDirty(false)
      setSelectedId(null)
      setHistoryOpen(false)
      resetHistory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.id])

  useEffect(() => {
    window.localStorage.setItem('ud-funnel-editor-left', leftOpen ? '1' : '0')
  }, [leftOpen])

  useEffect(() => {
    window.localStorage.setItem('ud-funnel-editor-right', rightOpen ? '1' : '0')
  }, [rightOpen])

  const save = useMutation({
    mutationFn: () => funnelsApi.saveStepContent(id!, stepId!, content),
    onSuccess: (saved) => {
      setDirty(false)
      qc.setQueryData(['funnel', id], (current: typeof funnel.data) =>
        current ? { ...current, steps: current.steps?.map((item) => (item.id === saved.id ? saved : item)) } : current,
      )
      void qc.invalidateQueries({ queryKey: ['funnel-step-revisions', id, stepId] })
    },
  })
  const [renderError, setRenderError] = useState<string | null>(null)
  const publish = useMutation({
    mutationFn: async () => {
      if (dirty) await funnelsApi.saveStepContent(id!, stepId!, content)
      return publishFunnelWithRenders(id!)
    },
    onSuccess: (result) => {
      setDirty(false)
      // This returns how many pages were rendered, not the funnel. Writing it
      // into the funnel cache replaced the funnel with {rendered: n}, which has
      // no steps, and the editor then reported the step it was showing as
      // missing. Refetch instead, so the cache holds a funnel.
      setRenderError(result.renderError ?? null)
      void qc.invalidateQueries({ queryKey: ['funnel', id] })
      void qc.invalidateQueries({ queryKey: ['funnel-step-revisions', id, stepId] })
    },
  })
  const update = (sections: PageSection[]) => {
    setContent({ schemaVersion: 1, sections })
    setDirty(true)
  }
  // Adding, deleting, duplicating, reordering, and hiding a block are each one
  // undo step. A field edit is not - typing a heading would otherwise fill the
  // undo stack with one entry per keystroke, so those still go through
  // `update`/`alter` directly, with no history push.
  const commit = (sections: PageSection[]) => {
    pushHistory(content)
    update(sections)
  }
  const applyUndo = useCallback(() => {
    const snapshot = undoHistory(content)
    if (snapshot) {
      setContent(snapshot)
      setDirty(true)
    }
  }, [content, undoHistory])
  const applyRedo = useCallback(() => {
    const snapshot = redoHistory(content)
    if (snapshot) {
      setContent(snapshot)
      setDirty(true)
    }
  }, [content, redoHistory])
  // Restoring already saved the content on the server as a new revision, so
  // the editor just needs to catch up - nothing left to save, no history push.
  const applyRestore = useCallback(
    (sections: PageSection[]) => {
      setContent({ schemaVersion: 1, sections })
      setDirty(false)
      resetHistory()
      setHistoryOpen(false)
      void qc.invalidateQueries({ queryKey: ['funnel', id] })
    },
    [id, qc, resetHistory],
  )
  const selected = content.sections.find((section) => section.id === selectedId)
  const def = selected ? getBlock(selected.type) : undefined
  const fields = (def?.schema.fields || []).filter((field) => selected && fieldVisible(field, selected.props))
  const groups = TABS.filter((group) => fields.some((field) => (field.group || 'content') === group.id))
  const activeTab = groups.some((group) => group.id === tab) ? tab : groups[0]?.id || 'content'
  const visibleFields = fields.filter((field) => (field.group || 'content') === activeTab)
  const publicUrl = standaloneFunnelUrl(funnel.data?.public_id, step?.slug)
  const mutationError = (save.error || publish.error) instanceof Error ? ((save.error || publish.error) as Error).message : null
  // A publish that succeeded but could not build the HTML is worth saying out
  // loud: the funnel is live and its pages still serve the previous render.
  const error = mutationError || renderError
  const cssVars = themeToCssVars(defaultThemeTokens) as CSSProperties
  const add = (type: string) => {
    const block = getBlock(type)
    if (!block) return
    const section: PageSection = {
      id: createId('funnel'),
      type: block.type,
      version: block.version,
      hidden: false,
      props: structuredClone(block.defaultProps),
    }
    commit([...content.sections, section])
    setSelectedId(section.id)
  }
  const alter = (idToChange: string, fn: (section: PageSection) => PageSection) =>
    update(content.sections.map((section) => (section.id === idToChange ? fn(section) : section)))
  const move = (index: number, delta: number) => {
    const next = [...content.sections]
    const target = index + delta
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    commit(next)
  }
  const deleteSection = (sectionId: string) => {
    commit(content.sections.filter((item) => item.id !== sectionId))
    setSelectedId(null)
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const typing =
        !!target &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.closest('[contenteditable="true"]') !== null)
      // While inline editing (or in any form control), the browser owns the
      // keyboard: Cmd+Z must undo typing, not roll back the page.
      if (typing) return

      const meta = event.metaKey || event.ctrlKey
      if (meta && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) applyRedo()
        else applyUndo()
      } else if (meta && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        applyRedo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [applyRedo, applyUndo])

  if (funnel.isLoading)
    return <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400">Loading funnel editor…</div>
  if (!step)
    return <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400">Funnel step not found.</div>

  return (
    <DndContext>
      <div className="flex h-screen flex-col bg-zinc-950 text-zinc-200">
        <header className="flex flex-wrap items-center gap-3 border-b border-zinc-800 px-4 py-2">
          <Link to={`/funnels/${id}`} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
            <ArrowLeft size={16} />
            Funnel flow
          </Link>
          <div className="h-5 w-px bg-zinc-800" />
          <div>
            <div className="text-sm font-medium text-white">{funnel.data?.name}</div>
            <div className="text-xs text-zinc-500">{step.name} · standalone landing page</div>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-zinc-800">
            <button
              type="button"
              title="Undo (Ctrl+Z)"
              disabled={!canUndo}
              className="px-2 py-1.5 text-zinc-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-zinc-400"
              onClick={applyUndo}
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              title="Redo (Ctrl+Shift+Z)"
              disabled={!canRedo}
              className="border-l border-zinc-800 px-2 py-1.5 text-zinc-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-zinc-400"
              onClick={applyRedo}
            >
              <Redo2 size={15} />
            </button>
            <button
              type="button"
              title="Version history"
              className={`border-l border-zinc-800 px-2 py-1.5 ${historyOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
              onClick={() => setHistoryOpen((open) => !open)}
            >
              <History size={15} />
            </button>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-zinc-800">
            <button
              type="button"
              title={leftOpen ? 'Hide block library' : 'Show block library'}
              className={`px-2 py-1.5 ${leftOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
              onClick={() => setLeftOpen((open) => !open)}
            >
              {leftOpen ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
            </button>
            <button
              type="button"
              title={rightOpen ? 'Hide inspector' : 'Show inspector'}
              className={`px-2 py-1.5 ${rightOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
              onClick={() => setRightOpen((open) => !open)}
            >
              {rightOpen ? <PanelRightClose size={15} /> : <PanelRight size={15} />}
            </button>
          </div>
          <span className="ml-2 text-xs text-zinc-500">
            {save.isPending ? 'Saving…' : dirty ? 'Unsaved changes' : 'Saved'}
          </span>
          <div className="ml-auto flex gap-2">
            {publicUrl && funnel.data?.status === 'published' ? (
              <a href={publicUrl} target="_blank" rel="noreferrer">
                <Button variant="outline">
                  <Monitor size={15} />
                  View live
                </Button>
              </a>
            ) : null}
            <Button variant="outline" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? 'Saving…' : 'Save'}
            </Button>
            <Button disabled={publish.isPending} onClick={() => publish.mutate()}>
              <Rocket size={15} />
              {publish.isPending ? 'Publishing…' : 'Publish funnel'}
            </Button>
          </div>
        </header>
        {error ? <div className="bg-red-950 px-4 py-2 text-sm text-red-300">{error}</div> : null}
        <div className="relative flex min-h-0 flex-1">
          {leftOpen ? (
            <div className="relative flex min-h-0 shrink-0">
              <BlockPalette theme={defaultThemeTokens} categories={LANDING_CATEGORIES} onAdd={add} />
              <button
                type="button"
                title="Collapse block library"
                className="absolute -right-3 top-3 z-20 rounded-full border border-zinc-700 bg-zinc-900 p-1 text-zinc-400 shadow hover:text-white"
                onClick={() => setLeftOpen(false)}
              >
                <PanelLeftClose size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              title="Show block library"
              className="flex w-10 shrink-0 flex-col items-center gap-3 border-r border-zinc-800 bg-zinc-950 py-3 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              onClick={() => setLeftOpen(true)}
            >
              <PanelLeft size={16} />
              <span className="text-[10px] font-medium uppercase tracking-wide" style={{ writingMode: 'vertical-rl' }}>
                Blocks
              </span>
            </button>
          )}

          <main className="min-w-0 flex-1 overflow-auto bg-zinc-900 p-3 sm:p-6" onClick={() => setSelectedId(null)}>
            <div className="canvas-theme mx-auto min-h-full max-w-[1180px] bg-white shadow-2xl" style={cssVars}>
              <BlockStyles />
              {content.sections.map((section, index) => (
                <div
                  key={section.id}
                  data-section-frame={section.id}
                  className={`group relative ${selectedId === section.id ? 'ring-2 ring-inset ring-blue-500' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelectedId(section.id)
                    if (typeof window !== 'undefined' && window.innerWidth < 900) setRightOpen(true)
                  }}
                >
                  {section.hidden ? (
                    <div className="flex h-20 items-center justify-center bg-zinc-100 text-sm text-zinc-500">
                      Hidden · {getBlock(section.type)?.label}
                    </div>
                  ) : (
                    <BlockRenderer type={section.type} props={section.props} theme={defaultThemeTokens} />
                  )}
                  <div className="absolute right-3 top-3 hidden gap-1 rounded-lg bg-zinc-950/90 p-1 text-zinc-300 shadow-lg group-hover:flex">
                    <button
                      title="Move up"
                      onClick={(event) => {
                        event.stopPropagation()
                        move(index, -1)
                      }}
                      className="p-1.5 text-zinc-300 hover:text-white"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      title="Move down"
                      onClick={(event) => {
                        event.stopPropagation()
                        move(index, 1)
                      }}
                      className="p-1.5 text-zinc-300 hover:text-white"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      title="Duplicate"
                      onClick={(event) => {
                        event.stopPropagation()
                        const copy = { ...section, id: createId('funnel'), props: structuredClone(section.props) }
                        const next = [...content.sections]
                        next.splice(index + 1, 0, copy)
                        commit(next)
                      }}
                      className="p-1.5 text-zinc-300 hover:text-white"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      title={section.hidden ? 'Show' : 'Hide'}
                      onClick={(event) => {
                        event.stopPropagation()
                        pushHistory(content)
                        alter(section.id, (current) => ({ ...current, hidden: !current.hidden }))
                      }}
                      className="p-1.5 text-zinc-300 hover:text-white"
                    >
                      {section.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      title="Delete"
                      onClick={(event) => {
                        event.stopPropagation()
                        deleteSection(section.id)
                      }}
                      className="p-1.5 text-zinc-300 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {!content.sections.length ? (
                <button
                  onClick={() => add('hero.centered')}
                  className="flex min-h-96 w-full flex-col items-center justify-center gap-3 text-zinc-500 hover:text-blue-600"
                >
                  <Plus size={32} />
                  <span>Add your first landing-page block</span>
                </button>
              ) : null}
            </div>
          </main>

          {rightOpen ? (
            <>
              <button
                type="button"
                aria-label="Close inspector"
                className="absolute inset-0 z-20 bg-black/50 md:hidden"
                onClick={() => setRightOpen(false)}
              />
              <aside className="relative flex w-[min(20rem,100%)] shrink-0 flex-col border-l border-zinc-800 max-md:absolute max-md:inset-y-0 max-md:right-0 max-md:z-30 max-md:bg-zinc-950 max-md:shadow-2xl md:w-80">
              <button
                type="button"
                title="Collapse inspector"
                className="absolute -left-3 top-3 z-20 rounded-full border border-zinc-700 bg-zinc-900 p-1 text-zinc-400 shadow hover:text-white"
                onClick={() => setRightOpen(false)}
              >
                <PanelRightClose size={14} />
              </button>
              {selected && def ? (
                <>
                  <div className="border-b border-zinc-800 p-3">
                    <div className="mb-3 font-medium text-white">{def.label}</div>
                    <div className="flex flex-wrap gap-1">
                      {groups.map((group) => (
                        <button
                          key={group.id}
                          onClick={() => setTab(group.id)}
                          className={`rounded px-2 py-1 text-xs ${activeTab === group.id ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}
                        >
                          {group.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
                    {visibleFields.map((field) => (
                      <FieldControl
                        key={field.key}
                        field={field}
                        value={selected.props[field.key]}
                        values={selected.props}
                        onChange={(value) =>
                          alter(selected.id, (current) => ({
                            ...current,
                            props: { ...current.props, [field.key]: value },
                          }))
                        }
                        context={{ theme: defaultThemeTokens, sectionId: selected.id, products: products.data }}
                      />
                    ))}
                    {!visibleFields.length ? <p className="text-sm text-zinc-500">Nothing to edit in this tab.</p> : null}
                  </div>
                </>
              ) : (
                <div className="p-5 text-sm text-zinc-500">
                  Select a block to edit its content, typography, colors, layout, spacing and motion.
                </div>
              )}
            </aside>
            </>
          ) : (
            <button
              type="button"
              title="Show inspector"
              className="flex w-10 shrink-0 flex-col items-center gap-3 border-l border-zinc-800 bg-zinc-950 py-3 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              onClick={() => setRightOpen(true)}
            >
              <PanelRight size={16} />
              <span className="text-[10px] font-medium uppercase tracking-wide" style={{ writingMode: 'vertical-rl' }}>
                Inspect
              </span>
            </button>
          )}
          {historyOpen ? (
            <FunnelStepHistoryPanel
              funnelId={id!}
              stepId={stepId!}
              onRestored={applyRestore}
              onClose={() => setHistoryOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </DndContext>
  )
}
