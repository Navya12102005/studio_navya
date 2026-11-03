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
- The authored upper-body GLB is sampled into beveled optical-glass voxel blocks while preserving its cranium, brain, cervical/thoracic spine, ribcage, heart and vascular coordinates. Native document scrolling drives block assembly, cranial focus (0–25%), spinal descent (25–50%), a held heart/energy-blade/pixel-burst transition (50–75%) and three spatial voxel portal anchors. Dragging or touching rotates the assembled anatomy and updates live integrity/orbit telemetry.
- Transparent, depth-tested world-space checkpoint labels plus accessible HTML typography, opacity/blur reveals, project dialogs and working realm tabs.
- Reduced-motion reading layout, pause and Hide 3D controls, loading progress and model-error recovery.
- Optional game demonstration at `/arcade`, separated from the primary portfolio.
- Reviewed email draft form, no server-side sending or database storage; draft Privacy and Terms pages.

See [model provenance](design/ANATOMY.md), [third-party notices](THIRD_PARTY.md) and [publishing instructions](PUBLISHING.md). The earlier world-flight design is historical and superseded. Hardware frame rate and live hosting require independent verification.

`/?reading=1` opens the reading layout. Canvas datasets expose rendering diagnostics, not portfolio achievements.

Task 24 preview branch: `codex/anatomy-task-24-preview`. It adds the #0A0A0C technical blueprint, cranial radar, real scene coordinates and clearly labeled simulated pulse/respiratory monitors. Task 23 remains on `codex/anatomy-flight-preview`; the v22 Git tag is unchanged.

Task 25 preview branch: `codex/anatomy-task-25-preview`. It adds an actual model-bound CAD cage, source-mesh point layers, selectable spatial markers, coordinate leaders and a short ShaderPass scan at chapter boundaries. Task 24 remains unchanged on its own preview branch.

Task 26 preview branch: `codex/anatomy-task-26-preview`. Programming-syntax particles converge onto the authored brain before the laser cut. Brain maps to Tech, spine maps to Bioengineering, and the heart maps to Creative/Non-Tech leadership and Studio Navya. All anatomical glass uses .95 transmission in this master version; earlier task branches preserve their own material settings.

The former comic realms remain recoverable on their dedicated task 27 and task 28 branches, but none of their environments, shaders, controls or destinations are part of the active build. Their clean replacement foundation is preserved on `codex/anatomy-voxel-reset-preview`.

After the heart burst, Realm 01 now continues into a procedural dark-gothic voxel Tech Core. One uninterrupted camera path crosses an obsidian street canyon with lanterns and red foliage, passes the main arch beneath roiling crimson storm layers, then enters a subterranean cavern of lava falls, cyan soul-fire beacons, fungus, particle portals, six roaming bridge entities, a suspended 196-block skeletal dragon and floating command blocks. A dense adaptive GPU ember volume fills the route. The camera banks toward a rotating optical-glass brain rebuilt from the authored GLB cerebral surfaces and wrapped in live redstone synaptic tubes, then descends to six world-space command consoles. Redstone floor circuits and neural points carry time-based pulses. The scene uses local geometry, shaders and generated code textures; it downloads no game assets. Reduced motion retains a readable gateway without starting WebGL flight.
