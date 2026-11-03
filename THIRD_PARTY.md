# Animation sources and attribution

## Active Next.js application

- Next.js 16.4.3 and React / React DOM 19.3.1; Tailwind CSS / PostCSS integration 4.3.3. MIT licenses.
- Lenis 1.3.27 remains a dependency from earlier versions (MIT). The current anatomical experience preserves native browser scrolling with GSAP ScrollTrigger.
- GSAP / ScrollTrigger 3.15.0, under the GSAP Standard License linked below.
- Three.js 0.187.0 and @react-three/fiber 9.8.2 (MIT), with Drei useGLTF, render the credited BodyParts3D derivative and original world assets/shaders. MIT notices ship at `/licenses/three.txt` and `/licenses/react-three-fiber.txt`.
- Current interface symbols are the local SVG components in `components/Icons.jsx`; Lucide is not used in the current app.
- **Actual React Bits SpotlightCard** is included in `components/react-bits/SpotlightCard.jsx` and its CSS, retrieved from the pinned upstream commit listed below. The full MIT + Commons Clause notice is retained in `licenses/react-bits.txt` and served at `/licenses/react-bits.txt`. It is retained from the earlier card-based design and is not used by the current spatial comic frames; it is not offered as a standalone component service.
- The magnetic controls, tilt, anatomical geometry, custom shader programs, particle field and domain transition are original implementation for this site. The shaders are stylized refraction/scattering approximations, not physically based ray-traced materials.

21st.dev, the four additional website references, and the ThreeUI Notion reference were supplied by the user but could not be visually inspected because the environment proxy denied access. Their code was not copied or represented as inspected.

## Earlier static implementation (retained)

- [Lenis](https://github.com/darkroomengineering/lenis), 1.3.27, darkroom.engineering — MIT. Desktop wheel easing; license included in `vendor/LENIS-LICENSE.txt` in the build.
- [GSAP / ScrollTrigger](https://github.com/greensock/GSAP), 3.15.0, GreenSock — [GSAP Standard License](https://gsap.com/standard-license/). Original license headers remain in both distributed scripts.
- [Vanta](https://github.com/tengbao/vanta), 0.5.24, Teng Bao — MIT. NET atmospheric background; license included in `vendor/VANTA-LICENSE.md`.
- [Three.js](https://github.com/mrdoob/three.js), 0.134.0 — MIT. Vanta-compatible renderer; license included in `vendor/THREE-LICENSE.txt`.
- [React Bits](https://github.com/DavidHDev/react-bits), David Haz — MIT + Commons Clause. SpotlightCard's pointer-local light treatment inspired the simplified vanilla JavaScript/CSS adaptation in `motion.js` and `motion.css`; this site does not install or execute React Bits React components. Source reviewed at commit `4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4`, `src/content/Components/SpotlightCard/SpotlightCard.jsx`. Full license in `licenses/react-bits.txt`, also shipped as `vendor/REACT-BITS-LICENSE.txt`. The adaptation is part of this portfolio, not a standalone component offering.

Pinned package versions and npm integrity hashes are recorded in package-lock.json.
The build serves all scripts from the site's own origin, including lazily requested WebGL libraries. No third-party script CDN is required.

## Anatomical reference scope

The Z-Anatomy open atlas repository (Gauthier Kervyn, Marcin Zielinski and contributors, based on BodyParts3D) was consulted for anatomical terminology: Readme.md and TA2.csv at commit 7b9197672eea2ed44ae238d3cfbf38e39b7586a9. See design/ANATOMY.md. Its atlas content is CC BY-SA 4.0. No Z-Anatomy meshes, Blender archives, dataset extracts, definitions or images are included. The current asset instead derives from the separately licensed BodyParts3D dataset described below.

## Arcade and realm atmosphere

- Framer Motion 14.9.0 (Motion), MIT, is the actual animation runtime for the realm atmosphere and click springs. License is served at `/licenses/framer-motion.txt`.
- The arcade avatar pixel map, world renderer, level/progression engine, terminal puzzle, square burst UI and retro frame styling are original assets/code. No third-party game sprites or artwork were downloaded.
- The grid/beam and warm conic-gradient lamp treatments follow Aceternity UI design patterns but are original code. The official registry at https://ui.aceternity.com/registry/lamp.json and /registry/3d-card.json returned HTTP 403. No Aceternity component source or licensing claim is made. Official source integration requires successful source access.

## Spatial typography (points 15–18)

JetBrains Mono, Syne and Plus Jakarta Sans are Google Fonts, self-hosted from the official google/fonts repository under the SIL Open Font License. Full notices are served at `/licenses/fonts/JetBrainsMono.txt`, `/licenses/fonts/Syne.txt` and `/licenses/fonts/PlusJakartaSans.txt`. Native label textures are generated with those fonts. The DNA, matrix rain, orb shader, vinyl geometry, pixel stickers, pooled sparks and spray particles are original Three.js implementations. The active spatial project layout supersedes the earlier React Bits card presentation; the source and its original license are retained as historical work.

## Imported anatomical GLB (current renderer)

`@react-three/drei` 10.7.9 (MIT), notice at `/licenses/react-three-drei.txt`, supplies `useGLTF` and useProgress. `/models/skeleton.glb` packages authored BodyParts3D 3.0 surfaces from Kevin Mattheus Moerman’s mirror at revision f0eeb6e843380cfe6b83797cf8c3e1af74de5e61. BodyParts3D is © The Database Center for Life Science / Life Science Integrated Database Center (2008), under CC BY-SA 2.1 Japan. The derived GLB retains that license; see `/models/README.md`, `/models/skeleton.provenance.json` and `/licenses/models/BodyParts3D.txt`. Changes: upper-body selection, STL-to-GLB conversion, quadric face reduction, grouping and coordinate normalization; sagittal partition of the authored brain surface and addition of authored ascending aorta and superior vena cava. Visible attribution is in the footer. The former procedural anatomical factory is deleted; previous references to original anatomical geometry describe superseded implementations.

## Current fixed anatomy implementation

The full-screen renderer uses Three.js, React Three Fiber and Drei. Neon material shaders, the particle field and ambient color-field shaders are original code. HTML typography uses the locally hosted fonts described above. Postprocessing packages and the earlier world-flight renderer have been removed; their retained license files document historical use. Lucide has been removed; small original action SVGs replace it. No analytics or delivery service was added.

## Acoustic field

The concentric shell shaders, phase-offset spectral fringes and swirling particle system in `lib/acoustic-field.js` are original code using Three.js. No external audio assets, microphones, acoustic recordings or additional libraries are used.

## Surgical narrative

The scroll-phase controller, laser sheet, abstract energy dagger and heart-vertex light-particle effect are original Three.js code. Brain halves and heart remain the licensed BodyParts3D GLB meshes; no new anatomical assets or libraries were introduced.

## Crystal and botanical accents

`lib/crystal-art.js` contains original low-poly petal surfaces, instanced roses, tubular botanical filigree and diamond-dust shaders. Dust samples the already licensed BodyParts3D derivative at runtime; the anatomical asset and attribution are unchanged. No third-party floral models, textures or HDR files were downloaded.

## Cybernetic lobe HUDs

`lib/lobe-engine.js` and `components/LobeHudPanel.jsx` contain original artistic synaptic paths, core fibers and transparent optical HUD surfaces. Copper surface traces are original procedural GLSL in the existing anatomical material adapter. No atlas, neural tractography dataset, UI library, font or remote texture was added.

## CAD inspection compositor

Task 25 uses EffectComposer, RenderPass, ShaderPass and OutputPass shipped with the already pinned Three.js package under its existing MIT notice. The bounding cage, shader scan, point overlay, marker texture and interaction code are original. No third-party postprocessing package or additional asset was added.

## Code-cloud brain

Task 26's glyph atlas and morph shader are original code, rendered with the already licensed local JetBrains Mono font. Neural targets are sampled from the existing BodyParts3D derivative. No code snippets are executed; no external AI, font, texture or model service is called.

## Graphic-novel worlds

Task 27 uses the existing Three.js MIT components and locally hosted fonts. Cel/ink/halftone shaders, code-city blocks, page hinges, rose petals and speech textures are original. Exploded anatomical plates reuse the credited BodyParts3D derivative. Molecular shapes are illustrative procedural artwork, not externally sourced protein data. Local sandbox tools do not contact an AI, scientific or analytics service.

Task 28's panel-focus paths, spline vortex layout, projected prop controls and orbit interface are original additions using the same pinned Three.js and R3F dependencies. No additional third-party model, library or service was introduced.
