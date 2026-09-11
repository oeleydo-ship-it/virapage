import { useId, useState, type ButtonHTMLAttributes, type CSSProperties } from 'react'
import { EditableImage, EditableText, ElementBox, editOf, pathId, useElementStyle, type EditPath } from '../editable'
import { SectionHead, SectionShell, bool, items, str, type Props } from '../primitives'
import { field, headFields, image, link, number, repeater, schema, slider, text, toggle } from '../schema'
import { defineBlock } from '../types'

// These are generic blocks: no template-family suffix, so every kit can use them.
const fields = [image('image', 'Full image or page screenshot'), text('imageAlt', 'Image description'), text('title', 'Title'), text('buttonLabel', 'Preview link label', { styleTarget: 'button' }), link('previewUrl', 'Preview site URL'), field('cardStyle', 'text', 'Card', 'design', { styleTarget: 'column' })]
const sample = { image: '/template-assets/veloura/hero.avif', imageAlt: 'Full salon portrait', title: 'Salon inspiration', buttonLabel: 'Preview site', previewUrl: 'https://hairlux-wbs.webflow.io/' }
const samples = [sample, { ...sample, image: '/template-assets/veloura/gallery-1.avif', imageAlt: 'Full styling photograph', title: 'Styling inspiration' }, { ...sample, image: '/template-assets/veloura/gallery-2.avif', imageAlt: 'Full colour photograph', title: 'Colour inspiration' }]

/** Allow only actual web destinations and site-relative paths. */
function destination(value: unknown) {
  const url = str(value).trim()
  if (/^\/(?!\/)/.test(url) && !/[\\\s]/.test(url)) return url
  try { const parsed = new URL(url); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : '' } catch { return '' }
}
function Card({ p, row, path = [] }: { p: Props; row: Props; path?: EditPath }) {
  const edit = editOf(p)
  const href = destination(row.previewUrl)
  const buttonPath = [...path, 'buttonLabel', '$box']
  const buttonStyle = useElementStyle(buttonPath)
  return <ElementBox as="figure" path={[...path, 'cardStyle']} className="ip-card">
    <ElementBox path={[...path, 'image']} className="ip-image-wrap ud-adjustable-image" style={{ '--ud-natural-image-height': 'auto' } as CSSProperties}>
      {str(row.image) ? <img className="ip-full-image" src={str(row.image)} alt={str(row.imageAlt, str(row.title))} loading="lazy" /> : <div className="ip-empty">Add an image or a full-page screenshot</div>}
      <EditableImage edit={edit} path={[...path, 'image']} current={str(row.image)} label="Replace full image" />
    </ElementBox>
    <figcaption>
      <EditableText edit={edit} path={[...path, 'title']} value={str(row.title)} as="h3" />
      {href && <a href={href} style={buttonStyle} data-ud-style={pathId(buttonPath)} target={bool(p.openInNewTab, true) ? '_blank' : undefined} rel={bool(p.openInNewTab, true) ? 'noopener noreferrer' : undefined}><EditableText edit={edit} path={[...path, 'buttonLabel']} value={str(row.buttonLabel, 'Preview site')} as="span" /><span aria-hidden="true"> ↗</span></a>}
    </figcaption>
  </ElementBox>
}
function integer(value: unknown, fallback: number, min: number, max: number) {
  const n = value === '' || value === null || value === undefined ? fallback : Number(value)
  return Math.max(min, Math.min(max, Math.floor(Number.isFinite(n) ? n : fallback)))
}
function FilterTab({ p, path, value, ...attributes }: { p: Props; path: EditPath; value: string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'>) {
  const stylePath = [...path, '$box']
  const style = useElementStyle(stylePath)
  return <button {...attributes} style={style} data-ud-style={pathId(stylePath)}><EditableText edit={editOf(p)} path={path} value={value} as="span" /></button>
}
function layoutStyle(p: Props, layout: string): CSSProperties {
  return { '--ip-columns': integer(p.columns, layout === 'duo' ? 2 : 3, 1, 6), '--ip-tablet-columns': integer(p.tabletColumns, 2, 1, 4), '--ip-mobile-columns': integer(p.mobileColumns, 1, 1, 2), '--ip-column-gap': `${integer(p.columnGap, 24, 0, 100)}px`, '--ip-row-gap': `${integer(p.rowGap, 24, 0, 100)}px` } as CSSProperties
}
const layoutFields = [
  slider('columns', 'Images per row — desktop', 1, 6),
  slider('tabletColumns', 'Images per row — tablet', 1, 4),
  slider('mobileColumns', 'Images per row — mobile', 1, 2),
  number('maxImages', 'Images per section (0 = all)', 'layout', { min: 0, max: 1000, step: 1 }),
  slider('columnGap', 'Space between columns', 0, 100), slider('rowGap', 'Space between rows', 0, 100),
]
function Gallery({ p, layout, filterable = false }: { p: Props; layout: string; filterable?: boolean }) {
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [query, setQuery] = useState('')
  const id = useId()
  const tabsStyle = useElementStyle(['tabsStyle'])
  const searchStyle = useElementStyle(['searchControlStyle'])
  const filterStyle = useElementStyle(['filterControlStyle'])
  const allRows = items(p.items, []).map((row, index) => ({ row, index }))
  const categories = [...new Set(allRows.map(({ row }) => str(row.category).trim()).filter(Boolean))]
  const activeCategory = categories.includes(category) ? category : ''
  const inCategory = allRows.filter(({ row }) => !filterable || !activeCategory || str(row.category).trim() === activeCategory)
  const tags = [...new Set(inCategory.map(({ row }) => str(row.tag).trim()).filter(Boolean))]
  const activeTag = tags.includes(tag) ? tag : ''
  const filtered = inCategory.filter(({ row }) => !filterable || ((!bool(p.showTagFilter, true) || !activeTag || str(row.tag).trim() === activeTag) && (!bool(p.showSearch, true) || `${str(row.title)} ${str(row.imageAlt)} ${str(row.category)} ${str(row.tag)}`.toLowerCase().includes(query.trim().toLowerCase()))))
  const limit = integer(p.maxImages, 0, 0, 1000)
  const rows = limit ? filtered.slice(0, limit) : filtered
  const tabs = ['', ...categories]
  const activeIndex = tabs.indexOf(activeCategory)
  return <SectionShell props={p} className="ip"><SectionHead props={p} />
    {filterable && <div className="ip-controls">
      <div className="ip-tabs" style={tabsStyle} data-ud-style="tabsStyle" role="tablist" aria-label={str(p.tabsLabel, 'Image categories')}>
        {tabs.map((value, index) => <FilterTab p={p} path={value ? ['items', allRows.find(({ row }) => str(row.category).trim() === value)?.index ?? 0, 'category'] : ['allLabel']} value={value || str(p.allLabel, 'All images')} key={value} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={value === activeCategory} aria-controls={`${id}-panel`} tabIndex={value === activeCategory ? 0 : -1} onClick={() => { setCategory(value); setTag('') }} onKeyDown={event => {
          let next = index
          if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
          else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
          else if (event.key === 'Home') next = 0
          else if (event.key === 'End') next = tabs.length - 1
          else return
          event.preventDefault(); setCategory(tabs[next]); setTag(''); document.getElementById(`${id}-tab-${next}`)?.focus()
        }} />)}
      </div>
      <div className="ip-filter-row">
        {bool(p.showSearch, true) && <label><EditableText edit={editOf(p)} path={['searchLabel']} value={str(p.searchLabel, 'Search images')} as="span" /><input type="search" value={query} style={searchStyle} data-ud-style="searchControlStyle" onChange={event => setQuery(event.target.value)} /></label>}
        {bool(p.showTagFilter, true) && <label><EditableText edit={editOf(p)} path={['filterLabel']} value={str(p.filterLabel, 'Filter by style')} as="span" /><select value={activeTag} style={filterStyle} data-ud-style="filterControlStyle" onChange={event => setTag(event.target.value)}><option value="">{str(p.allTagsLabel, 'All styles')}</option>{tags.map(value => <option key={value} value={value}>{value}</option>)}</select></label>}
      </div>
    </div>}
    <div id={filterable ? `${id}-panel` : undefined} role={filterable ? 'tabpanel' : undefined} aria-labelledby={filterable ? `${id}-tab-${activeIndex}` : undefined} tabIndex={filterable ? 0 : undefined}>
      {rows.length ? <div className={`ip-${layout}`} style={layoutStyle(p, layout)} tabIndex={layout === 'strip' ? 0 : undefined} role={layout === 'strip' ? 'region' : undefined} aria-label={layout === 'strip' ? 'Scrollable image previews' : undefined}>{rows.map(({ row, index }) => <Card key={index} p={p} row={row} path={['items', index]} />)}</div> : <p className="ip-empty" role="status">{filterable ? str(p.emptyMessage, 'No images match these filters.') : 'Add images to this gallery.'}</p>}
    </div>
  </SectionShell>
}
const shared = { paddingTop: 72, paddingBottom: 72, openInNewTab: true }
const galleryDefaults = { ...shared, tabletColumns: 2, mobileColumns: 1, maxImages: 0, columnGap: 24, rowGap: 24 }
const galleryFields = [...headFields, repeater('items', 'Images and preview sites', fields), ...layoutFields, toggle('openInNewTab', 'Open preview in a new tab')]
export const imagePreviewBlocks = [
  defineBlock({ type: 'gallery.full_image', version: 1, label: 'Images / Full-height image + site preview', category: 'gallery', icon: 'Image', defaultProps: { ...shared, heading: 'The complete picture', ...sample }, schema: schema(...headFields, ...fields, toggle('openInNewTab', 'Open preview in a new tab')), component: p => <SectionShell props={p} className="ip"><SectionHead props={p} /><div className="ip-single"><Card p={p} row={p} /></div></SectionShell> }),
  defineBlock({ type: 'gallery.vertical_duo', version: 1, label: 'Images / Two-column vertical previews', category: 'gallery', icon: 'Columns2', defaultProps: { ...galleryDefaults, columns: 2, heading: 'Explore the details', items: samples.slice(0, 2) }, schema: schema(...galleryFields), component: p => <Gallery p={p} layout="duo" /> }),
  defineBlock({ type: 'gallery.full_masonry', version: 1, label: 'Images / Uncropped masonry gallery', category: 'gallery', icon: 'LayoutGrid', defaultProps: { ...galleryDefaults, columns: 3, heading: 'A closer look', items: samples }, schema: schema(...galleryFields), component: p => <Gallery p={p} layout="masonry" /> }),
  defineBlock({ type: 'gallery.preview_strip', version: 1, label: 'Images / Vertical site-preview strip', category: 'gallery', icon: 'GalleryHorizontal', defaultProps: { ...galleryDefaults, columns: 3, heading: 'Find your inspiration', items: samples }, schema: schema(...galleryFields), component: p => <Gallery p={p} layout="strip" /> }),
  defineBlock({ type: 'gallery.filtered_tabs', version: 1, label: 'Images / Category tabs + filters', category: 'gallery', icon: 'ListFilter', defaultProps: { ...galleryDefaults, columns: 3, heading: 'Explore the collection', allLabel: 'All images', tabsLabel: 'Image categories', searchLabel: 'Search images', filterLabel: 'Filter by style', allTagsLabel: 'All styles', emptyMessage: 'No images match these filters.', showSearch: true, showTagFilter: true, items: samples.map((row, index) => ({ ...row, category: index === 2 ? 'Colour' : 'Styling', tag: index === 0 ? 'Portrait' : 'Salon' })) }, schema: schema(...headFields, repeater('items', 'Images, categories and preview sites', [...fields, text('category', 'Category tab', { styleTarget: 'button' }), text('tag', 'Style filter')]), ...layoutFields, toggle('showSearch', 'Show image search'), toggle('showTagFilter', 'Show style filter'), toggle('openInNewTab', 'Open preview in a new tab'), field('tabsStyle', 'text', 'Tabs container', 'design', { styleTarget: 'column' }), field('searchControlStyle', 'text', 'Search input', 'design', { styleTarget: 'column' }), field('filterControlStyle', 'text', 'Style filter', 'design', { styleTarget: 'column' }), text('allLabel', 'All images tab label', { styleTarget: 'button' }), text('tabsLabel', 'Category tabs accessible label'), text('searchLabel', 'Search label'), text('filterLabel', 'Style filter label'), text('allTagsLabel', 'All styles option label'), text('emptyMessage', 'No matching images message')), component: p => <Gallery p={p} layout="duo" filterable /> }),
]

