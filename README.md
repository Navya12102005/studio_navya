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
- Physical crystal optics (transmission .95, roughness .08, clearcoat 1/.1, IOR 1.52, thickness 1.2), colored rim lighting and a higher-resolution local reflection environment.
- Brain-specific .92 transmission, cyan synaptic pulse paths, violet/pink internal lights, copper circuit traces and world-anchored transparent glass HUDs with mouse parallax.
- Authored-surface diamond dust, three instanced glass roses and pulsing pink/amber botanical filigree inside the thorax.
- Acoustic brain/heart shells use chromatic sine-wave shaders and vortex particles; GSAP scroll velocity compresses the rings and increases their speed, then relaxes to a heartbeat-modulated idle.
- Native document scrolling drives cranial arrival/splitting (0–25%), spinal descent (25–50%), a held heart/energy-blade/light-burst transition (50–75%) and the final 360-degree domain gateway. All phases reverse with scrolling.
- Transparent, depth-tested world-space checkpoint labels plus accessible HTML typography, opacity/blur reveals, project dialogs and working realm tabs.
- Reduced-motion reading layout, pause and Hide 3D controls, loading progress and model-error recovery.
- Optional game demonstration at `/arcade`, separated from the primary portfolio.
- Reviewed email draft form, no server-side sending or database storage; draft Privacy and Terms pages.

See [model provenance](design/ANATOMY.md), [third-party notices](THIRD_PARTY.md) and [publishing instructions](PUBLISHING.md). The earlier world-flight design is historical and superseded. Hardware frame rate and live hosting require independent verification.

`/?reading=1` opens the reading layout. Canvas datasets expose rendering diagnostics, not portfolio achievements.

Task 24 preview branch: `codex/anatomy-task-24-preview`. It adds the #0A0A0C technical blueprint, cranial radar, real scene coordinates and clearly labeled simulated pulse/respiratory monitors. Task 23 remains on `codex/anatomy-flight-preview`; the v22 Git tag is unchanged.

Task 25 preview branch: `codex/anatomy-task-25-preview`. It adds an actual model-bound CAD cage, source-mesh point layers, selectable spatial markers, coordinate leaders and a short ShaderPass scan at chapter boundaries. Task 24 remains unchanged on its own preview branch.
