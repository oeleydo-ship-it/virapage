/**
 * Kirki — a revenue-consulting / agency template.
 *
 * Visual language: an off-white sheet, black headlines set tight at 600 weight
 * in Inter, one lime-yellow accent (#e8f019) carrying every button and the
 * footer's contact band, fully rounded 16-20px cards and photography, and a
 * white "rating" pill (stars + review count) that opens every hero. Proof —
 * a stat, a client name, a star count — sits next to almost every claim.
 *
 * Everything routes through `schema()`, which appends the shared design /
 * typography / background / spacing / animation controls, so every block is
 * editable on the canvas, recolourable, and reusable on any page.
 */
import type { CSSProperties } from 'react'
import { EditableText, editOf } from '../editable'
import { Icon } from '../icons'
import {
  Card,
  CtaGroup,
  Grid,
  Media,
  SafeText,
  SectionShell,
  Stars,
  bool,
  cx,
  items,
  num,
  str,
  type Props,
} from '../primitives'
import {
  columnsField,
  ctaFields,
  descriptionField,
  eyebrowField,
  gapField,
  headingField,
  icon,
  image,
  link,
  navLinksField,
  number,
  primaryCtaFields,
  repeater,
  schema,
  select,
  stickyField,
  text,
  textarea,
  toggle,
} from '../schema'
import { defineBlock } from '../types'

/* ------------------------------------------------------------------ helpers */

/** White rating pill — stars, a score and a source name — used above most headings. */
function RatingBadge({ props }: { props: Props }) {
  const edit = editOf(props)
  const score = str(props.ratingScore, '4.8')
  const source = str(props.ratingSource, 'Trustpilot')
  const note = str(props.ratingNote, '1000+ businesses already trust us')
  if (!edit && !str(props.ratingScore) && !str(props.ratingSource)) return null
  return (
    <div className="ud-kk-rating">
      <Stars count={5} />
      <span className="ud-kk-rating__text">
        Excellent {score} out of 5 · <strong>{source}</strong>
      </span>
      {note ? <span className="ud-kk-rating__note">{note}</span> : null}
    </div>
  )
}

/** Kicker + heading + description, left or centred. */
function KkHead({ props, align = 'left', as = 'h2' }: { props: Props; align?: 'left' | 'center'; as?: 'h1' | 'h2' }) {
  const edit = editOf(props)
  const eyebrow = str(props.eyebrow)
  const heading = str(props.heading)
  const description = str(props.description)
  if (!edit && !eyebrow && !heading && !description) return null
  return (
    <div className={cx('ud-kk-head', align === 'center' && 'ud-kk-head--center')}>
      {eyebrow || edit ? (
        <p className="ud-kk-kicker">
          <span className="ud-kk-kicker__bar" aria-hidden />
          {str(props.eyebrow)}
        </p>
      ) : null}
      {heading || edit ? (
        <EditableText edit={edit} path={['heading']} value={heading} as={as} className="ud-kk-title" placeholder="Headline" />
      ) : null}
      {description || edit ? (
        <SafeText value={description} className="ud-kk-lead" edit={edit} path={['description']} placeholder="Supporting copy" />
      ) : null}
    </div>
  )
}

const statItem = repeater('stats', 'Stats', [text('value', 'Value'), text('label', 'Label')], {
  itemLabel: 'Stat',
  itemDefaults: { value: '300%+', label: 'Average project ROI' },
})

/* ------------------------------------------------------------- navbar.kirki */

export const navbarKirki = defineBlock({
  type: 'navbar.kirki',
  version: 1,
  category: 'navigation',
  label: 'Kirki navbar',
  icon: 'PanelTop',
  defaultProps: {
    logoText: 'Kirki',
    links: [
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about' },
      { label: 'Insights', url: '/insights' },
      { label: 'Case studies', url: '/case-studies' },
    ],
    buttonLabel: 'Get a Proposal',
    buttonUrl: '/contact',
    sticky: true,
  },
  schema: schema(
    text('logoText', 'Logo text'),
    image('logoImage', 'Logo image'),
    navLinksField(),
    ...primaryCtaFields,
    stickyField,
  ),
  component: function NavbarKirki(props) {
    const edit = editOf(props)
    const links = items(props.links, [])
    const logo = str(props.logoImage)
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-nav-wrap" bleed>
        <div className={cx('ud-kk-nav', bool(props.sticky, true) && 'ud-kk-nav--sticky')}>
          <div className="ud-kk-nav__bar">
            <a href="/" className="ud-kk-nav__logo">
              {logo ? <img src={logo} alt={str(props.logoText, 'Logo')} /> : <Icon name="hexagon" size={20} />}
              {str(props.logoText, 'Kirki')}
            </a>
            <nav className="ud-kk-nav__links">
              {links.map((link, index) => (
                <a key={index} href={str(link.url, '#')}>
                  {str(link.label, 'Link')}
                </a>
              ))}
              {!links.length && edit ? <span className="ud-small">Add links in the panel</span> : null}
            </nav>
            <CtaGroup props={props} primaryVariant="accent" className="ud-kk-nav__cta" />
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* --------------------------------------------------------------- hero.kirki */

export const heroKirki = defineBlock({
  type: 'hero.kirki',
  version: 1,
  category: 'hero',
  label: 'Kirki split hero',
  icon: 'Sparkles',
  defaultProps: {
    ratingScore: '4.8',
    ratingSource: 'Trustpilot',
    heading: 'Your Revenue Growth Partner in the AI Era',
    description: 'We turn complex ideas into simple, compelling stories. Stories that connect emotionally, build trust, and move audiences to take action.',
    buttonLabel: 'Get a Proposal',
    buttonUrl: '/contact',
    secondaryLabel: 'Explore services',
    secondaryUrl: '/about',
    image: '',
    logosTitle: 'Trusted by 100+ brands',
    logos: [{ label: 'Logoipsum' }, { label: 'Logoipsum' }, { label: 'Logoipsum' }, { label: 'Logoipsum' }],
  },
  schema: schema(
    text('ratingScore', 'Rating score'),
    text('ratingSource', 'Rating source'),
    headingField,
    descriptionField,
    ...ctaFields,
    image('image', 'Hero image'),
    text('logosTitle', 'Logos title'),
    repeater('logos', 'Logos', [text('label', 'Name'), image('image', 'Logo image')], {
      itemLabel: 'Logo',
      itemDefaults: { label: 'Brand' },
    }),
  ),
  component: function HeroKirki(props) {
    const edit = editOf(props)
    const logos = items(props.logos, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-hero">
        <div className="ud-kk-hero__grid">
          <div className="ud-kk-hero__copy">
            <RatingBadge props={props} />
            <EditableText edit={edit} path={['heading']} value={str(props.heading)} as="h1" className="ud-kk-title ud-kk-title--xl" placeholder="Headline" />
            <SafeText value={str(props.description)} className="ud-kk-lead" edit={edit} path={['description']} placeholder="Supporting copy" />
            <CtaGroup props={props} primaryVariant="accent" secondaryVariant="outline" />
          </div>
          <Media src={props.image} alt={str(props.heading)} ratio="portrait" className="ud-kk-hero__figure" edit={edit} path={['image']} />
        </div>
        {logos.length || edit ? (
          <div className="ud-kk-hero__logos">
            {str(props.logosTitle) ? <span>{str(props.logosTitle)}</span> : null}
            <div className="ud-kk-hero__logo-row">
              {logos.map((logo, index) =>
                str(logo.image) ? (
                  <img key={index} src={str(logo.image)} alt={str(logo.label)} loading="lazy" />
                ) : (
                  <span key={index} className="ud-logo-text">
                    {str(logo.label, 'Brand')}
                  </span>
                ),
              )}
            </div>
          </div>
        ) : null}
      </SectionShell>
    )
  },
  settings: null,
})

/* ----------------------------------------------------------- pagehead.kirki */

export const pageHeadKirki = defineBlock({
  type: 'pagehead.kirki',
  version: 1,
  category: 'hero',
  label: 'Kirki page header',
  icon: 'AlignCenter',
  defaultProps: {
    ratingScore: '4.8',
    ratingSource: 'Trustpilot',
    heading: 'Our Story, Your Success: The Preply Difference',
    description: 'Growing a business today means navigating constant change, complex decisions, and high expectations. We exist to turn them into opportunities for sustainable growth.',
    buttonLabel: 'Get a Proposal',
    buttonUrl: '/contact',
    secondaryLabel: 'Explore services',
    secondaryUrl: '/about',
    showRating: true,
  },
  schema: schema(
    toggle('showRating', 'Show rating badge'),
    text('ratingScore', 'Rating score'),
    text('ratingSource', 'Rating source'),
    headingField,
    descriptionField,
    ...ctaFields,
  ),
  component: function PageHeadKirki(props) {
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-pagehead">
        <div className="ud-kk-pagehead__inner">
          {bool(props.showRating, true) ? <RatingBadge props={props} /> : null}
          <KkHead props={props} align="center" as="h1" />
          <CtaGroup props={props} primaryVariant="accent" secondaryVariant="outline" className="ud-kk-btns--center" />
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* -------------------------------------------------------------- logos.kirki */

export const logosKirki = defineBlock({
  type: 'logos.kirki',
  version: 1,
  category: 'gallery',
  label: 'Kirki logo rail',
  icon: 'Building2',
  defaultProps: {
    heading: 'Trusted by 100+ brands',
    logos: [{ label: 'Logoipsum' }, { label: 'Logoipsum' }, { label: 'Logoipsum' }, { label: 'Logoipsum' }, { label: 'Logoipsum' }],
  },
  schema: schema(
    text('heading', 'Label'),
    repeater('logos', 'Logos', [text('label', 'Name'), image('image', 'Logo image')], {
      itemLabel: 'Logo',
      itemDefaults: { label: 'Brand' },
    }),
  ),
  component: function LogosKirki(props) {
    const logos = items(props.logos, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-logos">
        {str(props.heading) ? <p className="ud-kk-logos__label">{str(props.heading)}</p> : null}
        <div className="ud-kk-logos__row">
          {logos.map((logo, index) =>
            str(logo.image) ? (
              <img key={index} src={str(logo.image)} alt={str(logo.label)} loading="lazy" />
            ) : (
              <span key={index} className="ud-logo-text">
                {str(logo.label, 'Brand')}
              </span>
            ),
          )}
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ----------------------------------------------------------- features.kirki */

const featureItem = repeater('items', 'Features', [text('title', 'Title'), textarea('text', 'Text'), icon('icon', 'Icon')], {
  itemLabel: 'Feature',
  itemDefaults: { title: 'Grown', text: 'We turn complex ideas into simple, compelling stories.', icon: 'trending-up' },
})

export const featuresKirki = defineBlock({
  type: 'features.kirki',
  version: 1,
  category: 'features',
  label: 'Kirki feature row',
  icon: 'LayoutGrid',
  defaultProps: {
    eyebrow: 'Current Services',
    heading: "People don't buy products. They buy Clarity.",
    buttonLabel: 'Get a Proposal',
    buttonUrl: '/contact',
    items: [
      { title: 'Grown', text: 'We turn complex ideas into simple, compelling stories.', icon: 'trending-up' },
      { title: 'Consulting', text: 'We turn complex ideas into simple, compelling stories.', icon: 'compass' },
      { title: 'Excellence', text: 'We turn complex ideas into simple, compelling stories.', icon: 'award' },
    ],
  },
  schema: schema(eyebrowField, headingField, ...primaryCtaFields, featureItem, columnsField(2, 3), gapField),
  component: function FeaturesKirki(props) {
    const list = items(props.items, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-features">
        <div className="ud-kk-features__top">
          <KkHead props={props} />
          <CtaGroup props={props} primaryVariant="accent" />
        </div>
        <Grid cols={num(props.columns, 3)} gap={num(props.gap, 20)} className="ud-kk-features__grid">
          {list.map((item, index) => (
            <Card key={index} className="ud-kk-feature-card">
              <p className="ud-kk-feature-card__label">{str(item.title, 'Feature')}</p>
              <p className="ud-kk-feature-card__text">{str(item.text)}</p>
            </Card>
          ))}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* --------------------------------------------------------------- about.kirki */

export const aboutKirki = defineBlock({
  type: 'about.kirki',
  version: 1,
  category: 'content',
  label: 'Kirki content + checklist',
  icon: 'Image',
  defaultProps: {
    layout: 'image-left',
    eyebrow: 'Brief about',
    heading: 'Driving Exceptional Results for Modern Businesses',
    description: 'We specialize in helping businesses navigate complex challenges and achieve sustainable growth.',
    checklist: ['Strategic solutions for growth', 'Proven methodologies & secure data handling', 'Flexible partnerships on your own terms'],
    buttonLabel: 'Get a Proposal',
    buttonUrl: '/contact',
    image: '',
  },
  schema: schema(
    select('layout', 'Layout', [['image-left', 'Image + checklist'], ['centered', 'Centered statement']], 'layout'),
    eyebrowField,
    headingField,
    descriptionField,
    textarea('checklist', 'Checklist (one per line)'),
    ...primaryCtaFields,
    image('image', 'Image'),
  ),
  component: function AboutKirki(props) {
    const edit = editOf(props)
    const centered = str(props.layout, 'image-left') === 'centered'
    const checks = (Array.isArray(props.checklist) ? props.checklist : str(props.checklist).split(/\r?\n+/))
      .map((line: unknown) => String(line).trim())
      .filter(Boolean)
    if (centered) {
      return (
        <SectionShell props={props} tone="default" className="ud-kk ud-kk-mission">
          <KkHead props={props} align="center" />
          {props.image ? <Media src={props.image} alt={str(props.heading)} ratio="square" className="ud-kk-mission__figure" edit={edit} path={['image']} /> : null}
        </SectionShell>
      )
    }
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-about">
        <div className="ud-kk-about__grid">
          <Media src={props.image} alt={str(props.heading)} ratio="portrait" className="ud-kk-about__figure" edit={edit} path={['image']} />
          <div className="ud-kk-about__copy">
            <KkHead props={props} />
            {checks.length ? (
              <ul className="ud-kk-checklist">
                {checks.map((line, index) => (
                  <li key={index}>
                    <Icon name="check" size={16} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <CtaGroup props={props} primaryVariant="accent" />
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ---------------------------------------------------------- industries.kirki */

const industryItem = repeater('items', 'Industries', [text('label', 'Label'), image('image', 'Image'), text('tint', 'Tint color (hex)')], {
  itemLabel: 'Industry',
  itemDefaults: { label: 'Healthcare', tint: '#7cbf6a' },
})

export const industriesKirki = defineBlock({
  type: 'industries.kirki',
  version: 1,
  category: 'gallery',
  label: 'Kirki industries grid',
  icon: 'Grid2x2',
  defaultProps: {
    eyebrow: 'Sector of Expertise',
    heading: 'Customized Solutions for Various Industries',
    buttonLabel: '',
    buttonUrl: '',
    items: [
      { label: 'Healthcare', tint: '#7cbf6a' },
      { label: 'Finance', tint: '#3a6bd8' },
      { label: 'E-commerce', tint: '#e8b23a' },
      { label: 'Technology', tint: '#2f6f8f' },
    ],
  },
  schema: schema(eyebrowField, headingField, ...primaryCtaFields, industryItem, columnsField(2, 4)),
  component: function IndustriesKirki(props) {
    const edit = editOf(props)
    const list = items(props.items, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-industries">
        <div className="ud-kk-features__top">
          <KkHead props={props} />
          <CtaGroup props={props} primaryVariant="accent" />
        </div>
        <div className="ud-kk-industries__grid" style={{ '--ud-cols': String(num(props.columns, 4)) } as CSSProperties}>
          {list.map((item, index) => (
            <div key={index} className="ud-kk-industry" style={{ '--kk-tint': str(item.tint, '#7cbf6a') } as CSSProperties}>
              {str(item.image) ? <img src={str(item.image)} alt={str(item.label)} loading="lazy" /> : <span className="ud-kk-industry__fallback" aria-hidden />}
              <span className="ud-kk-industry__label">{str(item.label, 'Industry')}</span>
            </div>
          ))}
          {!list.length && edit ? <p className="ud-small">Add industries in the panel</p> : null}
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* -------------------------------------------------------- testimonial.kirki */

const testimonialQuote = repeater(
  'items',
  'Quotes',
  [textarea('text', 'Quote'), text('name', 'Name'), text('role', 'Role'), image('image', 'Photo'), ...statItem.fields!],
  { itemLabel: 'Quote' },
)

export const testimonialKirki = defineBlock({
  type: 'testimonial.kirki',
  version: 1,
  category: 'testimonials',
  label: 'Kirki quote with proof',
  icon: 'Quote',
  defaultProps: {
    eyebrow: 'Real Stories of Expertise',
    heading: 'Genuine Insights from Our Clients',
    items: [
      {
        text: 'We turn complex ideas into simple, compelling stories. Working with this team has been a great experience. They understand requirements quickly.',
        name: 'Ryan Cooper',
        role: 'Clients',
        image: '',
        stats: [
          { value: '300%+', label: 'Average Project ROI' },
          { value: '11,000', label: 'Install of their new mobile app.' },
        ],
      },
    ],
  },
  schema: schema(eyebrowField, headingField, testimonialQuote),
  component: function TestimonialKirki(props) {
    const edit = editOf(props)
    const list = items(props.items, [])
    const quote = list[0] || {}
    const stats = items(quote.stats, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-testimonial">
        <KkHead props={props} align="center" />
        <div className="ud-kk-testimonial__card">
          <Media src={quote.image} alt={str(quote.name)} ratio="portrait" className="ud-kk-testimonial__figure" edit={edit} path={['items', 0, 'image']} />
          <div className="ud-kk-testimonial__body">
            <SafeText value={str(quote.text)} className="ud-kk-testimonial__quote" edit={edit} path={['items', 0, 'text']} placeholder="Client quote" />
            <div className="ud-kk-testimonial__stats">
              {stats.map((stat, index) => (
                <div key={index} className="ud-kk-testimonial__stat">
                  <Icon name="check-circle-2" size={16} />
                  <strong>{str(stat.value)}</strong>
                  <span>{str(stat.label)}</span>
                </div>
              ))}
            </div>
            <a className="ud-btn ud-btn--accent ud-kk-testimonial__link" href="#">
              Read the casestudy <Icon name="arrow-right" size={14} />
            </a>
            <p className="ud-kk-testimonial__byline">Clients: {str(quote.name, 'Client')}</p>
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* --------------------------------------------------------------- stats.kirki */

export const statsKirki = defineBlock({
  type: 'stats.kirki',
  version: 1,
  category: 'features',
  label: 'Kirki image + stat grid',
  icon: 'BarChart3',
  defaultProps: {
    image: '',
    stats: [
      { value: '95%', label: 'Client Satisfaction' },
      { value: '1,200+', label: 'Projects Delivered' },
      { value: '300%+', label: 'Average Project ROI' },
      { value: '50+', label: 'Industries Served' },
    ],
  },
  schema: schema(image('image', 'Image'), statItem),
  component: function StatsKirki(props) {
    const edit = editOf(props)
    const stats = items(props.stats, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-stats">
        <div className="ud-kk-stats__grid">
          <Media src={props.image} alt="" ratio="portrait" className="ud-kk-stats__figure" edit={edit} path={['image']} />
          <div className="ud-kk-stats__numbers">
            {stats.map((stat, index) => (
              <div key={index} className="ud-kk-stats__cell">
                <p className="ud-kk-stats__label">{str(stat.label)}</p>
                <p className="ud-kk-stats__value">{str(stat.value)}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* -------------------------------------------------------------- awards.kirki */

const awardItem = repeater('items', 'Awards', [text('title', 'Title'), text('year', 'Year')], {
  itemLabel: 'Award',
  itemDefaults: { title: 'Most Innovative Consultancy Firm', year: '2022' },
})

export const awardsKirki = defineBlock({
  type: 'awards.kirki',
  version: 1,
  category: 'content',
  label: 'Kirki awards timeline',
  icon: 'Trophy',
  defaultProps: {
    eyebrow: 'We achieved',
    heading: 'Celebrating Success',
    image: '',
    items: [
      { title: 'Most Innovative Consultancy Firm', year: '2022' },
      { title: 'Top Client Satisfaction Award', year: '2023' },
      { title: 'Leading Strategic Advisory', year: '2024' },
      { title: 'Excellence in Business Performance', year: '2025' },
    ],
  },
  schema: schema(eyebrowField, headingField, image('image', 'Image'), awardItem),
  component: function AwardsKirki(props) {
    const edit = editOf(props)
    const list = items(props.items, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-awards">
        <KkHead props={props} />
        <div className="ud-kk-awards__grid">
          <Media src={props.image} alt="" ratio="square" className="ud-kk-awards__figure" edit={edit} path={['image']} />
          <ol className="ud-kk-awards__list">
            {list.map((item, index) => (
              <li key={index}>
                <span className="ud-kk-awards__num">{String(index + 1).padStart(2, '0')}</span>
                <span className="ud-kk-awards__title">{str(item.title, 'Award')}</span>
                <span className="ud-kk-awards__year">{str(item.year)}</span>
              </li>
            ))}
          </ol>
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ---------------------------------------------------------------- team.kirki */

const teamMember = repeater('items', 'Team', [text('name', 'Name'), text('role', 'Role'), image('image', 'Photo'), toggle('featured', 'Show "New" tag')], {
  itemLabel: 'Member',
  itemDefaults: { name: 'Jerry Helfer', role: 'Founder & Strategy Lead' },
})

export const teamKirki = defineBlock({
  type: 'team.kirki',
  version: 1,
  category: 'team',
  label: 'Kirki team grid',
  icon: 'Users',
  defaultProps: {
    eyebrow: 'Team Behind the success',
    heading: 'Customized Solutions for Various Industries',
    buttonLabel: 'Get a Proposal',
    buttonUrl: '/contact',
    items: [
      { name: 'Jerry Helfer', role: 'Founder & Strategy Lead' },
      { name: 'Alex Morgan', role: 'Founder & Strategy Lead' },
      { name: 'Jerry Helfer', role: 'Founder & Strategy Lead', featured: true },
    ],
  },
  schema: schema(eyebrowField, headingField, ...primaryCtaFields, teamMember, columnsField(2, 4)),
  component: function TeamKirki(props) {
    const edit = editOf(props)
    const list = items(props.items, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-team">
        <div className="ud-kk-features__top">
          <KkHead props={props} />
          <CtaGroup props={props} primaryVariant="accent" />
        </div>
        <Grid cols={num(props.columns, 3)} gap={20} className="ud-kk-team__grid">
          {list.map((member, index) => (
            <div key={index} className="ud-kk-team__card">
              {bool(member.featured, false) ? <span className="ud-kk-team__tag">New</span> : null}
              <Media src={member.image} alt={str(member.name)} ratio="portrait" className="ud-kk-team__figure" edit={edit} path={['items', index, 'image']} />
              <p className="ud-kk-team__name">{str(member.name, 'Name')}</p>
              <p className="ud-kk-team__role">{str(member.role, 'Role')}</p>
            </div>
          ))}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* --------------------------------------------------------- casestudies.kirki */

const caseStudyItem = repeater(
  'items',
  'Case studies',
  [text('title', 'Title'), text('client', 'Client'), textarea('text', 'Description'), image('image', 'Image'), link('url', 'Case study link'), ...statItem.fields!],
  {
    itemLabel: 'Case study',
    itemDefaults: {
      title: 'We turn complex ideas into simple',
      client: 'Ryan Cooper',
      text: 'We turn complex ideas into simple, compelling stories. Working with this team has been a great experience.',
      stats: [{ value: '300%+', label: 'Average Project ROI' }, { value: '11,000', label: 'Install of their new mobile app.' }],
    },
  },
)

export const caseStudiesKirki = defineBlock({
  type: 'casestudies.kirki',
  version: 1,
  category: 'gallery',
  label: 'Kirki case study rows',
  icon: 'Briefcase',
  defaultProps: {
    items: [
      {
        title: 'We turn complex ideas into simple',
        client: 'Ryan Cooper',
        text: 'We turn complex ideas into simple, compelling stories. Working with this team has been a great experience. They understand requirements quickly.',
        stats: [{ value: '300%+', label: 'Average Project ROI' }, { value: '11,000', label: 'Install of their new mobile app.' }],
      },
      {
        title: 'Turning bold ideas into market-ready products',
        client: 'Ryan Cooper',
        text: 'They refined our early concept into a launch-ready digital product. The process was efficient, collaborative, and goal-focused.',
        stats: [{ value: '275%+', label: 'Average Project ROI' }, { value: '9,500', label: 'Install of their new mobile app.' }],
      },
    ],
  },
  schema: schema(caseStudyItem),
  component: function CaseStudiesKirki(props) {
    const edit = editOf(props)
    const list = items(props.items, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-casestudies" bleed={false}>
        <div className="ud-kk-casestudies__list">
          {list.map((item, index) => {
            const stats = items(item.stats, [])
            return (
              <Card key={index} className="ud-kk-casestudy">
                <Media src={item.image} alt={str(item.title)} ratio="landscape" className="ud-kk-casestudy__figure" edit={edit} path={['items', index, 'image']} />
                <div className="ud-kk-casestudy__body">
                  <SafeText value={str(item.text)} edit={edit} path={['items', index, 'text']} placeholder="Description" />
                  <div className="ud-kk-casestudy__stats">
                    {stats.map((stat, statIndex) => (
                      <div key={statIndex} className="ud-kk-casestudy__stat">
                        <Icon name="check-circle-2" size={14} />
                        <strong>{str(stat.value)}</strong>
                        <span>{str(stat.label)}</span>
                      </div>
                    ))}
                  </div>
                  <a className="ud-btn ud-btn--accent" href={str(item.url, '#')}>
                    Read the casestudy <Icon name="arrow-right" size={14} />
                  </a>
                </div>
                <div className="ud-kk-casestudy__caption">
                  <p className="ud-kk-casestudy__title">{str(item.title, 'Case study')}</p>
                  <p className="ud-kk-casestudy__client">Clients: {str(item.client, 'Client')}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* --------------------------------------------------------------- blog.kirki */

const articleItem = repeater('items', 'Articles', [text('title', 'Title'), text('author', 'Author'), text('date', 'Date'), image('image', 'Image'), link('url', 'Link')], {
  itemLabel: 'Article',
  itemDefaults: { title: 'Staging Secrets for a Fast and Lucrative Home Sale', author: 'Emily' },
})

export const blogKirki = defineBlock({
  type: 'blog.kirki',
  version: 1,
  category: 'blog',
  label: 'Kirki insights grid',
  icon: 'Newspaper',
  defaultProps: {
    eyebrow: 'Trusted by Insights',
    heading: 'Innovative Ideas to Propel Your Business',
    showFeatured: true,
    items: [
      { title: 'Staging Secrets for a Fast and Lucrative Home Sale', author: 'Emily', date: '19 Jan 2027' },
      { title: 'How to Stage Your Home for a Quick Sale', author: 'Emily' },
      { title: 'Tips for Staging Your Home Effectively', author: 'Emily' },
      { title: 'How to Stage Your Home for a Quick and Profitable Sale', author: 'Emily' },
    ],
  },
  schema: schema(eyebrowField, headingField, toggle('showFeatured', 'Show featured banner'), articleItem, columnsField(2, 2)),
  component: function BlogKirki(props) {
    const edit = editOf(props)
    const list = items(props.items, [])
    const featured = list[0]
    const rest = bool(props.showFeatured, true) ? list : list
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-blog">
        <KkHead props={props} align="center" />
        {bool(props.showFeatured, true) && featured ? (
          <a className="ud-kk-blog__feature" href={str(featured.url, '#')}>
            <Media src={featured.image} alt={str(featured.title)} ratio="wide" className="ud-kk-blog__feature-figure" edit={edit} path={['items', 0, 'image']} />
            <div className="ud-kk-blog__feature-copy">
              <p className="ud-kk-blog__meta">
                {str(featured.author, 'Author')} · {str(featured.date, 'Recent')}
              </p>
              <p className="ud-kk-blog__feature-title">{str(featured.title, 'Article title')}</p>
              <span className="ud-btn ud-btn--light">
                Read this article <Icon name="arrow-right" size={14} />
              </span>
            </div>
          </a>
        ) : null}
        <div className="ud-kk-blog__grid" style={{ '--ud-cols': String(num(props.columns, 2)) } as CSSProperties}>
          {rest.map((item, index) => (
            <a key={index} href={str(item.url, '#')} className="ud-kk-blog__card">
              <Media src={item.image} alt={str(item.title)} ratio="landscape" className="ud-kk-blog__card-figure" edit={edit} path={['items', index, 'image']} />
              <p className="ud-kk-blog__meta">By {str(item.author, 'Author')}</p>
              <p className="ud-kk-blog__card-title">{str(item.title, 'Article title')}</p>
              <span className="ud-kk-blog__card-link">
                Read more <Icon name="arrow-right" size={12} />
              </span>
            </a>
          ))}
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------- reviews.kirki */

const reviewItem = repeater(
  'items',
  'Reviews',
  [text('source', 'Source (e.g. Google)'), number('rating', 'Rating', 'content', { min: 0, max: 5 }), textarea('text', 'Quote'), text('name', 'Name'), text('role', 'Role')],
  {
    itemLabel: 'Review',
    itemDefaults: { source: 'Google', rating: 5, text: 'They helped clarify our vision and turn it into results.', name: 'Judith Rodriguez', role: 'Executive Officer' },
  },
)

export const reviewsKirki = defineBlock({
  type: 'reviews.kirki',
  version: 1,
  category: 'testimonials',
  label: 'Kirki review cards',
  icon: 'MessageSquareQuote',
  defaultProps: {
    eyebrow: 'Trusted by Clients',
    heading: 'Real Feedback From Our Clients',
    items: [
      { source: 'Google', rating: 5, text: 'We helped clarify our vision and turn it into results. Collaborative, thoughtful and easy to work with.', name: 'Judith Rodriguez', role: 'Executive Officer' },
      { source: 'Trustpilot', rating: 5, text: 'Their insight identified opportunities we had not seen. Communication was clear, timely and professional throughout.', name: 'Ivo Ryan', role: 'CFO Mid Level Corp' },
      { source: 'Clutch', rating: 5, text: 'They brought clarity to what previously felt uncertain. The process was disciplined, collaborative and on time.', name: 'John Dukes', role: 'Executive Officer' },
    ],
  },
  schema: schema(eyebrowField, headingField, reviewItem, columnsField(2, 3)),
  component: function ReviewsKirki(props) {
    const list = items(props.items, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-reviews">
        <KkHead props={props} align="center" />
        <Grid cols={num(props.columns, 3)} gap={20} className="ud-kk-reviews__grid">
          {list.map((review, index) => (
            <Card key={index} className="ud-kk-review">
              <div className="ud-kk-review__top">
                <Stars count={num(review.rating, 5)} />
                <span className="ud-kk-review__source">{str(review.source, 'Google')}</span>
              </div>
              <p className="ud-kk-review__text">{str(review.text)}</p>
              <p className="ud-kk-review__name">{str(review.name, 'Client')}</p>
              <p className="ud-kk-review__role">{str(review.role)}</p>
            </Card>
          ))}
        </Grid>
      </SectionShell>
    )
  },
  settings: null,
})

/* ---------------------------------------------------------------- cta.kirki */

export const ctaKirki = defineBlock({
  type: 'cta.kirki',
  version: 1,
  category: 'cta',
  label: 'Kirki closing banner',
  icon: 'Megaphone',
  defaultProps: {
    heading: 'Ready to simplify your business finances?',
    description: 'We turn complex ideas into simple, compelling stories. Stories that connect emotionally, build trust, and move audiences to take action.',
    buttonLabel: 'Contact now',
    buttonUrl: '/contact',
    image: '',
  },
  schema: schema(headingField, descriptionField, ...primaryCtaFields, image('image', 'Image')),
  component: function CtaKirki(props) {
    const edit = editOf(props)
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-cta">
        <div className="ud-kk-cta__grid">
          <div className="ud-kk-cta__panel">
            <EditableText edit={edit} path={['heading']} value={str(props.heading)} as="h2" className="ud-kk-title" placeholder="Headline" />
            <SafeText value={str(props.description)} className="ud-kk-lead ud-kk-lead--dark" edit={edit} path={['description']} placeholder="Supporting copy" />
            <CtaGroup props={props} primaryVariant="accent" />
          </div>
          <Media src={props.image} alt="" ratio="landscape" className="ud-kk-cta__figure" edit={edit} path={['image']} />
        </div>
      </SectionShell>
    )
  },
  settings: null,
})

/* ------------------------------------------------------------- footer.kirki */

export const footerKirki = defineBlock({
  type: 'footer.kirki',
  version: 1,
  category: 'footer',
  label: 'Kirki footer',
  icon: 'PanelBottom',
  defaultProps: {
    logoText: 'Kirki',
    columns: [
      { title: 'Services', links: [{ label: 'Biz strategy & growth', url: '#' }, { label: 'Financial Consulting', url: '#' }, { label: 'Operational Excellence', url: '#' }] },
      { title: 'Pages', links: [{ label: 'Home', url: '/' }, { label: 'About', url: '/about' }, { label: 'Contact', url: '/contact' }, { label: 'Blogs', url: '/insights' }] },
      { title: 'Pages', links: [{ label: 'FAQs', url: '#' }] },
    ],
    phone: '1222-5453-5432',
    email: 'contact@example.com',
    offices: [
      { city: 'Vancouver', address: '750 W Pender St, Suite 1750, Vancouver, British Columbia V6C 1G8' },
      { city: 'London', address: '750 W Pender St, Suite 1750, Vancouver, British Columbia V6C 1G8' },
    ],
    socials: [{ label: 'Facebook', url: '#' }, { label: 'Instagram', url: '#' }, { label: 'X.com', url: '#' }, { label: 'Linkedin', url: '#' }],
    copyright: '© 2026 Kirki Business. All Rights Reserved.',
  },
  schema: schema(
    text('logoText', 'Logo text'),
    repeater('columns', 'Link columns', [text('title', 'Title'), repeater('links', 'Links', [text('label', 'Label'), link('url', 'URL')], { itemLabel: 'Link' })], {
      itemLabel: 'Column',
    }),
    text('phone', 'Phone'),
    text('email', 'Email'),
    repeater('offices', 'Offices', [text('city', 'City'), textarea('address', 'Address')], { itemLabel: 'Office' }),
    repeater('socials', 'Social links', [text('label', 'Label'), link('url', 'URL')], { itemLabel: 'Social' }),
    text('copyright', 'Copyright line'),
  ),
  component: function FooterKirki(props) {
    const columns = items(props.columns, [])
    const offices = items(props.offices, [])
    const socials = items(props.socials, [])
    return (
      <SectionShell props={props} tone="default" className="ud-kk ud-kk-footer" bleed>
        <div className="ud-container">
          <div className="ud-kk-footer__top">
            <a href="/" className="ud-kk-nav__logo">
              <Icon name="hexagon" size={20} />
              {str(props.logoText, 'Kirki')}
            </a>
            <div className="ud-kk-footer__newsletter">
              <span>Email</span>
              <div className="ud-kk-footer__subscribe">
                <input type="email" placeholder="example@gmail.com" disabled />
                <span className="ud-btn ud-btn--accent">Subscribe</span>
              </div>
            </div>
            <div className="ud-kk-footer__columns">
              {columns.map((col, index) => (
                <div key={index}>
                  <p className="ud-kk-footer__col-title">{str(col.title, 'Links')}</p>
                  <ul>
                    {items(col.links, []).map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href={str(link.url, '#')}>{str(link.label, 'Link')}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ud-kk-footer__band">
          <div className="ud-container ud-kk-footer__band-inner">
            <div>
              <p className="ud-kk-footer__band-title">Our socials</p>
              <ul className="ud-kk-footer__socials">
                {socials.map((social, index) => (
                  <li key={index}>
                    <a href={str(social.url, '#')}>
                      {str(social.label, 'Social')} <Icon name="arrow-up-right" size={12} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ud-kk-footer__contact">
              <span>{str(props.phone)}</span>
              <span>{str(props.email)}</span>
            </div>
            {offices.map((office, index) => (
              <div key={index}>
                <p className="ud-kk-footer__band-title">{str(office.city, 'Office')}</p>
                <p>{str(office.address)}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="ud-kk-footer__copyright">{str(props.copyright)}</p>
      </SectionShell>
    )
  },
  settings: null,
})
