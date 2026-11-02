# Imported anatomical model

`skeleton.glb` is a packaged derivative of **BodyParts3D**, © The Database Center for Life Science / Life Science Integrated Database Center (2008), licensed under **Creative Commons Attribution-Share Alike 2.1 Japan**.

License: https://creativecommons.org/licenses/by-sa/2.1/jp/
English deed: https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en
Source credit/license notice: /licenses/models/BodyParts3D.txt

The authored surface meshes were obtained from Kevin Mattheus Moerman's BodyParts3D mirror at the pinned commit:
https://github.com/Kevin-Mattheus-Moerman/BodyParts3D/tree/f0eeb6e843380cfe6b83797cf8c3e1af74de5e61

Original dataset: BodyParts3D 3.0 / 20110915.
Mitsuhashi N, Fujieda K, Tamura T, Kawamoto S, Takagi T, Okubo K. BodyParts3D: 3D structure database for anatomical concepts. Nucleic Acids Res. 2009;37(Database issue):D782–5. https://doi.org/10.1093/nar/gkn613
Dataset DOI: https://doi.org/10.18908/lsdba.nbdc00837-000

## Changes

Selected authored cranial, cervical, thoracic, shoulder, heart and brain surfaces; converted STL to indexed GLB; reduced face count; normalized orientation/scale/placement; grouped surfaces into thirteen mesh regions. Added authored left/right lungs from five lung-lobe surfaces and authored ascending aorta and superior vena cava; partitioned the authored brain surface at the sagittal plane into independent left/right nodes. The brain partitions include white-matter and cerebellar surfaces, not a complete cortical reconstruction. Original spatial relationships are retained. No anatomy was synthesized from primitives, code-generated tubes, SVG lines or the previous procedural model.

The GLB derivative is distributed under the same CC BY-SA 2.1 Japan license. Its mesh license does not relicense the surrounding application code. The full surface list, exact source URLs, per-source SHA-256 hashes, reduction counts and final GLB hash are in `/models/skeleton.provenance.json`. This model is a visualization derived from the atlas, not a clinically validated teaching tool.

To reproduce, install Python `trimesh` and `fast-simplification`, then run `python3 scripts/import-anatomy.py` from the repository. It downloads only the selected surfaces from the pinned source revision.
