# Spatial portfolio — points 15–18

## 15. Type, telemetry and editorial voice

Google's JetBrains Mono, Syne and Plus Jakarta Sans variable fonts are vendored from the official `google/fonts` repository and loaded through `next/font/local`. JetBrains Mono is used for status, coordinates, chapter metadata, tags and diagnostic labels; Syne supplies editorial headings; Plus Jakarta Sans supplies readable body copy. Fonts and their SIL Open Font Licenses ship with the application. No Google Fonts request is needed when a visitor opens the site, and builds do not depend on the Google Fonts CDN.

Project micro-telemetry shows `[STATUS: ACTIVE]`, a node index, normalized pointer coordinates and the project's actual viewport depth. These are interface readings, not scientific measurements or invented portfolio results. Pointer writes are throttled; the underlying scene receives continuous pointer position.

`SpatialQuote` uses a scoped GSAP ScrollTrigger and `scrub: 1.2` to interpolate gradient text from cyan/lilac to rose/amber. Normal blockquote/figcaption semantics remain available to assistive technology and without WebGL.

## 16. Open spatial typography

The active project renderer no longer mounts SpotlightCard, bordered bento cards, rectangular window bars, card artwork panels or tilt containers. Projects are open editorial articles with alternating spatial placement. Their titles, descriptions, tags and telemetry have transparent backgrounds and no borders. This supersedes the earlier glass-card and retro-window presentation.

The hero, chapter text, diagnostic readouts, project details, email preview, arcade text controls and terminal also lose their solid/bordered rectangular content frames. Forms retain recognizable underlines, dialogs retain native focus trapping, and the arcade retains its playable canvas. Project details are an open full-screen editorial view, rather than a framed card.

Readability comes from text shadows, bright type and blurred radial vignettes behind content. These are soft light fields without rectangular boundaries. Long descriptions remain in normal document flow so they do not collide, clip or disappear when fonts resize or JavaScript/WebGL is unavailable.

`createSpatialLabel` creates actual world-space Three.js plane meshes with locally rendered font textures. Cranial, spinal, cardiac and active project labels plus a live coordinate HUD are billboarded toward the camera. The matching chapter HTML markers use the world-to-camera projection, hide outside the view frustum and expose their true world positions for diagnostics. Active project articles receive restrained parallax from a projected 3D anchor; their semantic HTML remains readable independently of the canvas. These are texture-backed 3D labels, not extruded text geometry.

`createAmbientField` renders a full-screen GLSL light field before the anatomy/realm pass. Cyan/indigo transitions toward rose/amber with anatomical depth, then blends toward the selected realm. Frame-rate-independent damping avoids abrupt color cuts. Local anatomical point lights also respond to the scroll palette. Bloom here is a shader-generated soft light field; it is not a screen-wide postprocessing blur pass.

## 17. One-turn helical journey

`sampleHelix` defines the reversible path around the spinal Y axis. The opening establishes the full upper body, then reaches the cranial focus before descending. Orbit goes from 0 to exactly 2π; elevation descends toward the heart; radius tightens from the establishing view to 0.14 scene units on desktop or 0.20 on mobile. The final target is the beating heart's actual transformed world position.

GSAP animates the progress ref with `scrub: 1.2`; R3F applies delta-time damping to the camera sample. This differs from copying raw ScrollTrigger progress, which bypasses scrub interpolation. Pointer movement adds a small perspective adjustment that fades away at the core. There is no motion-blur pass.

The anatomy keeps its own subtle idle orbit. Chapter controls navigate to points on the same continuous path. Reverse scrolling follows the same mathematical path. At the work transition the camera pulls back, the anatomical group recedes into depth and the realm scene emerges in the same canvas/context.

## 18. Two procedural realm environments

### Bio-Tech Lab

- Instanced voxel DNA: two helical strands and cross-links, with time-based vertex displacement and cyan/violet glow shader.
- Faceted bio-cell and open CRT calibration arcs.
- Square point-sprite matrix streams with deterministic seeds.
- Persistent per-particle velocity, radial pointer repulsion, damping and return-to-stream forces; this is geometry movement, not a CSS hover glow.
- Native 3D project labels and live JetBrains Mono coordinate telemetry.
- Clicks emit cyan/violet square electric sparks and a short point-light flash.

### Creative Studio

- Procedural low-poly liquid-glass orb with time-displaced vertices.
- Fragment shading samples displaced channels separately to create chromatic separation and interference bands.
- Rotating neon vinyl grooves in 3D.
- Pixel-art sticker planes at several depths, with nearest-neighbor texture sampling and independent rotation.
- Clicks emit pink/amber spray particles with downward acceleration and a pink point-light flash.
- Syne project headers get a two-frame RGB split on hover or keyboard focus; reduced motion bypasses it.

The realm switch preserves accessible tab semantics and arrow-key navigation. Scene opacity and palette ease between realms instead of cutting canvases. Project dialogs retain Escape dismissal and focus return.

## Lifecycle and performance boundaries

One R3F canvas handles anatomy, cosmic intro, ambient shader and both realms. Inactive realm groups are hidden. Shared geometries and instancing limit draw calls. Click bursts use a fixed pool of 192 slots; click activity cannot add unlimited particles, geometries or lights. Matrix streams have 300 software / 850 hardware particles. Stickers and textures are original generated assets.

R3F's DPR is controlled by React state so a parent render cannot silently undo an adaptive reduction. Software rendering starts at 0.5 pixel ratio, may reduce to 0.35, and uses a quarter-size transmission buffer. Hardware starts at 1.25 pixel ratio with adaptive reduction. Reduced motion and the pause control unmount heavy canvases and retain the open HTML portfolio. Visibility, offscreen sections and modal dialogs suspend the animation loop. Geometry, material, texture, event and ScrollTrigger cleanup is explicit.

No physical-device frame-rate guarantee is made. Shader correctness, functional transitions and geometry budgets can be checked in software Chromium; hardware visual quality and sustained frame rate require a device check.

## Review and diagnostics

Open `/?profile=1` to expose camera angle/radius/elevation, realm blend, palette warmth, native label names, particle pool information and frame/geometry samples on the canvas dataset. These diagnostics are not product copy or portfolio achievements.

Browser tests cover the exact full-turn path, live scroll traversal, local font loading, transparent/borderless typography, seven viewport widths, actual cursor/click inputs, both realm shaders, world-label projection, gradient quote progress, keyboard navigation, pause/reduced motion, native dialogs, no-WebGL content, the email draft flow and the existing arcade.

Final validation for this revision: `npm run build` succeeded and all 19 Playwright checks passed. The sampled software-Chromium anatomical scene measured about 4.73 fps at 0.5 pixel ratio, with 38 draw calls, 35,342 submitted triangles, 38 resident geometries and zero line primitives. This is software-renderer evidence, not a hardware performance guarantee. Both realm screenshots were inspected, and the live tests exercised their actual shaders, coordinate updates, particle repulsion and click effects.
