import * as T from '../vendor/three.module.js';
import { eveningState, mix, smooth } from './story-state.js';

// Everything in the room has geometry on every side. No panorama or camera-facing furniture.
export function createStudio({ textureFactory = makeTextures } = {}) {
  const scene = new T.Scene();
  scene.background = new T.Color('#282127');
  const tex = textureFactory();
  const material = (color, extra = {}) => new T.MeshStandardMaterial({ color, roughness: .8, ...extra });
  const m = {
    plaster: material('#c9ad89', { map: tex.plaster }),
    olive: material('#777b60', { map: tex.plaster }),
    wood: material('#866043', { map: tex.wood, roughness: .52 }),
    darkWood: material('#463127', { map: tex.wood, roughness: .5 }),
    trim: material('#e7d3ae'), brass: material('#b99a5d', { metalness: .72, roughness: .32 }),
    wine: material('#692e39', { map: tex.linen, roughness: .95 }),
    linen: material('#eee1c9', { map: tex.linen, side: T.DoubleSide }),
    paper: material('#f8eacb'), dark: material('#322a26'), sage: material('#78815d'),
    glass: new T.MeshPhysicalMaterial({ color: '#f0ddc5', transparent: true, opacity: .22, roughness: .1, metalness: .12, side: T.DoubleSide, depthWrite: false }),
    bulb: material('#ffe1a0', { emissive: '#ffb755', emissiveIntensity: 0 }),
    shade: material('#eed8b4', { side: T.DoubleSide, emissive: '#ffbd69', emissiveIntensity: 0 }),
    fur: material('#c99a4b', { roughness: 1 }), furLight: material('#dfb968', { roughness: 1 }),
    furDark: material('#aa773d', { roughness: 1 }), eye: material('#201a16', { roughness: .15 }),
    thread: new T.LineBasicMaterial({ color: '#e0cba4' })
  };
  const unitBox = new T.BoxGeometry(1, 1, 1), sphere = new T.SphereGeometry(1, 24, 16);
  const room = new T.Group(); room.name = 'complete-360-room'; scene.add(room);
  function mesh(g, mat, x=0, y=0, z=0, parent=room) { const o=new T.Mesh(g,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o; }
  function box(w,h,d,mat,x,y,z,parent=room) { const o=mesh(unitBox,mat,x,y,z,parent);o.scale.set(w,h,d);return o; }
  function ball(sx,sy,sz,mat,x,y,z,parent=room) { const o=mesh(sphere,mat,x,y,z,parent);o.scale.set(sx,sy,sz);return o; }
  function cylinder(rt,rb,h,mat,x,y,z,parent=room,segments=24) { return mesh(new T.CylinderGeometry(rt,rb,h,segments),mat,x,y,z,parent); }
  function group(name,x=0,y=0,z=0,parent=room) { const o=new T.Group();o.name=name;o.position.set(x,y,z);parent.add(o);return o; }
  function curve(points,r,mat,parent=room) { const c=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(c,32,r,6,false),mat,0,0,0,parent); }
  function line(points,mat,parent=room) { const o=new T.Line(new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p))),mat);parent.add(o);return o; }
  function softBox(w,h,d,r,mat,x,y,z,parent=room) {
    const shape=new T.Shape(),a=w/2,b=h/2;
    shape.moveTo(-a+r,-b);shape.lineTo(a-r,-b);shape.quadraticCurveTo(a,-b,a,-b+r);shape.lineTo(a,b-r);shape.quadraticCurveTo(a,b,a-r,b);shape.lineTo(-a+r,b);shape.quadraticCurveTo(-a,b,-a,b-r);shape.lineTo(-a,-b+r);shape.quadraticCurveTo(-a,-b,-a+r,-b);
    const g=new T.ExtrudeGeometry(shape,{depth:d-r*2,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r,bevelThickness:r,curveSegments:5});g.translate(0,0,-(d-r*2)/2);
    return mesh(g,mat,x,y,z,parent);
  }
  function lathe(points,mat,x,y,z,parent=room) { return mesh(new T.LatheGeometry(points.map(p=>new T.Vector2(...p)),32),mat,x,y,z,parent); }
  function contact(x,z,sx,sz,opacity=.23,parent=room) { const mat=new T.MeshBasicMaterial({map:tex.shadow,transparent:true,opacity,depthWrite:false});const o=mesh(new T.PlaneGeometry(1,1),mat,x,.012,z,parent);o.rotation.x=-Math.PI/2;o.scale.set(sx,sz,1);o.castShadow=false;return o; }

  // Four enclosed sides, a real opening in the window wall, and a timber ceiling.
  const floorMat=material('#b28a62',{map:tex.floor,roughness:.68});
  box(8,.12,7,floorMat,0,-.07,0).name='floor';
  box(8,3.65,.16,m.plaster,0,1.825,3.55).name='entry-wall';
  box(.16,3.65,7,m.olive,-4.05,1.825,0).name='library-wall';
  box(.16,3.65,7,m.plaster,4.05,1.825,0).name='lounge-wall';
  box(3.55,3.65,.16,m.plaster,-2.275,1.825,-3.55);
  box(.55,3.65,.16,m.plaster,3.775,1.825,-3.55);
  box(4,.88,.16,m.plaster,1.5,.44,-3.55);
  box(4,.54,.16,m.plaster,1.5,3.38,-3.55);
  box(8,.12,7,m.trim,0,3.7,0).name='ceiling';
  for(const x of [-3.7,-1.25,1.25,3.7])box(.13,.15,7,m.darkWood,x,3.57,0);
  for(const z of [-3.43,3.43])box(8,.18,.07,m.trim,0,.09,z);
  for(const x of [-3.93,3.93])box(.07,.18,7,m.trim,x,.09,0);
  // Panel mouldings lend the quieter walls some depth when you turn around.
  for(const x of [-2.75,-.95,.95,2.75]){
    for(const xx of [x-.68,x+.68])box(.025,1.25,.035,m.trim,xx,.94,3.43);
    for(const yy of [.315,1.565])box(1.38,.025,.035,m.trim,x,yy,3.43);
  }

  // The view outside changes continuously from peach sunset to a starry blue night.
  const skyMaterial=new T.ShaderMaterial({side:T.DoubleSide,uniforms:{dusk:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float dusk;void main(){vec3 sunset=mix(vec3(.94,.59,.35),vec3(.48,.38,.50),smoothstep(0.,1.,vUv.y));vec3 night=mix(vec3(.16,.20,.30),vec3(.045,.065,.15),vUv.y);gl_FragColor=vec4(mix(sunset,night,dusk),1.);}`});
  const sky=mesh(new T.PlaneGeometry(22,12),skyMaterial,0,2,-9);sky.name='sunset-to-night-sky';sky.castShadow=false;
  const sun=mesh(new T.CircleGeometry(.47,48),new T.MeshBasicMaterial({color:'#ffe5ad',transparent:true}),2.3,2.4,-8.8);sun.castShadow=false;
  const moon=mesh(new T.SphereGeometry(.18,24,16),new T.MeshBasicMaterial({color:'#e5e5c4'}),-.3,4.2,-8.4);moon.castShadow=false;
  const stars=new T.Group();stars.name='night-stars';room.add(stars);
  const starMaterial=new T.MeshBasicMaterial({color:'#ecdfbc',transparent:true,opacity:0});
  const rand=seeded(53);
  for(let i=0;i<54;i++){const s=mesh(new T.SphereGeometry(.009+rand()*.014,6,4),starMaterial,(rand()-.5)*16,1.8+rand()*5,-8.2,stars);s.castShadow=false;}
  for(let j=0;j<3;j++){
    const points=[[-12,-1],[12,-1]];for(let i=20;i>=0;i--)points.push([-12+i*1.2,.35+j*.22+Math.sin(i*.66+j)*.3+Math.cos(i*.38)*.25]);
    const shape=new T.Shape(points.map(p=>new T.Vector2(...p)));const hill=mesh(new T.ShapeGeometry(shape),material(['#8b7f67','#687062','#485a53'][j]),0,0,-7.7+j*.7);hill.castShadow=false;
  }
  for(let i=0;i<11;i++){const x=-7+i*1.4;const h=.6+rand()*.7;box(.055,h,.04,m.dark,x,h/2,-5.7);const crown=mesh(new T.ConeGeometry(.28,h*.9,7),m.sage,x,h,-5.7);crown.castShadow=false;}

  const windowGroup=group('window-and-casements',1.5,0,-3.43);
  for(const x of [-2,2])box(.11,2.3,.18,m.darkWood,x,2,0,windowGroup);
  for(const y of [.9,3.13])box(4.1,.12,.18,m.darkWood,0,y,0,windowGroup);
  box(4.3,.1,.4,m.wood,0,.86,.06,windowGroup);
  const panes=[];
  for(const side of [-1,1]){
    const hinge=group('opening-window-pane',side*1.94,2.02,-.02,windowGroup);panes.push(hinge);
    const center=-side*.96;
    for(const x of [0,-side*1.92])box(.055,2.12,.065,m.trim,x,0,0,hinge);
    for(const y of [-1.04,1.04,0])box(1.92,.055,.065,m.trim,center,y,0,hinge);
    box(.045,2.08,.045,m.trim,center,0,0,hinge);
    const glazing=mesh(new T.PlaneGeometry(1.86,2.05),new T.MeshPhysicalMaterial({color:'#f6dcaf',transparent:true,opacity:.065,side:T.DoubleSide,roughness:.08,depthWrite:false}),center,0,-.02,hinge);glazing.castShadow=false;
    cylinder(.018,.018,.12,m.brass,-side*1.72,-.2,.065,hinge).rotation.z=Math.PI/2;
  }
  // Linen cloth is subdivided and deformed; the hems remain attached to the rod.
  cylinder(.025,.025,4.9,m.brass,1.5,3.27,-3.05).rotation.z=Math.PI/2;
  const curtains=[];
  for(const side of [-1,1]){
    const g=new T.PlaneGeometry(.88,2.64,18,30);const o=mesh(g,m.linen,1.5+side*2.02,1.89,-2.98);o.name='linen-curtain';o.castShadow=false;
    curtains.push({mesh:o,base:g.attributes.position.array.slice(),side});
    for(let i=0;i<8;i++){const ring=mesh(new T.TorusGeometry(.035,.009,5,12),m.brass,1.5+side*2.02-.4+i*.114,3.25,-3.04);ring.rotation.y=Math.PI/2;}
  }
  const fairy=group('window-fairy-lights',1.5,3.2,-2.91);
  const lightPoints=[];
  for(let i=0;i<=40;i++){const x=-2.15+i*4.3/40;lightPoints.push([x,-.18-.16*Math.cos(x*1.3),0]);}
  curve(lightPoints,.008,m.darkWood,fairy);
  const fairyGlows=[];
  for(let i=0;i<25;i++){
    const x=-2.1+i*4.2/24,y=-.18-.16*Math.cos(x*1.3),drop=.05+(i%3)*.018;
    cylinder(.006,.006,drop,m.darkWood,x,y-drop/2,0,fairy,6);
    ball(.023,.032,.023,m.bulb,x,y-drop,0,fairy);
    const glow=new T.Sprite(new T.SpriteMaterial({map:tex.glow,color:'#ffb85c',transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));glow.position.set(x,y-drop,.02);glow.scale.set(.29,.29,1);fairy.add(glow);fairyGlows.push(glow);
  }

  // A real walnut writing desk, with paper, an opening notebook, flowers and wine.
  const desk=group('walnut-writing-desk',1.1,0,-2.25);
  softBox(2.65,.10,1.05,.025,m.wood,0,.99,0,desk);
  for(const x of [-1.15,1.15])for(const z of [-.36,.36]){const leg=box(.09,.94,.09,m.darkWood,x,.47,z,desk);leg.rotation.z=-x*.025;}
  for(const x of [-.8,.8]){box(.66,.2,.88,m.darkWood,x,.83,0,desk);ball(.025,.025,.025,m.brass,x,.83,.45,desk);}
  box(2.35,.045,.035,m.brass,0,.92,.43,desk);
  const notebook=group('opening-notebook',-.15,1.055,.03,desk);notebook.rotation.y=.16;
  box(.57,.025,.43,m.wine,0,0,0,notebook);box(.54,.026,.4,m.paper,0,.024,0,notebook);
  notebook.visible=false; // The single HTML diary is the narrator; no duplicate book on the desk.
  const cover=group('notebook-cover',-.285,.045,0,notebook);box(.57,.015,.43,m.wine,.285,0,0,cover);
  const pageInk=mesh(new T.PlaneGeometry(.43,.29),new T.MeshBasicMaterial({map:tex.note,transparent:true}),0,.04,0,notebook);pageInk.rotation.x=-Math.PI/2;pageInk.castShadow=false;
  const pencil=cylinder(.011,.011,.38,material('#9e4f36'),.35,1.065,.22,desk,8);pencil.rotation.z=Math.PI/2;pencil.rotation.y=.18;
  const wine=group('wine-glass',.76,1.055,.18,desk);
  lathe([[0,0],[.085,.006],[.09,.015],[.02,.025],[.01,.17],[.04,.19],[.085,.24],[.095,.32],[.075,.39]],m.glass,0,0,0,wine);
  lathe([[0,.205],[.06,.21],[.085,.25],[.091,.29]],material('#672b3c',{roughness:.24,metalness:.25}),0,0,0,wine);
  const flowers=group('vase-flowers',1.03,1.05,-.23,desk);
  lathe([[.04,0],[.065,.02],[.075,.10],[.06,.19],[.035,.25],[.04,.29]],m.glass,0,0,0,flowers);
  const bouquet=group('swaying-bouquet',0,.06,0,flowers);
  const petalMats=['#d5a087','#ead7ae','#a8665d'].map(c=>material(c));
  for(let i=0;i<7;i++){
    const a=i*2.4,h=.46+(i%3)*.065,x=Math.cos(a)*.11,z=Math.sin(a)*.11;
    curve([[0,0,0],[x*.2,.24,z*.3],[x,h,z]],.005,m.sage,bouquet);
    for(let k=0;k<5;k++){const petal=ball(.04,.015,.065,petalMats[i%3],x+Math.cos(k*1.257)*.034,h,z+Math.sin(k*1.257)*.034,bouquet);petal.rotation.y=-k*1.257;petal.rotation.z=.25;}
    ball(.018,.018,.018,m.brass,x,h+.008,z,bouquet);
    const leaf=ball(.02,.006,.075,m.sage,x*.5,.31,z*.4,bouquet);leaf.rotation.y=a;leaf.rotation.z=.45;
  }
  const deskLamp=group('brass-desk-lamp',-.93,1.055,-.22,desk);
  cylinder(.14,.16,.035,m.brass,0,.02,0,deskLamp);
  curve([[0,.04,0],[0,.37,0],[.1,.53,0],[.22,.49,0]],.016,m.brass,deskLamp);
  const shade=group('desk-lamp-shade',.22,.48,0,deskLamp);
  mesh(new T.CylinderGeometry(.10,.21,.21,32,1,true),m.shade,0,0,0,shade);
  cylinder(.055,.055,.025,m.bulb,0,-.06,0,shade);
  const lampLight=new T.PointLight('#ffc17c',0,5,2);lampLight.position.set(-.71,1.5,-2.47);room.add(lampLight);
  const lampGlow=new T.Sprite(new T.SpriteMaterial({map:tex.glow,color:'#ffb66c',transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));lampGlow.position.copy(lampLight.position);lampGlow.scale.set(.7,.7,1);room.add(lampGlow);
  const chair=group('desk-chair-pulls-out',.7,0,-1.35);chair.rotation.y=.06;
  for(const x of [-.28,.28])for(const z of [-.23,.23])box(.045,.54,.045,m.darkWood,x,.27,z,chair);
  softBox(.7,.15,.61,.055,m.wine,0,.58,0,chair);
  softBox(.68,.66,.12,.06,m.wine,0,.96,.26,chair);
  for(const x of [-.34,.34]){box(.035,.37,.035,m.brass,x,.72,.12,chair);softBox(.07,.06,.5,.02,m.darkWood,x,.87,0,chair);}
  for(const x of [-.17,.17])for(const y of [.8,1.03])ball(.013,.013,.013,m.brass,x,y,.18,chair);
  contact(.7,-1.35,1.2,1.1);

  // The reading corner is visible both from the desk and from behind.
  const lounge=group('wine-velvet-reading-chair',2.98,0,.15);lounge.rotation.y=-.65;
  for(const x of [-.42,.42])for(const z of [-.37,.37])cylinder(.035,.045,.25,m.wood,x,.125,z,lounge);
  softBox(1.16,.3,1.08,.12,m.wine,0,.4,0,lounge);
  softBox(.85,.16,.8,.06,m.wine,0,.62,-.02,lounge);
  const loungeBack=softBox(1.11,.96,.25,.1,m.wine,0,.92,-.45,lounge);loungeBack.rotation.x=-.12;
  for(const x of [-.51,.51])softBox(.23,.48,.95,.10,m.wine,x,.71,0,lounge);
  const pillow=softBox(.48,.43,.16,.07,m.linen,-.14,.91,-.21,lounge);pillow.rotation.z=.18;pillow.rotation.x=-.2;
  const throwMat=material('#a78257',{map:tex.linen,side:T.DoubleSide});
  const throwCloth=mesh(new T.PlaneGeometry(.42,.9,10,18),throwMat,.46,.66,.25,lounge);throwCloth.rotation.y=Math.PI/2;throwCloth.rotation.z=-.24;const tp=throwCloth.geometry.attributes.position;for(let i=0;i<tp.count;i++)tp.setZ(i,.025*Math.cos(tp.getX(i)*38));tp.needsUpdate=true;throwCloth.geometry.computeVertexNormals();
  contact(2.98,.15,1.7,1.6);
  const sideTable=group('reading-side-table',3.12,0,1.52);
  cylinder(.34,.34,.055,m.wood,0,.67,0,sideTable);cylinder(.05,.07,.64,m.brass,0,.32,0,sideTable);cylinder(.25,.29,.04,m.brass,0,.025,0,sideTable);
  box(.29,.045,.22,m.wine,0,.72,0,sideTable);box(.25,.035,.20,m.paper,.03,.758,.01,sideTable);
  const mug=lathe([[.05,0],[.067,.02],[.07,.14],[.06,.15]],material('#b48261'),.03,.78,.03,sideTable);
  mesh(new T.TorusGeometry(.047,.01,8,24),material('#b48261'),.10,.86,.03,sideTable);
  const floorLamp=group('standing-lamp',3.36,0,-1.28);
  cylinder(.22,.26,.045,m.brass,0,.025,0,floorLamp);cylinder(.018,.022,1.82,m.brass,0,.94,0,floorLamp);
  const floorShade=mesh(new T.CylinderGeometry(.26,.40,.43,36,1,true),m.shade,0,1.92,0,floorLamp);
  const floorLight=new T.PointLight('#ffca87',0,5,2);floorLight.position.set(3.36,1.76,-1.28);room.add(floorLight);
  const floorGlow=lampGlow.clone();floorGlow.material=lampGlow.material.clone();floorGlow.position.copy(floorLight.position);floorGlow.scale.set(1.1,1.1,1);room.add(floorGlow);

  const rug=mesh(new T.CircleGeometry(1,80),material('#ffffff',{map:tex.rug,roughness:1}),.35,.014,.35);rug.name='woven-oval-rug';rug.rotation.x=-Math.PI/2;rug.scale.set(2.5,1.76,1);
  const dogBed=group('retriever-cushion',2.02,0,.52);
  const bedMat=material('#9b9676',{map:tex.linen});
  ball(.68,.12,.51,bedMat,0,.12,0,dogBed);const bedRim=mesh(new T.TorusGeometry(.49,.085,12,56),bedMat,0,.17,0,dogBed);bedRim.rotation.x=Math.PI/2;bedRim.scale.set(1.27,1,1);
  const dog=makeRetriever({group,ball,curve,mesh,box,m});room.add(dog.root);
  const dogShadow=contact(2.02,.52,1.3,1.25,.26);

  // Dreamcatcher: wrapped hoop, concentric woven loops, beads and individual feathers.
  const dream=group('woven-dreamcatcher',3.45,3.12,-2.65);
  curve([[0,0,0],[0,-.22,0]],.006,m.trim,dream);
  mesh(new T.TorusGeometry(.245,.016,10,72),material('#b28755'),0,-.47,0,dream);
  const webCenter=new T.Vector3(0,-.47,0);const webLines=[];
  for(let ring=0;ring<8;ring++){
    const rad=.24*Math.pow(.76,ring),points=[];
    for(let j=0;j<=13;j++){const a=j/13*Math.PI*2+ring*.23;points.push([Math.cos(a)*rad,-.47+Math.sin(a)*rad,.003*Math.sin(j)]);if(j<13){const b=a+Math.PI*2/13*.5;points.push([Math.cos(b)*rad*.72,-.47+Math.sin(b)*rad*.72,.003]);}}
    webLines.push(line(points,m.thread,dream));
  }
  ball(.022,.022,.016,m.brass,0,-.47,.015,dream);
  const feathers=[];
  for(let i=0;i<5;i++){
    const x=(i-2)*.09,startY=-.47-Math.sqrt(.245**2-x*x),length=.19+(2-Math.abs(i-2))*.055;
    line([[x,startY,0],[x,startY-length,0]],m.thread,dream);
    for(let j=0;j<2;j++)ball(.014,.02,.014,j?m.brass:m.trim,x,startY-length*.4-j*.05,0,dream);
    const f=group('individual-dreamcatcher-feather',x,startY-length,0,dream);feathers.push(f);
    const shape=new T.Shape();shape.moveTo(0,0);shape.bezierCurveTo(.065,-.07,.072,-.19,0,-.29);shape.bezierCurveTo(-.07,-.19,-.055,-.06,0,0);
    const feather=mesh(new T.ShapeGeometry(shape,16),material(i%2?'#d3ba8f':'#eee1c6',{side:T.DoubleSide}),0,0,0,f);feather.castShadow=false;
    line([[0,0,.004],[.008,-.15,.007],[0,-.30,.002]],m.thread,f);
    const barbs=[];for(let j=1;j<14;j++){const y=-j*.019,width=Math.sin(j/15*Math.PI)*.052;barbs.push([0,y,.006],[-width,y+.033,.006],[0,y,.006],[width,y+.025,.006]);}
    const b=new T.LineSegments(new T.BufferGeometry().setFromPoints(barbs.map(p=>new T.Vector3(...p))),new T.LineBasicMaterial({color:'#ae9572',transparent:true,opacity:.6}));f.add(b);
  }

  // Furnishing the other half of the room is what makes the 360 view meaningful.
  const library=group('floor-to-ceiling-library',-3.68,0,-.65);library.rotation.y=Math.PI/2;
  box(2.6,2.82,.34,m.darkWood,0,1.41,0,library);
  box(2.38,2.60,.04,m.olive,0,1.42,-.19,library);
  for(const x of [-1.25,0,1.25])box(.07,2.8,.46,m.wood,x,1.42,.03,library);
  for(const y of [.13,.72,1.31,1.90,2.49,2.82])box(2.6,.065,.46,m.wood,0,y,.03,library);
  const bookColors=['#8b4e47','#a17d54','#d0b789','#6e775d','#70584e','#c19b70'];
  const bookMaterials=bookColors.map(color=>material(color));
  for(let row=0;row<4;row++)for(let col=0;col<2;col++){
    let x=-1.13+col*1.25;
    for(let i=0;i<8;i++){
      const w=.065+rand()*.06,h=.31+rand()*.14;
      const b=box(w,h,.25,bookMaterials[(row*3+i+col)%6],x+w/2,.77+row*.59+h/2,.10,library);if(i===6)b.rotation.z=.13;
      for(const off of [-.11,.11])box(w*.8,.008,.006,m.brass,x+w/2,.77+row*.59+h/2+off,.23,library);
      x+=w+.016;
    }
  }
  const readingBench=group('library-bench',-3.31,0,1.48);readingBench.rotation.y=Math.PI/2;
  for(const x of [-.6,.6])for(const z of [-.22,.22])box(.065,.4,.065,m.wood,x,.2,z,readingBench);
  softBox(1.6,.18,.62,.055,m.linen,0,.48,0,readingBench);
  const benchPillow=softBox(.48,.16,.44,.065,m.wine,.37,.64,0,readingBench);benchPillow.rotation.z=-.12;
  const entrance=group('entry-door',2.5,0,3.42);entrance.rotation.y=Math.PI;
  box(1.12,2.55,.075,m.darkWood,0,1.275,0,entrance);
  for(const x of [-.61,.61])box(.11,2.68,.13,m.trim,x,1.34,0,entrance);
  box(1.33,.12,.13,m.trim,0,2.68,0,entrance);
  for(const y of [.68,1.84]){box(.82,.96,.04,m.wood,0,y,.055,entrance);for(const x of [-.43,.43])box(.025,1,.018,m.brass,x,y,.083,entrance);}
  ball(.035,.035,.035,m.brass,-.4,1.12,.11,entrance);
  // Writing wall: typography is a texture on a framed object, legible and intentional.
  const picture=group('framed-studio-manifesto',-.5,2.25,3.42);picture.rotation.y=Math.PI;
  box(1.35,1.0,.055,m.darkWood,0,0,0,picture);box(1.28,.93,.06,m.brass,0,0,.015,picture);
  const art=mesh(new T.PlaneGeometry(1.20,.85),new T.MeshBasicMaterial({map:tex.manifesto}),0,0,.055,picture);art.castShadow=false;
  const console=group('entry-console',-.45,0,3.03);
  box(2.2,.075,.53,m.wood,0,.86,0,console);for(const x of [-.98,.98])for(const z of [-.18,.18])box(.045,.83,.045,m.darkWood,x,.42,z,console);
  for(let i=0;i<3;i++){const b=box(.42,.055,.31,bookMaterials[i],-.6,.94+i*.055,0,console);b.rotation.y=i*.1;}
  lathe([[.1,0],[.15,.1],[.12,.24],[.065,.3],[.055,.43]],material('#bc8464'),.55,.9,0,console);
  curve([[.55,1.1,0],[.52,1.5,0],[.75,1.7,.05]],.006,m.sage,console);
  for(let i=0;i<5;i++){const leaf=ball(.1,.012,.045,m.sage,.53+i*.04,1.32+i*.065,.01,console);leaf.rotation.z=.5+i*.2;}
  const artWall=group('botanical-art',3.94,2.05,1.55);artWall.rotation.y=-Math.PI/2;
  box(1,1.35,.06,m.darkWood,0,0,0,artWall);const bot=mesh(new T.PlaneGeometry(.89,1.24),new T.MeshBasicMaterial({map:tex.botanical}),0,0,.04,artWall);bot.castShadow=false;
  const ceilingPendant=group('ceiling-pendant',-.25,3.65,.35);
  cylinder(.008,.008,.55,m.dark,0,-.28,0,ceilingPendant);
  mesh(new T.SphereGeometry(.3,32,16,0,Math.PI*2,0,Math.PI*.55),m.shade,0,-.68,0,ceilingPendant);
  const ceilingLight=new T.PointLight('#ffd4a3',0,7,2);ceilingLight.position.set(-.25,2.72,.35);room.add(ceilingLight);

  const ambient=new T.HemisphereLight('#ffe0b5','#7e5f44',1.9);scene.add(ambient);
  const sunLight=new T.DirectionalLight('#ffd1a0',3.2);sunLight.position.set(3.5,4.2,-6);sunLight.target.position.set(-1,0,.8);scene.add(sunLight,sunLight.target);
  sunLight.castShadow=true;sunLight.shadow.mapSize.set(2048,2048);sunLight.shadow.camera.left=-6;sunLight.shadow.camera.right=6;sunLight.shadow.camera.top=6;sunLight.shadow.camera.bottom=-6;sunLight.shadow.camera.near=.5;sunLight.shadow.camera.far=18;sunLight.shadow.normalBias=.025;sunLight.shadow.bias=-.00025;sunLight.shadow.radius=3;
  // A small warm bounce keeps books, velvet and the dog readable after sunset.
  const bounce=new T.DirectionalLight('#eebc8d',.55);bounce.position.set(-2,3,3);scene.add(bounce);
  const dustGeo=new T.BufferGeometry(),dustPos=[];for(let i=0;i<70;i++)dustPos.push((rand()-.5)*6,.4+rand()*2.8,(rand()-.5)*5);
  dustGeo.setAttribute('position',new T.Float32BufferAttribute(dustPos,3));
  const dust=new T.Points(dustGeo,new T.PointsMaterial({color:'#ffe0a6',map:tex.glow,size:.035,transparent:true,opacity:.28,depthWrite:false,blending:T.AdditiveBlending}));dust.name='breeze-dust';room.add(dust);

  const daytime=new T.Color('#ffe0b5'),nighttime=new T.Color('#9eafcd');
  function update(progress,time=0,options={}) {
    const s=eveningState(progress,options),t=options.reduced?0:time;
    skyMaterial.uniforms.dusk.value=s.dusk;
    sun.position.y=s.sunHeight;sun.material.opacity=1-smooth(.4,.88,s.dusk);moon.visible=s.dusk>.5;starMaterial.opacity=smooth(.48,.95,s.dusk)*.8;
    ambient.color.copy(daytime).lerp(nighttime,s.dusk);ambient.intensity=mix(1.9,.64,s.dusk);
    sunLight.intensity=mix(3.2,.05,s.dusk);sunLight.position.y=mix(4.2,.2,s.dusk);bounce.intensity=mix(.55,.22,s.dusk);
    lampLight.intensity=s.lamp*19;floorLight.intensity=s.lamp*22;ceilingLight.intensity=smooth(.62,.93,s.dusk)*17;
    m.shade.emissiveIntensity=s.lamp*.55;m.bulb.emissiveIntensity=s.fairy*3;
    lampGlow.material.opacity=s.lamp*.24;floorGlow.material.opacity=s.lamp*.2;
    fairyGlows.forEach((g,i)=>{g.material.opacity=s.fairy*(.43+Math.sin(t*.7+i*.4)*.035);});
    fairy.rotation.z=Math.sin(t*.7)*s.breeze*.013;fairy.rotation.x=Math.sin(t*.9)*s.breeze*.04;
    panes[0].rotation.y=-s.breeze*.28;panes[1].rotation.y=s.breeze*.28;
    for(const {mesh:o,base,side} of curtains){const attr=o.geometry.attributes.position;for(let i=0;i<attr.count;i++){const x=base[i*3],y=base[i*3+1],down=(1.32-y)/2.64;attr.setXYZ(i,x+Math.sin(t*1.3+y*2+side)*s.breeze*.11*down,y,Math.cos(x*35)*.047+Math.sin(y*2+t*1.5+side)*s.breeze*.13*down);}attr.needsUpdate=true;o.geometry.computeVertexNormals();}
    dream.rotation.z=Math.sin(t*1.25)*(.012+s.breeze*.085);dream.rotation.x=Math.sin(t*.84)*s.breeze*.08;
    feathers.forEach((f,i)=>{f.rotation.z=Math.sin(t*1.8+i)*(.015+s.breeze*.12);f.rotation.y=Math.sin(t*1.2+i)*s.breeze*.25;});
    bouquet.rotation.z=Math.sin(t*1.4)*(.005+s.breeze*.04);shade.rotation.z=Math.sin(t*.7)*s.breeze*.014;
    chair.position.z=-1.35+s.chair*.62;chair.position.x=.7-s.chair*.16;chair.rotation.y=.06-s.chair*.55;
    cover.rotation.z=s.notebook*Math.PI*.94;
    updateRetriever(dog,s,t,options);
    dogShadow.position.set(s.dogX,.018,s.dogZ);dogShadow.scale.set(1.3,1.25,1);
    dust.position.x=Math.sin(t*.15)*s.breeze*.1;dust.position.y=Math.sin(t*.18)*.08;
    return s;
  }
  update(0,0);
  return {scene,update,objects:{room,chair,dog,panes,dream,feathers,curtains,fairy,flowers,bouquet,deskLamp,sky,sun,moon,lampLight,floorLight,ceilingLight,ambient,cover,library,entrance},dispose(){const gs=new Set(),ms=new Set();scene.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(v=>ms.add(v));});gs.forEach(g=>g.dispose());ms.forEach(v=>v.dispose());Object.values(tex).forEach(v=>v.dispose());}};
}

function makeRetriever({group,ball,curve,mesh,box,m}) {
  const root=group('golden-retriever'),body=group('retriever-torso',0,0,0,root);
  ball(.27,.30,.59,m.fur,0,0,0,body);ball(.29,.31,.30,m.furLight,0,.05,.34,body);
  ball(.245,.275,.30,m.fur,0,0,-.38,body);
  // Soft overlapping locks form the chest ruff and the feathered haunches.
  for(let i=0;i<18;i++){const a=i*2.4,y=(i%6)*.065-.13;const lock=ball(.065,.13,.085,i%3?m.furLight:m.fur,Math.cos(a)*.22,y,.40+Math.sin(a)*.10,body);lock.rotation.z=Math.cos(a)*.4;}
  for(const side of [-1,1])for(let i=0;i<5;i++){const lock=ball(.055,.14,.07,m.furLight,side*.24,-.12-i*.018,-.32+i*.065,body);lock.rotation.z=side*.3;}
  const head=group('retriever-head',0,.30,.5,body);
  ball(.235,.235,.25,m.furLight,0,.035,.10,head);
  ball(.155,.12,.22,m.furLight,0,-.035,.32,head);
  ball(.14,.065,.17,m.fur,0,-.105,.33,head);
  ball(.073,.047,.046,m.eye,0,-.015,.513,head);
  const ears=[];
  for(const side of [-1,1]){
    const ear=group('floppy-ear',side*.215,.12,.04,head);ears.push(ear);
    const flap=ball(.10,.225,.13,m.furDark,side*.025,-.18,0,ear);flap.rotation.z=-side*.12;
    for(let i=0;i<4;i++)ball(.033,.10,.035,m.fur,side*.06,-.25+i*.018,-.055+i*.027,ear);
    ball(.047,.034,.033,m.eye,side*.158,.071,.27,head);
    ball(.011,.011,.008,m.paper,side*.16,.084,.298,head);
    const brow=ball(.055,.026,.037,m.fur,side*.16,.121,.265,head);brow.rotation.z=side*-.18;
  }
  const mouth=curve([[-.09,-.10,.43],[0,-.12,.47],[.09,-.10,.43]],.006,m.eye,head);
  const lids=[];for(const side of [-1,1]){const lid=ball(.052,.035,.034,m.furLight,side*.158,.074,.277,head);lids.push(lid);}
  const legs=[];
  for(const z of [.38,-.38])for(const side of [-1,1]){
    const leg=group('articulated-leg',side*.205,-.08,z,body);
    ball(.085,.19,.10,m.fur,0,-.14,0,leg);
    const knee=group('retriever-knee',0,-.29,.01,leg);
    ball(.055,.16,.06,m.furLight,0,-.14,0,knee);
    ball(.09,.065,.13,m.furLight,0,-.29,.063,knee);
    for(let j=0;j<3;j++)ball(.025,.035,.035,m.fur,(j-1)*.048,-.31,.157,knee);
    legs.push({pivot:leg,knee,side,front:z>0});
  }
  const tail=group('feathered-tail',0,.08,-.56,body),tailSegments=[];let parent=tail;
  for(let i=0;i<6;i++){
    const node=group('tail-joint',0,0,i?-.14:0,parent);node.rotation.x=.17;
    ball(.073-i*.008,.082-i*.008,.14,m.fur,0,0,-.08,node);
    for(const side of [-1,1]){const f=ball(.035,.09-i*.008,.07,m.furLight,side*.036,-.04,-.07,node);f.rotation.z=-side*.3;}
    tailSegments.push(node);parent=node;
  }
  const collarMat=new T.MeshStandardMaterial({color:'#6c393b',roughness:.75});
  const collar=mesh(new T.TorusGeometry(.19,.018,8,36),collarMat,0,.25,.49,body);collar.rotation.x=Math.PI/2-.6;
  const tag=mesh(new T.SphereGeometry(.029,12,8),m.brass,0,.06,.62,body);tag.scale.z=.3;
  return {root,body,head,ears,lids,legs,tail,tailSegments};
}
function updateRetriever(d,s,t,options) {
  const breath=options.reduced?0:Math.sin(t*1.6)*.008;
  d.root.position.set(s.dogX,mix(.42,.73,Math.sqrt(s.standing))+.13*Math.sin(s.standing*Math.PI)+breath,s.dogZ);
  d.root.rotation.y=s.dogTurn;
  d.body.rotation.z=mix(.09,0,s.standing);
  d.body.scale.y=1+breath;
  d.head.rotation.x=mix(.42,-.06,s.waking);
  d.head.rotation.z=Math.sin(t*.7)*s.waking*.025;
  d.head.position.y=mix(.07,.30,s.waking);
  d.lids.forEach(l=>{l.visible=s.waking<.48;});
  const moving=s.walk>.003&&s.walk<.998&&!options.reduced;
  for(const leg of d.legs){
    const phase=(leg.front?0:Math.PI)+(leg.side>0?0:Math.PI);
    const gait=moving?Math.sin(s.gait+phase)*.44:0;
    leg.pivot.rotation.x=mix(-1.35,gait,s.standing);
    leg.pivot.rotation.z=mix(leg.side*.34,0,s.standing);
    leg.knee.rotation.x=mix(2.9,moving?Math.max(0,-Math.sin(s.gait+phase))*.52:0,s.standing);
  }
  d.ears.forEach((ear,i)=>{ear.rotation.z=(i?1:-1)*.08+Math.sin(t*1.8+i)*s.waking*.035;ear.rotation.x=moving?Math.sin(s.gait)*.07:0;});
  d.tail.rotation.y=Math.sin(t*(s.waking>0?4:1.2))*(.025+s.waking*.24);
  d.tail.rotation.x=mix(-.3,.28,s.standing);
}

function seeded(seed) { return () => { seed=(seed*1664525+1013904223)>>>0;return seed/4294967296; }; }
function makeTextures() {
  function canvas(size,draw,w=size,h=size){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t;}
  const random=seeded(17);
  const wood=canvas(1024,(c,w,h)=>{c.fillStyle='#b79570';c.fillRect(0,0,w,h);for(let i=0;i<1500;i++){const y=random()*h;c.strokeStyle=`rgba(${random()>.5?'65,35,19':'246,214,166'},${.02+random()*.07})`;c.lineWidth=.4+random()*2;c.beginPath();c.moveTo(0,y);for(let x=0;x<=w;x+=24)c.lineTo(x,y+Math.sin(x*.009+i*.03)*5+Math.sin(x*.023+i)*2);c.stroke();}});
  wood.wrapS=wood.wrapT=T.RepeatWrapping;
  const floor=canvas(1024,(c,w,h)=>{c.fillStyle='#b58d64';c.fillRect(0,0,w,h);for(let row=0;row<12;row++){const hh=h/12;for(let k=-1;k<5;k++){const x=k*w/4+(row%2)*w/8;c.fillStyle=['#b18b64','#b9956e','#c3a17b','#ad865f'][(row*3+k+5)%4];c.fillRect(x,row*hh,w/4,hh);c.strokeStyle='#77573b66';c.lineWidth=1.2;c.strokeRect(x,row*hh,w/4,hh);for(let j=0;j<40;j++){c.strokeStyle='#5b3b2310';c.beginPath();const yy=row*hh+random()*hh;c.moveTo(x,yy);c.bezierCurveTo(x+50,yy+3,x+160,yy-2,x+w/4,yy+2);c.stroke();}}}});floor.wrapS=floor.wrapT=T.RepeatWrapping;floor.repeat.set(2,2);
  const plaster=canvas(256,(c,w,h)=>{c.fillStyle='#eee5d5';c.fillRect(0,0,w,h);for(let i=0;i<10000;i++){c.fillStyle=`rgba(105,82,56,${random()*.07})`;c.fillRect(random()*w,random()*h,random()*3,random()*2);}});plaster.wrapS=plaster.wrapT=T.RepeatWrapping;plaster.repeat.set(3,2);
  const linen=canvas(256,(c,w,h)=>{c.fillStyle='#eee5d9';c.fillRect(0,0,w,h);for(let i=0;i<256;i+=2){c.strokeStyle=i%4?'#89745c26':'#ffffff99';c.lineWidth=.6;c.beginPath();c.moveTo(i,0);c.lineTo(i,h);c.moveTo(0,i);c.lineTo(w,i);c.stroke();}});linen.wrapS=linen.wrapT=T.RepeatWrapping;linen.repeat.set(3,3);
  const glow=canvas(128,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'#ffffff');g.addColorStop(.12,'#ffffffdd');g.addColorStop(.35,'#ffffff44');g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(0,0,w,h);});
  const shadow=canvas(128,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'#21150fe6');g.addColorStop(.4,'#21150fa0');g.addColorStop(1,'#21150f00');c.fillStyle=g;c.fillRect(0,0,w,h);});
  const rug=canvas(1024,(c,w,h)=>{c.fillStyle='#9b6955';c.fillRect(0,0,w,h);for(let r=490;r>50;r-=35){c.strokeStyle=Math.round(r/35)%2?'#d5b782':'#714738';c.lineWidth=8;c.beginPath();c.ellipse(512,512,r,r,0,0,Math.PI*2);c.stroke();}for(let i=0;i<8;i++)for(let j=0;j<8;j++){const x=160+i*100,y=160+j*100;if(Math.hypot(x-512,y-512)>350)continue;c.save();c.translate(x,y);c.rotate(Math.PI/4);c.fillStyle=(i+j)%2?'#bd9970':'#76594a';c.fillRect(-16,-16,32,32);c.restore();}for(let i=0;i<18000;i++){c.fillStyle=random()>.5?'#efdab51a':'#2a170b14';c.fillRect(random()*w,random()*h,1,2);}});
  const manifesto=canvas(1024,(c,w,h)=>{c.fillStyle='#efe1c5';c.fillRect(0,0,w,h);c.textAlign='center';c.fillStyle='#936b48';c.font='16px Georgia';c.fillText('S T U D I O   N A V Y A',w/2,104);c.fillStyle='#6a3b3d';c.font='italic 84px Georgia';c.fillText('Good stories',w/2,250);c.fillText('begin with',w/2,350);c.fillText('a little warmth.',w/2,450);c.fillStyle='#7a7e5a';c.font='20px Georgia';c.fillText('STRATEGY  ·  STORY  ·  SOUL',w/2,620);c.strokeStyle='#ba9c6e';c.strokeRect(35,35,w-70,h-70);},1024,725);
  const botanical=canvas(512,(c,w,h)=>{c.fillStyle='#e4d5b8';c.fillRect(0,0,w,h);c.strokeStyle='#777c58';c.lineWidth=5;c.beginPath();c.moveTo(245,650);c.bezierCurveTo(165,450,360,270,245,70);c.stroke();for(let i=0;i<9;i++){c.save();c.translate(245+Math.sin(i*.6)*24,110+i*53);c.rotate((i%2?1:-1)*.8);c.fillStyle=i%3?'#7f8660':'#a58d5c';c.beginPath();c.ellipse(0,-28,17,43,0,0,Math.PI*2);c.fill();c.restore();}c.fillStyle='#8a704c';c.font='13px Georgia';c.textAlign='center';c.fillText('a little room to grow',w/2,680);},512,725);
  const note=canvas(512,(c,w,h)=>{c.fillStyle='#f2e5c7';c.fillRect(0,0,w,h);c.fillStyle='#784d3c';c.font='italic 44px Georgia';c.fillText('Your next chapter.',35,90);c.strokeStyle='#af9a75';c.lineWidth=2;for(let i=0;i<7;i++){c.beginPath();c.moveTo(35,145+i*33);c.lineTo(w-50-(i%3)*32,145+i*33);c.stroke();}c.fillStyle='#78805a';c.font='italic 35px Georgia';c.fillText('with intention, Navya',35,440);});
  return {wood,floor,plaster,linen,glow,shadow,rug,manifesto,botanical,note};
}
