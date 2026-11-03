import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';

test.beforeEach(async ({page})=>{await page.addInitScript(()=>sessionStorage.setItem('navya-intro-seen','1'));});

test('authored upper-body GLB is served with verifiable provenance and independent brain halves and vascular regions',async({request})=>{
  const response=await request.get('/models/skeleton.glb');expect(response.status()).toBe(200);
  const bytes=await response.body();expect(bytes.subarray(0,4).toString()).toBe('glTF');expect(bytes.readUInt32LE(4)).toBe(2);
  const length=bytes.readUInt32LE(12),gltf=JSON.parse(bytes.subarray(20,20+length).toString());
  expect(gltf.meshes).toHaveLength(13);
  for(const mesh of gltf.meshes){expect(mesh.primitives[0].attributes.NORMAL).toBeDefined();expect(mesh.primitives[0].attributes.POSITION).toBeDefined();}
  const names=gltf.nodes.map(n=>n.name).filter(Boolean);
  for(const name of ['Cranium','CervicalSpine','ThoracicSpine','Ribcage','CostalCartilage','Sternum','ShoulderGirdle','Heart','LungLeft','LungRight','Brain','BrainLeft','BrainRight','VascularNodes'])expect(names).toContain(name);
  expect(names.join(' ')).not.toMatch(/pelvis|lumbar|femur|tibia|leg/i);
  const provenance=await (await request.get('/models/skeleton.provenance.json')).json();
  expect(provenance.surfaces).toHaveLength(92);expect(provenance.license).toBe('CC BY-SA 2.1 Japan');
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(provenance.sha256);
  expect(provenance.faces).toBeLessThan(80000);expect(bytes.length).toBeLessThan(2000000);
  expect((await request.get('/models/README.md')).status()).toBe(200);
});

test('Suspense displays a loader, then useGLTF traverses the real asset and applies exact crystal materials',async({page})=>{
  let release;const gate=new Promise(resolve=>{release=resolve;});
  let requested=false;
  await page.route('**/models/skeleton.glb',async route=>{requested=true;await gate;await route.continue();});
  try{
    await page.goto('/?profile=1',{waitUntil:'domcontentloaded'});
    await expect(page.locator('.anatomy-model-loader')).toBeVisible();expect(requested).toBe(true);
    release();
    const canvas=page.locator('.anatomy-canvas canvas');await expect(canvas).toHaveAttribute('data-model-source','/models/skeleton.glb');
    await expect(page.locator('.anatomy-model-loader')).toHaveCount(0);
    const meshes=JSON.parse(await canvas.getAttribute('data-imported-meshes'));expect(meshes).toHaveLength(13);expect(meshes).toContain('Cranium');expect(meshes).toContain('Ribcage');
    const materials=JSON.parse(await canvas.getAttribute('data-physical-materials'));
    for(const material of materials){expect(material.transmission).toBe(.95);expect(material.roughness).toBe(.08);expect(material.clearcoat).toBe(1);expect(material.ior).toBe(1.52);expect(material.clearcoatRoughness).toBe(.1);expect(material.thickness).toBe(1.2);}
    await page.waitForFunction(()=>document.querySelector('canvas[data-camera]'));
    await page.screenshot({path:'/tmp/navya-imported-glb-hero.png'});
    await expect(page.locator('.model-credit')).toContainText('BodyParts3D');
  }finally{release();}
});

test('missing GLB preserves the HTML portfolio and usable project dialogs without procedural anatomy',async({page})=>{
  await page.route('**/models/skeleton.glb',route=>route.abort());await page.goto('/');
  await expect(page.locator('.anatomy-unavailable')).toHaveCount(1);
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('.anatomy-fullscreen img,.anatomy-fullscreen svg')).toHaveCount(0);
  await page.getByRole('button',{name:'Explore Oculomics · Research'}).click();await expect(page.getByRole('dialog')).toBeVisible();
});
