# Navya Gupta portfolio

Next.js App Router portfolio with a real, licensed BodyParts3D GLB behind transparent editorial HTML.

## Run

```sh
npm ci --ignore-scripts
npm run build
npm start -- --port 3000
```

`npm test` runs production browser checks on port 3100 using `/usr/bin/chromium`.

## Current experience

- Full-screen fixed R3F Canvas, centered upper-body GLB loaded through Drei useGLTF and Suspense.
- Physical glass materials, cyan/violet cranial lighting and pink/amber chest lighting, with scroll-interpolated emissive shaders and real 3D particles.
- Native document scrolling drives a modest camera orbit and vertical movement through GSAP ScrollTrigger.
- Transparent HTML typography above the canvas, opacity/blur chapter reveals, keyboard-accessible project dialogs and working realm tabs.
- Reduced-motion reading layout, pause and Hide 3D controls, loading progress and model-error recovery.
- Optional game demonstration at `/arcade`, separated from the primary portfolio.
- Reviewed email draft form, no server-side sending or database storage; draft Privacy and Terms pages.

See [model provenance](design/ANATOMY.md), [third-party notices](THIRD_PARTY.md) and [publishing instructions](PUBLISHING.md). The earlier world-flight design is historical and superseded. Hardware frame rate and live hosting require independent verification.

`/?reading=1` opens the reading layout. Canvas datasets expose rendering diagnostics, not portfolio achievements.
