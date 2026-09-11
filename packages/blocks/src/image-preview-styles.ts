export const imagePreviewCss = `
.ip{font-family:var(--font-body,system-ui,sans-serif);font-size:var(--ud-body-size,16px)}
.ip-card{margin:0;min-width:0;align-self:start;background:var(--ud-card,var(--color-surface,#fff));border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:var(--radius-card,14px);overflow:hidden;break-inside:avoid}
.ip-image-wrap{position:relative;width:100%}
.ip .ip-full-image{display:block;width:100%;height:auto;max-height:none;aspect-ratio:auto;object-fit:contain;object-position:top}
.ip-image-wrap{--ud-natural-image-fit:contain;--ud-natural-image-position:top}
.ip-card figcaption{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:20px}
.ip-card h3{font-family:var(--font-heading,inherit);font-size:20px;line-height:1.35;margin:0;overflow-wrap:anywhere}
.ip-card figcaption a{font-size:14px;font-weight:600;color:inherit;text-decoration:underline;text-underline-offset:4px;min-height:32px;display:inline-flex;align-items:center;gap:5px}
.ip a:focus-visible,.ip-strip:focus-visible{outline:3px solid var(--color-primary,#2563eb);outline-offset:4px}
.ip-single{max-width:760px;margin-inline:auto}.ip-duo{display:grid;grid-template-columns:repeat(var(--ip-columns,2),minmax(0,1fr));gap:var(--ip-row-gap,24px) var(--ip-column-gap,24px);align-items:start}
.ip-masonry{column-count:var(--ip-columns,3);column-gap:var(--ip-column-gap,24px)}.ip-masonry .ip-card{margin-bottom:var(--ip-row-gap,24px)}
.ip-strip{display:flex;align-items:flex-start;gap:var(--ip-column-gap,24px);overflow-x:auto;scroll-snap-type:x proximity;padding:4px 4px 20px;scrollbar-width:auto}.ip-strip>.ip-card{flex:0 0 calc((100% - (var(--ip-columns,3) - 1)*var(--ip-column-gap,24px))/var(--ip-columns,3));scroll-snap-align:start}
.ip-tabs{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:22px}.ip-tabs button{font:inherit;color:inherit;border:1px solid currentColor;padding:10px 20px;border-radius:30px;background:transparent;cursor:pointer}.ip-tabs button[aria-selected=true]{background:var(--color-text,#111827);color:var(--color-background,#fff)}.ip-tabs button:focus-visible{outline:3px solid var(--color-primary,#2563eb);outline-offset:3px}
.ip-filter-row{display:flex;flex-wrap:wrap;gap:20px;margin-bottom:28px}.ip-filter-row label{display:grid;gap:8px;font-size:14px;flex:1;min-width:180px}.ip-filter-row input,.ip-filter-row select{font:inherit;font-size:16px;padding:12px;border:1px solid color-mix(in srgb,currentColor 35%,transparent);border-radius:8px;background:var(--ud-card,var(--color-surface,#fff));color:inherit;width:100%}
.ip-empty{display:grid;place-items:center;min-height:180px;padding:24px;text-align:center;border:1px dashed currentColor;opacity:.7}
@container udpage (max-width:900px){.ip-duo{grid-template-columns:repeat(var(--ip-tablet-columns,2),minmax(0,1fr))}.ip-masonry{column-count:var(--ip-tablet-columns,2)}.ip-strip>.ip-card{flex-basis:calc((100% - (var(--ip-tablet-columns,2) - 1)*var(--ip-column-gap,24px))/var(--ip-tablet-columns,2))}}
@container udpage (max-width:600px){.ip-duo{grid-template-columns:repeat(var(--ip-mobile-columns,1),minmax(0,1fr))}.ip-masonry{column-count:var(--ip-mobile-columns,1)}.ip-strip>.ip-card{flex-basis:calc((100% - (var(--ip-mobile-columns,1) - 1)*var(--ip-column-gap,24px))/var(--ip-mobile-columns,1))}.ip-card figcaption{padding:16px}}
`
