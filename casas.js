var scene,camera,renderer;
let agua, aguaGeo, aguaMat, tiempo = 0;
let casa,casa2,isla;
let grupoIsla = new THREE.Group();
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
function crearCasa(posX, posY, posZ) {
  const grupoCasa = new THREE.Group();
  function cilindro(radio, alto, x, y, z, color) {
    let geometry = new THREE.CylinderGeometry(radio, radio, alto, 32);
    let material = new THREE.MeshPhongMaterial({ color: color});
    let cilindro = new THREE.Mesh(geometry, material);
    cilindro.position.set(x, y, z);
    grupoCasa.add(cilindro);
    return cilindro;
  }
  let j = 2.5;
  for (let i = 0; i < 30; i++) {
    cilindro(0.05, 2.5, -1.5, 0, i * 0.1, 0xE4D96F);
    cilindro(0.05, 2.5,  1.5, 0, i * 0.1, 0xE4D96F);
    if (i <= 14) {
      cilindro(0.05, j, i * 0.1 - 1.5, j/2 - 1.25, 0,   0xE4D96F);
      cilindro(0.05, j, i * 0.1 - 1.5, j/2 - 1.25, 2.9, 0xE4D96F);
      j += 0.06;
    } else {
      cilindro(0.05, j, i * 0.1 - 1.5, j/2 - 1.25, 0,   0xE4D96F);
      cilindro(0.05, j, i * 0.1 - 1.5, j/2 - 1.25, 2.9, 0xE4D96F);
      j -= 0.06;
    }
  }
  for (let i = 0; i < 30; i++) {
    let tDer = cilindro(0.05, 2.5, -1, 1.6, i * 0.1, 0xC29A4A);
    tDer.rotation.z = -60 * (Math.PI / 180);
    let tIzq = cilindro(0.05, 2.5,  1, 1.6, i * 0.1, 0xC29A4A);
    tIzq.rotation.z =  60 * (Math.PI / 180);
  }
  let frontalDer = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    let p = cilindro(0.05, 2.5, i * 0.09 + 0.5, -0.2, 2.93, 0xC29A4A);
    frontalDer.add(p);
  }
  frontalDer.rotation.z = 60 * (Math.PI / 180);
  grupoCasa.add(frontalDer);
  let frontalIzq = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    let p = cilindro(0.05, 2.5, i * 0.09 - 1.9, -0.2, 2.92, 0xC29A4A);
    frontalIzq.add(p);
  }
  frontalIzq.rotation.z = -60 * (Math.PI / 180);
  grupoCasa.add(frontalIzq);
  let geoP = new THREE.PlaneGeometry(0.7, 1.4,2,2);
  let matP = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.DoubleSide });
  let puerta = new THREE.Mesh(geoP, matP);
  puerta.position.set(0, -0.5, 3);
  grupoCasa.add(puerta);
  grupoCasa.position.set(posX, posY, posZ);
  scene.add(grupoCasa);
  return grupoCasa;
}
function crearCasaTotora(x, y, z){
    let casa = new THREE.Group();
    let colorTotora = new THREE.MeshPhongMaterial({color: 0xd2b16d});
    let radio = 2;
    let altoPared = 2.4;
    let palos = 160;
    for(let i = 0; i < palos; i++){
        let geo = new THREE.CylinderGeometry(0.04,0.04,altoPared,6);
        let palo = new THREE.Mesh(geo,colorTotora);
        let ang = i * Math.PI * 2 / palos;
        palo.position.set(Math.cos(ang) * radio,altoPared / 2,Math.sin(ang) * radio);
        palo.rotation.y = ang;
        casa.add(palo);
    }
    let radioTecho = 1;
    let alturaPunta = altoPared + 2;
    let cantidadTecho = 120;
    for(let i = 0; i < cantidadTecho; i++){
        let geo = new THREE.CylinderGeometry(0.04,0.04,3.3,6);
        let palo = new THREE.Mesh(geo,colorTotora);
        let ang = i * Math.PI * 2 / cantidadTecho;
        let px = Math.cos(ang) * radioTecho;
        let pz = Math.sin(ang) * radioTecho;
        palo.position.set(px,altoPared + 1.15,pz);
        palo.lookAt(0, alturaPunta, 0);
        palo.rotateX(Math.PI/2);
        casa.add(palo);
    }
    let geoP = new THREE.PlaneGeometry(0.9,1.7);
    let matP = new THREE.MeshPhongMaterial({color: 0x000000,side: THREE.DoubleSide});
    let puerta = new THREE.Mesh(geoP, matP);
    puerta.position.set(0,0.8,radio+0.04);
    casa.add(puerta);
    casa.position.set(x,y,z);
    scene.add(casa);
    return casa;
}
function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1a2b); 
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0, 4, 8);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.getElementById("contenedor3D").appendChild(renderer.domElement);  
  const luzDir2 = new THREE.DirectionalLight(0xE4D96F, 3);
  luzDir2.position.set(-5, -5, 5);
  scene.add(luzDir2);
  const lightAmb = new THREE.PointLight(0xE4D96F, 1);
  lightAmb.position.set(0, 0, 0);
  scene.add(lightAmb);
  const luzaAmbiental = new THREE.AmbientLight(0xE4D96F, 0.3);
  scene.add(luzaAmbiental);
  scene.fog = new THREE.Fog(0x0b1a2b, 10, 80);
  casa = crearCasaTotora(0,0.5,-0.5);
  casa.rotation.y = 10*(Math.PI/180);
  casa2 = crearCasa(7,1.9,-1);
  casa2.rotation.y = 330*(Math.PI/180);
  scene.remove(casa);
  scene.remove(casa2);
  grupoIsla.add(casa);
  grupoIsla.add(casa2);
  cargarModelo("isla.glb", 3, -0.8, 0, 1.2, 1, 0.7, 3,function(modelo){isla = modelo;scene.remove(isla);grupoIsla.add(isla);});
  grupoIsla.position.set(2,-1,-2);
  scene.add(grupoIsla);

  aguaGeo = new THREE.PlaneGeometry(200, 200, 100, 100);
  aguaMat = new THREE.MeshPhongMaterial({color: 0x2E42FF,transparent: true,opacity: 0.7,shininess: 100});
  agua = new THREE.Mesh(aguaGeo, aguaMat);
  agua.rotation.x = -Math.PI / 2;
  agua.position.y = -0.8; 
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
  if(grupoIsla){
    grupoIsla.rotation.y += 0.01;
}
  pos.needsUpdate = true;
  agua.geometry.computeVertexNormals();
  renderer.render(scene, camera);
}
init();
animate();