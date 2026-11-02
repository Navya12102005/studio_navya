# Unified world-flight engine

## Current scope

The latest visual brief supersedes the earlier neon/purple palettes, liquid-glass orb, matrix rain, particles, stickers, hover glitches and automatic cosmic introduction. The current presentation uses charcoal, desaturated metal and warm stone, with a real imported anatomical GLB, spatial project text and a folded studio installation. No Lucide dependency or icons remain.

## One scene and one flight route

`WorldFlight.jsx` owns one fixed full-screen React Three Fiber Canvas. Its anatomy is loaded through Drei `useGLTF('/models/skeleton.glb', false, false)` under Suspense. The two false options disable unused compression decoders for this uncompressed asset; the production security policy remains unchanged.

`createFlightRoute` defines camera and focus paths as real `THREE.CatmullRomCurve3` curves. The route establishes the upper body, completes an orbital approach, enters the imported heart, pulls back through a data gallery, passes through an architectural portal and arrives at studio project installations and contact.

Bio-Tech and Creative objects occupy separate world coordinates. They are not two CSS sections or a recolored copy of the same object. The anatomy stays at the origin; gallery assets and project labels extend through the scene to z=-54. Layer visibility prevents distant labels from stacking over current content.

## Native scrolling and accessibility

A native browser scroll rail supplies progress to GSAP ScrollTrigger with `scrub: 1.2`; delta-time damping follows that progress. No wheel/touch/keyboard scroll interception or Lenis instance remains. Wheel, Page Down, keyboard timeline input and touch scrolling retain browser behavior. In the 3D presentation, the visual scene stays fixed while native scroll moves the camera.

Read portfolio switches to the normal HTML layout. Reduced-motion preferences avoid loading/rendering the model and use that readable layout. Native project dialogs retain Escape dismissal, modal focus trapping and focus return. The contact action opens the actual labeled form in reading mode. WebGL/model failures keep the HTML content and offer a retry button. The loader reflects a real model request and adds no artificial delay.

## World-space text and controls

Headings, project categories, titles, descriptions, tags and telemetry are real Troika SDF text meshes through Drei Text, anchored to world coordinates and billboarded for readability. They use locally hosted Syne, Plus Jakarta Sans and JetBrains Mono. Depth testing stays enabled. Glyph generation uses a valid 64-pixel SDF atlas; font typesetting stays on the main thread to preserve the existing CSP.

The visible project CTA text is also in the 3D scene. Transparent HTML action targets follow the actual text mesh's projected world position, with frustum and mesh-occlusion checks. This provides mouse, touch and keyboard access without rectangular cards or HTML text panels. Small persistent action icons clarify navigation, reading mode and pause. Legal and asset attribution links remain available.

## Transition effects

`@react-three/postprocessing` supplies actual Bloom and ChromaticAberration effects. Their intensity follows portal proximity: bloom moves from 0.06 to at most 0.31, and chromatic offset from zero to at most 0.00045. This preserves the requested transition mechanism with the latest restrained-motion direction. The background shader smoothly changes between flat cool and warm charcoal; it does not render harsh gradients or colored stripes.

The model retains the specified crystal properties: transmission 0.9, roughness 0.1, clearcoat 1 and IOR 1.5. Its studio and internal thoracic lights use muted colors. The original authored mesh, model license and conversion provenance are documented in ANATOMY.md and public/models/README.md.

## Data and legal drafts

No analytics, payment, booking or server-side contact delivery code is added. Contact drafts remain in page memory until the visitor chooses their email app or clipboard. Privacy and Terms routes describe that behavior and mark operator identity, contact details, hosting logs, jurisdiction and effective date as requiring owner review. No legal commitments or professional metrics are invented.

## Performance and cleanup

The visible portfolio uses one WebGL canvas and one composer. Resource ownership covers model clones, materials, installations, effects, text meshes, listeners and ScrollTriggers. The cached GLB stays untouched. Software rendering lowers pixel ratio and transmission-buffer size while preserving exact model material properties. Hardware frame rate requires device testing; no 60 fps guarantee is made.

Historical static files, unused card components and earlier animation helpers remain in the repository as cleanup candidates. The active experience does not import their decorative UI.

## Validation

The production build passed. The 15-check browser suite passed, covering the real GLB, spline flight, portal effects, project dialogs, reading mode, contact drafts, legal drafts and reduced motion. Final viewport/keyboard-bypass refinements were verified again with the focused browser check. Native font rendering was visually inspected; its glyph atlas uses 64-pixel cells, and project text preserves spaces. The updated preview is published from `codex/anatomy-flight-preview`; the old marketing production URL is not evidence of this build.
