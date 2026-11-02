# Navya Gupta — The science of possibility

A Next.js App Router portfolio at the intersection of bioengineering, technology, creative strategy, marketing and PR. Obsidian surfaces, editorial typography, a procedural anatomical installation, and two connected portfolio domains.

## Run

Node.js 20.9+ is required (the cloud environment provides Node 24).

```sh
npm ci --ignore-scripts
npm run dev
```

For the exact production experience:

```sh
npm run build
npm start
```

The build uses Next.js's supported Webpack backend because this cloud environment blocks the local socket used by Turbopack's CSS worker. No external fonts, models, textures, CDN scripts or API credentials are required. The existing WebP artwork provides a static anatomy fallback.

## Experience

- **Opening:** a same-canvas cosmic warp converges onto sampled anatomical vertices. First scroll/click accelerates it, Skip and Escape dismiss it, and it runs only once per tab session. Sound is opt-in, follows warp acceleration and fades away on completion; it is suspended when the page is hidden. Reduced motion bypasses the intro.
- **Anatomical journey:** Three.js upper-body wireframe, distinct cool/warm brain hemispheres, cervical/thoracic vertebrae, ribcage and pulsing heart core. Custom GLSL shaders create Fresnel glow, refractive bands, a backlit scattering approximation and flowing emitted particles. These are artistic approximations, not a physically simulated subsurface material or clinical anatomical model.
- **Camera:** GSAP ScrollTrigger synchronises a reversible whole-body → brain → spine → heart journey. Three labelled anatomy controls jump to the same scroll positions. Cursor movement subtly changes perspective. The upper body orbits continuously; the final camera approaches the cardiac core along the Z axis.
- **Scrolling:** the maintained `lenis/react` ReactLenis integration, synchronised to the GSAP ticker. The specifically mentioned `@studio-freight/react-lenis` package is retired and declares React 17/18 peers; `lenis/react` is its maintained React-19-compatible successor. Touch scrolling stays native.
- **Tech & Bioengineering:** a glass bento grid for research context, a molecular docking workflow exploration, an working synthetic-data Python pipeline and reporting concept and this working technical build.
- **Creative, PR & Strategy:** a staggered editorial grid covering Startup Club leadership, AWS Student Builder operations, Studio Navya and an independent founder-voice concept, Sound Check logistics direction and campus-summit PR direction.
- **Interactions:** actual upstream React Bits SpotlightCard, GSAP card tilt, magnetic controls, domain transition wipe, holographic tags and an additive interactive dot/ring cursor.
- **Accessibility:** labelled tabs with arrow-key navigation, native modal focus containment and Escape handling, visible keyboard focus, a skip link, native form validation, pause control and live system reduced-motion updates.
- **Fallbacks:** reduced motion unmounts both canvases, removes smooth-scroll tracking and uses a shorter static chapter layout. Offscreen or hidden-tab anatomy stops drawing. WebGL failure retains existing artwork. No JavaScript still provides server-rendered introduction, tech card summaries, personal context and direct email contact.

## Content and email

Edit `lib/projects.js` for project/leadership cards, `app/page.jsx` for personal context and `components/SiteChrome.jsx` for contact details. Leadership roles come from the user's brief. Research context, workflow studies and concepts are labelled with their scope; no invented client metrics or validated scientific outcomes are claimed.

The contact form prepares a reviewable draft for `hello@studionavya.com`. It does not send email or claim delivery. The visitor chooses to open their mail app or copy the draft. There is no server-side inbox integration or credential requirement.

## Verify

```sh
npm run build
npm test
```

Playwright starts the production application on port 3100. Tests use environment-provided `/usr/bin/chromium`; elsewhere install Chromium with Playwright and adjust `playwright.config.mjs`'s executable path. Fourteen browser tests cover actual GLSL rendering, camera descent/reversal, Lenis, real React Bits, hover depth/cursor, domain switching, native dialog/focus return, live pause/reduced motion, seven viewport widths, native touch scrolling, email drafts, clipboard failure, WebGL failure, server-rendered content and 404s. Tests never send real messages.

## Publish

See [PUBLISHING.md](PUBLISHING.md). Vercel and Netlify settings now target Next.js, not the former static `dist` site. Workspace changes are not automatically pushed or deployed.

## Sources

See [THIRD_PARTY.md](THIRD_PARTY.md) and [design/VISION.md](design/VISION.md). The supplied neuron/heart recordings informed the visual direction. The additional website and ThreeUI Notion references returned network-policy denials and were not visually inspected. Older static files and scripts are retained as legacy work; `app/`, `components/`, `lib/` and `public/` are the active application.

## Cyber-organic layer and model mapping

The upper-body model has C1–C7, T1–T12, twelve rib pairs (seven direct, three costal-margin, two floating), a cranial vault, shoulders, asymmetric ventricular core and branching upper-body vessels. No pelvis, lumbar/lower-body model or legs are generated. See [design/ANATOMY.md](design/ANATOMY.md) for reference scope and limitations.

A bounded recursive canopy creates curved bioluminescent floral fibers with instanced quartz-like tips. Rotating lipid-bilayer and ligand nodes are actually raycastable and open molecular workflow highlights; keyboard buttons provide the same action. Vascular picking opens the operational-leadership highlight. Brain/heart controls also change domain.

The diagnostic HUD includes scan grids, waveform studies and actual scroll progress. Card coordinate frames and pointer scan percentages are decorative interface telemetry, not biological measurements or optimization results. Thin-film organ/crystal shaders, stained-glass card films, orbit-linked prism projections and regional cool/warm light reinforce the two domains.

## Performance evidence

The scene is lazy loaded, with shader/vertex-color curve batching, instanced atoms/crystals, bounded recursion/particles, pixel-ratio caps, adaptive resolution and offscreen/hidden-tab drawing suspension. A profiled software-Chromium run measured 19 draw calls, about 6,000 triangles, 24 geometries and approximately 30 fps at 0.65 pixel ratio. This is not a 60 fps claim for physical devices; a hardware GPU benchmark is still needed. Use `/?profile=1` and listen for `anatomy:performance` events, or inspect the anatomy canvas's `data-profile`, to measure the active renderer.

The Python demonstration is downloadable from the data project. Run `python3 public/studies/analysis_pipeline.py`; it reports four accepted synthetic records, three rejections and an exact-decimal total of 3600.00, with explicit synthetic-data provenance.

## Playable arcade and shared realms

`components/ArcadeWorld.jsx`, `components/arcade-renderer.js` and `lib/arcade.js` add an original two-level pixel-art chapter. Scroll moves a custom engineer sprite through the Bio-Tech Lab and Creative Design Studio, with reversible platform jumps, server/code/DNA props, drafting tables and brand boards. The low-resolution canvas is only mounted near this section, draws at a deliberately retro cadence, and stops drawing when hidden, paused or covered by a project dialog. Reduced motion uses server-rendered SVG art and explicit level controls.

Four collectible ideas drive discovery energy (visitor exploration, never a professional completion statistic). Project terminals open the existing real portfolio dialogs. A command prompt supports help, lab, studio, projects, achievements, contact and reset; an Observe → Connect → Create puzzle unlocks a contact link. No projects or contact options are gated by gameplay. Skipping the chapter via anchor navigation does not earn automatic collectibles.

The game and portfolio tabs share a realm state. Cyan/violet lab lighting accompanies research, Python/code and HUD-framed cards. Pink/amber studio lighting accompanies serif editorial typography, leadership, events, PR and retro-windowed cards. The top pixel meter tracks actual document scroll, with a micro-avatar indicator. Clicks produce at most 64 transient square particles and actual Framer Motion spring feedback; keyboard activation uses the target's centre and reduced motion suppresses both effects.

`components/RealmAtmosphere.jsx` uses Framer Motion 14.9.0 for geometric grid/beams and a warm opposed-conic lamp composition. These are **original Aceternity-style implementations**, not imported Aceternity registry components: the official registry returned HTTP 403 and the guessed upstream repository did not exist. `ui.aceternity.com` was added to the cloud network draft for later source inspection. This save does not apply access or publish. Framer Motion and the actual React Bits component are installed; official Aceternity source integration remains unverified.

The four additional arcade browser checks exercise avatar jumps, reversal, collections, realm synchronization, terminal commands and sequence puzzle, real project/contact routes, OS frames, spring/burst UI, lamp styling, mobile fit and reduced-motion controls. Screenshots are written to /tmp/navya-arcade-lab.png, /tmp/navya-arcade-studio.png and /tmp/navya-arcade-mobile.png.
