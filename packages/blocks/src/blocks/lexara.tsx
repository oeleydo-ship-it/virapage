/**
 * Lexara — a contract-intelligence and enterprise-platform template.
 *
 * Visual language: tall dark bands in near-black navy alternating with a warm
 * off-white, a single burnt-orange accent used sparingly for eyebrows, rules
 * and one word of each headline, high-contrast Source Serif 4 display type
 * over plain Inter UI copy, and product mock-ups drawn in markup rather than
 * screenshotted - so the family carries no photography to license and stays
 * sharp at every width.
 *
 * Every block routes through `schema()`, which appends the shared design /
 * typography / background / spacing / content-width controls, so each one is
 * editable on the canvas and in the side panel and stays reusable on any
 * page. Colours resolve from theme tokens through the `--lx-*` variables
 * declared on `.ud-lx`, so the family recolours with the site theme instead
 * of carrying the reference palette around.
 */
import { useState, type CSSProperties } from 'react'
import { EditableText, editOf, useElementStyle } from '../editable'
import { Icon } from '../icons'
import {
  BrandLogo,
  Grid,
  Media,
  SafeText,
  SectionShell,
  bool,
  cx,
  items,
  num,
  sectionVars,
  str,
  type Props,
} from '../primitives'
import {
  descriptionField,
  headingField,
  icon,
  image,
  lightboxField,
  link,
  logoImageFields,
  navLinksField,
  repeater,
  schema,
  select,
  stickyField,
  text,
  textarea,
  toggle,
} from '../schema'
import { defineBlock } from '../types'

/* ------------------------------------------------------------------- parts */

/**
 * Eyebrow, headline and standfirst. `accentWord` is appended to the heading in
 * the accent colour, which is how the reference marks the one idea in a
 * headline that matters without breaking it onto its own line.
 */
function LxHead({ props, align = 'left' }: { props: Props; align?: 'left' | 'center' }) {
  const edit = editOf(props)
  const eyebrow = str(props.eyebrow)
  const heading = str(props.heading)
  const accentWord = str(props.accentWord)
  const description = str(props.description)
  if (!edit && !eyebrow && !heading && !description) return null
  return (
    <div className={cx('ud-lx-head', align === 'center' && 'ud-lx-head--center')}>
      {eyebrow || edit ? (
        <p className="ud-lx-eyebrow">
          <EditableText edit={edit} path={['eyebrow']} value={eyebrow} placeholder="Eyebrow" />
        </p>
      ) : null}
      {heading || accentWord || edit ? (
        <h2 className="ud-lx-title">
          <EditableText edit={edit} path={['heading']} value={heading} as="span" placeholder="Heading" />
          {accentWord || edit ? (
            <>
              {' '}
              <EditableText
                edit={edit}
                path={['accentWord']}
                value={accentWord}
                as="span"
                className="ud-lx-title__accent"
                placeholder="Accent"
              />
            </>
          ) : null}
        </h2>
      ) : null}
      {description || edit ? (
        <SafeText value={description} className="ud-lx-lead" edit={edit} path={['description']} placeholder="Short description" />
      ) : null}
    </div>
  )
}

/** Solid pill plus an underlined text link, the pairing the reference uses. */
function LxCta({ props }: { props: Props }) {
  const edit = editOf(props)
  const primaryStyle = useElementStyle(['buttonLabel', '$box'])
  const secondaryStyle = useElementStyle(['secondaryLabel', '$box'])
  const label = str(props.buttonLabel)
  const secondary = str(props.secondaryLabel)
  if (!label && !secondary && !edit) return null
  return (
    <div className="ud-lx-cta">
      {label || edit ? (
        <a className="ud-lx-btn" href={str(props.buttonUrl, '#')} style={primaryStyle}>
          <EditableText edit={edit} path={['buttonLabel']} value={label} as="span" placeholder="Button" />
        </a>
      ) : null}
      {secondary || edit ? (
        <a className="ud-lx-link" href={str(props.secondaryUrl, '#')} style={secondaryStyle}>
          <EditableText edit={edit} path={['secondaryLabel']} value={secondary} as="span" placeholder="Secondary" />
          <span aria-hidden>↗</span>
        </a>
      ) : null}
    </div>
  )
}

/** The thin orange path that ties the light sections together. */
function LxCurve() {
  return (
    <svg className="ud-lx-curve" viewBox="0 0 640 220" fill="none" aria-hidden focusable="false">
      <path d="M0 34h286c48 0 78 26 96 62 20 40 46 62 96 62h162" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="640" cy="158" r="4" fill="currentColor" />
    </svg>
  )
}

const headFields = [
  text('eyebrow', 'Eyebrow'),
  headingField,
  text('accentWord', 'Accent word', { placeholder: 'Shown after the heading in the accent colour' }),
  descriptionField,
]

const ctaFields = [
  text('buttonLabel', 'Button label', { styleTarget: 'button' }),
  link('buttonUrl', 'Button link'),
  text('secondaryLabel', 'Text link label', { styleTarget: 'button' }),
  link('secondaryUrl', 'Text link'),
]

const base = { paddingTop: 104, paddingBottom: 104, animation: 'fade-up', animationTrigger: 'scroll' }

/* ------------------------------------------------------------ navbar.lexara */

export const navbarLexara = defineBlock({
  type: 'navbar.lexara',
  version: 1,
  category: 'navigation',
  label: 'Lexara / Ticker navigation',
  icon: 'Menu',
  defaultProps: {
    paddingTop: 0,
    paddingBottom: 0,
    brand: 'Lexara',
    announcement: 'Platform tour — see contract review run in minutes',
    announcementUrl: '/platform',
    links: [
      { label: 'Platform', url: '/platform' },
      { label: 'Solutions', url: '/solutions' },
      { label: 'Customers', url: '/customers' },
      { label: 'Resources', url: '/resources' },
      { label: 'Company', url: '/company' },
    ],
    secondaryLabel: 'Get pricing',
    secondaryUrl: '/company#contact',
    buttonLabel: 'Book a demo',
    buttonUrl: '/company#contact',
    sticky: true,
  },
  schema: schema(
    ...logoImageFields,
    text('brand', 'Wordmark'),
    text('announcement', 'Announcement'),
    link('announcementUrl', 'Announcement link'),
    navLinksField('links', 'Links'),
    ...ctaFields,
    stickyField,
  ),
  component: function NavbarLexara(props) {
    const edit = editOf(props)
    const [open, setOpen] = useState(false)
    const announcement = str(props.announcement)
    return (
      <header
        className={cx('ud-lx', 'ud-lx-nav', bool(props.sticky, true) && 'ud-lx-nav--sticky')}
        style={sectionVars(props, 'default') as CSSProperties}
      >
        {announcement || edit ? (
          <a className="ud-lx-ticker" href={str(props.announcementUrl, '#')}>
            <EditableText edit={edit} path={['announcement']} value={announcement} as="span" placeholder="Announcement" />
            <span aria-hidden>→</span>
          </a>
        ) : null}
        <div className="ud-container ud-lx-nav__bar">
          <a className="ud-lx-brand" href="/">
            <BrandLogo props={props} alt={str(props.brand, 'Lexara')}>
              <span className="ud-lx-brand__mark" aria-hidden />
              <EditableText edit={edit} path={['brand']} value={str(props.brand, 'Lexara')} as="span" placeholder="Brand" />
            </BrandLogo>
          </a>
          <nav className={cx('ud-lx-nav__links', open && 'is-open')} aria-label="Primary">
            {items(props.links, []).map((item, index) => (
              <a key={index} href={str(item.url, '#')} onClick={() => setOpen(false)}>
                <EditableText edit={edit} path={['links', index, 'label']} value={str(item.label)} placeholder="Link" />
              </a>
            ))}
          </nav>
          <div className="ud-lx-nav__end">
            {str(props.secondaryLabel) || edit ? (
              <a className="ud-lx-nav__ghost" href={str(props.secondaryUrl, '#')}>
                <EditableText edit={edit} path={['secondaryLabel']} value={str(props.secondaryLabel)} placeholder="Link" />
              </a>
            ) : null}
            {str(props.buttonLabel) || edit ? (
              <a className="ud-lx-btn ud-lx-btn--sm" href={str(props.buttonUrl, '#')}>
                <EditableText edit={edit} path={['buttonLabel']} value={str(props.buttonLabel)} placeholder="Button" />
              </a>
            ) : null}
            <button
              type="button"
              className="ud-lx-nav__toggle"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <Icon name={open ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </div>
      </header>
    )
  },
})

/* -------------------------------------------------------------- hero.lexara */

export const heroLexara = defineBlock({
  type: 'hero.lexara',
  version: 1,
  category: 'hero',
  label: 'Lexara / Display hero',
  icon: 'Sparkles',
  defaultProps: {
    ...base,
    paddingTop: 150,
    paddingBottom: 130,
    tone: 'dark',
    eyebrow: '',
    heading: 'Turn every agreement into',
    accentWord: 'business intelligence.',
    description:
      'The data-first contract platform that shortens review cycles, surfaces the risk hiding in the fine print, and turns legal teams into decision partners.',
    buttonLabel: 'Book a demo',
    buttonUrl: '/company#contact',
    secondaryLabel: 'Take the tour',
    secondaryUrl: '/platform',
    layout: 'display',
    animation: 'fade-up',
    animationTrigger: 'load',
  },
  schema: schema(
    ...headFields,
    ...ctaFields,
    select('layout', 'Hero size', [
      ['display', 'Display — home page'],
      ['page', 'Page header — inner pages'],
    ], 'layout'),
  ),
  component: function HeroLexara(props) {
    const display = str(props.layout, 'display') === 'display'
    return (
      <SectionShell props={props} tone="dark" className={cx('ud-lx', 'ud-lx-hero', display ? 'ud-lx-hero--display' : 'ud-lx-hero--page')}>
        <div className="ud-lx-hero__copy">
          <LxHead props={props} align={display ? 'center' : 'left'} />
          <LxCta props={props} />
        </div>
        <span className="ud-lx-hero__glow" aria-hidden />
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------- stats.lexara */

const statItems = [
  { value: '80%', label: 'Less time spent\non contract admin' },
  { value: '99%', label: 'Faster internal\napprovals' },
  { value: '50%', label: 'Faster first-pass\ncontract review' },
  { value: '30%', label: 'Reduction in\nuntracked spend' },
]

export const statsLexara = defineBlock({
  type: 'stats.lexara',
  version: 1,
  category: 'content',
  label: 'Lexara / Outcome figures',
  icon: 'Chart',
  defaultProps: {
    paddingTop: 0,
    paddingBottom: 0,
    tone: 'dark',
    showPlus: true,
    items: statItems,
  },
  schema: schema(
    toggle('showPlus', 'Show the + prefix', 'design'),
    repeater('items', 'Figures', [text('value', 'Value'), textarea('label', 'Label')], {
      itemLabel: 'Figure',
      itemDefaults: { value: '40%', label: 'What it improved' },
    }),
  ),
  component: function StatsLexara(props) {
    const edit = editOf(props)
    const rows = items(props.items, statItems)
    return (
      <SectionShell props={props} tone="dark" className="ud-lx ud-lx-stats">
        <div className="ud-lx-stats__row">
          {rows.map((item, index) => (
            <div key={index} className="ud-lx-stat">
              <p className="ud-lx-stat__value">
                {bool(props.showPlus, true) ? <span aria-hidden>+</span> : null}
                <EditableText edit={edit} path={['items', index, 'value']} value={str(item.value)} as="span" placeholder="80%" />
              </p>
              <SafeText
                value={item.label}
                className="ud-lx-stat__label"
                edit={edit}
                path={['items', index, 'label']}
                placeholder="What it improved"
              />
            </div>
          ))}
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------- logos.lexara */

const logoItems = [
  { label: 'Meridian Health' },
  { label: 'Kestrel Group' },
  { label: 'Norsted' },
  { label: 'Arbour & Co' },
  { label: 'Halden Rail' },
  { label: 'Pallas Energy' },
]

export const logosLexara = defineBlock({
  type: 'logos.lexara',
  version: 1,
  category: 'content',
  label: 'Lexara / Client wall',
  icon: 'Globe',
  defaultProps: {
    paddingTop: 72,
    paddingBottom: 72,
    heading: 'Trusted by legal and procurement teams in regulated industries',
    items: logoItems,
  },
  schema: schema(
    headingField,
    repeater('items', 'Clients', [text('label', 'Name'), image('image', 'Logo image')], {
      itemLabel: 'Client',
      itemDefaults: { label: 'Client name' },
    }),
  ),
  component: function LogosLexara(props) {
    const edit = editOf(props)
    const rows = items(props.items, logoItems)
    return (
      <SectionShell props={props} tone="default" align="center" className="ud-lx ud-lx-logos">
        <EditableText
          edit={edit}
          path={['heading']}
          value={str(props.heading)}
          as="p"
          className="ud-lx-logos__caption"
          placeholder="Caption"
        />
        <div className="ud-lx-logos__row">
          {rows.map((item, index) => (
            <span key={index} className="ud-lx-logo">
              {str(item.image) ? (
                <img src={str(item.image)} alt={str(item.label)} loading="lazy" />
              ) : (
                <EditableText edit={edit} path={['items', index, 'label']} value={str(item.label)} as="span" placeholder="Client" />
              )}
            </span>
          ))}
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ---------------------------------------------------------- showcase.lexara */

const showcaseTabs = [
  {
    label: 'Workflow',
    icon: 'layers',
    title: 'Approvals that route themselves',
    text: 'Set the rule once and every agreement follows it — the right reviewers, in the right order, with the clock running where you can see it.',
    steps: [
      { role: 'Compliance', note: 'Risk score under threshold', state: 'Approved' },
      { role: 'Finance', note: 'Contract value over £50,000', state: 'Approved' },
      { role: 'Legal', note: 'New counterparty relationship', state: 'In review' },
    ],
  },
  {
    label: 'Review',
    icon: 'search',
    title: 'The risky clause, found first',
    text: 'Every draft is read against your playbook the moment it lands, so the exceptions surface before anyone spends an afternoon looking for them.',
    steps: [
      { role: 'Liability cap', note: 'Below approved floor', state: 'Flagged' },
      { role: 'Payment terms', note: 'Net 90 against Net 30 standard', state: 'Flagged' },
      { role: 'Governing law', note: 'Matches playbook', state: 'Approved' },
    ],
  },
  {
    label: 'Renewals',
    icon: 'clock',
    title: 'No renewal arrives by surprise',
    text: 'Obligations and dates are pulled out of the agreement itself, so the notice window opens with an owner already attached to it.',
    steps: [
      { role: 'Auto-renew notice', note: '30 days remaining', state: 'Due' },
      { role: 'Volume commitment', note: 'Tracking 82% of minimum', state: 'In review' },
      { role: 'Annual uplift', note: 'Capped at CPI', state: 'Approved' },
    ],
  },
]

export const showcaseLexara = defineBlock({
  type: 'showcase.lexara',
  version: 1,
  category: 'features',
  label: 'Lexara / Tabbed product showcase',
  icon: 'Layers',
  defaultProps: {
    ...base,
    eyebrow: 'The platform',
    heading: 'One place where contract work actually',
    accentWord: 'moves.',
    description: '',
    reverse: false,
    items: showcaseTabs,
  },
  schema: schema(
    ...headFields,
    toggle('reverse', 'Swap columns', 'layout'),
    repeater(
      'items',
      'Tabs',
      [
        text('label', 'Tab label'),
        icon('icon', 'Tab icon'),
        text('title', 'Panel title'),
        textarea('text', 'Panel description'),
        repeater('steps', 'Rows', [text('role', 'Row title'), text('note', 'Row detail'), text('state', 'Status')], {
          itemLabel: 'Row',
          itemDefaults: { role: 'Reviewer', note: 'What triggered it', state: 'Approved' },
        }),
      ],
      { itemLabel: 'Tab', itemDefaults: { label: 'New tab', title: 'Panel title', text: 'What this view does.', icon: 'layers', steps: [] } },
    ),
  ),
  component: function ShowcaseLexara(props) {
    const edit = editOf(props)
    const rows = items(props.items, showcaseTabs)
    const [active, setActive] = useState(0)
    const index = Math.min(active, Math.max(rows.length - 1, 0))
    const current = rows[index] || {}
    return (
      <SectionShell props={props} tone="surface" className="ud-lx ud-lx-showcase">
        <LxHead props={props} align="center" />
        <div className="ud-lx-tabs" role="tablist" aria-label="Product areas">
          {rows.map((tab, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={cx('ud-lx-tab', i === index && 'is-active')}
              onClick={() => setActive(i)}
            >
              <Icon name={str(tab.icon, 'layers')} size={16} />
              <span>{str(tab.label, 'Tab')}</span>
            </button>
          ))}
        </div>
        <div className={cx('ud-lx-panel', bool(props.reverse) && 'ud-lx-panel--reverse')} key={index}>
          <div className="ud-lx-panel__copy">
            <EditableText
              edit={edit}
              path={['items', index, 'title']}
              value={str(current.title)}
              as="h3"
              className="ud-lx-panel__title"
              placeholder="Panel title"
            />
            <SafeText
              value={current.text}
              className="ud-lx-panel__text"
              edit={edit}
              path={['items', index, 'text']}
              placeholder="What this view does"
            />
          </div>
          <div className="ud-lx-mock" aria-hidden>
            <div className="ud-lx-mock__bar">
              <span />
              <span />
              <span />
            </div>
            {items(current.steps, []).map((step, i) => (
              <div key={i} className="ud-lx-mock__row">
                <span className="ud-lx-mock__step">Step {i + 1}</span>
                <span className="ud-lx-mock__role">{str(step.role)}</span>
                <span className="ud-lx-mock__note">{str(step.note)}</span>
                <span className={cx('ud-lx-chip', str(step.state) === 'Flagged' && 'ud-lx-chip--warn')}>{str(step.state)}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ---------------------------------------------------------- features.lexara */

const featureItems = [
  {
    title: 'Drafting',
    text: 'Start from approved language, pull clauses from agreements that already closed, and let the playbook check the draft before it leaves the building.',
  },
  {
    title: 'Review and approval',
    text: 'Risky and non-standard terms are marked on arrival with fallback wording suggested, so the exceptions are the only thing anyone reads twice.',
  },
  {
    title: 'Obligations',
    text: 'Payment milestones, service levels and reporting duties are extracted and owned, with the past-due items in one list instead of six inboxes.',
  },
  {
    title: 'Search and analysis',
    text: 'Ask a question across thousands of agreements and get the clause, the contract and the date behind the answer.',
  },
]

export const featuresLexara = defineBlock({
  type: 'features.lexara',
  version: 1,
  category: 'features',
  label: 'Lexara / Feature accordion',
  icon: 'ListChecks',
  defaultProps: {
    ...base,
    tone: 'dark',
    eyebrow: 'Capabilities',
    heading: 'Everything the agreement touches, in',
    accentWord: 'one system.',
    description: '',
    buttonLabel: 'Book a demo',
    buttonUrl: '/company#contact',
    reverse: false,
    items: featureItems,
  },
  schema: schema(
    ...headFields,
    text('buttonLabel', 'Button label', { styleTarget: 'button' }),
    link('buttonUrl', 'Button link'),
    toggle('reverse', 'Swap columns', 'layout'),
    repeater('items', 'Capabilities', [text('title', 'Title'), textarea('text', 'Description')], {
      itemLabel: 'Capability',
      itemDefaults: { title: 'New capability', text: 'What it does.' },
    }),
  ),
  component: function FeaturesLexara(props) {
    const edit = editOf(props)
    const rows = items(props.items, featureItems)
    const [active, setActive] = useState(0)
    const index = Math.min(active, Math.max(rows.length - 1, 0))
    return (
      <SectionShell props={props} tone="dark" className="ud-lx ud-lx-features">
        <LxHead props={props} align="center" />
        <div className={cx('ud-lx-features__grid', bool(props.reverse) && 'ud-lx-features__grid--reverse')}>
          <div className="ud-lx-accordion">
            {rows.map((item, i) => (
              <div key={i} className={cx('ud-lx-acc', i === index && 'is-open')}>
                <button type="button" aria-expanded={i === index} onClick={() => setActive(i)}>
                  <span>{str(item.title, 'Capability')}</span>
                  <span aria-hidden>{i === index ? '−' : '+'}</span>
                </button>
                {i === index ? (
                  <div className="ud-lx-acc__body">
                    <SafeText
                      value={item.text}
                      edit={edit}
                      path={['items', i, 'text']}
                      placeholder="What it does"
                    />
                    {str(props.buttonLabel) || edit ? (
                      <a className="ud-lx-btn ud-lx-btn--sm" href={str(props.buttonUrl, '#')}>
                        <EditableText edit={edit} path={['buttonLabel']} value={str(props.buttonLabel)} placeholder="Button" />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="ud-lx-doc" aria-hidden>
            <p className="ud-lx-doc__title">Master services agreement</p>
            <p className="ud-lx-doc__sub">Clause 8 — Limitation of liability</p>
            <div className="ud-lx-doc__lines">
              {[92, 100, 84, 96, 70].map((width, i) => (
                <i key={i} style={{ width: `${width}%` }} />
              ))}
            </div>
            <div className="ud-lx-doc__flag">
              <span className="ud-lx-chip ud-lx-chip--warn">Below playbook floor</span>
              <div className="ud-lx-doc__lines">
                {[88, 64].map((width, i) => (
                  <i key={i} style={{ width: `${width}%` }} />
                ))}
              </div>
            </div>
            <div className="ud-lx-doc__lines">
              {[100, 78].map((width, i) => (
                <i key={i} style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------- intro.lexara */

export const introLexara = defineBlock({
  type: 'intro.lexara',
  version: 1,
  category: 'content',
  label: 'Lexara / Accent statement',
  icon: 'Pen',
  defaultProps: {
    ...base,
    tone: 'surface',
    eyebrow: 'Introducing Lexara Signal',
    heading: 'Every contract you sign should make the next one',
    accentWord: 'easier.',
    description:
      'Signal reads the agreements you have already closed and turns them into the standards your next negotiation starts from.',
    buttonLabel: 'Explore Signal',
    buttonUrl: '/platform',
    secondaryLabel: '',
    secondaryUrl: '',
  },
  schema: schema(...headFields, ...ctaFields),
  component: function IntroLexara(props) {
    return (
      <SectionShell props={props} tone="surface" className="ud-lx ud-lx-intro">
        <div className="ud-lx-intro__copy">
          <LxHead props={props} />
          <LxCta props={props} />
        </div>
        <LxCurve />
      </SectionShell>
    )
  },
  settings: null,
})

/* ----------------------------------------------------------- pillars.lexara */

const pillarItems = [
  {
    title: 'Contracts as data',
    text: 'Every agreement becomes structured, queryable information the moment it lands — not a PDF nobody opens again.',
  },
  {
    title: 'Judgement stays human',
    text: 'The platform prepares the decision and shows its evidence. The call, and the accountability for it, stays with your team.',
  },
  {
    title: 'Built to be changed',
    text: 'Approval chains, clause libraries and templates are configured by the people who own the process, without a support ticket.',
  },
]

export const pillarsLexara = defineBlock({
  type: 'pillars.lexara',
  version: 1,
  category: 'features',
  label: 'Lexara / Numbered principles',
  icon: 'Grid3x3',
  defaultProps: {
    ...base,
    eyebrow: 'How we build',
    heading: 'A platform with a point of',
    accentWord: 'view.',
    description: '',
    items: pillarItems,
  },
  schema: schema(
    ...headFields,
    repeater('items', 'Principles', [text('title', 'Title'), textarea('text', 'Description')], {
      itemLabel: 'Principle',
      itemDefaults: { title: 'New principle', text: 'What it means in practice.' },
    }),
  ),
  component: function PillarsLexara(props) {
    const edit = editOf(props)
    const rows = items(props.items, pillarItems)
    return (
      <SectionShell props={props} tone="default" className="ud-lx ud-lx-pillars">
        <LxHead props={props} />
        <Grid cols={Math.min(rows.length || 1, 3)} gap={0} className="ud-lx-pillars__grid">
          {rows.map((item, index) => (
            <article key={index} className="ud-lx-pillar">
              <span className="ud-lx-pillar__num">{String(index + 1).padStart(2, '0')}</span>
              <EditableText
                edit={edit}
                path={['items', index, 'title']}
                value={str(item.title, 'Principle')}
                as="h3"
                placeholder="Title"
              />
              <SafeText value={item.text} edit={edit} path={['items', index, 'text']} placeholder="What it means" />
            </article>
          ))}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------- cards.lexara */

const cardItems = [
  { title: 'Manufacturing', text: 'Supplier terms, volume commitments and quality obligations tracked across every plant.', url: '/solutions' },
  { title: 'Pharma and biotech', text: 'Clinical trial agreements and licensing terms held to the standard your regulators expect.', url: '/solutions' },
  { title: 'Software and technology', text: 'Order forms, renewals and usage commitments that keep revenue recognition clean.', url: '/solutions' },
  { title: 'Professional services', text: 'Statements of work and rate cards that stay aligned to the master agreement.', url: '/solutions' },
  { title: 'Energy and utilities', text: 'Long-dated contracts with obligations that outlive the people who signed them.', url: '/solutions' },
  { title: 'Public sector', text: 'Procurement rules, audit trails and reporting duties evidenced end to end.', url: '/solutions' },
]

export const cardsLexara = defineBlock({
  type: 'cards.lexara',
  version: 1,
  category: 'services',
  label: 'Lexara / Card grid',
  icon: 'LayoutGrid',
  defaultProps: {
    ...base,
    eyebrow: 'By industry',
    heading: 'Built for the contracts your sector actually',
    accentWord: 'signs.',
    description: '',
    columns: 3,
    items: cardItems,
  },
  schema: schema(
    ...headFields,
    select('columns', 'Columns', [['2', 'Two'], ['3', 'Three']], 'layout'),
    lightboxField,
    repeater(
      'items',
      'Cards',
      [text('title', 'Title'), textarea('text', 'Description'), icon('icon', 'Icon'), image('image', 'Image'), link('url', 'Link')],
      { itemLabel: 'Card', itemDefaults: { title: 'New card', text: 'What it covers.' } },
    ),
  ),
  component: function CardsLexara(props) {
    const edit = editOf(props)
    const rows = items(props.items, cardItems)
    return (
      <SectionShell props={props} tone="default" className="ud-lx ud-lx-cards">
        <LxHead props={props} />
        <Grid cols={num(props.columns, 3)} gap={20} className="ud-lx-cards__grid">
          {rows.map((item, index) => {
            const url = str(item.url)
            const body = (
              <>
                {str(item.image) ? (
                  <Media
                    src={item.image}
                    alt={str(item.title)}
                    ratio="wide"
                    className="ud-lx-card__img"
                    lightbox={bool(props.lightbox, false) && !url}
                    edit={edit}
                    path={['items', index, 'image']}
                  />
                ) : str(item.icon) ? (
                  <span className="ud-lx-card__icon" aria-hidden>
                    <Icon name={str(item.icon)} size={20} />
                  </span>
                ) : null}
                <EditableText
                  edit={edit}
                  path={['items', index, 'title']}
                  value={str(item.title, 'Card')}
                  as="h3"
                  placeholder="Title"
                />
                <SafeText value={item.text} edit={edit} path={['items', index, 'text']} placeholder="What it covers" />
                {url ? (
                  <span className="ud-lx-card__go" aria-hidden>
                    ↗
                  </span>
                ) : null}
              </>
            )
            return url ? (
              <a key={index} className="ud-lx-card" href={url}>
                {body}
              </a>
            ) : (
              <div key={index} className="ud-lx-card">
                {body}
              </div>
            )
          })}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------ impact.lexara */

export const impactLexara = defineBlock({
  type: 'impact.lexara',
  version: 1,
  category: 'content',
  label: 'Lexara / Impact statement',
  icon: 'Target',
  defaultProps: {
    ...base,
    tone: 'dark',
    eyebrow: 'The whole picture',
    heading: 'See what every agreement is really',
    accentWord: 'worth.',
    description:
      'Value, risk and obligation rolled up across the portfolio — so the answer to "what did we commit to?" takes a moment, not a week.',
    buttonLabel: 'See the platform',
    buttonUrl: '/platform',
    secondaryLabel: '',
    secondaryUrl: '',
    metricValue: '1,000+',
    metricLabel: 'agreements analysed in a single pass',
    reverse: false,
  },
  schema: schema(
    ...headFields,
    ...ctaFields,
    toggle('reverse', 'Swap columns', 'layout'),
    text('metricValue', 'Metric value'),
    text('metricLabel', 'Metric label'),
  ),
  component: function ImpactLexara(props) {
    const edit = editOf(props)
    return (
      <SectionShell props={props} tone="dark" className="ud-lx ud-lx-impact">
        <div className={cx('ud-lx-impact__grid', bool(props.reverse) && 'ud-lx-impact__grid--reverse')}>
          <div>
            <LxHead props={props} />
            <LxCta props={props} />
          </div>
          <div className="ud-lx-impact__metric">
            <EditableText
              edit={edit}
              path={['metricValue']}
              value={str(props.metricValue)}
              as="strong"
              placeholder="1,000+"
            />
            <EditableText
              edit={edit}
              path={['metricLabel']}
              value={str(props.metricLabel)}
              as="span"
              placeholder="What it counts"
            />
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------ testimonials.lexara */

const quoteItems = [
  {
    quote: 'We stopped chasing signatures and started reading the terms. That is the whole change, and it happened in a quarter.',
    name: 'Sample testimonial — replace with your own',
    role: 'Head of Legal Operations',
    company: 'Example customer',
  },
  {
    quote: 'The first month told us which of our own clauses were slowing every deal down. We had never been able to see that before.',
    name: 'Sample testimonial — replace with your own',
    role: 'Director of Procurement',
    company: 'Example customer',
  },
]

const quoteMetrics = [
  { value: '96%', label: 'Customer retention' },
  { value: '99%', label: 'Implementation satisfaction' },
  { value: '4.8', label: 'Average support rating' },
]

export const testimonialsLexara = defineBlock({
  type: 'testimonials.lexara',
  version: 1,
  category: 'testimonials',
  label: 'Lexara / Customer story',
  icon: 'Quote',
  defaultProps: {
    ...base,
    tone: 'surface',
    eyebrow: 'Customers',
    heading: 'The teams who took the',
    accentWord: 'long view.',
    description: '',
    items: quoteItems,
    metrics: quoteMetrics,
  },
  schema: schema(
    ...headFields,
    repeater(
      'items',
      'Quotes',
      [textarea('quote', 'Quote'), text('name', 'Name'), text('role', 'Role'), text('company', 'Company')],
      { itemLabel: 'Quote', itemDefaults: { quote: 'What they said.', name: 'Name', role: 'Role', company: 'Company' } },
    ),
    repeater('metrics', 'Metrics', [text('value', 'Value'), text('label', 'Label')], {
      itemLabel: 'Metric',
      itemDefaults: { value: '90%', label: 'What it measures' },
    }),
  ),
  component: function TestimonialsLexara(props) {
    const edit = editOf(props)
    const rows = items(props.items, quoteItems)
    const metrics = items(props.metrics, quoteMetrics)
    const [active, setActive] = useState(0)
    const index = Math.min(active, Math.max(rows.length - 1, 0))
    const current = rows[index] || {}
    return (
      <SectionShell props={props} tone="surface" className="ud-lx ud-lx-quotes">
        <LxHead props={props} />
        <figure className="ud-lx-quote" key={index}>
          <SafeText
            value={current.quote}
            className="ud-lx-quote__text"
            edit={edit}
            path={['items', index, 'quote']}
            placeholder="What they said"
          />
          <figcaption>
            <EditableText edit={edit} path={['items', index, 'name']} value={str(current.name)} as="strong" placeholder="Name" />
            <span>
              {str(current.role)}
              {str(current.company) ? ` · ${str(current.company)}` : ''}
            </span>
          </figcaption>
        </figure>
        {rows.length > 1 ? (
          <div className="ud-lx-quote__nav">
            <button type="button" aria-label="Previous story" onClick={() => setActive((index - 1 + rows.length) % rows.length)}>
              ←
            </button>
            <span>
              {index + 1} / {rows.length}
            </span>
            <button type="button" aria-label="Next story" onClick={() => setActive((index + 1) % rows.length)}>
              →
            </button>
          </div>
        ) : null}
        {metrics.length ? (
          <div className="ud-lx-quote__metrics">
            {metrics.map((metric, i) => (
              <div key={i}>
                <EditableText edit={edit} path={['metrics', i, 'value']} value={str(metric.value)} as="strong" placeholder="96%" />
                <EditableText edit={edit} path={['metrics', i, 'label']} value={str(metric.label)} as="span" placeholder="What it measures" />
              </div>
            ))}
          </div>
        ) : null}
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------- award.lexara */

export const awardLexara = defineBlock({
  type: 'award.lexara',
  version: 1,
  category: 'content',
  label: 'Lexara / Recognition band',
  icon: 'Award',
  defaultProps: {
    paddingTop: 56,
    paddingBottom: 56,
    tone: 'default',
    heading: 'Named a leader in contract intelligence, six years running.',
    accentWord: '',
    eyebrow: 'Recognition',
    description: '',
    buttonLabel: 'Read the report',
    buttonUrl: '/resources',
    secondaryLabel: '',
    secondaryUrl: '',
  },
  schema: schema(...headFields, ...ctaFields),
  component: function AwardLexara(props) {
    return (
      <SectionShell props={props} tone="default" className="ud-lx ud-lx-award">
        <div className="ud-lx-award__inner">
          <span className="ud-lx-award__mark" aria-hidden>
            <Icon name="award" size={26} />
          </span>
          <LxHead props={props} />
          <LxCta props={props} />
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* --------------------------------------------------------------- cta.lexara */

export const ctaLexara = defineBlock({
  type: 'cta.lexara',
  version: 1,
  category: 'cta',
  label: 'Lexara / Closing invitation',
  icon: 'ArrowRight',
  defaultProps: {
    ...base,
    paddingTop: 120,
    paddingBottom: 120,
    tone: 'dark',
    eyebrow: '',
    heading: 'Bring your next renewal cycle',
    accentWord: 'forward.',
    description: 'Thirty minutes with our team is usually enough to see where the weeks are going.',
    buttonLabel: 'Book a demo',
    buttonUrl: '/company#contact',
    secondaryLabel: 'Talk to sales',
    secondaryUrl: '/company#contact',
  },
  schema: schema(...headFields, ...ctaFields),
  component: function CtaLexara(props) {
    return (
      <SectionShell props={props} tone="dark" align="center" className="ud-lx ud-lx-closing">
        <LxHead props={props} align="center" />
        <LxCta props={props} />
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------ footer.lexara */

const footerGroups = [
  {
    title: 'Platform',
    links: [
      { label: 'Overview', url: '/platform' },
      { label: 'Solutions', url: '/solutions' },
      { label: 'Customers', url: '/customers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', url: '/company' },
      { label: 'Resources', url: '/resources' },
      { label: 'Contact', url: '/company#contact' },
    ],
  },
]

export const footerLexara = defineBlock({
  type: 'footer.lexara',
  version: 1,
  category: 'footer',
  label: 'Lexara / Column footer',
  icon: 'Layout',
  defaultProps: {
    paddingTop: 84,
    paddingBottom: 36,
    tone: 'dark',
    brand: 'Lexara',
    description: 'The contract intelligence platform for teams who read the fine print.',
    copyright: '© 2026 Your company. All rights reserved.',
    groups: footerGroups,
  },
  schema: schema(
    text('brand', 'Wordmark'),
    ...logoImageFields,
    textarea('description', 'Description'),
    text('copyright', 'Copyright'),
    repeater(
      'groups',
      'Link columns',
      [text('title', 'Column title'), navLinksField('links', 'Links')],
      { itemLabel: 'Column', itemDefaults: { title: 'Column', links: [] } },
    ),
  ),
  component: function FooterLexara(props) {
    const edit = editOf(props)
    const groups = items(props.groups, footerGroups)
    return (
      <SectionShell props={props} tone="dark" className="ud-lx ud-lx-footer">
        <div className="ud-lx-footer__top">
          <div className="ud-lx-footer__brand">
            <a className="ud-lx-brand" href="/">
              <BrandLogo props={props} alt={str(props.brand, 'Lexara')}>
                <span className="ud-lx-brand__mark" aria-hidden />
                <EditableText edit={edit} path={['brand']} value={str(props.brand, 'Lexara')} as="span" placeholder="Brand" />
              </BrandLogo>
            </a>
            <SafeText value={props.description} edit={edit} path={['description']} placeholder="Short description" />
          </div>
          {groups.map((group, index) => (
            <nav key={index} aria-label={str(group.title, 'Links')}>
              <EditableText
                edit={edit}
                path={['groups', index, 'title']}
                value={str(group.title)}
                as="p"
                className="ud-lx-footer__col"
                placeholder="Column"
              />
              {items(group.links, []).map((item, i) => (
                <a key={i} href={str(item.url, '#')}>
                  {str(item.label)}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <div className="ud-lx-footer__bottom">
          <EditableText edit={edit} path={['copyright']} value={str(props.copyright)} as="span" placeholder="Copyright" />
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

export const lexaraBlocks = [
  navbarLexara,
  heroLexara,
  statsLexara,
  logosLexara,
  showcaseLexara,
  featuresLexara,
  introLexara,
  pillarsLexara,
  cardsLexara,
  impactLexara,
  testimonialsLexara,
  awardLexara,
  ctaLexara,
  footerLexara,
]
