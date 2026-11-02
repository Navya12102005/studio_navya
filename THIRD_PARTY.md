# Animation sources and attribution

## Active Next.js application

- Next.js 16.4.3 and React / React DOM 19.3.1; Tailwind CSS / PostCSS integration 4.3.3. MIT licenses.
- `lenis/react` from Lenis 1.3.27 provides ReactLenis, the maintained successor to the React-17/18-only `@studio-freight/react-lenis` package. MIT.
- GSAP / ScrollTrigger 3.15.0, under the GSAP Standard License linked below.
- Three.js 0.187.0 and @react-three/fiber 9.8.2 (MIT) render locally generated anatomical curves and original GLSL shader effects; MIT notices shipped at `/licenses/three.txt` and `/licenses/react-three-fiber.txt`.
- Lucide React supplies the interface icons, under the ISC license.
- **Actual React Bits SpotlightCard** is included in `components/react-bits/SpotlightCard.jsx` and its CSS, retrieved from the pinned upstream commit listed below. The full MIT + Commons Clause notice is retained in `licenses/react-bits.txt` and served at `/licenses/react-bits.txt`. It is integrated into this portfolio; it is not offered as a standalone component service.
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

`@react-three/drei` 10.7.9 (MIT), notice at `/licenses/react-three-drei.txt`, supplies `useGLTF` and useProgress. `/models/skeleton.glb` packages authored BodyParts3D 3.0 surfaces from Kevin Mattheus Moerman’s mirror at revision f0eeb6e843380cfe6b83797cf8c3e1af74de5e61. BodyParts3D is © The Database Center for Life Science / Life Science Integrated Database Center (2008), under CC BY-SA 2.1 Japan. The derived GLB retains that license; see `/models/README.md`, `/models/skeleton.provenance.json` and `/licenses/models/BodyParts3D.txt`. Changes: upper-body selection, STL-to-GLB conversion, quadric face reduction, grouping and coordinate normalization. Visible attribution is in the footer. The former procedural anatomical factory is deleted; previous references to original anatomical geometry describe superseded implementations.

## Current fixed anatomy implementation

The full-screen renderer uses Three.js, React Three Fiber and Drei. Neon material shaders, the particle field and ambient color-field shaders are original code. HTML typography uses the locally hosted fonts described above. Postprocessing packages and the earlier world-flight renderer have been removed; their retained license files document historical use. Lucide has been removed; small original action SVGs replace it. No analytics or delivery service was added.
