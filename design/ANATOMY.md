# Imported upper-body anatomy

The active anatomical renderer loads `/models/skeleton.glb` with `useGLTF` from `@react-three/drei`. The previous procedural anatomical factory has been deleted. It is not used as a fallback, converted to a GLB, or mixed with the imported skeleton.

## Authored asset and source

The model packages 92 authored **BodyParts3D** surfaces into thirteen mesh regions: Cranium, CervicalSpine, ThoracicSpine, Ribcage, CostalCartilage, Sternum, ShoulderGirdle, LungLeft, LungRight, Heart, BrainLeft, BrainRight and VascularNodes. It includes seven cervical levels, twelve thoracic levels and twelve rib pairs. No lumbar spine, pelvis, legs, lower-body mesh, or procedural anatomical primitive is included.

Source: Kevin Mattheus Moerman's BodyParts3D mirror at revision `f0eeb6e843380cfe6b83797cf8c3e1af74de5e61`, using the original BodyParts3D 3.0 / 20110915 surface dataset. BodyParts3D is © The Database Center for Life Science / Life Science Integrated Database Center (2008), licensed under **CC BY-SA 2.1 Japan**. The derived GLB retains that license. The surrounding site code is separate from the mesh license.

Attribution appears in the website footer and `/models/README.md`; the source credit notice is at `/licenses/models/BodyParts3D.txt`. `/models/skeleton.provenance.json` records every source surface, exact source URL, SHA-256 hash, original/reduced face count, final mesh count and asset hash. `scripts/import-anatomy.py` reproduces the asset from the pinned sources using trimesh and quadric decimation. The conversion selects, simplifies, groups, rotates and scales authored surfaces; it never constructs skeleton shapes.

The packaged GLB contains 78,818 faces and is 1,916,296 bytes. Brain surfaces represent cerebral white matter and cerebellum; this is not a reconstruction of the entire cortical surface. The brain surface is partitioned at the sagittal plane into independent left/right mesh nodes under a Brain parent. This includes cerebellar surfaces and does not claim atlas-defined cortical lobes. VascularNodes packages the authored ascending aorta and superior vena cava. The heart uses the authored heart-wall surface. Rendering and simplification are intended for this artistic portfolio, not clinical teaching or measurement.

## Loading and materials

`SkeletonScene` suspends until `useGLTF('/models/skeleton.glb')` resolves. A CanvasLoader using Drei useProgress and a text-only DOM status overlay displays a floating loading indicator and percentage. Load errors preserve the HTML portfolio without substituting a procedural skeleton or flat image.

`createImportedAnatomy` clones the loaded scene, traverses actual mesh nodes and replaces their original materials with MeshPhysicalMaterial. The current master version uses transmission **0.95** for all imported bone and organ materials. Task 23 previously used **0.92** on the brain; that version remains separately preserved. All anatomical materials retain roughness **0.08**, clearcoat **1.0**, clearcoat roughness **0.1**, IOR **1.52** and thickness **1.2**, including on software renderers. Reduced pixel ratio and transmission-buffer resolution lower software rendering cost without changing those requested optical properties.

Cyan (#00F0FF) and violet (#7B2CBF) lights illuminate the cranial region. Pink (#FF007F) and amber (#FFB703) lights illuminate the chest. Internal point lights, physical environment reflections and a realm-aware rim/emission shader color the imported glass. The authored heart compresses and expands around its own pivot at 75 BPM, driving internal amber flashes. Brain vertices receive a small sinusoidal displacement and moving pink emission waves. A genuine 3D particle field and transparent shader haze interpolate between the same palettes; the haze approximates atmosphere rather than physical volumetric scattering.

## Camera, interaction and lifecycle

The R3F canvas stays fixed at inset 0, z-index 0, pointer-events none, width 100vw and height 100vh. Transparent HTML owns typography, navigation and controls at z-index 10 or higher. Native scrolling and GSAP ScrollTrigger (scrub 1.2) drive a complete 2π helical orbit. Camera targets follow authored pivots: cranial arrival through 25%, cervical focus at 37.5%, heart arrival at 50%, a held heart view through 75%, then exit below the thoracic cage at 360 degrees. Radius tightens at the heart and opens toward a split light gateway. Transparent Drei Html anchors use raycast occlusion and camera-facing text at each world-space checkpoint. Realm tabs also drive smooth palette interpolation. There is no scroll interception. Gateway buttons select the real Tech or Creative portfolio and preserve native navigation.

Chapter text animates opacity and blur only. Project dialogs remain keyboard accessible. Reduced motion and Hide 3D preserve the normal HTML portfolio; pause freezes the visible scene.

The cached useGLTF scene is never mutated or disposed. Each mounted instance gets its own geometry copies, mesh-node clones and material overrides. Unmount disposes only those owned copies, lights and environment resources, so pause/resume can reuse the cached GLB safely.

The GLB is uncompressed and embeds its buffers. The hook disables unused Draco and Meshopt decoder initialization; no remote decoder request or production CSP relaxation is needed.

Hardware rendering performance remains unverified; no physical-device frame-rate guarantee is made.

## Cymatics field (point 20)

`lib/acoustic-field.js` adds two concentric, transparent wave shells at each authored brain and heart pivot. These spheres are acoustic artwork around the imported model, never substitute anatomy. Surface displacement and ring opacity follow `sin(distance * frequency - phase)`; phase integrates speed continuously so velocity changes do not pop the wave position. Cyan, violet and amber phase offsets produce spectral edge splitting. A camera-facing transparent central aperture preserves the organ rather than painting an opaque black disk over it. Two GPU-animated micro-particle vortices occupy the fields.

A separate GSAP ScrollTrigger samples native document velocity in pixels/second. Absolute velocity is capped at 2400 and exponentially damped; frequency ranges from 12 to 36 and angular phase speed from 1.8 to 8.0. The peak impulse is retained until the next rendered frame so a slower GPU cannot miss it. After scrolling stops, sustained input expires at 160 ms and the field relaxes. Ring intensity and shell expansion also follow the existing 75 BPM cardiac waveform. This is an artistic acoustic visualization, not a physical pressure solver. No microphone, audio capture, permission prompt or new data collection is involved.

Reduced motion/Hide 3D omit the field with the canvas. Pause freezes shader time, phase and particles. Shared sphere geometry and all owned shader/particle resources are disposed on unmount. Software rendering uses 32×20 sphere segments and 100 particles per vortex; hardware uses 64×40 and 220. Device frame rate remains unverified.

## Surgical domain narrative (point 21)

The scroll ranges refer to the anatomy journey, ending before the portfolio domains. Camera height rises slightly into the cranium, continues a cranial orbit through 25%, then descends past the cervical pivot at 37.5% to the heart at 50%. Position, look-at and radius hold through the 50–75% impact sequence. The remaining quarter completes the turn and gateway exit. ScrollTrigger scrub and camera damping preserve native scrolling.

A zero-thickness sagittal laser sheet sweeps the pre-partitioned authored brain surface. The two GLB mesh nodes separate laterally with a small hover; shader waves change from pink into independent cyan/violet hemisphere materials. This animates the existing anatomical partition rather than computing a runtime surgical cut or inventing anatomical geometry. The spatial labels identify biomedical/healthcare intent and technology/prompt/Python exploration.

An abstract energy dagger descends at 51–59.5%. Impact transitions the authored heart into pink/amber particles sampled directly from its vertex buffer. Its material fades and depth writes stop before the original mesh is hidden. No blood, wound texture or medical procedure is represented. The background warms to Creative and selects the actual Creative portfolio at the completed burst. Explicit realm choices remain available in the portfolio. Returning above the heart restores Tech, and scrolling to the start restores the exact original brain transforms and heart visibility.

`lib/surgical-narrative.js` derives all phase values from scroll progress, with no timers, one-shot triggers or accumulating transforms. Pause stops model/effect updates; reduced-motion reading mode omits the animation. New spatial labels are transparent Drei Html anchors in the WebGL scene with raycast occlusion; ordinary HTML preserves accessible descriptions and controls. Generated geometry is restricted to the laser/energy prop and particle effects. All anatomy remains the licensed GLB.

Four additional acoustic apertures sit directly on the spinal camera trajectory at 29%, 35%, 41% and 47%. Their normals follow the flight tangent; the camera crosses their openings during the descent. They share the existing velocity-driven wave uniforms and fade outside the spinal phase. Placement adapts to the mobile camera radius. They are effect geometry, not anatomical structures.

## Crystalline anatomical engine (point 22)

`CRYSTAL_OPTICS` applies the requested physical properties to every imported bone and organ material. Base opacity is one; the heart fades only during its existing shatter. The former outgoing-light color replacement is removed, allowing Three.js physical transmission, Fresnel reflections and clearcoat to determine surface lighting. A low-amplitude colored rim/neural emission remains. The local studio cubemap has 128-pixel faces rather than 32. This uses rasterized MeshPhysicalMaterial optics; it does not claim path-traced caustics, measured spectral dispersion or calibrated photorealism.

`lib/crystal-art.js` samples actual GLB vertices and normals for diamond-dust Points on both spinal regions, both brain halves and the authored vascular nodes. Point shaders add sparse faceted glints and phase-offset chromatic fringes. Dust is parented to each source mesh, so it follows the cerebral split; it is excluded from decorative raycasting to preserve label readability. Micro-refractions are an artistic shader approximation. Counts are bounded at 520 software / 1400 hardware points.

Three original low-poly roses use a single curved petal geometry and two instanced mesh batches: 63 petals total. Nine fine tubular stems/tendrils form the surrounding filigree. These decorative meshes are separate from the authored anatomy and never replace it. Pink/amber glass emission follows the existing 75 BPM cardiac pulse; ornaments clear with the heart burst and restore on reverse scroll. Petals and filigree use thinner transmission depths (.08/.025) appropriate to their decorative scale. Shared geometries, instanced-mesh resources, particle buffers and materials are disposed on unmount.

The dual gateway now opens at the completed heart burst (72–74%) rather than waiting until 80%. It faces the active camera, then travels toward the existing final domain exit. Native browser scrolling and the actual Tech/Creative portfolio controls remain intact. No new UI cards, backgrounds, remote assets, audio capture, dependencies or data collection were introduced.

## Cybernetic lobe division and holographic HUDs (point 23)

The protected GitHub tag `navya-crystal-anatomy-v22` still resolves to `8b2ad0025f9098b8a78dbd56c830146f4678b576`. Current changes advance the preview branch without rewriting that restore point.

The imported brain materials use transmission .92 and clearcoat 1.0. Cyan point lighting is attached inside BrainLeft; violet and pink lights are attached inside BrainRight. Four GPU-animated synaptic motifs carry bright pulses along curved paths in the left half. Five luminous core fibers stretch into the sagittal gap as the existing laser/split progresses. These are artistic neural motifs, not measured tractography or a volumetric scattering solver. Right-brain copper traces use a triplanar procedural circuit pattern and moving emissive signals in mesh-local coordinates. They follow the authored surface without external textures or UV seams. The source remains white-matter/cerebellar anatomy rather than a full cortical reconstruction.

Each separated lobe carries a clipped-corner MeshPhysicalMaterial holographic surface: transmission .85, opacity .15 (85% transparent), clearcoat 1 and thin optical depth. Partial luminous corner brackets reinforce the glass edge. They are world-space optical surfaces, not HTML containers, black masks or opaque rectangular cards. Labels remain transparent, overflow-visible, raycast-occluded Drei Html anchors. Their positions derive from the actual hemisphere world transforms plus explicit spatial offsets. Physical panel scale adapts to camera distance and viewport dimensions so the text remains readable. Mobile panels use staggered elevations.

Pointer motion adds a damped offset of at most .045 world units and a small panel tilt. Pause freezes both the neural engine and HUD updates; reduced-motion/reading mode retains the interest descriptions in normal HTML without requesting WebGL. No achievements, clinical results or metrics were invented. All new geometry, lights, shader buffers and HUD listeners are cleaned up on unmount.

The cranial camera remains mostly frontal during the slice (up to 30 degrees at 25%) so both lobe identities remain visible, then resumes the existing spinal/heart orbit and full-turn exit. HUD world points are constrained to the camera frustum at their original projected depth, avoiding clipping without CSS masks. During the active HUD interval, duplicate visual brain-chapter prose fades while remaining in the accessibility tree; the chapter action remains visible on keyboard focus and in the reading layout. Hide 3D/unmount clears that presentation flag and restores the normal reading layout.

The synaptic spark/core layer uses additive X-ray rendering without depth rejection so its light remains visible through the translucent anatomical surfaces. This applies only to the artistic neural motifs; imported anatomy and the HUD text continue to use their own physical shading/occlusion.

## Cyber-blueprint and telemetry (task 24)

Branch `codex/anatomy-task-24-preview` retains task 23 on its original preview branch. The background is #0A0A0C with a derivative-antialiased procedural cyan/white grid, native cranial radar rings, angular ticks and corner reticles. Transparent editorial readouts display the real camera coordinates and the number of imported regions. No placeholder coordinate values or fabricated performance statistics are shown.

The current GLB adds authored left/right lungs assembled from five atlas lobes, bringing the surface manifest to 92 sources and 13 mesh regions. The asset remains below 2 MB and 80,000 triangles. Source hashes and exact identifiers are in the provenance manifest. Lung materials retain physical transmission .95 and use .18 opacity to preserve visibility of the heart and floral installation.

PULSE is the existing simulated 75 BPM heart waveform. VOLUME is the actual relative scale-cubed value of the modeled lungs, driven by a 12 cycles/min breathing function. Both monitors explicitly say SIMULATED ORGAN SIGNALS / NOT MEDICAL DATA and report relative units, never clinical millilitres. Scene status/coordinates come from the running renderer at up to eight updates per second. Pause freezes the model clock and waveforms; reduced-motion/reading mode omits the WebGL HUD.

Brain arrival and heart core emission use #FF7A00, while separated cerebral identities retain their cyan/violet distinction. The original cranial cut, spinal acoustic corridor, heart strike, burst and realm controls remain. Biography and ABOUT copy describe the supplied student portfolio; no clinical outcomes or credentials were added.

## CAD scanner and point-cloud inspection (task 25)

`lib/cad-inspection.js` unions the authored mesh bounds into a real Box3Helper cage. It adds a sampled point layer to each of the 13 anatomical mesh nodes without replacing their physical materials. Vertex totals are read from the imported BufferGeometry attributes. VISIBLE MESH VERTICES counts complete meshes intersecting the camera frustum, not per-pixel occlusion or a clinical measurement. Total source vertices stay constant; the frustum subset changes with camera descent and heart visibility.

Cranium, cervical spine, lateral ribcage and heart markers use projected positions from actual mesh bounds. Native 3D sprites and Line leaders connect them to transparent coordinate labels. The corresponding keyboard-operable HTML buttons occupy those projected positions above the canvas. Clicking selects the real anatomical node and highlights its marker/readout. Frustum limits keep labels in view; reduced-motion/Hide 3D removes the inspector with the canvas.

The renderer now uses Three.js EffectComposer with RenderPass, a custom ShaderPass and OutputPass. Chapter crossings briefly trigger a bounded RGB/planar sweep; strength decays against the active scene clock instead of persisting at a scroll threshold. Pause freezes that clock. Draw counts aggregate the actual composed frame via renderer.info, and are labeled FRAME DRAWS. The procedural grid is toned down for linear compositing. All render targets, materials, geometries, source point attachments and event listeners are released on teardown.

No new source assets, libraries, clinical datasets or data collection were added. Task 25 advances only its dedicated preview branch; tasks 23/24 and the protected v22 tag remain separate.

## Master skeletal installation (task 26)

`lib/code-brain.js` builds a local, transparent glyph atlas from 16 Python/prompt/vibe-coding snippets in the already hosted monospaced font. These are illustrative syntax, not executed commands or a claim of a running AI service. Two GPU point sets sample the actual authored BrainLeft/BrainRight surfaces. Their initial displaced cloud converges to those vertex positions while the physical neural meshes fade in. Eight larger glyphs improve legibility within the dense cloud. The morph completes at 7.5% of the journey, before the existing laser/split reaches its revealing phase. Reverse scrolling restores the glyph cloud. Buffers, texture and material are owned/disposed by the effect; original brain material opacity/depth settings are restored on teardown.

Neural diamond dust, synaptic spark opacity and CAD brain-point visibility are gated during the code reveal so they do not obscure the syntax. Anatomical source geometry remains the licensed atlas white-matter/cerebellar surfaces; no generic sphere is substituted or claimed as a cortical reconstruction. Master optical transmission returns to .95 for the brain, matching the skeleton and other organs.

The current narrative mapping is deliberate: Brain → Tech, prompt engineering, vibe coding and Python systems; Spine → Bioengineering/biomedical foundation and healthcare contribution; Heart → Creative/Non-Tech strategy, leadership and Studio Navya. The spine action opens the existing Oculomics research context. The brain action opens the runnable Python workflow context. The creative action retains the actual Creative realm. Descriptions continue to distinguish academic/research interests and synthetic demonstrations from clinically validated work or client results.

Native spatial readouts now carry the master labels. Duplicate HTML chapter prose fades only while the live 3D inspector is active, retaining accessible text and visible keyboard focus. Hide 3D and reduced-motion mode restore the ordinary Tech/Bio/Creative reading layout. The CAD cage, actual coordinates/counts, modeled pulmonary telemetry, cymatic corridor, glass roses, heart strike, timed ShaderPass sweep and dual portal are retained. Earlier previews and the v22 restore tag are not overwritten.

## Voxel-realm reset

The active build stops at the post-heart split. The former comic worlds, toon/halftone compositor, cyanotype lab, luxury-goth gallery, realm dock, work sandboxes and rebirth loop are removed from the application. Their earlier branches remain recoverable history.

The licensed glass anatomy, code-brain morph, surgical sequence, acoustic field, CAD cage, point cloud, coordinate nodes, scan pass and split-portal signal remain active. The clean reset is preserved on `codex/anatomy-voxel-reset-preview`; on that branch the gateway exposes no destination or automatic transfer. Realm 01 is layered from that boundary here.

## Realm 01: voxel Tech Core

`lib/voxel-tech-core.js` begins only after scroll progress .76, preserving a visible heart-burst/split checkpoint first. It captures the live anatomical camera and drives one CatmullRom tracking path through three continuous phases: atmospheric arch entry, upward bank around the neural core, and descent to the terminal floor. Reverse scrolling below the threshold disposes the active flight state and returns control to the anatomical spiral.

The environment is original procedural geometry: 53 gothic arch blocks, a deep street canyon, warm lanterns, red foliage, 14 jointed crimson vines, deterministic shader ash, moving crimson storm layers, a generated moon, lava fissures and more than 100 redstone circuit tiles. The subterranean layer adds two particle portals, vertical lava falls, cyan soul-fire beacons, crimson fungus and six floating command blocks. A GPU ember shader generates 16,000 sparks on hardware rendering and 1,800 in economy mode. The brain is an instanced ellipsoidal voxel volume with a longitudinal fissure, physical glass optics and a separate shader-driven redstone neural point field. Six locally generated 1024-pixel canvas textures display Python, `vibe_coding()` and prompt parameters on command-style terminal blocks. No Minecraft textures, models, code or branded assets are bundled.

The scene adapts voxel/particle counts for software rendering while retaining the same composition and motion. Reported canvas telemetry exposes actual generated counts and viewport pixel ratio. Pause freezes the shared scene clock; Escape or Return to anatomy exits the realm. Reduced-motion mode keeps the HTML checkpoint and omits the WebGL flight.

## Voxel anatomy introduction

`lib/voxel-anatomy.js` samples the licensed GLB mesh surfaces at their authored world coordinates into four instanced regions: head, spine, thorax and heart. Rounded box geometry and `MeshPhysicalMaterial` use transmission, clearcoat and IOR 1.52. Scroll progress assembles deterministic scattered blocks with staggered placement snaps; the heart blocks pulse at 75 BPM and seven redstone tubes connect the brain, cervical spine and heart anchors. Pointer/touch dragging rotates the complete installation without replacing native scrolling. Canvas telemetry reports generated block count, structural integrity, anatomical regions and live orbit angles.

At the completed heart burst, `lib/split-portal.js` condenses three camera-facing voxel frames labeled Tech Core, Bio Sanctuary and Creative Studio. Realm 01 is the active continuous destination in this build.
