# Imported upper-body anatomy

The active anatomical renderer loads `/models/skeleton.glb` with `useGLTF` from `@react-three/drei`. The previous procedural anatomical factory has been deleted. It is not used as a fallback, converted to a GLB, or mixed with the imported skeleton.

## Authored asset and source

The model packages 85 authored **BodyParts3D** surfaces into nine mesh regions: Cranium, CervicalSpine, ThoracicSpine, Ribcage, CostalCartilage, Sternum, ShoulderGirdle, Heart and Brain. It includes seven cervical levels, twelve thoracic levels and twelve rib pairs. No lumbar spine, pelvis, legs, lower-body mesh, or procedural anatomical primitive is included.

Source: Kevin Mattheus Moerman's BodyParts3D mirror at revision `f0eeb6e843380cfe6b83797cf8c3e1af74de5e61`, using the original BodyParts3D 3.0 / 20110915 surface dataset. BodyParts3D is © The Database Center for Life Science / Life Science Integrated Database Center (2008), licensed under **CC BY-SA 2.1 Japan**. The derived GLB retains that license. The surrounding site code is separate from the mesh license.

Attribution appears in the website footer and `/models/README.md`; the source credit notice is at `/licenses/models/BodyParts3D.txt`. `/models/skeleton.provenance.json` records every source surface, exact source URL, SHA-256 hash, original/reduced face count, final mesh count and asset hash. `scripts/import-anatomy.py` reproduces the asset from the pinned sources using trimesh and quadric decimation. The conversion selects, simplifies, groups, rotates and scales authored surfaces; it never constructs skeleton shapes.

The packaged GLB contains 72,818 faces and is 1,767,836 bytes. Brain surfaces represent cerebral white matter and cerebellum; this is not a reconstruction of the entire cortical surface. The heart uses the authored heart-wall surface. Rendering and simplification are intended for this artistic portfolio, not clinical teaching or measurement.

## Loading and materials

`SkeletonScene` suspends until `useGLTF('/models/skeleton.glb')` resolves. A CanvasLoader using Drei useProgress and a text-only DOM status overlay displays a floating loading indicator and percentage. Load errors preserve the HTML portfolio without substituting a procedural skeleton or flat image.

`createImportedAnatomy` clones the loaded scene, traverses actual mesh nodes and replaces their original materials with MeshPhysicalMaterial. Every anatomical material has transmission **0.9**, roughness **0.1**, clearcoat **1.0** and IOR **1.5**, including on software renderers. Reduced pixel ratio and transmission-buffer resolution lower software rendering cost without changing those requested optical properties.

Cyan (#00F0FF) and violet (#7B2CBF) lights illuminate the cranial region. Pink (#FF007F) and amber (#FFB703) lights illuminate the chest. Internal point lights, physical environment reflections and a realm-aware rim/emission shader color the imported glass. The authored heart pulses around its own pivot. A genuine 3D particle field and transparent shader haze interpolate between the same palettes; the haze approximates atmosphere rather than physical volumetric scattering.

## Camera, interaction and lifecycle

The R3F canvas stays fixed at inset 0, z-index 0, pointer-events none, width 100vw and height 100vh. Transparent HTML owns typography, navigation and controls at z-index 10 or higher. Native scrolling and GSAP ScrollTrigger drive a modest 1.1-radian orbit and 0.45-unit vertical translation around the centered model. Realm tabs also drive smooth palette interpolation. There is no scroll interception or spline world jump.

Chapter text animates opacity and blur only. Project dialogs remain keyboard accessible. Reduced motion and Hide 3D preserve the normal HTML portfolio; pause freezes the visible scene.

The cached useGLTF scene is never mutated or disposed. Each mounted instance gets its own geometry copies, mesh-node clones and material overrides. Unmount disposes only those owned copies, lights and environment resources, so pause/resume can reuse the cached GLB safely.

The GLB is uncompressed and embeds its buffers. The hook disables unused Draco and Meshopt decoder initialization; no remote decoder request or production CSP relaxation is needed.

Hardware rendering performance remains unverified; no physical-device frame-rate guarantee is made.
