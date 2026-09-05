export const formaCss = `
.ud-forma{--forma-line:color-mix(in srgb,currentColor 18%,transparent)}
.ud-forma-head{max-width:760px;margin-bottom:40px}
.ud-forma-head .ud-h1,.ud-forma-head .ud-h2{letter-spacing:-.055em;line-height:1.04;text-wrap:balance}
.ud-forma-kicker{font:500 11px/1.5 var(--ud-font-body, sans-serif);text-transform:uppercase;letter-spacing:.16em;margin:0 0 24px}
.ud-forma-description{max-width:530px;line-height:1.75;margin-top:24px;opacity:.8}
.ud-forma-hero-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:64px;align-items:center}
.ud-forma-hero--reverse .ud-forma-art{order:-1}
.ud-forma-hero--centered .ud-forma-hero-grid{grid-template-columns:1fr;text-align:center}
.ud-forma-hero--centered .ud-forma-head,.ud-forma-hero--centered .ud-forma-description{margin-left:auto;margin-right:auto}
.ud-forma-hero--centered .ud-btns{justify-content:center}
.ud-forma-art{background:#e8d8c6;min-height:420px;position:relative;overflow:hidden;border-radius:180px 180px 12px 12px}
.ud-forma-art .ud-media-box{height:420px;width:100%;object-fit:cover}
.ud-forma-sculpture{height:420px;display:flex;align-items:center;justify-content:center;transform:rotate(-25deg)}
.ud-forma-sculpture i{display:block;width:100px;height:250px;border-radius:80px;background:linear-gradient(100deg,#9b3925,#d27854 48%,#9f462d);box-shadow:16px 30px 24px #6b38232b;margin-left:-15px}
.ud-forma-sculpture i:nth-child(2){transform:translateY(-30px)}
.ud-forma-sculpture i:nth-child(3){transform:translateY(30px)}
.ud-forma-art-caption{position:absolute;bottom:20px;left:24px;color:#40271e;font-size:12px;letter-spacing:.04em}
.ud-forma-services{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.ud-forma-service{padding:32px;border:1px solid var(--forma-line);border-radius:12px}
.ud-forma-number{font-size:12px;letter-spacing:.1em;display:block;margin-bottom:36px;opacity:.6}
.ud-forma-service .ud-h3{margin-bottom:16px}.ud-forma-service p,.ud-forma-step p{line-height:1.75;opacity:.8}
.ud-forma-services--list{grid-template-columns:1fr;gap:0}.ud-forma-services--list .ud-forma-service{border:0;border-top:1px solid var(--forma-line);border-radius:0;display:grid;grid-template-columns:auto 1fr 2fr;gap:32px}.ud-forma-services--list .ud-forma-number{margin:8px 0}
.ud-forma-work{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:36px 24px}
.ud-forma-work--editorial article:first-child{grid-column:1/-1}.ud-forma-work--stacked{grid-template-columns:1fr}
.ud-forma-project{height:340px;border-radius:12px;overflow:hidden;background:#d5d9cb}.ud-forma-project--1{background:#e9bba3}.ud-forma-project--2{background:#d6ccbb}
.ud-forma-project .ud-media-box{width:100%;height:100%;object-fit:cover}
.ud-forma-project-art{height:100%;display:grid;place-items:center;background:radial-gradient(ellipse at 70% 20%,#ffffff80,transparent 70%)}
.ud-forma-project-art span{font:italic 140px Georgia,serif;color:#343d2e;border:1px solid #343d2e40;min-width:190px;text-align:center;padding:10px 24px;transform:rotate(-8deg);box-shadow:20px 30px 40px #00000014;background:#ffffff30}
.ud-forma-project--1 span{color:#713c28;transform:rotate(6deg);border-radius:100px 100px 0 0}.ud-forma-project--2 span{color:#594a3a;transform:rotate(-3deg)}
.ud-forma-project-caption{padding-top:18px}.ud-forma-project-caption p{font-size:12px;margin-top:8px;opacity:.65}
.ud-forma-process{display:grid;grid-template-columns:1fr 1fr;gap:80px}.ud-forma-step{padding:24px 0;border-top:1px solid var(--forma-line)}.ud-forma-step .ud-forma-number{margin-bottom:12px}.ud-forma-step .ud-h3{margin-bottom:12px}.ud-forma-step summary{cursor:pointer;font-size:20px;padding:8px 0}.ud-forma-step summary:focus-visible{outline:2px solid currentColor;outline-offset:4px}
.ud-forma-cta--centered{text-align:center}.ud-forma-cta--centered .ud-forma-head,.ud-forma-cta--centered .ud-forma-description{margin-left:auto;margin-right:auto}.ud-forma-cta--centered .ud-btns{justify-content:center}.ud-forma-cta--split .ud-forma-invitation{display:flex;align-items:center;justify-content:space-between;gap:40px}
@container (max-width:760px){.ud-forma-hero-grid,.ud-forma-services,.ud-forma-process{grid-template-columns:1fr;gap:32px}.ud-forma-hero--reverse .ud-forma-art{order:0}.ud-forma-hero .ud-h1{font-size:clamp(40px,10cqw,72px)}.ud-forma-services--list .ud-forma-service{grid-template-columns:1fr;gap:12px}.ud-forma-work{grid-template-columns:1fr}.ud-forma-cta--split .ud-forma-invitation{display:block}.ud-forma-art{min-height:340px}.ud-forma-project{height:280px}}
/* navbar.forma / footer.forma - every colour comes from a theme token so the
   kit recolours with the site rather than shipping its own palette. */
.ud-forma-nav-wrap{padding:0}
.ud-forma-nav{display:flex;align-items:center;justify-content:space-between;gap:32px;padding:20px 0;border-bottom:1px solid var(--forma-line)}
.ud-forma .ud-forma-nav--sticky{position:sticky;top:0;z-index:40;background:var(--color-background);backdrop-filter:saturate(1.2) blur(8px)}
.ud-forma-nav__logo{font:500 20px/1 var(--ud-font-heading, serif);letter-spacing:-.04em;color:var(--color-text);text-decoration:none}
.ud-forma-nav__links{display:flex;align-items:center;gap:28px}
.ud-forma-nav__links a{font-size:14px;color:var(--color-text);text-decoration:none;opacity:.75}
.ud-forma-nav__links a:hover{opacity:1}
.ud-forma-footer{border-top:1px solid var(--forma-line)}
.ud-forma-footer__top{display:grid;grid-template-columns:1.2fr 1fr;gap:56px}
.ud-forma-footer__mark{font:500 28px/1 var(--ud-font-heading, serif);letter-spacing:-.04em;margin:0 0 12px}
.ud-forma-footer__tagline{max-width:320px;opacity:.75;line-height:1.7}
.ud-forma-footer__columns{display:grid;grid-template-columns:repeat(2,1fr);gap:32px}
.ud-forma-footer__columns h3{font-size:12px;text-transform:uppercase;letter-spacing:.14em;opacity:.6;margin:0 0 14px}
.ud-forma-footer__columns ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.ud-forma-footer__columns a{font-size:14px;color:var(--color-text);text-decoration:none;opacity:.8}
.ud-forma-footer__columns a:hover{opacity:1}
.ud-forma-footer__legal{margin:48px 0 0;font-size:13px;opacity:.6}
@container (max-width:760px){.ud-forma-nav__links{display:none}.ud-forma-footer__top{grid-template-columns:1fr;gap:32px}}
`

