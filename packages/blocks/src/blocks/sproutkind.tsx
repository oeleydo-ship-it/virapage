import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { BlockCategory, BlockField } from '@uidesired/types'
import { EditableText, editOf, useElementStyle } from '../editable'
import { Icon } from '../icons'
import { BrandLogo, Media, SafeText, SectionShell, bool, cx, items, str, type Props } from '../primitives'
import { PublicForm } from '../public-form'
import { headFields, icon, image, link, logoImageFields, navLinksField, repeater, schema, select, stickyField, text, textarea, toggle } from '../schema'
import { defineBlock, type BlockDefinition } from '../types'

const asset = (file: string) => `/template-assets/sproutkind/${file}`
const base = { paddingTop: 88, paddingBottom: 88, animation: 'fade-up', animationDuration: 700, animationTrigger: 'scroll' }
const ctaFields = [text('buttonLabel', 'Button label', { styleTarget: 'button' }), link('buttonUrl', 'Button link')]
const secondaryFields = [text('secondaryLabel', 'Second button label', { styleTarget: 'button' }), link('secondaryUrl', 'Second button link')]
const cardFields = [text('title', 'Title'), textarea('description', 'Description'), image('image', 'Image'), text('imageAlt', 'Image description')]

function kit(type: string, category: BlockCategory, label: string, defaults: Props, fields: BlockField[], component: BlockDefinition['component']) {
  return defineBlock({ type: `${type}.sproutkind`, version: 1, category, label: `Sproutkind / ${label}`, icon: 'Flower', defaultProps: { ...base, ...(['page_header', 'programs', 'steps'].includes(type) ? { tone: 'surface' } : ['testimonials', 'footer'].includes(type) ? { tone: 'dark' } : type === 'cta' ? { tone: 'primary', textColor: '#191818' } : {}), ...defaults }, schema: schema(...fields), component })
}
function Pinwheel({ className = '' }: { className?: string }) { return <span className={`sk-pinwheel ${className}`} aria-hidden="true"><i /><i /><i /><i /></span> }
function Head({ p, hero = false }: { p: Props; hero?: boolean }) {
  return <header className="sk-head">
    {str(p.eyebrow) && <div className="sk-eyebrow"><Pinwheel /><EditableText edit={editOf(p)} path={['eyebrow']} value={str(p.eyebrow)} as="span" /></div>}
    <EditableText edit={editOf(p)} path={['heading']} value={str(p.heading)} as={hero ? 'h1' : 'h2'} className="sk-heading" />
    {str(p.description) && <SafeText value={p.description} edit={editOf(p)} path={['description']} className="sk-description" />}
  </header>
}
function Button({ p, secondary = false }: { p: Props; secondary?: boolean }) {
  const field = secondary ? 'secondaryLabel' : 'buttonLabel'
  const style = useElementStyle([field, '$box'])
  if (!str(p[field])) return null
  return <a href={str(p[secondary ? 'secondaryUrl' : 'buttonUrl'], '/contact')} className={`sk-button ${secondary ? 'sk-button--outline' : ''}`} style={style}>
    <EditableText edit={editOf(p)} path={[field]} value={str(p[field])} as="span" /><Pinwheel />
  </a>
}
function Actions({ p }: { p: Props }) { return <div className="sk-actions"><Button p={p} /><Button p={p} secondary /></div> }
function Picture({ p, name = 'image', alt = 'imageAlt', ratio = 'landscape', className = '' }: { p: Props; name?: string; alt?: string; ratio?: string; className?: string }) {
  return <Media src={str(p[name])} alt={str(p[alt])} ratio={ratio} className={className} edit={editOf(p)} path={[name]} />
}
function ItemPicture({ p, item, index, ratio = 'landscape' }: { p: Props; item: Props; index: number; ratio?: string }) {
  return <Media src={str(item.image)} alt={str(item.imageAlt, str(item.title))} ratio={ratio} edit={editOf(p)} path={['items', index, 'image']} />
}
function Modal({ title, onClose, children, onStep }: { title: string; onClose: () => void; children: ReactNode; onStep?: (direction: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const headingId = useId()
  useEffect(() => {
    const focused = document.activeElement as HTMLElement | null
    const node = ref.current
    node?.showModal()
    // Close before restoring: unmounting a dialog that is still open leaves
    // the top layer teardown to run after the focus() call, which drops
    // focus to the body and loses the trigger.
    return () => {
      // jsdom ships <dialog> without close(); the top-layer problem it solves
      // only exists in a real browser, so guard rather than require it.
      if (typeof node?.close === 'function') node.close()
      focused?.focus()
    }
  }, [])
  return <dialog className="sk-dialog" ref={ref} aria-labelledby={headingId} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }} onKeyDown={e => { if (onStep && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); onStep(e.key === 'ArrowRight' ? 1 : -1) } }}>
    <div className="sk-dialog-panel"><button type="button" className="sk-dialog-close" aria-label="Close details" onClick={onClose}>×</button><h2 id={headingId}>{title}</h2>{children}</div>
  </dialog>
}
function Navigation(p: Props) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  return <SectionShell props={p} className={cx('sk', 'sk-nav-section', bool(p.sticky, true) && 'sk-nav-section--sticky')} bleed><div className="sk-nav">
    <a href={str(p.logoUrl, '/')} className="sk-brand"><BrandLogo props={p} alt={str(p.brand)}><Pinwheel /><EditableText edit={editOf(p)} path={['brand']} value={str(p.brand)} as="span" /></BrandLogo></a>
    <button type="button" className="sk-menu" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '☰'}</span></button>
    <nav id={menuId} className={`sk-nav-links ${open ? 'is-open' : ''}`} aria-label="Main navigation">{items(p.links, []).map((l, i) => <a key={i} href={str(l.url)} onClick={() => setOpen(false)}><EditableText edit={editOf(p)} path={['links', i, 'label']} value={str(l.label)} as="span" /></a>)}<Button p={p} /></nav>
  </div></SectionShell>
}
function Hero(p: Props) {
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync(); query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  return <SectionShell props={p} className="sk sk-hero" bleed>
    <div className="sk-hero-scene"><img src={str(p.image)} alt={str(p.imageAlt)} className="sk-hero-image" />
      {str(p.videoUrl) && !paused && !reduced && !editOf(p) && <video className="sk-hero-image" src={str(p.videoUrl)} poster={str(p.image)} muted autoPlay playsInline loop aria-hidden="true" />}
      <div className="sk-hero-shade" /><div className="sk-hero-content"><Head p={p} hero /><Actions p={p} /></div>
      {str(p.videoUrl) && !reduced && <button type="button" className="sk-motion" aria-label={paused ? 'Play background video' : 'Pause background video'} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button>}
    </div>
  </SectionShell>
}
function Highlights(p: Props) { return <SectionShell props={p} className="sk"><div className="sk-highlights">
  <div className="sk-feature-list"><EditableText edit={editOf(p)} path={['heading']} value={str(p.heading)} as="h2" />{items(p.items, []).map((item, i) => <div className="sk-feature-line" key={i}><Icon name={str(item.icon, 'leaf')} size={23} /><EditableText edit={editOf(p)} path={['items', i, 'title']} value={str(item.title)} as="span" /></div>)}</div>
  <div className="sk-highlight-photo"><Picture p={p} ratio="portrait" /><Pinwheel /></div>
  <div className="sk-note"><span className="sk-note-stars" aria-label="Five stars">★★★★★</span><EditableText edit={editOf(p)} path={['quote']} value={str(p.quote)} as="p" /><div><EditableText edit={editOf(p)} path={['author']} value={str(p.author)} as="strong" /><EditableText edit={editOf(p)} path={['caption']} value={str(p.caption)} as="p" /></div><span className="sk-quote-mark" aria-hidden="true">”</span></div>
</div></SectionShell> }
function About(p: Props) { return <SectionShell props={p} className="sk sk-about"><Head p={p} /><div className={`sk-about-grid ${p.reverse ? 'sk-reverse' : ''}`}>
  <div className="sk-about-photo"><Picture p={p} ratio="landscape" /><div className="sk-photo-label"><Pinwheel /><EditableText edit={editOf(p)} path={['imageCaption']} value={str(p.imageCaption)} as="span" /></div></div>
  <div className="sk-about-body"><EditableText edit={editOf(p)} path={['subheading']} value={str(p.subheading)} as="h3" /><SafeText value={p.body} edit={editOf(p)} path={['body']} />
    <div className="sk-mini-stats">{items(p.items, []).map((item, i) => <div key={i}><EditableText edit={editOf(p)} path={['items', i, 'value']} value={str(item.value)} as="strong" /><EditableText edit={editOf(p)} path={['items', i, 'label']} value={str(item.label)} as="p" /></div>)}</div><Button p={p} />
  </div></div></SectionShell> }
const programs = [
  { title: 'Little explorers', category: '2–3 years', description: 'A gentle first step into learning, with stories, sensory play, and familiar daily rhythms.', details: 'Small-group play, music, movement, and time outdoors help children settle in and build friendships. Our team works with families to make the transition feel comfortable.', image: asset('program-play.jpg'), imageAlt: 'Children learning together', schedule: 'Morning sessions · Monday–Friday' },
  { title: 'Curious communicators', category: '3–4 years', description: 'Songs, storytelling, and creative conversations for growing voices and imaginations.', details: 'Children explore words and ideas through shared books, pretend play, art, and conversation. Every child has opportunities to be heard and supported at their own pace.', image: asset('program-language.jpg'), imageAlt: 'A child exploring a learning activity', schedule: 'Full-day and morning options' },
  { title: 'Ready for tomorrow', category: '4–5 years', description: 'Hands-on discovery that supports confidence, cooperation, and the next learning adventure.', details: 'Our oldest learners investigate questions together, practice everyday independence, and build the social foundations for their next classroom.', image: asset('program-care.jpg'), imageAlt: 'Children enjoying classroom activities', schedule: 'Full-day sessions · Monday–Friday' },
]
function Programs(p: Props) {
  const [filter, setFilter] = useState('All')
  const [detail, setDetail] = useState<number | null>(null)
  const entries = items(p.items, [])
  const categories = ['All', ...new Set(entries.map(e => str(e.category)).filter(Boolean))]
  const selectedFilter = categories.includes(filter) ? filter : 'All'
  const selected = detail === null ? null : entries[detail]
  return <SectionShell props={p} tone="surface" className="sk sk-programs"><div className="sk-heading-row"><Head p={p} /><Button p={p} /></div>
    {bool(p.showFilters, true) && <div className="sk-filters" aria-label="Filter programs by age">{categories.map(category => <button type="button" key={category} aria-pressed={selectedFilter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>}
    <div className="sk-program-grid">{entries.map((item, i) => (!bool(p.showFilters, true) || selectedFilter === 'All' || selectedFilter === str(item.category)) && <article key={i} className="sk-program-card"><ItemPicture p={p} item={item} index={i} /><div className="sk-card-content"><EditableText edit={editOf(p)} path={['items', i, 'category']} value={str(item.category)} as="span" className="sk-tag" /><EditableText edit={editOf(p)} path={['items', i, 'title']} value={str(item.title)} as="h3" /><SafeText value={item.description} edit={editOf(p)} path={['items', i, 'description']} /><button type="button" className="sk-text-button" onClick={() => setDetail(i)}>Explore program <span aria-hidden="true">↗</span></button></div></article>)}</div>
    {!entries.length && <p className="sk-empty">Programs will appear here when they are added.</p>}
    {selected && <Modal title={str(selected.title)} onClose={() => setDetail(null)}><img className="sk-dialog-image" src={str(selected.image)} alt={str(selected.imageAlt, str(selected.title))} /><span className="sk-tag">{str(selected.category)}</span><p>{str(selected.details, str(selected.description))}</p><p><strong>{str(selected.schedule)}</strong></p><Button p={{ buttonLabel: str(p.detailLabel, 'Ask about this program'), buttonUrl: str(p.detailUrl, '/admissions') }} /></Modal>}
  </SectionShell>
}
function Benefits(p: Props) { return <SectionShell props={p} className="sk"><Head p={p} /><div className="sk-benefits"><Picture p={p} ratio="portrait" /><div>{items(p.items, []).map((item, i) => <article key={i}><span className="sk-icon"><Icon name={str(item.icon, 'heart')} size={26} /></span><div><EditableText edit={editOf(p)} path={['items', i, 'title']} value={str(item.title)} as="h3" /><SafeText value={item.description} edit={editOf(p)} path={['items', i, 'description']} /></div></article>)}</div></div></SectionShell> }
function Gallery(p: Props) {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<number | null>(null)
  const entries = items(p.items, [])
  const categories = ['All', ...new Set(entries.map(item => str(item.category)).filter(Boolean))]
  const currentFilter = categories.includes(filter) ? filter : 'All'
  const visible = entries.map((item, index) => ({ item, index })).filter(({ item }) => currentFilter === 'All' || str(item.category) === currentFilter)
  const current = selected === null ? undefined : entries[selected]
  const step = (direction: number) => { const index = visible.findIndex(v => v.index === selected); setSelected(visible[(index + direction + visible.length) % visible.length]?.index ?? null) }
  return <SectionShell props={p} className="sk sk-gallery"><Head p={p} /><div className="sk-filters" aria-label="Filter gallery">{categories.map(category => <button key={category} type="button" aria-pressed={currentFilter === category} onClick={() => { setFilter(category); setSelected(null) }}>{category}</button>)}</div>
    <div className={`sk-gallery-grid sk-gallery-grid--${str(p.layout, 'masonry')}`}>{visible.map(({ item, index }) => <figure key={index}><ItemPicture p={p} item={item} index={index} ratio={index % 3 === 0 ? 'portrait' : 'landscape'} /><figcaption><EditableText edit={editOf(p)} path={['items', index, 'title']} value={str(item.title)} as="span" /><button type="button" aria-label={`View ${str(item.title)}`} onClick={() => setSelected(index)}>↗</button></figcaption></figure>)}</div>
    {!visible.length && <p className="sk-empty">Add photographs to bring your gallery to life.</p>}
    {current && <Modal title={str(current.title)} onClose={() => setSelected(null)} onStep={step}><img className="sk-lightbox-image" src={str(current.image)} alt={str(current.imageAlt, str(current.title))} /><p>{str(current.description)}</p><div className="sk-carousel-controls"><button aria-label="Previous photo" type="button" onClick={() => step(-1)}>←</button><span>{visible.findIndex(v => v.index === selected) + 1} / {visible.length}</span><button aria-label="Next photo" type="button" onClick={() => step(1)}>→</button></div></Modal>}
  </SectionShell>
}
function Testimonials(p: Props) {
  const [active, setActive] = useState(0)
  const entries = items(p.items, [])
  const index = Math.min(active, Math.max(0, entries.length - 1))
  const current = entries[index]
  return <SectionShell props={p} tone="dark" className="sk sk-testimonials"><Head p={p} />{current && <div className="sk-testimonial-grid"><Picture p={p} ratio="portrait" /><div className="sk-testimonial-card" key={index}><Pinwheel /><blockquote><EditableText edit={editOf(p)} path={['items', index, 'quote']} value={str(current.quote)} as="p" /></blockquote><EditableText edit={editOf(p)} path={['items', index, 'name']} value={str(current.name)} as="strong" /><EditableText edit={editOf(p)} path={['items', index, 'role']} value={str(current.role)} as="p" /><div className="sk-carousel-controls"><button type="button" aria-label="Previous story" onClick={() => setActive((index - 1 + entries.length) % entries.length)}>←</button><span>{index + 1} / {entries.length}</span><button type="button" aria-label="Next story" onClick={() => setActive((index + 1) % entries.length)}>→</button></div></div></div>}</SectionShell>
}
function Events(p: Props) {
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<number | null>(null)
  const entries = items(p.items, [])
  const categories = ['All', ...new Set(entries.map(item => str(item.category)).filter(Boolean))]
  const active = categories.includes(category) ? category : 'All'
  const current = selected === null ? null : entries[selected]
  return <SectionShell props={p} className="sk"><div className="sk-heading-row"><Head p={p} /><Button p={p} /></div><div className="sk-filters" aria-label="Filter events">{categories.map(name => <button type="button" key={name} aria-pressed={name === active} onClick={() => setCategory(name)}>{name}</button>)}</div><div className="sk-events">{entries.map((item, i) => (active === 'All' || active === str(item.category)) && <article key={i}><div className="sk-event-image"><ItemPicture p={p} item={item} index={i} /><EditableText edit={editOf(p)} path={['items', i, 'date']} value={str(item.date)} as="span" className="sk-event-date" /></div><div className="sk-event-copy"><span className="sk-tag">{str(item.category)}</span><EditableText edit={editOf(p)} path={['items', i, 'title']} value={str(item.title)} as="h3" /><SafeText value={item.description} edit={editOf(p)} path={['items', i, 'description']} /><button type="button" className="sk-text-button" onClick={() => setSelected(i)}>Event details <span aria-hidden="true">↗</span></button></div></article>)}</div>{!entries.length && <p>New events will be listed here.</p>}
    {current && <Modal title={str(current.title)} onClose={() => setSelected(null)}><img className="sk-dialog-image" src={str(current.image)} alt={str(current.imageAlt, str(current.title))} /><p className="sk-tag">{str(current.date)} · {str(current.time)}</p><p>{str(current.details, str(current.description))}</p><p><strong>Location:</strong> {str(current.location)}</p><Button p={{ buttonLabel: str(p.detailLabel, 'Ask about attending'), buttonUrl: str(p.detailUrl, '/contact') }} /></Modal>}
  </SectionShell>
}
function Steps(p: Props) {
  const [active, setActive] = useState(0)
  const entries = items(p.items, [])
  const index = Math.min(active, Math.max(entries.length - 1, 0))
  const current = entries[index]
  return <SectionShell props={p} tone="surface" className="sk sk-steps"><Head p={p} /><div className="sk-step-layout"><div className="sk-step-list" aria-label="Admission steps">{entries.map((item, i) => <button key={i} type="button" aria-pressed={index === i} onClick={() => setActive(i)}><span>{String(i + 1).padStart(2, '0')}</span>{str(item.title)}<span aria-hidden="true">↗</span></button>)}</div>{current && <div className="sk-step-detail" key={index}><Pinwheel /><EditableText edit={editOf(p)} path={['items', index, 'title']} value={str(current.title)} as="h3" /><SafeText value={current.description} edit={editOf(p)} path={['items', index, 'description']} /><Button p={p} /></div>}</div></SectionShell>
}
function Faq(p: Props) { return <SectionShell props={p} className="sk sk-faq"><div className="sk-faq-grid"><Head p={p} /><div>{items(p.items, []).map((item, i) => <details key={i}><summary><EditableText edit={editOf(p)} path={['items', i, 'question']} value={str(item.question)} as="span" /><span className="sk-faq-plus" aria-hidden="true">+</span></summary><SafeText value={item.answer} edit={editOf(p)} path={['items', i, 'answer']} /></details>)}</div></div></SectionShell> }
function Contact(p: Props) { return <SectionShell props={p} className="sk sk-contact"><div className="sk-contact-grid"><div><Head p={p} /><div className="sk-contact-details">{items(p.items, []).map((item, i) => <div key={i}><EditableText edit={editOf(p)} path={['items', i, 'title']} value={str(item.title)} as="strong" />{str(item.url) ? <a href={str(item.url)}>{str(item.description)}</a> : <SafeText value={item.description} edit={editOf(p)} path={['items', i, 'description']} />}</div>)}</div><Pinwheel /></div><div className="sk-form-panel"><EditableText edit={editOf(p)} path={['formHeading']} value={str(p.formHeading)} as="h3" /><PublicForm formId={str(p.formId) || undefined} fields={[{ name: 'name', label: 'Your name', type: 'text', required: true }, { name: 'email', label: 'Email address', type: 'email', required: true }, { name: 'message', label: 'How can we help?', type: 'textarea', required: true }]} submitLabel={str(p.buttonLabel)} edit={editOf(p)} submitLabelPath={['buttonLabel']} /><SafeText value={p.note} edit={editOf(p)} path={['note']} className="sk-form-note" /></div></div></SectionShell> }

export const sproutkindBlocks = [
  kit('navbar', 'navigation', 'Rounded school navigation', { paddingTop: 0, paddingBottom: 0, animation: 'none', brand: 'Sproutkind', logoUrl: '/', sticky: true, buttonLabel: 'Apply now', buttonUrl: '/admissions', links: [{ label: 'Home', url: '/' }, { label: 'About', url: '/about' }, { label: 'Programs', url: '/programs' }, { label: 'Gallery', url: '/gallery' }, { label: 'Events', url: '/events' }, { label: 'Contact', url: '/contact' }] }, [text('brand', 'Brand name'), ...logoImageFields, link('logoUrl', 'Logo link'), navLinksField(), ...ctaFields, stickyField], Navigation),
  kit('hero', 'hero', 'Playful video hero', { paddingTop: 0, paddingBottom: 0, animation: 'none', heading: 'Little moments.\nWonderful beginnings.', image: asset('hero.jpg'), imageAlt: 'Children making colorful artwork together', videoUrl: asset('hero.mp4'), buttonLabel: 'Come say hello', buttonUrl: '/contact', secondaryLabel: 'Explore our programs', secondaryUrl: '/programs' }, [...headFields, image('image', 'Poster image'), text('imageAlt', 'Image description'), text('videoUrl', 'Video URL'), ...ctaFields, ...secondaryFields], Hero),
  kit('page_header', 'hero', 'Inner page introduction', { heading: 'Room to wonder.\nSpace to grow.', eyebrow: 'Welcome to Sproutkind', description: 'A thoughtful little community for big imaginations.', paddingTop: 100, paddingBottom: 100 }, [...headFields], p => <SectionShell props={p} tone="surface" className="sk sk-page-header"><Pinwheel className="sk-page-flower" /><Head p={p} /><a href="/" className="sk-breadcrumb">Home <span aria-hidden="true">↗</span></a></SectionShell>),
  kit('highlights', 'features', 'Welcome collage', { paddingTop: 36, paddingBottom: 55, heading: 'Good days start here.', image: asset('children.jpg'), imageAlt: 'Children sitting together in a bright classroom', quote: 'A place where little voices are heard and every new discovery is worth celebrating.', author: 'The Sproutkind approach', caption: 'Curiosity · Kindness · Belonging', items: [{ icon: 'book-open', title: 'Stories that spark imagination' }, { icon: 'palette', title: 'Creative, hands-on play' }, { icon: 'leaf', title: 'Outdoor discoveries' }, { icon: 'heart', title: 'Care that feels personal' }] }, [text('heading', 'Heading'), image('image', 'Center image'), text('imageAlt', 'Image description'), textarea('quote', 'Statement'), text('author', 'Attribution'), text('caption', 'Caption'), repeater('items', 'Highlights', [icon('icon', 'Icon'), text('title', 'Title')])], Highlights),
  kit('about', 'content', 'Our story and impact', { eyebrow: 'A little about us', heading: 'Growing together,\none discovery at a time.', description: 'We make space for children to ask questions, try new things, and build friendships at their own pace.', image: asset('about.jpg'), imageAlt: 'A child in a colorful learning environment', imageCaption: 'Small steps. Big possibilities.', subheading: 'A warm welcome, every morning.', body: 'Our days balance creative play, outdoor exploration, quiet moments, and time together. Families are part of the conversation from the very beginning.', buttonLabel: 'Meet Sproutkind', buttonUrl: '/about', reverse: false, items: [{ value: '2–5', label: 'Years of wonder' }, { value: 'Every day', label: 'A new discovery' }] }, [...headFields, image('image', 'Image'), text('imageAlt', 'Image description'), text('imageCaption', 'Photo caption'), text('subheading', 'Story title'), textarea('body', 'Story'), toggle('reverse', 'Reverse columns'), ...ctaFields, repeater('items', 'Highlights', [text('value', 'Value'), text('label', 'Label')])], About),
  kit('programs', 'services', 'Filterable program cards', { eyebrow: 'Learn through play', heading: 'Something wonderful\nfor every little learner.', description: 'Find a rhythm that fits your child’s stage of discovery.', buttonLabel: 'All programs', buttonUrl: '/programs', detailLabel: 'Ask about this program', detailUrl: '/admissions', showFilters: true, items: programs }, [...headFields, ...ctaFields, toggle('showFilters', 'Show age filters'), text('detailLabel', 'Detail button label'), link('detailUrl', 'Detail button link'), repeater('items', 'Programs', [...cardFields, text('category', 'Age group'), textarea('details', 'Full details'), text('schedule', 'Schedule')])], Programs),
  kit('benefits', 'features', 'Image and learning benefits', { eyebrow: 'More than a classroom', heading: 'Confidence begins\nwith feeling at home.', image: asset('classroom.jpg'), imageAlt: 'Children creating together at a classroom table', items: [{ icon: 'book-open', title: 'Learning that feels like play', description: 'Real experiences give new ideas a place to take root.' }, { icon: 'heart', title: 'Friendships and feelings', description: 'Space to listen, share, and understand each other.' }, { icon: 'sun', title: 'Little acts of independence', description: 'Everyday choices help children discover what they can do.' }, { icon: 'leaf', title: 'Room to move and explore', description: 'Active days, fresh air, and plenty of small adventures.' }] }, [...headFields, image('image', 'Feature image'), text('imageAlt', 'Image description'), repeater('items', 'Benefits', [icon('icon', 'Icon'), text('title', 'Title'), textarea('description', 'Description')])], Benefits),
  kit('gallery', 'gallery', 'Filterable photo lightbox', { eyebrow: 'Our days in pictures', heading: 'A little peek\ninto our world.', layout: 'masonry', items: [{ title: 'Colorful discoveries', category: 'Creative play', image: asset('hero.jpg'), description: 'A shared table and endless possibilities.' }, { title: 'Learning together', category: 'Classroom', image: asset('children.jpg'), description: 'Making friends is part of every day.' }, { title: 'Our reading corner', category: 'Classroom', image: asset('care.jpg'), description: 'A welcoming space to pause and explore a story.' }, { title: 'A world of imagination', category: 'Creative play', image: asset('creativity.jpg'), description: 'Turning small ideas into something wonderful.' }, { title: 'Hands-on learning', category: 'Classroom', image: asset('classroom.jpg'), description: 'Learning by doing, with a friend nearby.' }, { title: 'Making memories', category: 'Community', image: asset('event-family.avif'), description: 'Sharing experiences with our wider community.' }] }, [...headFields, select('layout', 'Photo layout', ['masonry', 'grid']), repeater('items', 'Photos', [...cardFields, text('category', 'Category')])], Gallery),
  kit('testimonials', 'testimonials', 'Parent story carousel', { eyebrow: 'Family voices', heading: 'A community\nthat grows with you.', image: asset('program-language.jpg'), imageAlt: 'A playful classroom moment', items: [{ quote: 'The little stories we hear on the way home say it all: a new friend, a new song, and something exciting to try tomorrow.', name: 'Morgan family', role: 'Illustrative parent story — replace with permission' }, { quote: 'We love the thoughtful daily rhythm and the way every child has space to join in at their own pace.', name: 'Taylor family', role: 'Illustrative parent story — replace with permission' }, { quote: 'It feels like a partnership. There is always time for a conversation about how our child is getting on.', name: 'Rivera family', role: 'Illustrative parent story — replace with permission' }] }, [...headFields, image('image', 'Story image'), text('imageAlt', 'Image description'), repeater('items', 'Stories', [textarea('quote', 'Quote'), text('name', 'Family name'), text('role', 'Caption')])], Testimonials),
  kit('events', 'content', 'Events with filters and details', { eyebrow: 'Come join the fun', heading: 'Little celebrations.\nLovely memories.', buttonLabel: 'All events', buttonUrl: '/events', detailLabel: 'Ask about attending', detailUrl: '/contact', items: [{ title: 'A morning of making', category: 'Creative play', date: 'OCT 17', time: '10:00–11:30', location: 'Sproutkind art room', image: asset('event-art.avif'), description: 'Explore colors, textures, and big ideas with your little artist.', details: 'An example family art morning. Bring your curiosity and clothes suitable for creative play. Contact the team to confirm the date and availability before attending.' }, { title: 'Meet your little community', category: 'Families', date: 'NOV 07', time: '09:30–11:00', location: 'Sproutkind classroom', image: asset('event-family.avif'), description: 'A relaxed opportunity to meet other families and our team.', details: 'An example family gathering with stories, conversation, and a look around our learning spaces. Please contact us to confirm event arrangements.' }] }, [...headFields, ...ctaFields, text('detailLabel', 'Detail button label'), link('detailUrl', 'Detail button link'), repeater('items', 'Events', [...cardFields, text('category', 'Category'), text('date', 'Display date'), text('time', 'Time'), text('location', 'Location'), textarea('details', 'Full details')])], Events),
  kit('steps', 'content', 'Interactive admissions steps', { eyebrow: 'Your first little steps', heading: 'Let’s get to\nknow each other.', buttonLabel: 'Start a conversation', buttonUrl: '/contact', items: [{ title: 'Say hello', description: 'Tell us a little about your family and the kind of learning environment you are looking for.' }, { title: 'Come and explore', description: 'Arrange a visit, see our spaces, and ask all the questions on your mind.' }, { title: 'Find your rhythm', description: 'Talk through program options, availability, fees, and the daily schedule with our team.' }, { title: 'Settle in together', description: 'Plan a gentle start that gives your child time to feel comfortable and connected.' }] }, [...headFields, ...ctaFields, repeater('items', 'Steps', [text('title', 'Title'), textarea('description', 'Description')])], Steps),
  kit('faq', 'faq', 'Family questions accordion', { eyebrow: 'Good questions', heading: 'A little more\nto help you decide.', items: [{ question: 'Can we visit before applying?', answer: 'Yes. Use our contact page to request a visit and the team will help arrange a suitable time.' }, { question: 'Which age groups are the programs for?', answer: 'Our example programs are grouped for ages two to five. Ask the team about the best fit and current availability.' }, { question: 'How do children settle in?', answer: 'We plan the first days with each family and make time for familiar routines, reassurance, and regular conversations.' }, { question: 'Where can I find fees and session times?', answer: 'Contact the team for the current fee information, session options, and any additional arrangements.' }] }, [...headFields, repeater('items', 'Questions', [text('question', 'Question'), textarea('answer', 'Answer')])], Faq),
  kit('cta', 'cta', 'Sunny invitation band', { eyebrow: 'The next chapter starts here', heading: 'A happy place\nfor a bright beginning.', description: 'Come meet the people who will be part of your child’s everyday adventures.', buttonLabel: 'Book a visit', buttonUrl: '/contact', secondaryLabel: 'Explore admissions', secondaryUrl: '/admissions' }, [...headFields, ...ctaFields, ...secondaryFields], p => <SectionShell props={p} tone="primary" className="sk sk-cta"><Pinwheel className="sk-cta-flower" /><Head p={p} /><Actions p={p} /></SectionShell>),
  kit('form', 'form', 'Connected family inquiry', { eyebrow: 'We would love to hear from you', heading: 'Let’s start with\na hello.', description: 'Ask a question, request a visit, or tell us what you are looking for.', formHeading: 'Send a little note', formId: '', buttonLabel: 'Send inquiry', note: 'Please share only the information needed for your inquiry. The team will reply to arrange the next step.', items: [{ title: 'Email us', description: 'hello@sproutkind.example', url: 'mailto:hello@sproutkind.example' }, { title: 'Visits', description: 'By appointment — contact the team to arrange a time.' }, { title: 'Our opening hours', description: 'Monday–Friday · 8:30am–5:00pm' }] }, [...headFields, text('formHeading', 'Form heading'), text('formId', 'Connected form'), text('buttonLabel', 'Submit label'), textarea('note', 'Form note'), repeater('items', 'Contact details', [text('title', 'Label'), textarea('description', 'Value'), link('url', 'Link')])], Contact),
  kit('footer', 'footer', 'Community footer', { paddingTop: 65, paddingBottom: 25, brand: 'Sproutkind', description: 'Small discoveries.\nA world of possibility.', copyright: '© 2026 Sproutkind. All rights reserved.', buttonLabel: 'Come say hello', buttonUrl: '/contact', links: [{ label: 'Home', url: '/' }, { label: 'About', url: '/about' }, { label: 'Programs', url: '/programs' }, { label: 'Admissions', url: '/admissions' }, { label: 'Gallery', url: '/gallery' }, { label: 'Events', url: '/events' }, { label: 'Contact', url: '/contact' }] }, [text('brand', 'Brand'), ...logoImageFields, textarea('description', 'Tagline'), text('copyright', 'Copyright'), navLinksField(), ...ctaFields], p => <SectionShell props={p} tone="dark" className="sk sk-footer"><div className="sk-footer-top"><div><a href="/" className="sk-brand"><BrandLogo props={p} alt={str(p.brand)}><Pinwheel /><EditableText edit={editOf(p)} path={['brand']} value={str(p.brand)} as="span" /></BrandLogo></a><SafeText value={p.description} edit={editOf(p)} path={['description']} /><Button p={p} /></div><nav aria-label="Footer navigation">{items(p.links, []).map((item, i) => <a href={str(item.url)} key={i}><EditableText edit={editOf(p)} path={['links', i, 'label']} value={str(item.label)} as="span" /><span aria-hidden="true">↗</span></a>)}</nav></div><div className="sk-footer-bottom"><EditableText edit={editOf(p)} path={['copyright']} value={str(p.copyright)} as="span" /><Pinwheel /></div></SectionShell>),
]
