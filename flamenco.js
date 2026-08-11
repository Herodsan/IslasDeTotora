var scene,camera,renderer;
let agua, aguaGeo, aguaMat, tiempo = 0;
let casa,casa2,isla;
let materialEstrellas;
let moviendoMouse = false;
let ultimaX = 0;
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

function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1a2b); 
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0, 3.3, 8);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.getElementById("contenedor3D").appendChild(renderer.domElement);  

  renderer.domElement.addEventListener("mousedown", function(event){
      moviendoMouse = true;
      ultimaX = event.clientX;
  });
  renderer.domElement.addEventListener("mouseup", function(){
      moviendoMouse = false;
  });
  renderer.domElement.addEventListener("mousemove", function(event){
      if(moviendoMouse && grupoIsla){
          let movimiento = event.clientX - ultimaX;
          grupoIsla.rotation.y += movimiento * 0.01;
          ultimaX = event.clientX;
      }
    
  });

  const luzDir1 = new THREE.DirectionalLight(0xE4D96F, 1);
  luzDir1.position.set(3, -1, 5);
  scene.add(luzDir1);
  const luzDir2 = new THREE.DirectionalLight(0xE4D96F, 3);
  luzDir2.position.set(3, 0, 5);
  scene.add(luzDir2);
  const lightAmb = new THREE.PointLight(0xE4D96F, 1);
  lightAmb.position.set(0, 0, 0);
  scene.add(lightAmb);
  const luzaAmbiental = new THREE.AmbientLight(0xE4D96F, 0.3);
  scene.add(luzaAmbiental);
  scene.fog = new THREE.Fog(0x0b1a2b, 10, 80);
  
  cargarModelo("isla.glb", 0, -0.8, 0, 0.6, 1, 0.5, 3,function(modelo){isla = modelo;scene.remove(isla);grupoIsla.add(isla);}); 
  cargarModelo("flamenco.glb", 0, 0.8, 0, 0.4, 0.5, 0.4, 0, function(modelo){pez = modelo;scene.remove(modelo);grupoIsla.add(modelo);});
  grupoIsla.position.set(3.4,-1.3,1);
  scene.add(grupoIsla);
  //estrellas
  const datosEstrellas = crearEstrellas(scene);
  const estrellas = datosEstrellas.estrellas;
  materialEstrellas = datosEstrellas.material;
  estrellas.position.y = -13;
  
  aguaGeo = new THREE.PlaneGeometry(200, 200, 100, 100);
  aguaMat = new THREE.MeshPhongMaterial({color: 0x2E42FF,transparent: true,opacity: 0.7,shininess: 100});
  agua = new THREE.Mesh(aguaGeo, aguaMat);
  agua.rotation.x = -Math.PI / 2;
  agua.position.y = -0.8; 
  scene.add(agua);
}
function animate() {
  requestAnimationFrame(animate);
  if(grupoIsla){
        grupoIsla.rotation.y += 0.01;
    }
  agua.geometry.computeVertexNormals();
  renderer.render(scene, camera);
}
init();
animate();