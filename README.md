# Studio Navya

A warm, minimal digital-services portfolio told through one handwritten diary inside a complete 360° studio. The diary stays with you, drifts between chapters, turns its pages and reveals its ink as you scroll. Separate narration boxes are removed. After the evening story, the diary settles open for the portfolio, service explanations, process, proposals, FAQ and enquiry form. Individual project pages share the same paper and handwriting.

Behind the diary, sunset becomes night, the chair pulls out, a golden retriever wakes and walks, and a breeze moves the curtains, window lights, flowers and woven dreamcatcher. Select Explore 360° to hide the diary and look around.

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
| diary.js / diary.css | The single moving diary, page turns, writing effect and later diary pages |
| assets/fonts/ | Self-hosted Caveat handwriting fonts with the SIL Open Font License |
| assets/scene/ | Three.js room geometry, rendering and reversible scroll choreography |
| assets/vendor/ | Self-hosted Three.js 0.186.1 and its MIT license |
| scripts/verify-room.mjs | Dependency-free geometry and choreography checks |
| main.js | Accessible tabs, filters, menu, journey diagram and enquiries |
| content.js | Shared safe rendering, content validation and draft loading |
| case.html / case.js | Individual project pages |
| editor.html / editor.js / editor.css | Local project and contact editor |
| .openai/hosting.json | Sites identity and static deployment directory |

No package installation or external 3D CDN is required. The Caveat handwriting font is self-hosted under its SIL Open Font License; it does not depend on Google Fonts loading. The browser loads the bundled Three.js ES modules. Serve over HTTP(S) for module loading; opening index.html directly as a file cannot run WebGL modules. Google Fonts are optional; readable Georgia and Arial fallbacks are supplied. Motion respects prefers-reduced-motion, uses native scrolling without trapping input, and degrades to readable static content. The silk image is retained from the original repository.

## Build and host

Run node scripts/build.mjs from the repository root. It copies public HTML, CSS, JavaScript and assets to dist/. Host dist/ with any static host, or use the Sites workflow. Rebuild after content changes. Root files also work on GitHub Pages; enable Pages for the desired branch and root directory.

## Verification

Run `node scripts/verify-room.mjs` for 10 checks of the complete room, finite geometry, opening composition, lighting changes, chair movement, retriever motion and floor clearance, breeze, reversibility and reduced motion. An additional 26 DOM-based checks cover services, keyboard tabs, portfolio filters, cases, enquiries, menu, local editing, draft isolation, unsafe content, 360° inputs, room settings, native vertical scrolling story progress, single-diary continuity and content inside the diary pages.

These checks do not render WebGL pixels. Desktop/mobile appearance, GPU performance and exact animation timing still require a visual browser pass; the supported browser QA capability was unavailable in this environment.

## Explore the room

Select **Explore 360°** to hide the diary and enjoy the room. Drag sideways to turn without a yaw limit; drag diagonally to look up or down. Horizontal wheel or Shift+wheel also turns. Vertical wheel movement always keeps reading the site. On touch devices, swipe horizontally to turn and vertically to read. Arrow keys turn when the room is focused; Home or **Reset view** resets it. Escape returns to the words. The story includes direct view buttons for the desk, reading corner, doorway and library.

**Room settings** holds night, breeze, greeting, reset and fullscreen controls. The story itself automatically pulls the chair out, opens the casements, changes the sky, switches on the fairy lights and lamps, and takes the articulated golden retriever from resting to standing and walking. Scroll backward to rewind those actions. Ambient pause freezes continuous swaying and breathing; scroll-driven actions remain available. Reduced motion uses discrete scene poses and no ambient movement.

The room has four furnished sides, a floor and ceiling, modeled furniture and an articulated stylized retriever. It is a warm, crafted 3D illustration, not a photographic room or a walkable game. Lighting and geometric edges render at native 3840 × 2160 on a 4K display; high-DPI rendering is capped at approximately 8.3 million pixels. Material textures use modest resolutions for performance. One WebGL context follows the visible room; it does not draw while reading later sections. A still illustration remains available when WebGL is unsupported.

Original generated artwork is retained for the fallback view, About and contact backgrounds. Prompts and asset dimensions remain in [docs/art-direction.md](docs/art-direction.md). The live 3D room, dog, woven threads, feathers, flowers and material textures are native geometry/code.

## The diary narrator

One diary DOM object stays fixed through the introduction and four story chapters, so it does not jump between section containers. Its position and gentle rotation follow scroll progress. Its pages change with the chapter and the handwriting appears letter by letter. Screen readers receive complete text, while the visual letters are hidden from the accessibility tree. Reduced motion shows all writing immediately and disables page flips and drift; ambient pause shows the full writing too. At the end of the story, the floating diary fades as the later paper pages enter view. The services, portfolio and enquiry controls keep their existing functionality inside those pages. Room controls and navigation retain clear compact UI labels.
