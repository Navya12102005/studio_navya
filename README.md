# Studio Navya

A warm digital-services portfolio set in the same original illustrated sunset room throughout the opening, scrolling story and room-view mode. A small handwritten diary stays at the left edge. Existing painted layers provide the fairy lights, woven dreamcatcher, flowers, furniture and golden retriever. Scrolling changes the evening tint and diary entries; it never replaces the painting with the modeled prototype.

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
| motion.css / motion.js | Story progress, floating text, word reveals and ambient pause |
| room.js | Full 360° input, room settings, explore, keyboard and fullscreen controls |
| living-room.css | Room controls and responsive 3D presentation |
| diary.js / diary.css | Small side diary, short handwritten entries and page turns |
| hero-art.js | Original illustrated room layers, fairy lights, flowers and retriever |
| assets/fonts/ | Self-hosted Caveat handwriting fonts with the SIL Open Font License |
| assets/scene/ | Archived modeled prototype; not loaded by the live page |
| assets/vendor/ | Archived prototype dependency and MIT license; not loaded by the live page |
| scripts/verify-room.mjs | Dependency-free geometry and choreography checks |
| main.js | Accessible tabs, filters, menu, journey diagram and enquiries |
| content.js | Shared safe rendering, content validation and draft loading |
| case.html / case.js | Individual project pages |
| editor.html / editor.js / editor.css | Local project and contact editor |
| .openai/hosting.json | Sites identity and static deployment directory |

No package installation or external 3D CDN is required. The Caveat handwriting font is self-hosted under its SIL Open Font License; it does not depend on Google Fonts loading. The live page uses ordinary JavaScript and SVG image layers. The modeled-room modules remain archived in source but are not referenced, preloaded, published or executed by the website. Google Fonts are optional; readable Georgia and Arial fallbacks are supplied. Motion respects prefers-reduced-motion, uses native scrolling without trapping input, and degrades to readable static content. The silk image is retained from the original repository.

## Build and host

Run node scripts/build.mjs from the repository root. It copies public HTML, CSS, JavaScript and assets to dist/. Host dist/ with any static host, or use the Sites workflow. Rebuild after content changes. Root files also work on GitHub Pages; enable Pages for the desired branch and root directory.

## Verification

Twenty-six DOM-based checks cover services, portfolio filters, cases, enquiries, local editing, accessibility, native vertical scrolling, bounded painted-room movement, diary continuity and the restored editorial layout. Both scenes are checked against the same five artwork URLs, with eight illustrated layers and no modeled-renderer entry point. Syntax, local references and build assets are checked separately.

These checks do not render browser pixels. Visual browser QA was unavailable in this environment. The old scripts/verify-room.mjs only checks the archived 3D prototype and is not evidence about the live painted experience.

## View the room

Select **View the room** to hide the diary while keeping the exact same painting. Drag sideways or diagonally for gentle bounded depth movement; horizontal wheel or Shift+wheel also works. Vertical movement always reads the site. Arrow keys adjust the view when focused; Home resets it, and Escape returns to the diary. There is no full 360° model in this version: the rejected modeled room is no longer loaded, including during scrolling and fullscreen.

Room settings provide the night tint, breeze, retriever greeting, reset and fullscreen. The existing illustration layers supply subtle chair, lamp, flower, dreamcatcher, feather and fairy-light movement. Scrolling gradually darkens the same artwork toward night. The retriever remains the original painted sleeping dog with a small greeting animation; the toy-like articulated model and its walking animation are not used. Reduced motion removes continuous movement and ambient pause freezes the loops.

Original generated assets and prompts remain in [docs/art-direction.md](docs/art-direction.md). Their files are unchanged.

## The diary narrator

The diary is a small side element: 286 × 286px on desktop, 370 × 360px on very large displays and up to 224 × 256px on phones. It stays along the left edge and drifts by no more than seven vertical pixels. It does not cross the window or grow to fill the screen. Entries are deliberately short; the full services and project descriptions remain in the normal page sections.

Handwriting is self-hosted. Visual ink appears letter by letter; screen readers receive complete text. Reduced motion removes drift, flips and writing animation. Ambient pause shows the full writing immediately. View the room hides only the diary; the painting stays the same before, during and after it. The original generated artwork files are unchanged.
