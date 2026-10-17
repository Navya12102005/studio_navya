# Studio Navya

A warm illustrated portfolio set in a creative studio at sunset. A four-scene scroll story follows an idea arriving, a notebook opening, words finding their audience and an invitation to begin. The room includes a sleeping golden retriever, books, a wine glass, a gently swaying dreamcatcher and lamplight. Services, portfolio editing and enquiries remain directly accessible.

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
| motion.css / motion.js | Four-scene camera, word reveals, notebook, letters, flying notes and plane |
| room.js | Layered room illustration, golden retriever, lamp and greeting controls |
| main.js | Accessible tabs, filters, menu, journey diagram and enquiries |
| content.js | Shared safe rendering, content validation and draft loading |
| case.html / case.js | Individual project pages |
| editor.html / editor.js / editor.css | Local project and contact editor |
| .openai/hosting.json | Sites identity and static deployment directory |

No runtime package dependencies are required. Google Fonts are optional; readable Georgia and Arial fallbacks are supplied. Motion respects prefers-reduced-motion, uses native scrolling without trapping input, and degrades to readable static content. The silk image is retained from the original repository.

## Build and host

Run node scripts/build.mjs from the repository root. It copies public HTML, CSS, JavaScript and assets to dist/. Host dist/ with any static host, or use the Sites workflow. Rebuild after content changes. Root files also work on GitHub Pages; enable Pages for the desired branch and root directory.

## Verification

JavaScript syntax and local links/assets are checked. Twenty-six DOM-based functional checks cover services, keyboard selection, portfolio filters, case studies, missing projects, enquiry preparation, menu state, local editing, draft isolation, unsafe input and four-scene motion state, room controls, the golden retriever layer, fairy lights, layered props, explore mode, horizontal/diagonal camera input, native vertical scrolling, pointer/keyboard input, ambient pause and reduced-motion state. These checks do not render layout. Desktop/mobile appearance and animation timing still require a visual browser pass; the supported browser QA capability was unavailable in this environment.

Artwork files and exact generation prompts are recorded in [docs/art-direction.md](docs/art-direction.md). The built-in image generation tool created the room and the transparent retriever layer. The website uses optimized WebP versions.

## Explore the room

Select **Explore the room** to hide the opening text and enjoy the illustrated depth scene. Drag horizontally or diagonally to look around; horizontal wheel or Shift+wheel also works. Vertical wheel movement keeps reading the site. Arrow keys look around when the view has focus; Home or **Reset view** returns to the starting angle. Escape leaves explore mode. **Let the breeze in** opens the casements and increases the movement of flowers and the woven dreamcatcher. Fullscreen depends on browser support.

The scene is a layered CSS 3D diorama with a bounded camera, not a full walkable 3D model. A large-screen layout supports 4K displays; artwork textures retain their original generated dimensions.
