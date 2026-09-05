// Generate a standalone preview without a database or Laravel server.
// Run: node scripts/preview-forma.mjs
import { build } from '../packages/blocks/node_modules/esbuild/lib/main.js'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const bundle = resolve(root, 'packages/blocks/node_modules/.forma-preview.mjs')
await build({
  stdin: { contents: `
    import React from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import { PageRenderer, getBlock } from './src/index';
    const theme = { primary:'#963f2d', secondary:'#302e29', accent:'#d5d9cb', background:'#faf7f1', surface:'#eee8df', text:'#302e29', muted:'#716b62', headingFont:'Fraunces, Georgia, serif', bodyFont:'Inter, system-ui, sans-serif', headingWeight:500, bodyWeight:400, buttonRadius:'999px', cardRadius:'12px', containerWidth:'1180px', sectionSpacing:'88px' };
    const types = ['navbar.cta','hero.forma','services.forma','gallery.forma','content.forma','cta.forma','footer.simple'];
    const sections = types.map((type,i) => ({ id:'section-'+i,type,version:1,hidden:false,props:{...getBlock(type).defaultProps,...(i===0 ? {logoText:'forma.',links:[{label:'Work',url:'#section-3'},{label:'Services',url:'#section-2'}],buttonLabel:'Let’s talk',buttonUrl:'#section-5'} : {})} }));
    export const html = renderToStaticMarkup(React.createElement(PageRenderer,{content:{schemaVersion:1,sections},theme}));
  `, resolveDir: resolve(root, 'packages/blocks'), loader: 'tsx' },
  outfile: bundle, bundle: true, format: 'esm', platform: 'node', jsx: 'automatic',
  external: ['react', 'react-dom/server', 'react/jsx-runtime'],
})
try {
  const { html } = await import(pathToFileURL(bundle).href)
  const output = resolve(root, 'storage/app/forma-preview.html')
  mkdirSync(resolve(root, 'storage/app'), { recursive: true })
  writeFileSync(output, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Forma — template preview</title><style>body{margin:0;background:#faf7f1}*{box-sizing:border-box}</style><body>${html}</body></html>`)
  console.log(output)
} finally {
  rmSync(bundle, { force: true })
}
