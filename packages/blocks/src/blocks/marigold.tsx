/**
 * Marigold — a nonprofit, early-education and childcare template.
 *
 * Visual language: a warm cream sheet carrying deep-green full-bleed panels,
 * a lime headline colour that only ever appears on green, coral and pastel
 * chips for categories, generously rounded 20-30px cards with 100px pills,
 * and friendly rounded Parkinsans headings over plain Onest copy. The hero
 * and the closing band run edge to edge; everything else sits on the shared
 * container so a page reads as full-width panels stacked on a calm ground.
 *
 * Every block routes through `schema()`, which appends the shared design /
 * typography / background / spacing / content-width controls, so each one is
 * editable on the canvas and in the side panel and stays reusable on any
 * page. Colours resolve from theme tokens through the `--mg-*` variables on
 * `.ud-mg`, so the family recolours with the site theme.
 */
import { useState, type CSSProperties } from 'react'
import { EditableText, editOf, useColumnAttrs, useElementStyle } from '../editable'
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
  lines,
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
  columnStyleFields,
  schema,
  select,
  slider,
  stickyField,
  text,
  textarea,
  toggle,
} from '../schema'
import { defineBlock } from '../types'

/* ------------------------------------------------------------------- parts */

/** Small caps eyebrow, rounded display heading, standfirst. */
function MgHead({ props, align = 'left' }: { props: Props; align?: 'left' | 'center' }) {
  const edit = editOf(props)
  const eyebrow = str(props.eyebrow)
  const heading = str(props.heading)
  const description = str(props.description)
  if (!edit && !eyebrow && !heading && !description) return null
  return (
    <div className={cx('ud-mg-head', align === 'center' && 'ud-mg-head--center')}>
      {eyebrow || edit ? (
        <p className="ud-mg-eyebrow">
          <EditableText edit={edit} path={['eyebrow']} value={eyebrow} placeholder="Eyebrow" />
        </p>
      ) : null}
      {heading || edit ? (
        <EditableText edit={edit} path={['heading']} value={heading} as="h2" className="ud-mg-title" placeholder="Heading" />
      ) : null}
      {description || edit ? (
        <SafeText value={description} className="ud-mg-lead" edit={edit} path={['description']} placeholder="Short description" />
      ) : null}
    </div>
  )
}

/** Filled pill plus an outline pill — the pairing the reference repeats. */
function MgCta({ props }: { props: Props }) {
  const edit = editOf(props)
  const primaryStyle = useElementStyle(['buttonLabel', '$box'])
  const secondaryStyle = useElementStyle(['secondaryLabel', '$box'])
  const primary = str(props.buttonLabel)
  const secondary = str(props.secondaryLabel)
  if (!primary && !secondary && !edit) return null
  return (
    <div className="ud-mg-cta">
      {primary || edit ? (
        <a className="ud-mg-btn" href={str(props.buttonUrl, '#')} style={primaryStyle}>
          <EditableText edit={edit} path={['buttonLabel']} value={primary} as="span" placeholder="Button" />
          <span className="ud-mg-btn__dot" aria-hidden>
            <Icon name="arrow" size={13} />
          </span>
        </a>
      ) : null}
      {secondary || edit ? (
        <a className="ud-mg-btn ud-mg-btn--ghost" href={str(props.secondaryUrl, '#')} style={secondaryStyle}>
          <EditableText edit={edit} path={['secondaryLabel']} value={secondary} as="span" placeholder="Secondary" />
        </a>
      ) : null}
    </div>
  )
}

/**
 * Photography ships with the defaults so a block dragged out of the palette
 * arrives looking finished rather than as a row of grey boxes.
 */
const photo = (id: string, width = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`

const headFields = [text('eyebrow', 'Eyebrow'), headingField, descriptionField]
const ctaFields = [
  text('buttonLabel', 'Button label', { styleTarget: 'button' }),
  link('buttonUrl', 'Button link'),
  text('secondaryLabel', 'Secondary label', { styleTarget: 'button' }),
  link('secondaryUrl', 'Secondary link'),
]
const base = { paddingTop: 96, paddingBottom: 96, animation: 'fade-up', animationTrigger: 'scroll' }

/* ---------------------------------------------------------- navbar.marigold */

export const navbarMarigold = defineBlock({
  type: 'navbar.marigold',
  version: 1,
  category: 'navigation',
  label: 'Marigold / Rounded navigation',
  icon: 'Menu',
  defaultProps: {
    paddingTop: 0,
    paddingBottom: 0,
    brand: 'Marigold',
    links: [
      { label: 'Home', url: '/' },
      { label: 'About us', url: '/about' },
      { label: 'Programs', url: '/programs' },
      { label: 'Early years', url: '/early-years' },
      { label: 'Donate', url: '/donate' },
      { label: 'Shop', url: '/shop' },
    ],
    buttonLabel: 'Get admission',
    buttonUrl: '/contact',
    sticky: true,
  },
  schema: schema(
    text('brand', 'Wordmark'),
    image('logo', 'Logo image'),
    navLinksField('links', 'Links'),
    text('buttonLabel', 'Button label', { styleTarget: 'button' }),
    link('buttonUrl', 'Button link'),
    stickyField,
  ),
  component: function NavbarMarigold(props) {
    const edit = editOf(props)
    const [open, setOpen] = useState(false)
    const logo = str(props.logo)
    return (
      <header
        className={cx('ud-mg', 'ud-mg-nav', bool(props.sticky, true) && 'ud-mg-nav--sticky')}
        style={sectionVars(props, 'default') as CSSProperties}
      >
        <div className="ud-container ud-mg-nav__bar">
          <a className="ud-mg-brand" href="/">
            {logo ? (
              <img src={logo} alt={str(props.brand, 'Logo')} className="ud-mg-brand__logo" />
            ) : (
              <span className="ud-mg-brand__mark" aria-hidden />
            )}
            <EditableText edit={edit} path={['brand']} value={str(props.brand, 'Marigold')} as="span" placeholder="Brand" />
          </a>
          <nav className={cx('ud-mg-nav__links', open && 'is-open')} aria-label="Primary">
            {items(props.links, []).map((item, index) => (
              <a key={index} href={str(item.url, '#')} onClick={() => setOpen(false)}>
                <EditableText edit={edit} path={['links', index, 'label']} value={str(item.label)} placeholder="Link" />
              </a>
            ))}
          </nav>
          <div className="ud-mg-nav__end">
            {str(props.buttonLabel) || edit ? (
              <a className="ud-mg-btn ud-mg-btn--sm" href={str(props.buttonUrl, '#')}>
                <EditableText edit={edit} path={['buttonLabel']} value={str(props.buttonLabel)} placeholder="Button" />
                <span className="ud-mg-btn__dot" aria-hidden>
                  <Icon name="arrow" size={12} />
                </span>
              </a>
            ) : null}
            <button
              type="button"
              className="ud-mg-nav__toggle"
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

/* ------------------------------------------------------------ hero.marigold */

export const heroMarigold = defineBlock({
  type: 'hero.marigold',
  version: 1,
  category: 'hero',
  label: 'Marigold / Split panel hero',
  icon: 'Sparkles',
  defaultProps: {
    paddingTop: 0,
    paddingBottom: 0,
    layout: 'split',
    intro: 'We are a nonprofit committed to giving every child the chance to learn, grow and thrive.',
    heading: 'Education with purpose. Impact with heart.',
    eyebrow: '',
    description: '',
    buttonLabel: 'Donate now',
    buttonUrl: '/donate',
    secondaryLabel: 'Explore programs',
    secondaryUrl: '/programs',
    image: photo('1786292949404-084cbd10c7b1', 1100),
    portrait: photo('1761208663763-c4d30657c910', 500),
    statLabel: 'Raised donation',
    statValue: '$50,000',
    statGoal: '$80,000',
    statPercent: 62,
    animation: 'fade',
    animationTrigger: 'load',
  },
  schema: schema(
    textarea('intro', 'Intro line'),
    headingField,
    descriptionField,
    ...ctaFields,
    image('image', 'Main photo'),
    image('portrait', 'Small portrait'),
    text('statLabel', 'Stat label'),
    text('statValue', 'Raised'),
    text('statGoal', 'Goal'),
    slider('statPercent', 'Progress %', 0, 100, 'design'),
    select('layout', 'Layout', [['split', 'Split panel — home'], ['page', 'Page header — inner pages']], 'layout'),
    toggle('reverse', 'Swap columns', 'layout'),
    ...columnStyleFields(['panelColumn', 'Copy column'], ['mediaColumn', 'Photo column']),
  ),
  component: function HeroMarigold(props) {
    const edit = editOf(props)
    const panelCol = useColumnAttrs('panelColumn')
    const mediaCol = useColumnAttrs('mediaColumn')
    const split = str(props.layout, 'split') === 'split'
    if (!split) {
      return (
        <SectionShell props={props} tone="surface" className="ud-mg ud-mg-pagehead" align="center">
          <MgHead props={props} align="center" />
          <MgCta props={props} />
        </SectionShell>
      )
    }
    return (
      <SectionShell props={props} tone="default" className="ud-mg ud-mg-hero" bleed>
        <div className={cx('ud-mg-hero__grid', bool(props.reverse) && 'ud-mg-hero__grid--reverse')}>
          <div className="ud-mg-hero__panel" {...panelCol}>
            <span className="ud-mg-hero__rings" aria-hidden />
            {str(props.portrait) || edit ? (
              <Media
                src={props.portrait}
                alt=""
                ratio="landscape"
                className="ud-mg-hero__portrait"
                edit={edit}
                path={['portrait']}
              />
            ) : null}
            <SafeText
              value={props.intro}
              className="ud-mg-hero__intro"
              edit={edit}
              path={['intro']}
              placeholder="Who you are"
            />
            <EditableText
              edit={edit}
              path={['heading']}
              value={str(props.heading)}
              as="h1"
              className="ud-mg-hero__title"
              placeholder="Headline"
            />
            <MgCta props={props} />
          </div>
          <div className="ud-mg-hero__media" {...mediaCol}>
            <Media src={props.image} alt="" ratio="portrait" className="ud-mg-hero__photo" edit={edit} path={['image']} />
            <div className="ud-mg-hero__stat">
              <p className="ud-mg-hero__statlabel">
                <EditableText edit={edit} path={['statLabel']} value={str(props.statLabel)} placeholder="Raised" />
              </p>
              <p className="ud-mg-hero__statvalue">
                <EditableText edit={edit} path={['statValue']} value={str(props.statValue)} as="strong" placeholder="$50,000" />
                <span aria-hidden>/</span>
                <EditableText edit={edit} path={['statGoal']} value={str(props.statGoal)} as="span" placeholder="$80,000" />
              </p>
              <span className="ud-mg-bar" aria-hidden>
                <i style={{ width: `${Math.min(Math.max(num(props.statPercent, 60), 0), 100)}%` }} />
              </span>
            </div>
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------ quicklinks.marigold */

const quickItems = [
  { title: 'Explore programs', text: 'Tailored pathways for every learner.', icon: 'layers', url: '/programs' },
  { title: 'Browse courses', text: 'Interactive learning experiences.', icon: 'book', url: '/programs' },
  { title: 'Meet teachers', text: 'Personal guidance from specialists.', icon: 'users', url: '/about' },
  { title: 'View products', text: 'Kids and baby goods for every need.', icon: 'gift', url: '/shop' },
]

export const quicklinksMarigold = defineBlock({
  type: 'quicklinks.marigold',
  version: 1,
  category: 'features',
  label: 'Marigold / Quick link strip',
  icon: 'Grid3x3',
  defaultProps: { paddingTop: 0, paddingBottom: 0, lift: false, items: quickItems },
  schema: schema(
    toggle('lift', 'Overlap the section above', 'layout'),
    repeater('items', 'Links', [text('title', 'Title'), text('text', 'Description'), icon('icon', 'Icon'), link('url', 'Link')], {
      itemLabel: 'Link',
      itemDefaults: { title: 'New link', text: 'What it leads to.', icon: 'layers' },
    }),
  ),
  component: function QuicklinksMarigold(props) {
    const edit = editOf(props)
    const rows = items(props.items, quickItems)
    return (
      <SectionShell props={props} tone="default" className="ud-mg ud-mg-quick">
        <div className={cx('ud-mg-quick__row', bool(props.lift, false) && 'ud-mg-quick__row--lift')}>
          {rows.map((item, index) => {
            const url = str(item.url)
            const inner = (
              <>
                <span className="ud-mg-quick__icon" aria-hidden>
                  <Icon name={str(item.icon, 'layers')} size={19} />
                </span>
                <span className="ud-mg-quick__body">
                  <EditableText
                    edit={edit}
                    path={['items', index, 'title']}
                    value={str(item.title, 'Link')}
                    as="strong"
                    placeholder="Title"
                  />
                  <EditableText
                    edit={edit}
                    path={['items', index, 'text']}
                    value={str(item.text)}
                    as="span"
                    placeholder="Description"
                  />
                </span>
              </>
            )
            return url ? (
              <a key={index} className="ud-mg-quick__item" href={url}>
                {inner}
              </a>
            ) : (
              <div key={index} className="ud-mg-quick__item">
                {inner}
              </div>
            )
          })}
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ----------------------------------------------------------- about.marigold */

const aboutItems = [
  { title: 'Playful learning', text: 'Learning happens naturally through play and exploration.', icon: 'star' },
  { title: 'Safe environment', text: 'A secure, nurturing space where children feel comfortable.', icon: 'shield' },
  { title: 'Caring attention', text: 'Every child is seen, supported and cared for with patience.', icon: 'heart' },
]

export const aboutMarigold = defineBlock({
  type: 'about.marigold',
  version: 1,
  category: 'features',
  label: 'Marigold / Mission and values',
  icon: 'Heart',
  defaultProps: {
    ...base,
    eyebrow: 'For every child',
    heading: '',
    description:
      'We believe education is more than learning — it is hope, confidence and the foundation for lifelong opportunity. With donors, volunteers and partners we are shaping a world where no child is left behind.',
    items: aboutItems,
  },
  schema: schema(
    ...headFields,
    repeater('items', 'Values', [text('title', 'Title'), textarea('text', 'Description'), icon('icon', 'Icon')], {
      itemLabel: 'Value',
      itemDefaults: { title: 'New value', text: 'What it means.', icon: 'star' },
    }),
  ),
  component: function AboutMarigold(props) {
    const edit = editOf(props)
    const rows = items(props.items, aboutItems)
    return (
      <SectionShell props={props} tone="default" className="ud-mg ud-mg-about">
        <MgHead props={props} align="center" />
        <Grid cols={Math.min(rows.length || 1, 3)} gap={22} className="ud-mg-about__grid">
          {rows.map((item, index) => (
            <article key={index} className="ud-mg-value">
              <span className="ud-mg-value__icon" aria-hidden>
                <Icon name={str(item.icon, 'star')} size={20} />
              </span>
              <EditableText
                edit={edit}
                path={['items', index, 'title']}
                value={str(item.title, 'Value')}
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

/* -------------------------------------------------------- programs.marigold */

const programItems = [
  {
    label: 'Creative room',
    title: 'Creative room',
    text: 'A welcoming space where children are free to imagine and explore, in a supportive environment designed just for them.',
    image: photo('1564429097439-e400382dc893'),
  },
  {
    label: 'Kids classes',
    title: 'Kids classes',
    text: 'Structured, age-appropriate learning that builds strong academic and social foundations, guided by caring educators.',
    image: photo('1777056481869-feac70afe522'),
  },
  {
    label: 'Learning games',
    title: 'Learning games',
    text: 'Playful, interactive activities that strengthen memory, focus and critical thinking without it ever feeling like work.',
    image: photo('1785780224428-7b690d3d58bd'),
  },
  {
    label: 'Painting & art',
    title: 'Painting & art',
    text: 'Children express feelings and ideas through colour, shape and making — and find their own voice doing it.',
    image: photo('1564429238817-393bd4286b2d'),
  },
]

export const programsMarigold = defineBlock({
  type: 'programs.marigold',
  version: 1,
  category: 'services',
  label: 'Marigold / Program tabs',
  icon: 'Layers',
  defaultProps: {
    ...base,
    tone: 'dark',
    eyebrow: 'Program',
    heading: 'Creating opportunities through education.',
    description: '',
    buttonLabel: 'Explore programs',
    buttonUrl: '/programs',
    secondaryLabel: '',
    secondaryUrl: '',
    items: programItems,
  },
  schema: schema(
    ...headFields,
    ...ctaFields,
    toggle('reverse', 'Swap columns', 'layout'),
    repeater('items', 'Programs', [text('label', 'Tab label'), text('title', 'Title'), textarea('text', 'Description'), image('image', 'Photo')], {
      itemLabel: 'Program',
      itemDefaults: { label: 'New program', title: 'New program', text: 'What it covers.' },
    }),
    ...columnStyleFields(['mediaColumn', 'Photo column'], ['copyColumn', 'Copy column']),
  ),
  component: function ProgramsMarigold(props) {
    const edit = editOf(props)
    const copyCol = useColumnAttrs('copyColumn')
    const rows = items(props.items, programItems)
    const [active, setActive] = useState(0)
    const index = Math.min(active, Math.max(rows.length - 1, 0))
    const current = rows[index] || {}
    return (
      <SectionShell props={props} tone="dark" className="ud-mg ud-mg-programs">
        <MgHead props={props} />
        <div className="ud-mg-progtabs" role="tablist" aria-label="Programs">
          {rows.map((row, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={cx('ud-mg-progtab', i === index && 'is-active')}
              onClick={() => setActive(i)}
            >
              {str(row.label, 'Program')}
            </button>
          ))}
        </div>
        <div className={cx('ud-mg-progpanel', bool(props.reverse) && 'ud-mg-progpanel--reverse')} key={index}>
          <Media
            src={current.image}
            alt={str(current.title)}
            ratio="landscape"
            className="ud-mg-progpanel__img"
            styleKey="mediaColumn"
            edit={edit}
            path={['items', index, 'image']}
          />
          <div className="ud-mg-progpanel__copy" {...copyCol}>
            <EditableText
              edit={edit}
              path={['items', index, 'title']}
              value={str(current.title, 'Program')}
              as="h3"
              placeholder="Title"
            />
            <SafeText value={current.text} edit={edit} path={['items', index, 'text']} placeholder="What it covers" />
            <MgCta props={props} />
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ----------------------------------------------------------- steps.marigold */

const stepItems = [
  { title: 'Browse programs', text: 'Explore what we run online and find the best fit for your child’s age and interests.' },
  { title: 'Schedule a visit', text: 'See the space in person, meet the educators and watch an ordinary day unfold.' },
  { title: 'Confirm enrollment', text: 'Complete the paperwork and welcome your child into a place built for them.' },
]

export const stepsMarigold = defineBlock({
  type: 'steps.marigold',
  version: 1,
  category: 'features',
  label: 'Marigold / Enrolment steps',
  icon: 'ListChecks',
  defaultProps: {
    ...base,
    eyebrow: 'Enroll your child',
    heading: 'Steps toward a brighter future.',
    description: '',
    buttonLabel: 'Enroll now',
    buttonUrl: '/contact',
    secondaryLabel: 'Explore courses',
    secondaryUrl: '/programs',
    items: stepItems,
  },
  schema: schema(
    ...headFields,
    ...ctaFields,
    repeater('items', 'Steps', [text('title', 'Title'), textarea('text', 'Description')], {
      itemLabel: 'Step',
      itemDefaults: { title: 'New step', text: 'What happens here.' },
    }),
  ),
  component: function StepsMarigold(props) {
    const edit = editOf(props)
    const rows = items(props.items, stepItems)
    return (
      <SectionShell props={props} tone="surface" className="ud-mg ud-mg-steps">
        <div className="ud-mg-steps__top">
          <MgHead props={props} />
          <MgCta props={props} />
        </div>
        <Grid cols={Math.min(rows.length || 1, 3)} gap={22} className="ud-mg-steps__grid">
          {rows.map((item, index) => (
            <article key={index} className="ud-mg-step">
              <span className="ud-mg-step__num">{index + 1}</span>
              <EditableText
                edit={edit}
                path={['items', index, 'title']}
                value={str(item.title, 'Step')}
                as="h3"
                placeholder="Title"
              />
              <SafeText value={item.text} edit={edit} path={['items', index, 'text']} placeholder="What happens" />
            </article>
          ))}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------- donations.marigold */

const donationItems = [
  {
    title: 'Education for children',
    text: 'Enrolling out-of-school children into safe learning. Covers admission, uniforms, books and daily classroom support.',
    raised: '$40,000',
    goal: '$80,000',
    percent: 50,
    donors: '70',
    image: photo('1786667395513-1d0804488602'),
  },
  {
    title: 'Classrooms and learning spaces',
    text: 'Building, renovating and equipping classrooms with desks, lighting and child-friendly furniture.',
    raised: '$35,000',
    goal: '$60,000',
    percent: 60,
    donors: '50',
    image: photo('1786667395451-3f0cbf620a90'),
  },
  {
    title: 'Meals and fresh water',
    text: 'Nutritious daily meals and clean water for every child attending our learning centres.',
    raised: '$54,000',
    goal: '$60,000',
    percent: 90,
    donors: '70',
    image: photo('1763310225537-f7161d5c93e9'),
  },
]

export const donationsMarigold = defineBlock({
  type: 'donations.marigold',
  version: 1,
  category: 'features',
  label: 'Marigold / Donation cards',
  icon: 'Heart',
  defaultProps: {
    ...base,
    eyebrow: 'Donation',
    heading: 'Empowering children through giving.',
    description: '',
    amounts: '$50\n$100\n$200\n$400',
    buttonLabel: 'Donate now',
    buttonUrl: '/donate',
    items: donationItems,
  },
  schema: schema(
    ...headFields,
    textarea('amounts', 'Preset amounts (one per line)'),
    text('buttonLabel', 'Button label', { styleTarget: 'button' }),
    link('buttonUrl', 'Button link'),
    lightboxField,
    repeater(
      'items',
      'Appeals',
      [
        text('title', 'Title'),
        textarea('text', 'Description'),
        image('image', 'Photo'),
        text('raised', 'Raised'),
        text('goal', 'Goal'),
        slider('percent', 'Progress %', 0, 100),
        text('donors', 'Donor count'),
      ],
      { itemLabel: 'Appeal', itemDefaults: { title: 'New appeal', text: 'What it funds.', raised: '$0', goal: '$10,000', percent: 0, donors: '0' } },
    ),
  ),
  component: function DonationsMarigold(props) {
    const edit = editOf(props)
    const rows = items(props.items, donationItems)
    const amounts = lines(props.amounts)
    return (
      <SectionShell props={props} tone="default" className="ud-mg ud-mg-donations">
        <MgHead props={props} align="center" />
        <Grid cols={Math.min(rows.length || 1, 3)} gap={24} className="ud-mg-donations__grid">
          {rows.map((item, index) => (
            <article key={index} className="ud-mg-appeal">
              <Media
                src={item.image}
                alt={str(item.title)}
                ratio="landscape"
                className="ud-mg-appeal__img"
                lightbox={bool(props.lightbox, false)}
                edit={edit}
                path={['items', index, 'image']}
              />
              <div className="ud-mg-appeal__body">
                <EditableText
                  edit={edit}
                  path={['items', index, 'title']}
                  value={str(item.title, 'Appeal')}
                  as="h3"
                  placeholder="Title"
                />
                <SafeText value={item.text} edit={edit} path={['items', index, 'text']} placeholder="What it funds" />
                <div className="ud-mg-appeal__meta">
                  <span>
                    <EditableText edit={edit} path={['items', index, 'donors']} value={str(item.donors)} placeholder="70" /> donors
                  </span>
                  <span>{Math.min(Math.max(num(item.percent, 0), 0), 100)}%</span>
                </div>
                <span className="ud-mg-bar" aria-hidden>
                  <i style={{ width: `${Math.min(Math.max(num(item.percent, 0), 0), 100)}%` }} />
                </span>
                <div className="ud-mg-appeal__figures">
                  <span>
                    Raised{' '}
                    <EditableText edit={edit} path={['items', index, 'raised']} value={str(item.raised)} as="strong" placeholder="$40,000" />
                  </span>
                  <span>
                    Goal{' '}
                    <EditableText edit={edit} path={['items', index, 'goal']} value={str(item.goal)} as="strong" placeholder="$80,000" />
                  </span>
                </div>
                {amounts.length ? (
                  <div className="ud-mg-appeal__amounts">
                    {amounts.map((amount, i) => (
                      <span key={i}>{amount}</span>
                    ))}
                  </div>
                ) : null}
                {str(props.buttonLabel) || edit ? (
                  <a className="ud-mg-btn ud-mg-btn--sm" href={str(props.buttonUrl, '#')}>
                    <EditableText edit={edit} path={['buttonLabel']} value={str(props.buttonLabel)} placeholder="Donate" />
                    <span className="ud-mg-btn__dot" aria-hidden>
                      <Icon name="arrow" size={12} />
                    </span>
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* ---------------------------------------------------- testimonials.marigold */

const quoteItems = [
  {
    quote:
      'I support them because they are transparent and genuinely focused on the children. Knowing exactly how my donation helps gives me real peace of mind.',
    name: 'Sasha Michel',
    role: 'Parent, Chicago',
  },
  {
    quote:
      'Seeing my child excited about learning means everything. The attention and encouragement here have made a lasting difference for our family.',
    name: 'Brooklyn Simmons',
    role: 'Donor, New York',
  },
  {
    quote:
      'My son looks forward to school now. Caring teachers and a safe space have helped him grow academically and emotionally.',
    name: 'Anna Jones',
    role: 'Parent, California',
  },
]

export const testimonialsMarigold = defineBlock({
  type: 'testimonials.marigold',
  version: 1,
  category: 'testimonials',
  label: 'Marigold / Parent voices',
  icon: 'Quote',
  defaultProps: {
    ...base,
    tone: 'surface',
    eyebrow: 'Trusted voices',
    heading: 'Trusted by parents and donors.',
    description: '',
    items: quoteItems,
  },
  schema: schema(
    ...headFields,
    repeater('items', 'Quotes', [textarea('quote', 'Quote'), text('name', 'Name'), text('role', 'Role'), image('avatar', 'Photo')], {
      itemLabel: 'Quote',
      itemDefaults: { quote: 'What they said.', name: 'Name', role: 'Role' },
    }),
  ),
  component: function TestimonialsMarigold(props) {
    const edit = editOf(props)
    const rows = items(props.items, quoteItems)
    const [active, setActive] = useState(0)
    const index = Math.min(active, Math.max(rows.length - 1, 0))
    const current = rows[index] || {}
    return (
      <SectionShell props={props} tone="surface" className="ud-mg ud-mg-quotes">
        <MgHead props={props} align="center" />
        <figure className="ud-mg-quote" key={index}>
          <span className="ud-mg-quote__mark" aria-hidden>
            <Icon name="quote" size={26} filled />
          </span>
          <SafeText
            value={current.quote}
            className="ud-mg-quote__text"
            edit={edit}
            path={['items', index, 'quote']}
            placeholder="What they said"
          />
          <figcaption>
            {str(current.avatar) ? <img src={str(current.avatar)} alt="" loading="lazy" /> : null}
            <span>
              <EditableText edit={edit} path={['items', index, 'name']} value={str(current.name)} as="strong" placeholder="Name" />
              <EditableText edit={edit} path={['items', index, 'role']} value={str(current.role)} as="span" placeholder="Role" />
            </span>
          </figcaption>
        </figure>
        {rows.length > 1 ? (
          <div className="ud-mg-quote__nav">
            <button type="button" aria-label="Previous quote" onClick={() => setActive((index - 1 + rows.length) % rows.length)}>
              ←
            </button>
            <span>
              {index + 1} / {rows.length}
            </span>
            <button type="button" aria-label="Next quote" onClick={() => setActive((index + 1) % rows.length)}>
              →
            </button>
          </div>
        ) : null}
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------- checklist.marigold */

export const checklistMarigold = defineBlock({
  type: 'checklist.marigold',
  version: 1,
  category: 'content',
  label: 'Marigold / Environment checklist',
  icon: 'CheckCircle2',
  defaultProps: {
    ...base,
    eyebrow: 'Environment matters',
    heading: 'A space built around how children actually grow.',
    description: '',
    bullets: 'Hygienic, clean rooms\nSupervised daily activities\nRest and quiet time\nA large outdoor space\nChild-friendly facilities',
    image: photo('1567746455504-cb3213f8f5b8', 1000),
    reverse: false,
    buttonLabel: '',
    buttonUrl: '',
    secondaryLabel: '',
    secondaryUrl: '',
  },
  schema: schema(
    ...headFields,
    textarea('bullets', 'Checklist (one per line)'),
    image('image', 'Photo'),
    toggle('reverse', 'Swap columns', 'layout'),
    ...ctaFields,
    lightboxField,
    ...columnStyleFields(['mediaColumn', 'Photo column'], ['copyColumn', 'Copy column']),
  ),
  component: function ChecklistMarigold(props) {
    const edit = editOf(props)
    const copyCol = useColumnAttrs('copyColumn')
    return (
      <SectionShell props={props} tone="default" className="ud-mg ud-mg-checklist">
        <div className={cx('ud-mg-checklist__grid', bool(props.reverse) && 'ud-mg-checklist__grid--reverse')}>
          <Media
            src={props.image}
            alt=""
            ratio="landscape"
            className="ud-mg-checklist__img"
            styleKey="mediaColumn"
            lightbox={bool(props.lightbox, false)}
            edit={edit}
            path={['image']}
          />
          <div {...copyCol}>
            <MgHead props={props} />
            <ul className="ud-mg-checks">
              {lines(props.bullets).map((line, index) => (
                <li key={index}>
                  <span aria-hidden>
                    <Icon name="check" size={13} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <MgCta props={props} />
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* -------------------------------------------------------- products.marigold */

const productItems = [
  { title: 'Wooden dump truck', price: '$18.00', tag: 'Kids toys', image: photo('1599673605141-910b95714438', 700), url: '/shop' },
  { title: 'Counting and sorting set', price: '$15.00', tag: 'Learning', image: photo('1774464593838-85b320eb7453', 700), url: '/shop' },
  { title: 'First tricycle', price: '$25.00', tag: 'Outdoor', image: photo('1674830608058-5e8fe5e54da7', 700), url: '/shop' },
]

export const productsMarigold = defineBlock({
  type: 'products.marigold',
  version: 1,
  category: 'gallery',
  label: 'Marigold / Product cards',
  icon: 'Gift',
  defaultProps: {
    ...base,
    eyebrow: 'Products',
    heading: 'Support education through shopping.',
    description: '',
    buttonLabel: 'Explore all products',
    buttonUrl: '/shop',
    items: productItems,
  },
  schema: schema(
    ...headFields,
    text('buttonLabel', 'Button label', { styleTarget: 'button' }),
    link('buttonUrl', 'Button link'),
    lightboxField,
    repeater('items', 'Products', [text('title', 'Name'), text('price', 'Price'), text('tag', 'Category'), image('image', 'Photo'), link('url', 'Link')], {
      itemLabel: 'Product',
      itemDefaults: { title: 'New product', price: '$0.00', tag: 'Category' },
    }),
  ),
  component: function ProductsMarigold(props) {
    const edit = editOf(props)
    const rows = items(props.items, productItems)
    return (
      <SectionShell props={props} tone="default" className="ud-mg ud-mg-products">
        <div className="ud-mg-products__top">
          <MgHead props={props} />
          {str(props.buttonLabel) || edit ? (
            <a className="ud-mg-btn ud-mg-btn--ghost" href={str(props.buttonUrl, '#')}>
              <EditableText edit={edit} path={['buttonLabel']} value={str(props.buttonLabel)} placeholder="Explore" />
            </a>
          ) : null}
        </div>
        <Grid cols={Math.min(rows.length || 1, 3)} gap={24} className="ud-mg-products__grid">
          {rows.map((item, index) => {
            const url = str(item.url)
            const inner = (
              <>
                <Media
                  src={item.image}
                  alt={str(item.title)}
                  ratio="square"
                  className="ud-mg-product__img"
                  lightbox={bool(props.lightbox, false) && !url}
                  edit={edit}
                  path={['items', index, 'image']}
                />
                <span className="ud-mg-product__tag">
                  <EditableText edit={edit} path={['items', index, 'tag']} value={str(item.tag)} placeholder="Category" />
                </span>
                <EditableText
                  edit={edit}
                  path={['items', index, 'title']}
                  value={str(item.title, 'Product')}
                  as="h3"
                  placeholder="Name"
                />
                <p className="ud-mg-product__price">
                  <EditableText edit={edit} path={['items', index, 'price']} value={str(item.price)} placeholder="$0.00" />
                </p>
              </>
            )
            return url ? (
              <a key={index} className="ud-mg-product" href={url}>
                {inner}
              </a>
            ) : (
              <div key={index} className="ud-mg-product">
                {inner}
              </div>
            )
          })}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------ team.marigold */

const teamItems = [
  { name: 'David Elson', role: 'Founder & program director', image: photo('1573496527892-904f897eb744', 600) },
  { name: 'Patricia Sanders', role: 'Executive director', image: photo('1573496799515-eebbb63814f2', 600) },
  { name: 'Judith Rodriguez', role: 'Child development specialist', image: photo('1650728287460-37c20c1c6a30', 600) },
  { name: 'Iva Ryan', role: 'Lead educator', image: photo('1544717305-2782549b5136', 600) },
]

export const teamMarigold = defineBlock({
  type: 'team.marigold',
  version: 1,
  category: 'team',
  label: 'Marigold / Educator grid',
  icon: 'Users',
  defaultProps: {
    ...base,
    eyebrow: 'Team members',
    heading: 'The people who care for them every day.',
    description: '',
    buttonLabel: 'Meet the team',
    buttonUrl: '/about',
    columns: 4,
    items: teamItems,
  },
  schema: schema(
    ...headFields,
    text('buttonLabel', 'Button label', { styleTarget: 'button' }),
    link('buttonUrl', 'Button link'),
    select('columns', 'Columns', [['3', 'Three'], ['4', 'Four']], 'layout'),
    repeater('items', 'People', [text('name', 'Name'), text('role', 'Role'), image('image', 'Photo')], {
      itemLabel: 'Person',
      itemDefaults: { name: 'New person', role: 'Role' },
    }),
  ),
  component: function TeamMarigold(props) {
    const edit = editOf(props)
    const rows = items(props.items, teamItems)
    return (
      <SectionShell props={props} tone="default" className="ud-mg ud-mg-team">
        <div className="ud-mg-products__top">
          <MgHead props={props} />
          {str(props.buttonLabel) || edit ? (
            <a className="ud-mg-btn ud-mg-btn--ghost" href={str(props.buttonUrl, '#')}>
              <EditableText edit={edit} path={['buttonLabel']} value={str(props.buttonLabel)} placeholder="Meet the team" />
            </a>
          ) : null}
        </div>
        <Grid cols={num(props.columns, 4)} gap={22} className="ud-mg-team__grid">
          {rows.map((item, index) => (
            <article key={index} className="ud-mg-member">
              <Media
                src={item.image}
                alt={str(item.name)}
                ratio="square"
                className="ud-mg-member__img"
                edit={edit}
                path={['items', index, 'image']}
              />
              <EditableText
                edit={edit}
                path={['items', index, 'name']}
                value={str(item.name, 'Name')}
                as="h3"
                placeholder="Name"
              />
              <EditableText
                edit={edit}
                path={['items', index, 'role']}
                value={str(item.role)}
                as="p"
                className="ud-mg-member__role"
                placeholder="Role"
              />
            </article>
          ))}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------- faq.marigold */

const faqItems = [
  { question: 'What age groups do you welcome?', answer: 'We take children from six months to six years, grouped so each room suits the stage they are at.' },
  { question: 'What does a typical day look like?', answer: 'A rhythm of free play, a guided activity, outdoor time, a shared meal and a quiet rest period.' },
  { question: 'How do you help a child settle in?', answer: 'A staged introduction over the first fortnight, with a key educator assigned to your child throughout.' },
  { question: 'What meals are provided?', answer: 'Two cooked meals and two snacks daily, prepared on site, with allergies handled individually.' },
]

export const faqMarigold = defineBlock({
  type: 'faq.marigold',
  version: 1,
  category: 'faq',
  label: 'Marigold / Help centre',
  icon: 'HelpCircle',
  defaultProps: {
    ...base,
    eyebrow: 'Help centre',
    heading: 'Questions? We are happy to answer.',
    description: '',
    items: faqItems,
  },
  schema: schema(
    ...headFields,
    repeater('items', 'Questions', [text('question', 'Question'), textarea('answer', 'Answer')], {
      itemLabel: 'Question',
      itemDefaults: { question: 'A new question?', answer: 'The answer.' },
    }),
  ),
  component: function FaqMarigold(props) {
    const edit = editOf(props)
    const rows = items(props.items, faqItems)
    const [open, setOpen] = useState(0)
    return (
      <SectionShell props={props} tone="default" className="ud-mg ud-mg-faq">
        <MgHead props={props} align="center" />
        <div className="ud-mg-faq__list">
          {rows.map((item, index) => (
            <div key={index} className={cx('ud-mg-faq__item', index === open && 'is-open')}>
              <button type="button" aria-expanded={index === open} onClick={() => setOpen(index === open ? -1 : index)}>
                <span>{str(item.question, 'Question')}</span>
                <i aria-hidden>{index === open ? '−' : '+'}</i>
              </button>
              {index === open ? (
                <SafeText
                  value={item.answer}
                  className="ud-mg-faq__answer"
                  edit={edit}
                  path={['items', index, 'answer']}
                  placeholder="The answer"
                />
              ) : null}
            </div>
          ))}
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------ blog.marigold */

const blogItems = [
  { title: 'How you can support a classroom this term', category: 'Education', date: 'March 12, 2026', image: photo('1601339434203-130259102db6', 800), url: '' },
  { title: 'What a settled first week actually looks like', category: 'Early years', date: 'March 4, 2026', image: photo('1567746512136-f005499a7575', 800), url: '' },
  { title: 'Where your donation went last quarter', category: 'Impact', date: 'February 20, 2026', image: photo('1786667395451-3f0cbf620a90', 800), url: '' },
]

export const blogMarigold = defineBlock({
  type: 'blog.marigold',
  version: 1,
  category: 'blog',
  label: 'Marigold / Story cards',
  icon: 'BookOpen',
  defaultProps: {
    ...base,
    tone: 'surface',
    eyebrow: 'Blogs',
    heading: 'Impact stories and updates.',
    description: '',
    buttonLabel: 'Explore all blogs',
    buttonUrl: '/blog',
    items: blogItems,
  },
  schema: schema(
    ...headFields,
    text('buttonLabel', 'Button label', { styleTarget: 'button' }),
    link('buttonUrl', 'Button link'),
    repeater('items', 'Posts', [text('title', 'Title'), text('category', 'Category'), text('date', 'Date'), image('image', 'Photo'), link('url', 'Link')], {
      itemLabel: 'Post',
      itemDefaults: { title: 'New post', category: 'Category', date: 'Date' },
    }),
  ),
  component: function BlogMarigold(props) {
    const edit = editOf(props)
    const rows = items(props.items, blogItems)
    return (
      <SectionShell props={props} tone="surface" className="ud-mg ud-mg-blog">
        <div className="ud-mg-products__top">
          <MgHead props={props} />
          {str(props.buttonLabel) || edit ? (
            <a className="ud-mg-btn ud-mg-btn--ghost" href={str(props.buttonUrl, '#')}>
              <EditableText edit={edit} path={['buttonLabel']} value={str(props.buttonLabel)} placeholder="Explore" />
            </a>
          ) : null}
        </div>
        <Grid cols={Math.min(rows.length || 1, 3)} gap={24} className="ud-mg-blog__grid">
          {rows.map((item, index) => {
            const url = str(item.url)
            const inner = (
              <>
                <Media
                  src={item.image}
                  alt={str(item.title)}
                  ratio="landscape"
                  className="ud-mg-post__img"
                  edit={edit}
                  path={['items', index, 'image']}
                />
                <p className="ud-mg-post__meta">
                  <span className="ud-mg-post__tag">
                    <EditableText edit={edit} path={['items', index, 'category']} value={str(item.category)} placeholder="Category" />
                  </span>
                  <EditableText edit={edit} path={['items', index, 'date']} value={str(item.date)} as="span" placeholder="Date" />
                </p>
                <EditableText
                  edit={edit}
                  path={['items', index, 'title']}
                  value={str(item.title, 'Post')}
                  as="h3"
                  placeholder="Title"
                />
              </>
            )
            return url ? (
              <a key={index} className="ud-mg-post" href={url}>
                {inner}
              </a>
            ) : (
              <div key={index} className="ud-mg-post">
                {inner}
              </div>
            )
          })}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------- cta.marigold */

export const ctaMarigold = defineBlock({
  type: 'cta.marigold',
  version: 1,
  category: 'cta',
  label: 'Marigold / Closing band',
  icon: 'ArrowRight',
  defaultProps: {
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    eyebrow: '',
    heading: 'Every child deserves a place to begin.',
    description: 'Give once, give monthly, or come and see the difference for yourself.',
    buttonLabel: 'Donate now',
    buttonUrl: '/donate',
    secondaryLabel: 'Book a visit',
    secondaryUrl: '/contact',
  },
  schema: schema(...headFields, ...ctaFields),
  component: function CtaMarigold(props) {
    return (
      <SectionShell props={props} tone="dark" className="ud-mg ud-mg-closing" bleed>
        <div className="ud-mg-closing__panel">
          <span className="ud-mg-hero__rings" aria-hidden />
          <MgHead props={props} align="center" />
          <MgCta props={props} />
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ---------------------------------------------------------- footer.marigold */

const footerGroups = [
  { title: 'Explore', links: [{ label: 'About us', url: '/about' }, { label: 'Programs', url: '/programs' }, { label: 'Early years', url: '/early-years' }] },
  { title: 'Support', links: [{ label: 'Donate', url: '/donate' }, { label: 'Shop', url: '/shop' }, { label: 'Contact', url: '/contact' }] },
]

export const footerMarigold = defineBlock({
  type: 'footer.marigold',
  version: 1,
  category: 'footer',
  label: 'Marigold / Warm footer',
  icon: 'Layout',
  defaultProps: {
    paddingTop: 80,
    paddingBottom: 34,
    tone: 'dark',
    brand: 'Marigold',
    description: 'A nonprofit early-learning charity giving every child a place to begin.',
    copyright: '© 2026 Your organisation. All rights reserved.',
    groups: footerGroups,
  },
  schema: schema(
    text('brand', 'Wordmark'),
    ...logoImageFields,
    textarea('description', 'Description'),
    text('copyright', 'Copyright'),
    repeater('groups', 'Link columns', [text('title', 'Column title'), navLinksField('links', 'Links')], {
      itemLabel: 'Column',
      itemDefaults: { title: 'Column', links: [] },
    }),
  ),
  component: function FooterMarigold(props) {
    const edit = editOf(props)
    const groups = items(props.groups, footerGroups)
    return (
      <SectionShell props={props} tone="dark" className="ud-mg ud-mg-footer">
        <div className="ud-mg-footer__top">
          <div className="ud-mg-footer__brand">
            <a className="ud-mg-brand" href="/">
              <BrandLogo props={props} alt={str(props.brand, 'Marigold')}>
                <span className="ud-mg-brand__mark" aria-hidden />
                <EditableText edit={edit} path={['brand']} value={str(props.brand, 'Marigold')} as="span" placeholder="Brand" />
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
                className="ud-mg-footer__col"
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
        <div className="ud-mg-footer__bottom">
          <EditableText edit={edit} path={['copyright']} value={str(props.copyright)} as="span" placeholder="Copyright" />
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

export const marigoldBlocks = [
  navbarMarigold,
  heroMarigold,
  quicklinksMarigold,
  aboutMarigold,
  programsMarigold,
  stepsMarigold,
  donationsMarigold,
  testimonialsMarigold,
  checklistMarigold,
  productsMarigold,
  teamMarigold,
  faqMarigold,
  blogMarigold,
  ctaMarigold,
  footerMarigold,
]
