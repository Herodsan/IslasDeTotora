var scene,camera,renderer;
let totoras = [];
let moviendoMouse = false;
let ultimaX = 0;
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

  renderer.domElement.addEventListener("mousedown", function(event){
      moviendoMouse = true;
      ultimaX = event.clientX;
  });
  renderer.domElement.addEventListener("mouseup", function(){
      moviendoMouse = false;
  });
  renderer.domElement.addEventListener("mousemove", function(event){
      if(moviendoMouse && totoras.length > 0){
          let movimiento = event.clientX - ultimaX;
          totoras.forEach(function(totora){
              totora.rotation.y += movimiento * 0.01;
          });
          ultimaX = event.clientX;
      }
  });

    renderer.domElement.addEventListener("touchstart", function(event){
      if(event.touches.length === 1){
          moviendoMouse = true;
          ultimaX = event.touches[0].clientX;
      }

  }, { passive: false });

  renderer.domElement.addEventListener("touchmove", function(event){
      if(moviendoMouse && totoras.length > 0){
          event.preventDefault();
          let posicionActual = event.touches[0].clientX;
          let movimiento = posicionActual - ultimaX;
          totoras.forEach(function(totora){
              totora.rotation.y += movimiento * 0.01;
          });
          ultimaX = posicionActual;
      }

  }, { passive: false });
  renderer.domElement.addEventListener("touchend", function(){
      moviendoMouse = false;
  });

  renderer.domElement.style.touchAction = "none";
  
  
  // 1. Luz Ambiental suave (mantiene los tonos neutros en todo el modelo)
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(luzAmbiental);

    // 2. Luz del Sol/Luna desde ARRIBA (no desde abajo) con intensidad moderada
    const luzDir2 = new THREE.DirectionalLight(0xffffff, 1.2); 
    luzDir2.position.set(10, 20, 10); // Desde arriba y con ángulo
    scene.add(luzDir2);

    // --- PRUEBA DE SKY (cielo nocturno) ---
    sky = new THREE.Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 8;
    skyUniforms['rayleigh'].value = 3;
    skyUniforms['mieCoefficient'].value = 0.01;
    skyUniforms['mieDirectionalG'].value = 0.95;

    const solSky = new THREE.Vector3();
    const elevacion = 4;  // sol bajo el horizonte, probando de noche
    const azimuth = 220;
    const phi = THREE.MathUtils.degToRad(90 - elevacion);
    const theta = THREE.MathUtils.degToRad(azimuth);
    solSky.setFromSphericalCoords(1, phi, theta);
    skyUniforms['sunPosition'].value.copy(solSky);

  cargarModelo("planta.glb", 7, -1, 2, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 6, -1, 1, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 5, -1, 1, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 4, -1, 2, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 4, -1, 0, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 3, -1, 2, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 2, -1, 1, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 1, -1, 2, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});

  // Agua realista
  const aguaGeometry = new THREE.PlaneGeometry(200, 200);
  water = new THREE.Water(aguaGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
          'https://threejs.org/examples/textures/waternormals.jpg',
          function (textura) {
              textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
          }
      ),
      sunDirection: luzDir2.position.clone().normalize(),
      sunColor: 0xffffff,
      waterColor: 0x0e2a3d,
      distortionScale: 1.8,
      fog: scene.fog !== undefined
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.1;
  scene.add(water);

}
function animate() {
  requestAnimationFrame(animate);
  if (water) {
    water.material.uniforms['time'].value += 0.6 / 60.0;
  }
  totoras.forEach(totora => {
    totora.rotation.y += 0.01;
});
  renderer.render(scene, camera);
}
init();
animate();