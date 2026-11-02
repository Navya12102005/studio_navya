# Anatomical structure and reference scope

The website is a cyber-organic portfolio installation, not a clinical anatomical atlas. Geometry is authored procedurally using Three.js buffers; neither a proprietary model nor a professional mesh has been copied into the application.

## References actually inspected

- [Z-Anatomy / Models of human anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy), commit `7b9197672eea2ed44ae238d3cfbf38e39b7586a9`. Read `Readme.md`, `License.txt` and the relevant terms in `TA2.csv`. The atlas credits BodyParts3D and is a navigable Blender atlas. Its terminology includes cervical/thoracic structures, true/false/floating ribs, sternum/manubrium and cardiac structures. Authors and source content license: Gauthier Kervyn, Marcin Zielinski and contributors; CC BY-SA 4.0. No dataset rows, model vertices, atlas images or definitions are redistributed here.
- User recordings `r11.mp4` and `r12again.mp4`: inspected for the neuronal impulse, thoracic context and warm orbital light, not as a source of clinical anatomy.

The requested anatomy3datlas.com website and OpenStax thoracic-cage page returned proxy CONNECT HTTP 403. Their pages and 3D models were not inspected. The open atlas terminology is a reference, not a claim that this original mesh has been checked against a professional atlas surface or clinically validated.

## Structure

- Upper body only: cranial vault, jaw/eye/nasal contours, paired cerebral forms, seven cervical levels, twelve thoracic levels, clavicular/shoulder contours, proximal arm segments and twelve rib pairs. The spine stops at the thoracic limit. No lumbar stack, pelvis, lower body or legs are generated.
- C1 is represented by an atlas ring; the C2 region includes a schematic odontoid process. Cervical and thoracic paths have gentle opposing curvature.
- Rib pairs 1–7 meet the sternum; pairs 8–10 return to the costal margin; pairs 11–12 stop freely. The sternum has a simplified manubrial/body/xiphoid path.
- The cardiac core is an asymmetric, tapered volume with a tilted long axis, aortic/pulmonary-inspired paths and anterior branching vessels. It replaces the earlier conventional heart-symbol contour. It remains a stylized single core, not a four-chamber clinical reconstruction.
- The branching vascular tree runs between the cranial, shoulder/arm and thoracic regions only. Neural floral fibers, quartz tips and the illustrative cell/ligand are decorative additions and are not anatomical structures or validated compounds.
- Palette sides express the user's analytical/creative metaphor; they do not claim scientific left/right-brain specialization.

## Interaction mapping

| Structure | Portfolio destination |
| --- | --- |
| Cranial / cerebral | Tech & Bioengineering domain |
| Spine | Leadership & strategy domain |
| Vascular | AWS Student Builder operations highlight; operations domain includes Sound Check logistics |
| Thoracic / heart | Creative, PR & Strategy domain: Startup Club, Studio Navya, content and campus-summit communication |
| Lipid-bilayer / ligand nodes | Molecular docking workflow highlight |

Raycast volumes are tagged independently of delicate visual lines. The same targets have keyboard-operable buttons and contextual readouts. Interface percentages describe scan or pointer progress; they are not biological or professional performance metrics.

## Rendering

The active renderer uses lofted MeshPhysicalMaterial glass head/torso surfaces, solid tubular ribs and vessels, instanced vertebrae, folded organ meshes, dynamic point lights and vertex-shader spectrum mapping. Static tube buffers are merged by material; there are no line/wireframe materials in the active anatomical scene. Bounded recursive fibers, instanced crystals/atoms and local GLSL shaders avoid large model downloads. Low frame rates trigger a bounded resolution reduction. Render diagnostics are opt-in via `?profile=1`.

Physical-device 60 fps performance and professional atlas-surface validation remain unverified. The measured cloud renderer uses software Chromium, which is distinct from a hardware-backed browser.

## Full-screen presentation

The canvas is fixed to the viewport in a React portal under document.body. Main HTML remains at a higher stacking level; pointer events pass through the canvas. Camera focus stays centred, visits cranial/spinal/thoracic regions, enters an inner cardiac chamber, then pulls out and fades as the bento section enters. Software rendering substitutes alpha glass and lower-density meshes for expensive optical transmission while retaining real 3D volume, normals, lighting and motion. This remains original artistic geometry rather than an atlas-validated medical reconstruction.
