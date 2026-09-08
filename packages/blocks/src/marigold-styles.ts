/**
 * Marigold family stylesheet.
 *
 * Colour resolves from theme tokens: `--color-secondary` paints the deep
 * green panels through the shared dark tone, `--color-accent` is the coral
 * that marks eyebrows and chips, and `--color-highlight` is the lime that
 * only ever appears on green. Everything else is derived here, so the family
 * recolours with the site theme rather than carrying a second palette.
 */
export const marigoldCss = `
.ud-mg{
  --mg-green:var(--color-secondary, #2b6d36);
  --mg-coral:var(--color-accent, #ef5e36);
  --mg-lime:var(--color-highlight, #d5df5d);
  --mg-ink:var(--color-text, #481427);
  --mg-muted:var(--ud-muted, var(--color-muted, #6f6468));
  --mg-line:color-mix(in srgb, var(--ud-fg, #481427) 12%, transparent);
  --mg-card:var(--color-surface, #fff);
  --mg-round:26px;
  --mg-display:var(--font-heading, Parkinsans, "Trebuchet MS", sans-serif);
}
.ud-mg.ud-section{line-height:1.62}
.ud-mg h1,.ud-mg h2,.ud-mg h3,.ud-mg p,.ud-mg figure,.ud-mg blockquote,.ud-mg ul{margin:0}
.ud-mg ul{padding:0;list-style:none}
.ud-mg a{color:inherit;text-decoration:none}
.ud-mg button{font:inherit;cursor:pointer;color:inherit}
.ud-mg :focus-visible{outline:2px solid var(--mg-coral);outline-offset:3px;border-radius:6px}

/* --------------------------------------------------------------- head + cta */
.ud-mg-head{max-width:660px}
.ud-mg-head--center{margin-inline:auto;text-align:center}
.ud-mg .ud-mg-eyebrow{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--mg-coral);margin-bottom:14px}
.ud-mg-title{font-family:var(--mg-display);font-size:clamp(29px,3.4vw,45px);font-weight:500;line-height:1.14;letter-spacing:-.02em;text-wrap:balance}
.ud-mg .ud-mg-lead{margin-top:16px;font-size:16.5px;color:var(--mg-muted);max-width:600px}
.ud-mg-head--center .ud-mg-lead{margin-inline:auto}
.ud-mg-cta{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:28px}
.ud-mg-head--center + .ud-mg-cta{justify-content:center}
.ud-mg-btn{display:inline-flex;align-items:center;gap:12px;padding:12px 14px 12px 24px;border-radius:100px;background:var(--mg-lime);color:var(--mg-ink)!important;font-size:15px;font-weight:600;transition:transform .2s ease,filter .2s ease}
.ud-mg-btn:hover{transform:translateY(-2px);filter:brightness(1.05)}
.ud-mg-btn__dot{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:var(--mg-green);color:#fff;flex-shrink:0}
.ud-mg-btn--sm{padding:9px 11px 9px 18px;font-size:14px}
.ud-mg-btn--sm .ud-mg-btn__dot{width:22px;height:22px}
.ud-mg-btn--ghost{background:transparent;border:1.5px solid var(--mg-line);padding:12px 24px;color:inherit!important}
.ud-mg-btn--ghost:hover{border-color:var(--mg-coral);filter:none}
.ud-mg-bar{display:block;height:7px;border-radius:99px;background:color-mix(in srgb,var(--ud-fg,#481427) 12%,transparent);overflow:hidden}
.ud-mg-bar > i{display:block;height:100%;border-radius:99px;background:var(--mg-coral)}

/* ------------------------------------------------------------------- navbar */
.ud-mg-nav{background:var(--ud-bg,var(--color-background,#f8f8f6));color:var(--mg-ink);position:relative;z-index:60}
.ud-mg-nav--sticky.ud-mg-nav--sticky{position:sticky;top:0;z-index:70}
.ud-mg-nav__bar{display:flex;align-items:center;justify-content:space-between;gap:26px;padding-block:15px}
.ud-mg-brand{display:inline-flex;align-items:center;gap:10px;font-family:var(--mg-display);font-size:20px;font-weight:600;letter-spacing:-.02em}
.ud-mg-brand__mark{width:22px;height:22px;border-radius:50% 50% 50% 4px;background:var(--mg-green);box-shadow:inset -6px -6px 0 -3px var(--mg-lime)}
.ud-mg-brand__logo{max-height:34px;width:auto}
.ud-mg-nav__links{display:flex;align-items:center;gap:24px;font-size:15px}
.ud-mg-nav__links a{opacity:.82;transition:opacity .18s ease}
.ud-mg-nav__links a:hover{opacity:1;color:var(--mg-green)}
.ud-mg-nav__end{display:flex;align-items:center;gap:14px}


.ud-mg-nav__toggle{display:none;background:none;border:0;padding:4px}

/* --------------------------------------------------------------------- hero */
.ud-mg-hero{padding:0!important}
.ud-mg-hero__grid{display:grid;grid-template-columns:1fr 1fr;min-height:min(86vh,720px)}
.ud-mg-hero__panel{position:relative;overflow:hidden;background:var(--mg-green);color:#fff;display:flex;flex-direction:column;justify-content:center;gap:20px;padding:64px clamp(28px,5vw,86px)}
.ud-mg-hero__rings{position:absolute;right:-14%;top:-10%;width:78%;aspect-ratio:1;border-radius:50%;border:1px solid rgba(255,255,255,.14);box-shadow:0 0 0 42px rgba(255,255,255,.05),0 0 0 90px rgba(255,255,255,.04);pointer-events:none}
.ud-mg-hero__portrait{position:relative;width:190px;border-radius:20px;overflow:hidden}
.ud-mg .ud-mg-hero__intro{position:relative;font-size:15.5px;max-width:390px;color:rgba(255,255,255,.86)}
.ud-mg-hero__title{position:relative;font-family:var(--mg-display);font-size:clamp(38px,4.6vw,66px);font-weight:500;line-height:1.06;letter-spacing:-.025em;color:var(--mg-lime)}
.ud-mg-hero__media{position:relative}
.ud-mg-hero__photo{width:100%;height:100%;border-radius:0}
.ud-mg-hero__photo.ud-media-box{aspect-ratio:auto!important;min-height:340px}
/* Compact and bottom-left on the photo, as the reference has it. Raised
   clear of the quick-link strip, which lifts into the hero and was cutting
   across this card. */
.ud-mg-hero__stat{position:absolute;left:28px;bottom:78px;width:min(360px,calc(100% - 56px));padding:18px 22px;border-radius:20px;background:rgba(255,255,255,.94);color:var(--mg-ink);backdrop-filter:blur(6px);box-shadow:0 20px 40px -28px rgba(0,0,0,.5)}
.ud-mg .ud-mg-hero__statlabel{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mg-muted)}
.ud-mg .ud-mg-hero__statvalue{display:flex;align-items:baseline;gap:5px;margin:6px 0 12px;font-family:var(--mg-display);font-size:26px;font-weight:600}
.ud-mg-hero__statvalue span{color:var(--mg-muted);font-size:17px}

/* ----------------------------------------------------------------- pagehead */

.ud-mg-pagehead .ud-mg-title{font-size:clamp(34px,4.2vw,56px)}

/* --------------------------------------------------------------- quicklinks */
/* The strip lifts into the hero above it, so this section must not clip
   its own children - .ud-section defaults --ud-overflow to hidden, which
   was cutting the icon and title off every card. */
.ud-mg-quick{--ud-overflow:visible}
.ud-mg-quick .ud-container{padding-block:0}
.ud-mg-quick__row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;position:relative;z-index:2}
/* Only tucks under the section above when the block asks for it, which
   is the home page sitting beneath the hero. */
.ud-mg-quick__row--lift{margin-top:-46px}
.ud-mg-quick__item{display:flex;align-items:flex-start;gap:14px;padding:24px 22px;border-radius:20px;background:var(--mg-card);box-shadow:0 22px 44px -34px rgba(0,0,0,.45);transition:transform .2s ease}
a.ud-mg-quick__item:hover{transform:translateY(-4px)}
.ud-mg-quick__icon{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:14px;background:color-mix(in srgb,var(--mg-green) 12%,transparent);color:var(--mg-green);flex-shrink:0}
.ud-mg-quick__body{display:flex;flex-direction:column;gap:4px;min-width:0}
.ud-mg-quick__body strong{font-family:var(--mg-display);font-size:17px;font-weight:600}
.ud-mg-quick__body span{font-size:13.5px;color:var(--mg-muted)}

/* -------------------------------------------------------------------- about */
.ud-mg-about__grid{margin-top:44px}
.ud-mg-value{padding:30px;border-radius:var(--mg-round);background:var(--color-surface,#fff);border:1px solid var(--mg-line)}
.ud-mg-value__icon{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%;background:var(--mg-lime);color:var(--mg-ink);margin-bottom:16px}
.ud-mg-value h3{font-family:var(--mg-display);font-size:19px;font-weight:600}
.ud-mg-value p{margin-top:9px;font-size:14.5px;color:var(--mg-muted)}

/* ----------------------------------------------------------------- programs */
.ud-mg-programs{color:#fff}
.ud-mg-programs .ud-mg-title{color:var(--mg-lime)}
.ud-mg-programs .ud-mg-lead{color:rgba(255,255,255,.8)}
.ud-mg-progtabs{display:flex;flex-wrap:wrap;gap:9px;margin-top:30px}
.ud-mg-progtab{padding:11px 22px;border-radius:100px;border:1px solid rgba(255,255,255,.28);background:transparent;color:#fff;font-size:14.5px;font-weight:500;transition:background .2s ease,color .2s ease}
.ud-mg-progtab:hover{border-color:var(--mg-lime)}
.ud-mg-progtab.is-active{background:var(--mg-lime);border-color:var(--mg-lime);color:var(--mg-ink)}
.ud-mg-progpanel{display:grid;grid-template-columns:1.05fr .95fr;gap:34px;align-items:center;margin-top:32px;padding:26px;border-radius:var(--mg-round);background:rgba(255,255,255,.07);animation:ud-mg-in .45s ease}
.ud-mg-progpanel__img{border-radius:20px;overflow:hidden}
.ud-mg-progpanel__copy h3{font-family:var(--mg-display);font-size:clamp(22px,2.3vw,30px);font-weight:600;color:var(--mg-lime)}
.ud-mg-progpanel__copy p{margin-top:12px;font-size:15.5px;color:rgba(255,255,255,.82)}

/* -------------------------------------------------------------------- steps */
.ud-mg-steps__top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px}
.ud-mg-steps__top .ud-mg-cta{margin-top:0}
.ud-mg-steps__grid{margin-top:40px}
.ud-mg-step{position:relative;padding:30px;border-radius:var(--mg-round);background:var(--color-background,#fff)}
.ud-mg-step__num{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:var(--mg-coral);color:#fff;font-family:var(--mg-display);font-weight:600;margin-bottom:16px}
.ud-mg-step h3{font-family:var(--mg-display);font-size:19px;font-weight:600}
.ud-mg-step p{margin-top:9px;font-size:14.5px;color:var(--mg-muted)}

/* ---------------------------------------------------------------- donations */
.ud-mg-donations__grid{margin-top:44px}
.ud-mg-appeal{display:flex;flex-direction:column;border-radius:var(--mg-round);overflow:hidden;background:var(--color-surface,#fff);border:1px solid var(--mg-line)}
.ud-mg-appeal__img{border-radius:0}
.ud-mg-appeal__body{flex:1;padding:24px;display:flex;flex-direction:column;gap:12px}
.ud-mg-appeal__body h3{font-family:var(--mg-display);font-size:19px;font-weight:600}
.ud-mg-appeal__body > p{font-size:14px;color:var(--mg-muted)}
.ud-mg-appeal__meta{display:flex;justify-content:space-between;font-size:12.5px;font-weight:600;color:var(--mg-muted)}
.ud-mg-appeal__figures{display:flex;justify-content:space-between;font-size:13px;color:var(--mg-muted)}
.ud-mg-appeal__figures strong{font-family:var(--mg-display);color:var(--mg-ink);font-weight:600}
.ud-mg-appeal__amounts{display:flex;flex-wrap:wrap;gap:7px}
.ud-mg-appeal__amounts span{padding:6px 13px;border-radius:100px;border:1px solid var(--mg-line);font-size:12.5px;font-weight:600}
/* Pushed to the bottom of the card so the buttons line up across a row of
   appeals whose descriptions are different lengths. */
.ud-mg-appeal .ud-mg-btn{align-self:flex-start;margin-top:auto;padding-top:12px}

/* ------------------------------------------------------------------- quotes */
.ud-mg .ud-mg-quote{position:relative;max-width:840px;margin:36px auto 0;padding:36px;border-radius:var(--mg-round);background:var(--color-background,#fff);text-align:center;animation:ud-mg-in .45s ease}
.ud-mg-quote__mark{display:inline-flex;color:var(--mg-coral);margin-bottom:12px}
.ud-mg .ud-mg-quote__text{font-family:var(--mg-display);font-size:clamp(18px,2.1vw,25px);font-weight:500;line-height:1.44;letter-spacing:-.01em}
.ud-mg-quote figcaption{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:22px}
.ud-mg-quote figcaption img{width:44px;height:44px;border-radius:50%;object-fit:cover}
.ud-mg-quote figcaption span{display:flex;flex-direction:column;text-align:left}
.ud-mg-quote figcaption strong{font-family:var(--mg-display);font-size:15px;font-weight:600}
.ud-mg-quote figcaption span span{font-size:13px;color:var(--mg-muted)}
.ud-mg-quote__nav{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:22px;font-size:12.5px;color:var(--mg-muted)}
.ud-mg-quote__nav button{width:38px;height:38px;border-radius:50%;border:1px solid var(--mg-line);background:transparent;transition:background .2s ease,color .2s ease}
.ud-mg-quote__nav button:hover{background:var(--mg-green);border-color:var(--mg-green);color:#fff}

/* ---------------------------------------------------------------- checklist */
.ud-mg-checklist__grid{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center}
.ud-mg-checklist__img{border-radius:var(--mg-round);overflow:hidden}
.ud-mg .ud-mg-checks{display:grid;gap:11px;margin-top:22px}
.ud-mg-checks li{display:flex;align-items:center;gap:11px;padding:13px 18px;border-radius:100px;background:var(--color-surface,#fff);font-size:14.5px;font-weight:500}
.ud-mg-checks li > span{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:var(--mg-green);color:#fff;flex-shrink:0}

/* ----------------------------------------------------------------- products */
.ud-mg-products__top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:18px}
.ud-mg-products__grid,.ud-mg-team__grid,.ud-mg-blog__grid{margin-top:40px}
.ud-mg-product{display:flex;flex-direction:column;align-items:flex-start;padding:16px;border-radius:var(--mg-round);background:var(--color-surface,#fff);border:1px solid var(--mg-line);transition:transform .2s ease,border-color .2s ease}
a.ud-mg-product:hover{transform:translateY(-4px);border-color:var(--mg-green)}
.ud-mg-product__img{width:100%;border-radius:18px;overflow:hidden;margin-bottom:14px}
.ud-mg-product__tag{padding:5px 12px;border-radius:100px;background:color-mix(in srgb,var(--mg-coral) 14%,transparent);color:var(--mg-coral);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.ud-mg-product h3{font-family:var(--mg-display);font-size:17px;font-weight:600;margin-top:10px}
.ud-mg .ud-mg-product__price{margin-top:6px;font-family:var(--mg-display);font-size:17px;font-weight:600;color:var(--mg-green)}

/* --------------------------------------------------------------------- team */
.ud-mg-member{text-align:center}
.ud-mg-member__img{border-radius:var(--mg-round);overflow:hidden}
.ud-mg-member h3{font-family:var(--mg-display);font-size:17px;font-weight:600;margin-top:14px}
.ud-mg .ud-mg-member__role{font-size:13.5px;color:var(--mg-muted);margin-top:3px}

/* ---------------------------------------------------------------------- faq */
.ud-mg-faq__list{max-width:820px;margin:38px auto 0;display:grid;gap:12px}
.ud-mg-faq__item{border-radius:20px;background:var(--color-surface,#fff);border:1px solid var(--mg-line);overflow:hidden}
.ud-mg-faq__item.is-open{border-color:var(--mg-green)}
.ud-mg-faq__item button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:19px 24px;background:none;border:0;text-align:left;font-family:var(--mg-display);font-size:16.5px;font-weight:600}
.ud-mg-faq__item i{font-style:normal;font-size:21px;color:var(--mg-green);flex-shrink:0}
.ud-mg .ud-mg-faq__answer{padding:0 24px 22px;font-size:14.5px;color:var(--mg-muted)}

/* --------------------------------------------------------------------- blog */
.ud-mg-post{display:flex;flex-direction:column;align-items:flex-start;padding:16px;border-radius:var(--mg-round);background:var(--color-background,#fff);transition:transform .2s ease}
a.ud-mg-post:hover{transform:translateY(-4px)}
.ud-mg-post__img{width:100%;border-radius:18px;overflow:hidden;margin-bottom:14px}
.ud-mg .ud-mg-post__meta{display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--mg-muted)}
.ud-mg-post__tag{padding:5px 12px;border-radius:100px;background:color-mix(in srgb,var(--mg-green) 12%,transparent);color:var(--mg-green);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.ud-mg-post h3{font-family:var(--mg-display);font-size:18px;font-weight:600;margin-top:10px}

/* ------------------------------------------------------------------ closing */
.ud-mg-closing{padding-block:0!important}
.ud-mg-closing__panel{position:relative;overflow:hidden;padding:clamp(48px,6vw,86px) 30px;background:var(--ud-bg,var(--mg-green));color:var(--ud-fg,#fff);text-align:center}
.ud-mg-closing__panel .ud-mg-title{color:var(--mg-lime)}
.ud-mg-closing__panel .ud-mg-lead{color:rgba(255,255,255,.84)}
.ud-mg-closing__panel .ud-mg-head{position:relative;z-index:1}
.ud-mg-closing__panel .ud-mg-cta{position:relative;z-index:1}
.ud-mg-closing__panel .ud-mg-btn--ghost{border-color:rgba(255,255,255,.4);color:#fff!important}

/* ------------------------------------------------------------------- footer */
.ud-mg-footer{color:#fff}
.ud-mg-footer__top{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:40px}
.ud-mg-footer__brand p{margin-top:16px;font-size:14.5px;color:rgba(255,255,255,.76);max-width:320px}
.ud-mg-footer nav{display:flex;flex-direction:column;gap:11px;font-size:14.5px}
.ud-mg-footer nav a{opacity:.8}
.ud-mg-footer nav a:hover{opacity:1;color:var(--mg-lime)}
.ud-mg .ud-mg-footer__col{font-size:11.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--mg-lime);margin-bottom:3px}
.ud-mg-footer__bottom{margin-top:56px;padding-top:20px;border-top:1px solid rgba(255,255,255,.2);font-size:12.5px;color:rgba(255,255,255,.72)}

@keyframes ud-mg-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

@container udpage (max-width:1024px){
  .ud-mg-hero__grid{grid-template-columns:1fr}
  .ud-mg-hero__panel{padding:52px 30px}
  .ud-mg-quick__row{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:26px}
  .ud-mg-progpanel,.ud-mg-checklist__grid{grid-template-columns:1fr;gap:26px}
  .ud-mg-footer__top{grid-template-columns:1fr 1fr}
  .ud-mg-nav__links{gap:16px;font-size:14px}
}
@container udpage (max-width:640px){
  .ud-mg-nav__toggle{display:inline-flex}
  .ud-mg-nav__links{display:none;position:absolute;left:0;right:0;top:100%;flex-direction:column;align-items:stretch;gap:0;padding:6px 22px 18px;background:var(--color-background,#f8f8f6);box-shadow:0 18px 30px -22px rgba(0,0,0,.4)}
  .ud-mg-nav__links.is-open{display:flex}
  .ud-mg-nav__links a{padding:12px 0;border-bottom:1px solid var(--mg-line)}
  .ud-mg-nav__bar{position:relative}
  .ud-mg-quick__row{grid-template-columns:1fr}
  .ud-mg-footer__top{grid-template-columns:1fr}
  .ud-mg-steps__top,.ud-mg-products__top{flex-direction:column;align-items:flex-start}
  .ud-mg-hero__stat{left:14px;bottom:16px;width:calc(100% - 28px);padding:15px 17px}
  .ud-mg-quote{padding:26px 20px}
}
@media (prefers-reduced-motion:reduce){
  .ud-mg *,.ud-mg *::before,.ud-mg *::after{animation:none!important;transition:none!important}
}

/* Column order is a setting, not a fixture: each split offers a Swap
   columns toggle and these flip the first child to the far side. */
.ud-mg-hero__grid--reverse > *:first-child{order:2}
.ud-mg-progpanel--reverse > *:first-child{order:2}
.ud-mg-checklist__grid--reverse > *:first-child{order:2}
`
