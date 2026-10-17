# Studio Navya

A warm digital-services portfolio set in the same original illustrated sunset room throughout the opening, scrolling story and room-view mode. A small editorial diary stays at the left edge. Existing painted layers provide the fairy lights, woven dreamcatcher, flowers, furniture and golden retriever. One scene stays pinned across the introduction and story. Scroll progress continuously changes the evening light and subtle furniture position; the scene is never swapped or reset at a chapter boundary. Short diary entries fade in beside it.

The portfolio, services, process, proposals, FAQ, project pages and enquiries retain their editorial layouts and readable typography. Notebook styling is confined to the small diary.

## Update your work without writing code

1. Open editor.html (the **Studio editor** link in the footer).
2. Enter your real email and optional social, WhatsApp and booking links. Save the details.
3. Add or edit projects. Include your own cover image, scope, approach, deliverables and any verified results. Save each project.
4. Select **Preview your draft** to see changes on this device. Ordinary visitors still see the published version.
5. Select **Export content-data.js**. Replace that file at the root of this repository, commit it, and redeploy.

The editor is a browser-local notebook, not a remote CMS. It cannot access GitHub, send enquiries, or publish by itself. Exported content contains public website data, never passwords or private client information. Download a JSON backup to move a draft between devices. Changes to form fields must be saved before export.

## Before pitching clients

- Add a genuine enquiry email in the editor. The old unverified email, generic social URLs and dummy WhatsApp number are disabled.
- The form opens the visitor’s email app with a prepared message when an email is configured; the visitor reviews and sends it. With no configured email, it creates a copyable brief and clearly says it has **not** been sent.
- The seven starting projects are **concept briefs**. Their strategies and deliverables are proposed, with editorial concept covers. They are not completed client engagements or verified results. Replace them or add your own work.
- Example certifications remain in certs.js for editing but are excluded from the live page until placeholder is false. Only publish credentials you actually hold.
- Prices from the earlier site are preserved in config.js but hidden by default. Set showPrices to true to show those saved prices. The homepage otherwise offers tailored proposals.
- Public client access depends on the hosting audience. A new Sites deployment starts private.

## Content and source

| File | Purpose |
| --- | --- |
| content-data.js | Published editor export; overrides default settings and work |
| config.js | Default contact details, saved prices and one-off service menu |
| work.js | Default concept project data; gallery arrays support extra samples |
| services.js | Seven services, inclusions, example scope, audience and measures |
| certs.js | Credentials; placeholder entries are hidden |
| index.html | Main page, four story chapters, FAQ and enquiry form |
| styles.css | Responsive layout, warm palette and typography |
| motion.css / motion.js | One continuous evening timeline, word reveals and ambient pause |
| room.js | Bounded painted-room parallax, settings, keyboard and fullscreen controls |
| living-room.css | Room controls, illustrated prop movement and responsive presentation |
| diary.js / diary.css | One pinned room and small side diary with fading entries |
| hero-art.js | Original illustrated room layers, fairy lights, flowers and retriever |
| assets/fonts/ | Self-hosted DM Serif Display and Inter webfonts with their SIL Open Font Licenses |
| assets/scene/ | Archived modeled prototype; not loaded by the live page |
| assets/vendor/ | Archived prototype dependency and MIT license; not loaded by the live page |
| scripts/verify-room.mjs | Dependency-free geometry and choreography checks |
| main.js | Accessible tabs, filters, menu, journey diagram and enquiries |
| content.js | Shared safe rendering, content validation and draft loading |
| case.html / case.js | Individual project pages |
| editor.html / editor.js / editor.css | Local project and contact editor |
| .openai/hosting.json | Sites identity and static deployment directory |

No package installation or external font connection is required. DM Serif Display and Inter are self-hosted as compressed WOFF files under their SIL Open Font Licenses. The live page uses ordinary JavaScript and SVG image layers. The modeled-room modules remain archived in source but are not referenced, preloaded, published or executed by the website. Readable Georgia and Arial fallbacks are supplied. Motion respects prefers-reduced-motion, uses native scrolling without trapping input, and degrades to readable static content. The silk image is retained from the original repository.

## Build and host

Run node scripts/build.mjs from the repository root. It copies public HTML, CSS, JavaScript and assets to dist/. Host dist/ with any static host, or use the Sites workflow. Rebuild after content changes. Root files also work on GitHub Pages; enable Pages for the desired branch and root directory.

## Verification

DOM checks exercise the single room through forward and reverse scroll progress, continuous lighting and time, diary continuity, native vertical input, view controls and reduced motion. The scene contains one illustration with four SVG layers, 22 fairy bulbs and one painted retriever. Services, portfolio filters and enquiries receive interaction smoke checks. Font metrics, asset references, unchanged artwork, JavaScript syntax and the static build are checked separately.

These checks do not render browser pixels. Visual browser QA was unavailable in this environment. The old scripts/verify-room.mjs only checks the archived 3D prototype and is not evidence about the live painted experience.

## View the room

Select **View the room** to hide the diary while keeping the exact same painting. Drag sideways or diagonally for gentle bounded depth movement; horizontal wheel or Shift+wheel also works. Vertical movement always reads the site. Arrow keys adjust the view when focused; Home resets it, and Escape returns to the diary. There is no full 360° model in this version: the rejected modeled room is no longer loaded, including during scrolling and fullscreen.

Room settings provide the night tint, breeze, retriever greeting, reset and fullscreen. The existing illustration layers supply subtle chair, lamp, flower, dreamcatcher, feather and fairy-light movement. Scrolling gradually darkens the same artwork toward night. The retriever remains the original painted sleeping dog with a small greeting animation; the toy-like articulated model and its walking animation are not used. Reduced motion removes continuous movement and ambient pause freezes the loops.

Original generated assets and prompts remain in [docs/art-direction.md](docs/art-direction.md). Their files are unchanged.

## The diary narrator

The diary is a small side element: 286 × 286px on desktop, 370 × 360px on very large displays and up to 224 × 256px on phones. It stays along the left edge and drifts by no more than seven vertical pixels. It does not cross the window or grow to fill the screen. Entries are deliberately short; the full services and project descriptions remain in the normal page sections.

DM Serif Display provides the diary headings and Inter provides its body copy and controls. Text appears as complete, accessible paragraphs with a brief page fade. Reduced motion removes drift and fades; ambient pause also removes the text fade. View the room hides only the diary; the painting stays the same before, during and after it. The original generated artwork files are unchanged.

## Current typography

Headings use DM Serif Display (regular and italic), paired with Inter regular, medium and semibold for body text and controls. Fonts are served locally as WOFF files and do not depend on Google Fonts connectivity. Licenses are in assets/fonts/DM-SERIF-OFL.txt and assets/fonts/INTER-OFL.txt. The former handwriting font is no longer loaded. Small labels, body line-height and diary title sizes are tuned for the compact layout. The current typography revision was checked using the actual font metrics at 320, 375, 768 and 1440px, local font parsing, deployed asset references and JavaScript syntax. Browser visual QA remains unavailable.

## One continuous visual

The introduction and four diary entries share a single .room-world and .room-illustration inside one sticky scene. There is no second room, slide transition, page-flip animation or chapter-dot navigation. Vertical scroll controls a reversible 6:12–7:21 PM timeline from golden light toward evening. The diary stays small on the left; the full service, work and contact details follow below. Fullscreen and View the room use that same illustration rather than creating another scene.
