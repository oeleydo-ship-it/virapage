# Veloura template and shared image blocks

Veloura adapts the visual direction of the supplied [Hairlux reference](https://hairlux-wbs.webflow.io/) into native AI Sitekit blocks, with original branding and copy. It does not embed Webflow or require Webflow scripts.

## Pages and installation

Home, About, Services, Pricing, Gallery, Team, Contact and Appointment. Fourteen `*.veloura` blocks are registered in the shared renderer, editor palette and generated backend catalog. The standard template seeder includes Veloura. To install only this template, run `php artisan db:seed --class=VelouraTemplateSeeder` with PHP 8.4 or newer for the installed dependencies. Rerunning replaces this template's seed pages; it does not replace existing customer sites.

Local demo: `/demo/veloura`; interior pages: `/demo/veloura/about`, `/demo/veloura/services`, `/demo/veloura/pricing`, `/demo/veloura/gallery`, `/demo/veloura/team`, `/demo/veloura/contact`, `/demo/veloura/appointment`.

## Editing and AI

Choose Veloura when creating a site. Its blocks appear in the recommended palette. Text, image selection, repeaters, links, layout controls and shared section styling use the existing editor schema. The AI kit note identifies the visual family. Template content generation discovers declared text fields while retaining block types, ordering, photographs, navigation and form identifiers. Rates are numeric fields and currency is a selection, so copy generation does not change either.

Appointment and contact blocks use the existing public-form pipeline. When applied to a site, `FormService` binds them to the site's contact form. A demo is not a live appointment reservation; a real inquiry is submitted only through a connected form. Prices, biographies, reviews and contact details are starter content to replace with the salon's actual information.

## Shared image and gallery blocks

Available under **Gallery** in the recommended or generic block library on every template:

| Block | Display |
| --- | --- |
| `gallery.full_image` | One complete image, up to 760px wide |
| `gallery.vertical_duo` | Two vertical image columns, stacked on small screens |
| `gallery.full_masonry` | Three natural-height columns, reducing to two and one |
| `gallery.preview_strip` | Horizontal scrolling cards with full vertical images |
| `gallery.filtered_tabs` | Category tabs with image search and a style filter for each category |

The galleries provide Layout controls for desktop (1–6), tablet (1–4) and mobile (1–2) images per row, images per section (`0` displays all), and separate row/column spacing. In the scrolling strip, the column count controls visible cards. Limits hide additional images without deleting them, and the filtered gallery applies its limit after filtering. Existing saved blocks inherit sensible defaults without reseeding.

In the tabbed gallery's Content panel, give each image a **Category tab** and optional **Style filter**. Categories become tabs automatically; each tab offers only its own styles. Search and style filters can be independently hidden. Tab labels, search labels, and the empty-result message are editable. Tabs support arrow keys, Home and End.

Upload a portrait or full-page website screenshot through the image field. Images retain their natural aspect ratio by default; individual image settings can set a different size, ratio, crop or focal position. Each image has an editable title, alternative text, preview label and destination URL. Preview links can open in a new tab or the same tab; empty or unsupported destinations do not produce a link. The strip supports touch scrolling and keyboard scrolling when focused.

The initial examples use salon photographs and the supplied reference URL. Replace these with your own demo screenshots and live-site links. No screenshots are automatically generated for the existing template library, and these optional blocks are not injected into existing customer pages.

## Assets and validation

Reference photographs are stored under `public/template-assets/veloura`; `sources.txt` records each original URL. They are editable sample media from the supplied reference. No reference font, logo or Webflow JavaScript was copied.

Targeted tests cover eight-page installation, link and asset integrity, AI copy isolation, contact-form binding, gallery filters, navigation, review cycling, form submission, and generic preview links. Both the dashboard and published-site renderer must be rebuilt after changing block code. Regenerate `resources/blocks/block-catalog.json` with the existing block catalog script after schema changes.

## Individual element settings

Image fields in the Content panel now include **Individual image settings**: width, height, maximum dimensions, aspect ratio, fit, position, opacity, alignment, border, corners, shadow and spacing. Sizes accept px, %, rem/em and viewport units; a bare number is stored as pixels. Clear a value to restore the template default. These controls target each image path, including images inside repeaters, rather than the entire section.

The shared Media and BrandLogo renderers and all image-preview blocks apply these saved styles. Text elements have a **Text box appearance** panel as well as typography. Shared buttons infer appearance from their editable label; gallery preview links and Veloura's custom buttons also use their own appearance settings. Gallery cards, category tabs, search inputs and style filters have separate appearance targets. Tablet/mobile element settings use the existing responsive overrides and are emitted into the published stylesheet.

For a gallery item, expand its Content entry to edit the image, title and preview button independently. Open its Card appearance for the surrounding card. Default gallery images remain complete and uncropped until a custom frame/fit is selected. Customer pages do not need to be reseeded.
