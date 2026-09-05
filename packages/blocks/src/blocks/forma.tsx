import { EditableText, editOf } from '../editable'
import { CtaGroup, Media, SafeText, SectionShell, bool, cx, items, str, type Props } from '../primitives'
import { ctaFields, headFields, image, link, navLinksField, primaryCtaFields, repeater, schema, select, stickyField, text, textarea, toggle } from '../schema'
import { defineBlock } from '../types'

function Heading({ props, hero = false }: { props: Props; hero?: boolean }) {
  const edit = editOf(props)
  return <div className="ud-forma-head">
    <EditableText edit={edit} path={['eyebrow']} value={str(props.eyebrow)} as="p" className="ud-forma-kicker" />
    <EditableText edit={edit} path={['heading']} value={str(props.heading)} as={hero ? 'h1' : 'h2'} className={hero ? 'ud-h1' : 'ud-h2'} />
    <SafeText value={props.description} edit={edit} path={['description']} className="ud-forma-description" />
  </div>
}

const base = { paddingTop: 88, paddingBottom: 88 }
export const formaBlocks = [
  defineBlock({
    type: 'hero.forma', version: 1, category: 'hero', label: 'Forma / Editorial hero', icon: 'Layout',
    defaultProps: { ...base, eyebrow: 'Independent design studio · Est. 2024', heading: 'Good things take shape.', description: 'We turn ambitious ideas into brands and digital experiences with clarity, character, and a little unexpected delight.', buttonLabel: 'Explore our work', buttonUrl: '/work', secondaryLabel: 'Meet the studio', secondaryUrl: '/about', layout: 'split', showArtwork: true, artworkLabel: 'A different perspective.', image: '', imageAlt: 'Studio project', headingSize: 80 },
    schema: schema(...headFields, ...ctaFields, select('layout', 'Composition', ['split', 'centered', 'reverse']), toggle('showArtwork', 'Show artwork'), image('image', 'Replace artwork with image'), text('imageAlt', 'Image description'), text('artworkLabel', 'Artwork caption')),
    component: (props) => <SectionShell props={props} className={`ud-forma ud-forma-hero ud-forma-hero--${str(props.layout, 'split')}`}>
      <div className="ud-forma-hero-grid"><div><Heading props={props} hero /><CtaGroup props={props} /></div>
        {bool(props.showArtwork, true) && <div className="ud-forma-art">{str(props.image) ? <Media src={str(props.image)} alt={str(props.imageAlt)} edit={editOf(props)} path={['image']} /> : <div className="ud-forma-sculpture" aria-hidden="true"><i /><i /><i /></div>}<EditableText edit={editOf(props)} path={['artworkLabel']} value={str(props.artworkLabel)} as="p" className="ud-forma-art-caption" /></div>}
      </div>
    </SectionShell>,
  }),
  defineBlock({
    type: 'services.forma', version: 1, category: 'services', label: 'Forma / Capabilities', icon: 'Grid',
    defaultProps: { ...base, eyebrow: '01 / What we do', heading: 'Small team. Broad perspective.', description: 'From the first sketch to the final detail, we make every part feel connected.', layout: 'cards', showNumbers: true, items: [ { title: 'Brand strategy', description: 'Find your point of view. Positioning, naming, and a story worth telling.' }, { title: 'Visual identity', description: 'A considered identity with the flexibility to grow alongside your business.' }, { title: 'Digital experiences', description: 'Thoughtful websites that feel as good to use as they look.' } ] },
    schema: schema(...headFields, select('layout', 'Service layout', ['cards', 'list']), toggle('showNumbers', 'Show numbering'), repeater('items', 'Services', [text('title', 'Title'), textarea('description', 'Description')])),
    component: (props) => <SectionShell props={props} className="ud-forma"><Heading props={props} /><div className={`ud-forma-services ud-forma-services--${str(props.layout, 'cards')}`}>{items(props.items, []).map((item, i) => <article key={i} className="ud-forma-service">{bool(props.showNumbers, true) && <span className="ud-forma-number">{String(i + 1).padStart(2, '0')}</span>}<EditableText edit={editOf(props)} path={['items', i, 'title']} value={str(item.title)} as="h3" className="ud-h3" /><SafeText value={item.description} edit={editOf(props)} path={['items', i, 'description']} /></article>)}</div></SectionShell>,
  }),
  defineBlock({
    type: 'gallery.forma', version: 1, category: 'gallery', label: 'Forma / Selected work', icon: 'Image',
    defaultProps: { ...base, eyebrow: '02 / Selected work', heading: 'Made with intention.', description: 'A few explorations in identity, storytelling, and digital design.', layout: 'editorial', showTags: true, items: [{ title: 'Objects of everyday', tag: 'Brand identity / Concept', image: '', imageAlt: 'Objects of everyday brand concept' }, { title: 'A quieter kind of living', tag: 'Digital experience / Concept', image: '', imageAlt: 'Living brand concept' }, { title: 'Room for something new', tag: 'Art direction / Concept', image: '', imageAlt: 'Room brand concept' }] },
    schema: schema(...headFields, select('layout', 'Gallery layout', ['editorial', 'grid', 'stacked']), toggle('showTags', 'Show project tags'), repeater('items', 'Projects', [text('title', 'Project title'), text('tag', 'Category'), image('image', 'Project image'), text('imageAlt', 'Image description')])),
    component: (props) => <SectionShell props={props} className="ud-forma"><Heading props={props} /><div className={`ud-forma-work ud-forma-work--${str(props.layout, 'editorial')}`}>{items(props.items, []).map((item, i) => <article key={i}><div className={`ud-forma-project ud-forma-project--${i % 3}`}>{str(item.image) ? <Media src={str(item.image)} alt={str(item.imageAlt)} edit={editOf(props)} path={['items', i, 'image']} /> : <div className="ud-forma-project-art" aria-hidden="true"><span>{['o.', 'a /', 'R'][i % 3]}</span></div>}</div><div className="ud-forma-project-caption"><EditableText edit={editOf(props)} path={['items', i, 'title']} value={str(item.title)} as="h3" className="ud-h3" />{bool(props.showTags, true) && <EditableText edit={editOf(props)} path={['items', i, 'tag']} value={str(item.tag)} as="p" />}</div></article>)}</div></SectionShell>,
  }),
  defineBlock({
    type: 'content.forma', version: 1, category: 'content', label: 'Forma / Process', icon: 'List',
    defaultProps: { ...base, eyebrow: '03 / The process', heading: 'A clear path from idea to launch.', description: 'Open conversations, purposeful decisions, and room to explore.', layout: 'steps', items: [{ title: 'Discover', description: 'We listen, ask questions, and agree on what success looks like.' }, { title: 'Shape', description: 'We explore directions together and refine the strongest idea.' }, { title: 'Make', description: 'We bring the details together, test, and prepare your team for launch.' }] },
    schema: schema(...headFields, select('layout', 'Process layout', ['steps', 'accordion']), repeater('items', 'Steps', [text('title', 'Step title'), textarea('description', 'Explanation')])),
    component: (props) => <SectionShell props={props} className="ud-forma"><div className="ud-forma-process"><Heading props={props} /><div>{items(props.items, []).map((item, i) => str(props.layout) === 'accordion' ? <details key={i} className="ud-forma-step"><summary><EditableText edit={editOf(props)} path={['items', i, 'title']} value={str(item.title)} /></summary><SafeText value={item.description} edit={editOf(props)} path={['items', i, 'description']} /></details> : <article key={i} className="ud-forma-step"><span className="ud-forma-number">{String(i + 1).padStart(2, '0')}</span><EditableText edit={editOf(props)} path={['items', i, 'title']} value={str(item.title)} as="h3" className="ud-h3" /><SafeText value={item.description} edit={editOf(props)} path={['items', i, 'description']} /></article>)}</div></div></SectionShell>,
  }),
  defineBlock({
    type: 'cta.forma', version: 1, category: 'cta', label: 'Forma / Invitation', icon: 'ArrowRight',
    defaultProps: { ...base, eyebrow: 'Have something in mind?', heading: 'Let’s make it meaningful.', description: 'Tell us what you are imagining. We will help you find the next step.', buttonLabel: 'Start a conversation', buttonUrl: '/contact', secondaryLabel: '', secondaryUrl: '', layout: 'centered', tone: 'muted' },
    schema: schema(...headFields, ...ctaFields, select('layout', 'Invitation layout', ['centered', 'split'])),
    component: (props) => <SectionShell props={props} className={`ud-forma ud-forma-cta ud-forma-cta--${str(props.layout, 'centered')}`}><div className="ud-forma-invitation"><Heading props={props} /><CtaGroup props={props} /></div></SectionShell>,
  }),
  defineBlock({
    type: 'navbar.forma', version: 1, category: 'navigation', label: 'Forma / Wordmark navbar', icon: 'PanelTop',
    defaultProps: { paddingTop: 0, paddingBottom: 0, logoText: 'forma.', logoImage: '', links: [{ label: 'Work', url: '/work' }, { label: 'Services', url: '/services' }, { label: 'Studio', url: '/about' }], buttonLabel: 'Let’s talk', buttonUrl: '/contact', sticky: true },
    schema: schema(text('logoText', 'Wordmark'), image('logoImage', 'Logo image'), navLinksField(), ...primaryCtaFields, stickyField),
    // The sticky class is paired with ud-forma-nav so the rule carries two
    // classes: a single-class rule elsewhere would otherwise outrank it.
    component: (props) => <SectionShell props={props} className="ud-forma ud-forma-nav-wrap" bleed>
      <div className={cx('ud-forma-nav', bool(props.sticky, true) && 'ud-forma-nav--sticky')}>
        <a href="/" className="ud-forma-nav__logo">{str(props.logoImage) ? <Media src={str(props.logoImage)} alt={str(props.logoText, 'Logo')} edit={editOf(props)} path={['logoImage']} /> : <EditableText edit={editOf(props)} path={['logoText']} value={str(props.logoText, 'forma.')} as="span" />}</a>
        <nav className="ud-forma-nav__links">{items(props.links, []).map((item, i) => <a key={i} href={str(item.url, '#')}>{str(item.label, 'Link')}</a>)}</nav>
        <CtaGroup props={props} className="ud-forma-nav__cta" />
      </div>
    </SectionShell>,
  }),
  defineBlock({
    type: 'footer.forma', version: 1, category: 'footer', label: 'Forma / Studio footer', icon: 'PanelBottom',
    defaultProps: { paddingTop: 72, paddingBottom: 40, brand: 'forma.', tagline: 'Independent minds. Thoughtful design.', columns: [{ title: 'Explore', links: [{ label: 'Work', url: '/work' }, { label: 'Services', url: '/services' }, { label: 'Studio', url: '/about' }] }, { title: 'Say hello', links: [{ label: 'Start a project', url: '/contact' }] }], copyright: '© Forma Studio. All rights reserved.' },
    schema: schema(text('brand', 'Wordmark'), textarea('tagline', 'Tagline'), repeater('columns', 'Link columns', [text('title', 'Title'), repeater('links', 'Links', [text('label', 'Label'), link('url', 'URL')], { itemLabel: 'Link' })], { itemLabel: 'Column' }), text('copyright', 'Copyright line')),
    component: (props) => <SectionShell props={props} className="ud-forma ud-forma-footer" bleed>
      <div className="ud-forma-footer__top">
        <div className="ud-forma-footer__brand">
          <EditableText edit={editOf(props)} path={['brand']} value={str(props.brand, 'forma.')} as="p" className="ud-forma-footer__mark" />
          <SafeText value={props.tagline} edit={editOf(props)} path={['tagline']} className="ud-forma-footer__tagline" />
        </div>
        <div className="ud-forma-footer__columns">{items(props.columns, []).map((col, i) => <div key={i}>
          <EditableText edit={editOf(props)} path={['columns', i, 'title']} value={str(col.title)} as="h3" />
          <ul>{items(col.links, []).map((l, j) => <li key={j}><a href={str(l.url, '#')}>{str(l.label, 'Link')}</a></li>)}</ul>
        </div>)}</div>
      </div>
      <EditableText edit={editOf(props)} path={['copyright']} value={str(props.copyright)} as="p" className="ud-forma-footer__legal" />
    </SectionShell>,
  }),
]
