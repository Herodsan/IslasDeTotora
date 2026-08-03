var scene,camera,renderer;
let agua, aguaGeo, aguaMat, tiempo = 0;
let barco,barco2;
const loader = new THREE.GLTFLoader();

function cargarModelo(ruta, x, y, z, sx, sy, sz, rotY = 0, callback = null) {
  loader.load(ruta, function(gltf) {
    const modelo = gltf.scene;
    modelo.position.set(x, y, z);
    modelo.scale.set(sx, sy, sz);
    modelo.rotation.y = rotY;
    scene.add(modelo);
    if(callback){
      callback(modelo);
    }
  });
}

function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1a2b); 
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0, 4, 8);
//   camera.position.set(-6, 3, 17);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.getElementById("contenedor3D").appendChild(renderer.domElement);  
  const luzDir2 = new THREE.DirectionalLight(0xE4D96F, 3);
  luzDir2.position.set(0, 0.5, 5);
  scene.add(luzDir2);
  const lightAmb = new THREE.PointLight(0xE4D96F, 1);
  lightAmb.position.set(0, 0, 0);
  scene.add(lightAmb);
  const luzaAmbiental = new THREE.AmbientLight(0xE4D96F, 1);
//   scene.add(luzaAmbiental);
  scene.fog = new THREE.Fog(0x0b1a2b, 10, 80);


  cargarModelo("planta.glb", -2, 0, -1, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 9, 0, -1, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, 0, -1, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, 0, -3, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", -1.5, 0, -3, 0.3, 0.3, 0.3, 3);
  cargarModelo("barcoDoble.glb",3.5, -0.5, 1,2.3, 2.3, 2.3,5.5,function(modelo){barco2 = modelo;});
  cargarModelo("barco3.glb",-20, 0, -6,0.8, 0.7, 0.7,3,function(modelo){barco = modelo;});
  aguaGeo = new THREE.PlaneGeometry(200, 200, 100, 100);
  aguaMat = new THREE.MeshPhongMaterial({color: 0x2E42FF,transparent: true,opacity: 0.7,shininess: 100});
  agua = new THREE.Mesh(aguaGeo, aguaMat);
  agua.rotation.x = -Math.PI / 2;
  agua.position.y = 0; 
  scene.add(agua);
}
function animate() {
  requestAnimationFrame(animate);
  tiempo += 0.02;
  const pos = agua.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = Math.sin(x * 0.2 + tiempo) * 0.2 + Math.cos(y * 0.2 + tiempo) * 0.2;
    pos.setZ(i, z);
  }
  pos.needsUpdate = true;
  agua.geometry.computeVertexNormals();
  if (barco) {
  barco.position.x += 0.08;
  barco.position.y = 0 + Math.sin(tiempo * 2) * 0.08;
  if (barco.position.x > 30) {
    barco.position.x = -18;
  }
}
if(barco2){
    barco2.rotation.y += 0.01;
}
  renderer.render(scene, camera);
}
init();
animate();