"""Package authored BodyParts3D surfaces as GLB; never synthesize anatomy.

Reproduce with Python trimesh + fast-simplification. Sources remain CC BY-SA
2.1 Japan. SHA-256 hashes and original/reduced face counts are recorded beside
skeleton.glb. Raw meshes are cached outside the repository in /tmp.
"""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import urllib.request
import numpy as np
import trimesh

REVISION = 'f0eeb6e843380cfe6b83797cf8c3e1af74de5e61'
ROOT = Path(__file__).resolve().parents[1]
BASE = f'https://raw.githubusercontent.com/Kevin-Mattheus-Moerman/BodyParts3D/{REVISION}/assets/BodyParts3D_data/'
CACHE = Path('/tmp/navya-bp3d')
CACHE.mkdir(exist_ok=True)

def fetch(path):
    target = CACHE / Path(path).name
    if not target.exists():
        with urllib.request.urlopen(BASE + path, timeout=90) as response:
            target.write_bytes(response.read())
    return target

names = {line.split('\t', 1)[0]: line.split('\t', 1)[1] for line in fetch('parts_list_e.txt').read_text().splitlines() if '\t' in line}
skull = ['FMA52734','FMA52735','FMA52736','FMA52738','FMA52739','FMA52788','FMA52789','FMA52740','FMA53647','FMA53648','FMA53649','FMA53650','FMA52892','FMA52893','FMA52748','FMA53655','FMA53656','FMA9710']
cervical = ['FMA12519','FMA12520','FMA12521','FMA12522','FMA12523','FMA12524','FMA12525']
thoracic = ['FMA9165','FMA9187','FMA9209','FMA9248','FMA9922','FMA9945','FMA9968','FMA9991','FMA10014','FMA10037','FMA10059','FMA10081']
ribs = ['FMA7857','FMA7882','FMA7909','FMA7957','FMA8066','FMA8175','FMA8229','FMA8283','FMA8364','FMA8445','FMA8531','FMA8533','FMA7987','FMA8012','FMA8039','FMA8148','FMA8093','FMA8202','FMA8256','FMA8310','FMA8391','FMA8472','FMA8532','FMA8534']
cartilage = ['FMA7875','FMA7886','FMA7913','FMA7976','FMA8070','FMA8194','FMA8248','FMA8005','FMA8031','FMA8058','FMA8167','FMA8112','FMA8221','FMA8275']
# Only cranial/cervical/thoracic/shoulder structures. No lumbar spine, pelvis,
# legs, hands or lower-body meshes are downloaded or included.
groups = {
    'Cranium': (skull, 1800),
    'CervicalSpine': (cervical, 550),
    'ThoracicSpine': (thoracic, 500),
    'Ribcage': (ribs, 400),
    'CostalCartilage': (cartilage, 180),
    'Sternum': (['FMA7486','FMA7487','FMA7488'], 700),
    'ShoulderGirdle': (['FMA13322','FMA13323','FMA13395','FMA13396'], 1700),
    'Heart': (['FMA7274'], 5000),
    'Brain': (['FMA61822','FMA67944'], 3000),
    'VascularNodes': (['FMA3736','FMA4720'], 1200),
}
ids = [key for keys, _ in groups.values() for key in keys]
print(f'Downloading {len(ids)} authored surfaces from pinned BodyParts3D revision.', flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    paths = dict(zip(ids, pool.map(lambda key: fetch(f'stl/{key}.stl'), ids)))
meshes = {key: trimesh.load_mesh(path, process=True) for key, path in paths.items()}
# Source Z is superior; rotate into Three.js Y-up using a proper rotation.
rotation = trimesh.transformations.rotation_matrix(-np.pi / 2, [1,0,0])
for mesh in meshes.values(): mesh.apply_transform(rotation)
bone_ids = [key for group, (keys, _) in groups.items() if group not in ('Heart','Brain','VascularNodes') for key in keys]
bounds = np.array([meshes[key].bounds for key in bone_ids])
minimum, maximum = bounds[:,0].min(axis=0), bounds[:,1].max(axis=0)
scale = 5.06 / (maximum[1] - minimum[1])
# Keep the sagittal axis on x=0, normalize superior height to y=3.53 and
# retain the source's actual relative positions. T1 defines spinal depth.
offset = np.array([(minimum[0]+maximum[0])/2, maximum[1] - 3.53/scale, meshes['FMA9165'].centroid[2] + .25/scale])
scene = trimesh.Scene()
provenance = []
for group, (keys, limit) in groups.items():
    pieces = []
    for key in keys:
        mesh = meshes[key]
        original = len(mesh.faces)
        if original > limit:
            mesh = mesh.simplify_quadric_decimation(face_count=limit)
        mesh.vertices = (mesh.vertices - offset) * scale
        _ = mesh.vertex_normals
        pieces.append(mesh)
        provenance.append({'id':key,'name':names[key],'source':BASE+f'stl/{key}.stl','sha256':hashlib.sha256(paths[key].read_bytes()).hexdigest(),'originalFaces':original,'packagedFaces':len(mesh.faces),'group':group})
    combined = trimesh.util.concatenate(pieces)
    if group == 'Brain':
        # Partition the authored surface at the sagittal plane, never synthesize
        # a lobe. This is an artistic split of white-matter/cerebellar surfaces.
        scene.graph.update(frame_to='Brain', matrix=np.eye(4))
        for name, mask in [('BrainLeft', combined.triangles_center[:,0] >= 0), ('BrainRight', combined.triangles_center[:,0] < 0)]:
            half = combined.submesh([np.flatnonzero(mask)], append=True)
            pivot = half.bounds.mean(axis=0)
            half.vertices -= pivot
            scene.add_geometry(half, node_name=name, geom_name=name, parent_node_name='Brain', transform=trimesh.transformations.translation_matrix(pivot))
        continue
    pivot = combined.bounds.mean(axis=0)
    combined.vertices -= pivot
    transform = trimesh.transformations.translation_matrix(pivot)
    scene.add_geometry(combined, node_name=group, geom_name=group, transform=transform, metadata={'source':'BodyParts3D','region':group})
output = ROOT / 'public/models'
output.mkdir(exist_ok=True)
blob = scene.export(file_type='glb', include_normals=True)
(output/'skeleton.glb').write_bytes(blob)
manifest = {'asset':'skeleton.glb','sourceRevision':REVISION,'sourceRepository':'https://github.com/Kevin-Mattheus-Moerman/BodyParts3D','credit':'BodyParts3D, (c) The Database Center for Life Science','license':'CC BY-SA 2.1 Japan','licenseUrl':'https://creativecommons.org/licenses/by-sa/2.1/jp/','changes':['Selected upper-body structures only','Converted binary STL surfaces to indexed GLB','Reduced faces with quadric decimation','Normalized orientation, scale and placement','Grouped surfaces by anatomical region; retained original spatial relationships','Partitioned authored brain triangles at sagittal plane into left and right nodes','Added authored ascending aorta and superior vena cava'],'bytes':len(blob),'sha256':hashlib.sha256(blob).hexdigest(),'faces':sum(item['packagedFaces'] for item in provenance),'meshes':list(scene.geometry),'bounds':scene.bounds.tolist(),'surfaces':provenance}
(output/'skeleton.provenance.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({key:manifest[key] for key in ['bytes','faces','meshes','bounds']},indent=2),flush=True)
