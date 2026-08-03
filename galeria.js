var scene,camera,renderer;
let agua, aguaGeo, aguaMat, tiempo = 0;
let anguloBarco = 120*(Math.PI/180);
let barco2;
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
  camera.position.set(-6, 3, 17);
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
  scene.fog = new THREE.Fog(0x0b1a2b, 10, 80);
  
  crearCasa(-4,0,-4);
  crearCasa(1.5,0,-4);
  crearCasaTotora(-7,-1.5,0.5);
  crearCasa(4,0,2);
  // isla de la izquierda
  cargarModelo("isla.glb", -18, -2.2, -10, 1, 0.5, 0.5, 3);
  let casaIzq1 = crearCasa(-20,0,-12);
  casaIzq1.rotation.y = 20*(Math.PI/180);
  cargarModelo("planta.glb", -23.5, -2.1, -8.3, 0.3, 0.3, 0.3, 2); 
  cargarModelo("planta.glb", -13.5, -2.1, -6.8, 0.3, 0.3, 0.3, 2); 
  cargarModelo("barco3.glb",-19, -2, -5,0.2, 0.3, 0.3,2);
  // isla de la derecha
  cargarModelo("isla.glb", 18, -2.2, -10, 1, 0.5, 0.5, 3);
  let casaDer1 = crearCasaTotora(21,-1.5,-12);
  casaDer1.rotation.y = 320*(Math.PI/180);
  cargarModelo("planta.glb", 22.8, -2.1, -7, 0.3, 0.3, 0.3, 2); 
  cargarModelo("planta.glb", 12, -2.1, -8.8, 0.3, 0.3, 0.3, 2); 
  cargarModelo("planta.glb", 13, -2.1, -15, 0.3, 0.3, 0.3, 2); 
  cargarModelo("barco3.glb",20, -2, -4.5,0.2, 0.3, 0.3,2);
  //isla del medio
  cargarModelo("isla.glb", 0, -3, 0, 1.8, 1, 1, 3);
  cargarModelo("planta.glb", -10.3, -2.5, 3.5, 0.3, 0.3, 0.3, 2);
  cargarModelo("planta.glb", -11.5, -2.5, 2.5, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, -2.5, 5.5, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, -2.5, 6, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, -2.5, 6.5, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", -9.4, -2, 5, 0.2, 0.2, 0.2, 1);
  cargarModelo("planta.glb", 8, -2,7.3, 0.2, 0.2, 0.2, 1);
  cargarModelo("barcoDoble.glb",-15, -3, 10,0.8, 0.8, 0.8,1.5,function(modelo){barco2 = modelo;});
  cargarModelo("barco3.glb",0, -2, 9,0.2, 0.3, 0.3,1.5,function(modelo){barco = modelo;});
  
  aguaGeo = new THREE.PlaneGeometry(200, 200, 100, 100);
  aguaMat = new THREE.MeshPhongMaterial({color: 0x2E42FF,transparent: true,opacity: 0.7,shininess: 100});

  agua = new THREE.Mesh(aguaGeo, aguaMat);
  agua.rotation.x = -Math.PI / 2;
  agua.position.y = -2; 
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

  if(barco){
    anguloBarco -= 0.002;
    barco.position.x = Math.cos(anguloBarco) * 12;
    barco.position.z = Math.sin(anguloBarco) * 12;
    barco.position.y = -2 + Math.sin(tiempo * 2) * 0.08;
    barco.lookAt(
      Math.cos(anguloBarco + 0.1) * 12,
      barco.position.y,
      Math.sin(anguloBarco + 0.1) * 12
    );
  }
  if (barco2) {
  barco2.position.x += 0.02;
  barco2.position.y = -2.9 + Math.sin(tiempo * 2) * 0.08;
  if (barco2.position.x > 30) {
    barco2.position.x = -18;
  }
}
  renderer.render(scene, camera);
}
init();
animate();s