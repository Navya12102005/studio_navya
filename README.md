# Navya Gupta portfolio

Next.js App Router portfolio with an authored BodyParts3D GLB, native world-space typography and a scroll-driven 3D flight between research and creative project galleries.

## Run

```sh
npm ci --ignore-scripts
npm run build
npm start -- --port 3000
```

`npm run dev -- --port 3000` starts development. `npm test` runs browser checks against production on port 3100 using `/usr/bin/chromium`.

## Current experience

- One fixed R3F scene; Catmull-Rom camera/focus curves driven by native browser scrolling and GSAP.
- Actual GLB anatomy through Drei useGLTF, Suspense loading and exact crystal material overrides.
- Local-font, depth-tested SDF text for headings, projects and telemetry.
- Separate spatial Bio-Tech and Studio galleries with an architectural portal.
- Restrained bloom/chromatic transition effects; charcoal and muted materials.
- Readable HTML mode, reduced-motion fallback, keyboard controls, model-error recovery and native project dialogs.
- A reviewed email draft form; no server-side sending or database storage.
- Draft Privacy and Terms pages based on the implemented data practices.

See [WORLD-FLIGHT.md](design/WORLD-FLIGHT.md), [model provenance](design/ANATOMY.md), [third-party notices](THIRD_PARTY.md) and [publishing instructions](PUBLISHING.md).

The latest visual brief supersedes earlier neon, orb, matrix-rain, sticker and decorative hover implementations. Old static source files and unused animation components are historical cleanup candidates. Hardware rendering and deployment success require verification beyond local software-browser tests.

`/?reading=1` opens the normal reading layout. `/?profile=1` exposes camera, scene, text, postprocessing and model diagnostics on the canvas dataset. Diagnostic values are not portfolio achievements.
