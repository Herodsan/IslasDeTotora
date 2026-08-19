var scene,camera,renderer;
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
  camera.position.set(0, 5.5, 8);
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

  renderer.domElement.addEventListener("touchstart", function(event){
      moviendoMouse = true;
      ultimaX = event.touches[0].clientX;
  }, { passive: true });

  renderer.domElement.addEventListener("touchmove", function(event){
      if(moviendoMouse && grupoIsla){
          let nuevaX = event.touches[0].clientX;
          let movimiento = nuevaX - ultimaX;
          grupoIsla.rotation.y += movimiento * 0.01;
          ultimaX = nuevaX;
      }
      event.preventDefault();
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

    // 3. Luces puntuales suavizadas para los barcos/islas
    const luzPunt = new THREE.PointLight(0xffffff, 0.5);
    luzPunt.position.set(0, 5, 5);
    scene.add(luzPunt);

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
  
    cargarModelo("islaFlamenco.glb", 3.5, 0.3, 0, 0.8, 0.8, 0.8, -98 * Math.PI / 180, function(modeloCargado) {
        grupoIsla = modeloCargado;
      });

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
  if (grupoIsla) {
    grupoIsla.rotation.y += 0.005;
  }
  renderer.render(scene, camera);
}
init();
animate();