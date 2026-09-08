/**
 * Lexara family stylesheet.
 *
 * Colour comes from the tone variables SectionShell already sets
 * (`--ud-bg`, `--ud-fg`, `--ud-muted`, `--ud-accent`), so a block styled here
 * reads correctly on a light or a dark band without a second rule, and the
 * whole family recolours when the site theme changes. The `--lx-*` variables
 * below are derived values only - a hairline, a tint - never a second palette.
 */
export const lexaraCss = `
.ud-lx{
  /* Bound to the theme accent rather than the tone's --ud-accent, which
     resolves to the primary on light bands and would flip the family's one
     accent colour from section to section. */
  --lx-accent:var(--color-accent, #ea6a1e);
  --lx-line:color-mix(in srgb, var(--ud-fg, #0b1120) 16%, transparent);
  --lx-hairline:color-mix(in srgb, var(--ud-fg, #0b1120) 9%, transparent);
  --lx-tint:color-mix(in srgb, var(--ud-fg, #0b1120) 4%, transparent);
  --lx-serif:var(--font-heading, "Source Serif 4", Georgia, serif);
}
.ud-lx.ud-section{line-height:1.6}
.ud-lx h1,.ud-lx h2,.ud-lx h3,.ud-lx p,.ud-lx figure,.ud-lx blockquote{margin:0}
.ud-lx a{color:inherit;text-decoration:none}
.ud-lx button{font:inherit;cursor:pointer;color:inherit}
.ud-lx :focus-visible{outline:2px solid var(--lx-accent);outline-offset:3px;border-radius:3px}

/* --------------------------------------------------------------- head + cta */
.ud-lx-head{max-width:780px}
.ud-lx-head--center{margin-inline:auto;text-align:center}
.ud-lx-eyebrow{font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--lx-accent);margin-bottom:18px!important}
.ud-lx-title{font-family:var(--lx-serif);font-size:clamp(32px,4.1vw,54px);font-weight:400;line-height:1.08;letter-spacing:-.02em;text-wrap:balance}
.ud-lx-title__accent{font-style:normal;color:var(--lx-accent)}
.ud-lx-lead{margin-top:22px!important;font-size:17px;color:var(--ud-muted,#6b7280);max-width:640px}
.ud-lx-head--center .ud-lx-lead{margin-inline:auto}
.ud-lx-cta{display:flex;flex-wrap:wrap;align-items:center;gap:14px 26px;margin-top:34px}
.ud-lx-head--center + .ud-lx-cta{justify-content:center}
.ud-lx-btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 26px;border-radius:999px;background:var(--lx-accent);color:#fff!important;font-size:15px;font-weight:600;transition:transform .2s ease,filter .2s ease}
.ud-lx-btn:hover{transform:translateY(-2px);filter:brightness(1.07)}
.ud-lx-btn--sm{padding:10px 18px;font-size:14px}
.ud-lx-link{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:500;border-bottom:1px solid var(--lx-line);padding-bottom:3px;transition:border-color .2s ease}
.ud-lx-link:hover{border-color:var(--lx-accent)}
.ud-lx-curve{position:absolute;right:0;bottom:6%;width:min(46%,560px);height:auto;color:var(--lx-accent);opacity:.55;pointer-events:none}

/* ------------------------------------------------------------------- navbar */
.ud-lx-nav{background:var(--lx-ink,var(--color-secondary,#0b1120));color:#fff;position:relative;z-index:60}
.ud-lx-nav--sticky.ud-lx-nav--sticky{position:sticky;top:0;z-index:70}
.ud-lx-ticker{display:flex;align-items:center;justify-content:center;gap:10px;padding:9px 20px;background:var(--lx-accent);color:#fff;font-size:12.5px;font-weight:600;letter-spacing:.02em}
.ud-lx-ticker span[aria-hidden]{transition:transform .2s ease}
.ud-lx-ticker:hover span[aria-hidden]{transform:translateX(4px)}
.ud-lx-nav__bar{display:flex;align-items:center;justify-content:space-between;gap:28px;padding-block:16px}
.ud-lx-brand{display:inline-flex;align-items:center;gap:10px;font-size:19px;font-weight:600;letter-spacing:-.02em}
.ud-lx-brand__mark{width:18px;height:18px;border-radius:4px;background:var(--lx-accent);box-shadow:6px 0 0 -3px color-mix(in srgb,var(--lx-accent) 45%,transparent)}
.ud-lx-nav__links{display:flex;align-items:center;gap:26px;font-size:14.5px}
.ud-lx-nav__links a{opacity:.82;transition:opacity .18s ease}
.ud-lx-nav__links a:hover{opacity:1}
.ud-lx-nav__end{display:flex;align-items:center;gap:16px}
.ud-lx-nav__ghost{font-size:14.5px;opacity:.82}
.ud-lx-nav__ghost:hover{opacity:1}
.ud-lx-nav__toggle{display:none;background:none;border:0;padding:4px}

/* --------------------------------------------------------------------- hero */
.ud-lx-hero{position:relative;overflow:hidden}
.ud-lx-hero__copy{position:relative;z-index:1}
.ud-lx-hero--display .ud-lx-head{max-width:940px;margin-inline:auto;text-align:center}
.ud-lx-hero--display .ud-lx-title{font-size:clamp(40px,6.4vw,84px);line-height:1.02;letter-spacing:-.03em}
.ud-lx-hero--display .ud-lx-lead{font-size:18.5px;max-width:620px;margin-inline:auto}
.ud-lx-hero--page .ud-lx-title{font-size:clamp(34px,4.6vw,60px)}
.ud-lx-hero__glow{position:absolute;left:50%;top:-32%;width:min(1100px,120%);aspect-ratio:2/1;transform:translateX(-50%);background:radial-gradient(ellipse at center,color-mix(in srgb,var(--lx-accent) 26%,transparent),transparent 62%);opacity:.5;pointer-events:none}

/* -------------------------------------------------------------------- stats */
.ud-lx-stats .ud-container{padding-block:0}
.ud-lx-stats__row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid color-mix(in srgb,#fff 16%,transparent)}
.ud-lx-stat{padding:46px 30px;border-left:1px solid color-mix(in srgb,#fff 16%,transparent)}
.ud-lx-stat:first-child{border-left:0;padding-left:0}
.ud-lx-stat:last-child{padding-right:0}
/* The + is a modifier on the figure, not a character of equal weight: half
   the size and set against the cap height, so "80%" stays the thing you read. */
.ud-lx-stat__value{font-family:var(--lx-serif);font-size:clamp(38px,3.9vw,56px);line-height:1;letter-spacing:-.032em;display:flex;align-items:flex-start;gap:3px}
.ud-lx-stat__value span[aria-hidden]{font-size:.46em;line-height:1.25;color:var(--lx-accent);letter-spacing:0}
.ud-lx-stat__label{margin-top:14px!important;font-size:13.5px;color:var(--ud-muted,rgba(255,255,255,.72));white-space:pre-line}

/* -------------------------------------------------------------------- logos */
/* Scoped under .ud-lx so it outranks the \`.ud-lx p{margin:0}\` reset above,
   which would otherwise win on specificity and strand the caption left. */
.ud-lx .ud-lx-logos__caption{font-size:13px;letter-spacing:.05em;color:var(--ud-muted,#6b7280);max-width:560px;margin-inline:auto;text-align:center}
.ud-lx-logos__row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:26px 54px;margin-top:34px}
.ud-lx-logo{font-family:var(--lx-serif);font-size:21px;letter-spacing:-.01em;opacity:.55;transition:opacity .2s ease}
.ud-lx-logo:hover{opacity:.9}
.ud-lx-logo img{max-height:30px;max-width:132px;object-fit:contain}

/* ----------------------------------------------------------------- showcase */
.ud-lx-tabs{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:38px auto 0;max-width:640px}
.ud-lx-tab{display:inline-flex;align-items:center;gap:9px;padding:11px 20px;border-radius:999px;border:1px solid var(--lx-line);background:transparent;font-size:14.5px;font-weight:500;transition:background .2s ease,border-color .2s ease,color .2s ease}
.ud-lx-tab:hover{border-color:var(--lx-accent)}
.ud-lx-tab.is-active{background:var(--lx-accent);border-color:var(--lx-accent);color:#fff}
.ud-lx-panel{display:grid;grid-template-columns:.85fr 1.15fr;gap:46px;align-items:center;margin-top:46px;animation:ud-lx-in .45s ease}
.ud-lx-panel__title{font-family:var(--lx-serif);font-size:clamp(24px,2.4vw,32px);font-weight:400;letter-spacing:-.02em;line-height:1.16}
.ud-lx .ud-lx-panel__text{margin-top:16px;font-size:16px;color:var(--ud-muted,#6b7280)}
.ud-lx-mock{background:var(--ud-card,#fff);border:1px solid var(--lx-hairline);border-radius:14px;padding:18px;box-shadow:0 30px 60px -40px rgb(0 0 0 / .45)}
.ud-lx-mock__bar{display:flex;gap:6px;padding-bottom:14px;border-bottom:1px solid var(--lx-hairline)}
.ud-lx-mock__bar span{width:9px;height:9px;border-radius:50%;background:var(--lx-line)}
.ud-lx-mock__row{display:grid;grid-template-columns:58px 1fr auto;align-items:center;gap:6px 14px;padding:15px 4px;border-bottom:1px solid var(--lx-hairline)}
.ud-lx-mock__row:last-child{border-bottom:0}
.ud-lx-mock__step{grid-row:span 2;font-size:10.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ud-muted,#6b7280)}
.ud-lx-mock__role{font-size:15px;font-weight:600}
.ud-lx-mock__note{grid-column:2;font-size:13px;color:var(--ud-muted,#6b7280)}
.ud-lx-chip{grid-row:span 2;justify-self:end;padding:5px 12px;border-radius:999px;font-size:11.5px;font-weight:600;background:var(--lx-tint);color:var(--ud-fg,#0b1120)}
.ud-lx-chip--warn{background:color-mix(in srgb,var(--lx-accent) 16%,transparent);color:var(--lx-accent)}

/* ----------------------------------------------------------------- features */
.ud-lx-features__grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start;margin-top:52px}
.ud-lx-acc{border-top:1px solid color-mix(in srgb,#fff 18%,transparent)}
.ud-lx-acc:last-child{border-bottom:1px solid color-mix(in srgb,#fff 18%,transparent)}
.ud-lx-acc button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0;background:none;border:0;text-align:left;font-family:var(--lx-serif);font-size:21px;letter-spacing:-.015em}
.ud-lx-acc__body{padding-bottom:26px;max-width:460px}
.ud-lx-acc__body p{font-size:15px;color:var(--ud-muted,rgba(255,255,255,.72))}
.ud-lx-acc__body .ud-lx-btn{margin-top:20px}
.ud-lx-doc{background:#fff;color:#0b1120;border-radius:14px;padding:26px;box-shadow:0 40px 70px -45px rgb(0 0 0 / .8)}
.ud-lx-doc__title{font-family:var(--lx-serif);font-size:19px}
.ud-lx-doc__sub{font-size:12.5px;color:#6b7280;margin-top:4px!important}
.ud-lx-doc__lines{display:grid;gap:9px;margin-top:18px}
.ud-lx-doc__lines i{display:block;height:8px;border-radius:99px;background:#eceaf0}
.ud-lx-doc__flag{margin-top:18px;padding:16px;border-radius:10px;border-left:3px solid var(--lx-accent);background:color-mix(in srgb,#ea6a1e 7%,#fff)}
.ud-lx-doc__flag .ud-lx-doc__lines{margin-top:12px}

/* -------------------------------------------------------------------- intro */
.ud-lx-intro{position:relative;overflow:hidden}
.ud-lx-intro__copy{position:relative;z-index:1;max-width:620px}

/* ------------------------------------------------------------------ pillars */
.ud-lx-pillars__grid{margin-top:52px;border-top:1px solid var(--lx-line)}
.ud-lx-pillar{padding:34px 32px 30px 0;border-left:1px solid var(--lx-line);padding-left:32px}
.ud-lx-pillar:first-child{border-left:0;padding-left:0}
.ud-lx-pillar__num{font-family:var(--lx-serif);font-size:15px;color:var(--lx-accent)}
.ud-lx-pillar h3{font-family:var(--lx-serif);font-size:23px;font-weight:400;letter-spacing:-.015em;margin-top:16px}
.ud-lx-pillar p{margin-top:12px;font-size:15px;color:var(--ud-muted,#6b7280)}

/* -------------------------------------------------------------------- cards */
.ud-lx-cards__grid{margin-top:48px}
.ud-lx-card{display:flex;flex-direction:column;align-items:flex-start;position:relative;padding:28px;border:1px solid var(--lx-line);border-radius:14px;background:var(--ud-bg,#fff);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}
a.ud-lx-card:hover{transform:translateY(-4px);border-color:var(--lx-accent);box-shadow:0 26px 44px -34px rgb(0 0 0 / .4)}
.ud-lx-card h3{font-family:var(--lx-serif);font-size:21px;font-weight:400;letter-spacing:-.015em}
.ud-lx-card p{margin-top:11px;font-size:14.5px;color:var(--ud-muted,#6b7280)}
.ud-lx-card__icon{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:10px;margin-bottom:18px;background:color-mix(in srgb,var(--lx-accent) 12%,transparent);color:var(--lx-accent)}
.ud-lx-card__img{width:100%;margin-bottom:18px;border-radius:10px;overflow:hidden}
.ud-lx-card__go{position:absolute;top:24px;right:24px;color:var(--lx-accent);opacity:0;transition:opacity .2s ease,transform .2s ease}
a.ud-lx-card:hover .ud-lx-card__go{opacity:1;transform:translate(2px,-2px)}

/* ------------------------------------------------------------------- impact */
.ud-lx-impact__grid{display:grid;grid-template-columns:1.25fr .75fr;gap:56px;align-items:center}
.ud-lx-impact__metric{border-left:1px solid color-mix(in srgb,#fff 20%,transparent);padding-left:40px}
.ud-lx-impact__metric strong{display:block;font-family:var(--lx-serif);font-size:clamp(48px,5.6vw,76px);font-weight:400;line-height:1;letter-spacing:-.03em;color:var(--lx-accent)}
.ud-lx-impact__metric span{display:block;margin-top:14px;font-size:14.5px;color:var(--ud-muted,rgba(255,255,255,.72));max-width:230px}

/* ------------------------------------------------------------------- quotes */
.ud-lx-quote{margin-top:44px;border-top:1px solid var(--lx-line);padding-top:34px}
.ud-lx-quote__text{font-family:var(--lx-serif);font-size:clamp(24px,3.1vw,40px);font-weight:400;line-height:1.24;letter-spacing:-.02em;max-width:960px}
.ud-lx-quote figcaption{margin-top:28px;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;font-size:14px}
.ud-lx-quote figcaption span{color:var(--ud-muted,#6b7280)}
.ud-lx-quote__nav{display:flex;align-items:center;justify-content:flex-end;gap:16px;margin-top:26px;font-size:12.5px;color:var(--ud-muted,#6b7280)}
.ud-lx-quote__nav button{width:40px;height:40px;border-radius:50%;border:1px solid var(--lx-line);background:transparent;transition:background .2s ease,color .2s ease,border-color .2s ease}
.ud-lx-quote__nav button:hover{background:var(--lx-accent);border-color:var(--lx-accent);color:#fff}
.ud-lx-quote__metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:54px;border-top:1px solid var(--lx-line);padding-top:34px}
.ud-lx-quote__metrics strong{display:block;font-family:var(--lx-serif);font-size:clamp(30px,3.4vw,44px);font-weight:400;letter-spacing:-.03em;line-height:1}
.ud-lx-quote__metrics span{display:block;margin-top:10px;font-size:13.5px;color:var(--ud-muted,#6b7280)}

/* -------------------------------------------------------------------- award */
.ud-lx-award__inner{display:flex;flex-wrap:wrap;align-items:center;gap:18px 30px;padding:30px 34px;border:1px solid var(--lx-line);border-left:3px solid var(--lx-accent);border-radius:14px;background:var(--lx-tint)}
.ud-lx-award__mark{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background:color-mix(in srgb,var(--lx-accent) 14%,transparent);color:var(--lx-accent);flex-shrink:0}
.ud-lx-award .ud-lx-head{flex:1 1 340px;max-width:none}
.ud-lx-award .ud-lx-title{font-size:clamp(20px,2.1vw,27px);line-height:1.25}
.ud-lx-award .ud-lx-cta{margin-top:0}

/* ------------------------------------------------------------------ closing */
.ud-lx-closing{position:relative;overflow:hidden}
.ud-lx-closing .ud-lx-title{font-size:clamp(36px,5.4vw,70px);line-height:1.04}

/* ------------------------------------------------------------------- footer */
.ud-lx-footer__top{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:44px}
.ud-lx-footer__brand p{margin-top:18px;font-size:14.5px;color:var(--ud-muted,rgba(255,255,255,.72));max-width:330px}
.ud-lx-footer nav{display:flex;flex-direction:column;gap:12px;font-size:14.5px}
.ud-lx-footer nav a{opacity:.78;transition:opacity .18s ease}
.ud-lx-footer nav a:hover{opacity:1}
.ud-lx-footer__col{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--lx-accent);margin-bottom:4px!important}
.ud-lx-footer__bottom{margin-top:64px;padding-top:22px;border-top:1px solid color-mix(in srgb,#fff 16%,transparent);font-size:12.5px;color:var(--ud-muted,rgba(255,255,255,.72))}

@keyframes ud-lx-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

@container udpage (max-width:1024px){
  .ud-lx-panel,.ud-lx-features__grid,.ud-lx-impact__grid{grid-template-columns:1fr;gap:34px}
  .ud-lx-impact__metric{border-left:0;border-top:1px solid color-mix(in srgb,#fff 20%,transparent);padding-left:0;padding-top:28px}
  .ud-lx-footer__top{grid-template-columns:1fr 1fr;gap:34px}
  .ud-lx-stats__row{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ud-lx-stat{padding:32px 24px}
  .ud-lx-stat:nth-child(odd){border-left:0;padding-left:0}
  .ud-lx-stat:nth-child(even){padding-right:0}
  /* Two columns means a second row, which needs its own rule above it. */
  .ud-lx-stat:nth-child(n+3){border-top:1px solid color-mix(in srgb,#fff 16%,transparent)}
  .ud-lx-pillar{padding:26px 0 26px 24px}
  .ud-lx-curve{width:60%;opacity:.35}
}
@container udpage (max-width:640px){
  .ud-lx-nav__toggle{display:inline-flex}
  .ud-lx-nav__ghost{display:none}
  .ud-lx-nav__links{display:none;position:absolute;left:0;right:0;top:100%;flex-direction:column;align-items:stretch;gap:0;padding:8px 22px 20px;background:var(--lx-ink,var(--color-secondary,#0b1120))}
  .ud-lx-nav__links.is-open{display:flex}
  .ud-lx-nav__links a{padding:13px 0;border-bottom:1px solid color-mix(in srgb,#fff 12%,transparent)}
  .ud-lx-nav__bar{position:relative}
  .ud-lx-ticker{font-size:11.5px;text-align:center}
  /* Figures stay two-up even on the narrowest screen - stacked one per row
     they read as a list rather than a set, and push everything below the
     fold. The 2x2 grid and its rules come from the 1024 block above. */
  .ud-lx-stat{padding:26px 14px}
  .ud-lx-stat__value{font-size:34px}
  .ud-lx-stat__label{font-size:12.5px}
  .ud-lx-quote__metrics,.ud-lx-footer__top{grid-template-columns:1fr}
  .ud-lx-pillar{border-left:0;padding:24px 0;border-top:1px solid var(--lx-line)}
  .ud-lx-pillar:first-child{border-top:0}
  .ud-lx-pillars__grid{border-top:0}
  .ud-lx-curve{display:none}
  .ud-lx-award__inner{padding:24px}
  .ud-lx-mock__row{grid-template-columns:1fr auto}
  .ud-lx-mock__step{grid-row:auto;grid-column:1}
  .ud-lx-mock__note{grid-column:1}
  .ud-lx-chip{grid-row:span 3}
}
@media (prefers-reduced-motion:reduce){
  .ud-lx *,.ud-lx *::before,.ud-lx *::after{animation:none!important;transition:none!important}
}

/* Column order is a setting, not a fixture. */
.ud-lx-panel--reverse > *:first-child{order:2}
.ud-lx-features__grid--reverse > *:first-child{order:2}
.ud-lx-impact__grid--reverse > *:first-child{order:2}
`
