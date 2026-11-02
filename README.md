# Navya Gupta — The science of possibility

A Next.js App Router portfolio connecting bioengineering, technology, leadership and creative strategy. The current visual direction is a full-screen botanical glass-anatomy installation followed by two open, container-free 3D realms.

## Run locally

```bash
npm ci
npm run build
npm start -- --port 3000
```

For development, use `npm run dev -- --port 3000`. The server binds to `0.0.0.0`; a local address is not automatically a public preview URL. Vercel uses the checked-in Next.js configuration. Publishing a Git branch alone does not verify a successful hosting deployment.

## Current design: points 15–18

- **Typography:** self-hosted Google Fonts JetBrains Mono, Syne and Plus Jakarta Sans, with local licenses. No runtime font CDN request.
- **Open editorial layout:** transparent, borderless project articles, unboxed tags and telemetry, soft radial readability masks and scroll-colored pull-quotes. The earlier bento/OS card styling is superseded.
- **Spatial anatomy:** fixed body-level R3F canvas, original upper-body glass meshes, beating heart, glowing vessels, botanical details and native 3D text markers. No flat anatomy image or SVG skeleton fallback.
- **Helical camera:** a full reversible 360° turn around the spinal axis with descending height, tightening radius and a final heart-core approach. GSAP `scrub: 1.2`, Lenis and delta-time camera damping drive the motion.
- **Bio-Tech Lab:** instanced voxel DNA, a faceted bio-cell, matrix pixel streams with pointer-repulsion physics, open CRT calibration arcs, spatial typography and electric click sparks.
- **Creative Studio:** a displaced chromatic glass orb, spinning neon vinyl grooves, pixel stickers in depth, pink/amber spray particles and two-frame header glitches.
- **Continuity:** anatomy, ambient shaders and both realms use one R3F canvas. Realm lighting and shader opacity ease between palettes.
- **Existing interactions:** the two-level arcade, discovery badges, terminal puzzle, native project dialogs and reviewed email draft flow remain usable.

See [the point-by-point implementation guide](design/SPATIAL-REALMS.md), [anatomical scope](design/ANATOMY.md) and [third-party notices](THIRD_PARTY.md). Geometry is original artistic work, not a clinically validated atlas model. Portfolio descriptions distinguish research context, working demonstrations, leadership and concepts; decorative telemetry never invents professional or scientific results.

## Important source files

| File | Responsibility |
| --- | --- |
| `components/FullCanvasAnatomy.jsx` | R3F lifecycle, camera, scene handoff, projected markers and diagnostics |
| `lib/spatial.js` | Reversible helix math and transient visual state |
| `lib/volumetric-anatomy.js` | Upper-body meshes, glass materials, botanical fibers and heartbeat |
| `lib/realm-world.js` | Realm assets, shaders, native text billboards, matrix physics and pooled click VFX |
| `components/Domains.jsx` | Accessible realm tabs, open project articles, telemetry and native dialogs |
| `components/SpatialEditorial.jsx` | Gradient quotes, micro-telemetry and matching HTML milestones |
| `app/spatial.css` | Typography, open spatial layout, vignettes, glitch styling and responsive behavior |

## Accessibility and performance

System reduced motion and the pause control unmount heavy canvases while preserving normal HTML chapters, projects and controls. Native dialogs retain focus trapping, Escape dismissal and focus return. All project content remains readable without WebGL; the initial portfolio is server-rendered.

The renderer uses instancing, merged geometries, hidden inactive groups, bounded particle pools, adaptive pixel ratio, lower-density software geometry and a smaller software transmission buffer. It suspends drawing for hidden tabs, offscreen scenes and modal dialogs. Resource and event cleanup is explicit.

Open `/?profile=1` for canvas datasets and `anatomy:performance` events. Software-Chromium measurements do not establish a hardware-backed 60 fps result. Hardware appearance and sustained frame rate need a physical-device check.

## Validation

```bash
npm test
```

Playwright starts the production build on port 3100 and uses `/usr/bin/chromium`. On another machine, install a Playwright browser and adjust `playwright.config.mjs`. The suite covers the helix, real shaders, world markers, local fonts, box-free layout, responsive widths, cursor/click effects, both realms, keyboard navigation, reduced motion, WebGL failure, project dialogs, contact drafts and the arcade. No tests send real messages.

## Contact and historical files

The form prepares an email draft; it does not send or store a message on a backend. See [CONTACT_SETUP.md](CONTACT_SETUP.md) for delivery context. Earlier static HTML, scripts and source components remain as historical work; `app/`, `components/`, `lib/` and `public/` form the active Next.js application.
