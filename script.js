let agua, aguaGeo, aguaMat, tiempo = 0;
let anguloBarco = 120*(Math.PI/180);
let barco;
let barco2;
let direccion = 1;
let controls;
let destinoCamara = new THREE.Vector3();
let destinoLook = new THREE.Vector3();
let paginaCultura = 0;
let animCamara = {
    activa: false,
    inicio: new THREE.Vector3(),
    objetivo: new THREE.Vector3(),
    lookInicio: new THREE.Vector3(),
    lookObjetivo: new THREE.Vector3(),
    tiempo: 0,
    duracion: 1.5
};
let materialEstrellas;
const cultura = [
{
    titulo: "Origen del pueblo Uru",
    texto: "Los Urus son uno de los pueblos más antiguos del altiplano andino, anteriores incluso a los incas y aymaras. Según su tradición, se establecieron en el Lago Titicaca como una forma de refugio y adaptación al entorno acuático. Con el tiempo, desarrollaron una forma de vida única basada completamente en el lago, convirtiéndose en un pueblo estrechamente ligado al agua y a la totora.",
    // cam: { x: -4, y: 1, z: 12 },
    // look: { x: -3, y: 0, z: 0 }
    cam: { x: 0, y: 1, z: 12 },
    look: { x: 0, y: 0, z: 0 }
},
{
    titulo: "Viviendas flotantes",
    texto: "Las viviendas de los Urus están construidas sobre islas artificiales hechas de totora, un material vegetal que crece en el lago. Estas islas requieren mantenimiento constante, ya que la base se descompone con el tiempo y debe ser reemplazada. Las casas también son ligeras y hechas del mismo material, lo que permite que toda la comunidad viva sobre una superficie flotante.",
    cam: { x: 12, y: 1, z: -4 },
    look: { x: 16, y: -1, z: -10 }
},
{
    titulo: "Barcos de totora",
    texto: "Los Urus utilizan embarcaciones hechas de totora para desplazarse por el Lago Titicaca, pescar y realizar actividades comerciales. Estos barcos son ligeros, resistentes y fáciles de construir con materiales naturales del entorno. Además de su función práctica, también representan una tradición cultural que ha pasado de generación en generación.",
    cam: { x: -22, y: 1, z: 0 },
    look: { x: -18, y: 0, z: -2 }
  },
{
    titulo: "Mirador de las Islas Uros",
    texto: "Los miradores son estructuras elevadas construidas principalmente con madera y totora que permiten observar el paisaje del Lago Titicaca y las diferentes islas flotantes. Desde estos puntos es posible apreciar la organización de la comunidad, las viviendas, las embarcaciones y la belleza natural del entorno. Además de ser un atractivo para los visitantes, los miradores reflejan la creatividad y el conocimiento tradicional de los pobladores en el aprovechamiento de los recursos naturales.",
    cam: { x: -25, y: 2, z: 25 },
    look: { x: -23, y: 1, z: 19 }
  },
{
    titulo: "Pez elaborado con Totora",
    texto: "El pez de totora es una representación artesanal inspirada en las especies que habitan el Lago Titicaca. Elaborado con fibras secas de totora, simboliza la importancia de la pesca como una actividad tradicional para los habitantes de las islas flotantes. Estas figuras también forman parte de las artesanías que los pobladores elaboran para compartir su cultura y fortalecer el turismo local.",
    cam: { x: 8.52, y: 1.80, z: 36.66 },
    look: { x: 25, y: -1.5, z: 19 }
  },
{
    titulo: "Arco de Bienvenida",
    texto: "El arco de bienvenida, elaborado con totora, recibe a los visitantes que llegan a las islas flotantes de los Uros. Esta estructura representa la hospitalidad de la comunidad y destaca la importancia de la totora como material de construcción y símbolo de identidad cultural. Su diseño refleja las técnicas tradicionales transmitidas de generación en generación y constituye uno de los elementos más fotografiados por los turistas.",
    cam: { x: -4, y: 1, z: 12 },
    look: { x: -3, y: 0, z: 0 }
},
{
    titulo: "La totora",
    texto: "La totora es una planta acuática que crece en las orillas del Lago Titicaca y constituye el recurso natural más importante para el pueblo Uru. Con ella construyen las islas flotantes, las viviendas, las embarcaciones, los miradores y diversos objetos de uso cotidiano. Gracias a su resistencia, flexibilidad y capacidad de flotar, la totora ha permitido que esta cultura conserve su forma de vida durante siglos. Además de su utilidad práctica, representa un símbolo de identidad y de la estrecha relación entre los habitantes y el lago.",
    cam: { x: -18, y: 0.33, z: 42 }, 
    look: { x: 29, y: -2.36, z: 0.4 }
}
];

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

function crearCasa(posX, posY, posZ,rotY = 0) {
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
  grupoCasa.rotation.y = rotY;
  scene.add(grupoCasa);
  return grupoCasa;
}
function moverCamara(){
    // guardar inicio
    animCamara.inicio.copy(camera.position);
    animCamara.objetivo.set(cultura[paginaCultura].cam.x,cultura[paginaCultura].cam.y,cultura[paginaCultura].cam.z);
    animCamara.lookInicio.copy(destinoLook);
    animCamara.lookObjetivo.set(cultura[paginaCultura].look.x,cultura[paginaCultura].look.y,cultura[paginaCultura].look.z);
    animCamara.tiempo = 0;
    animCamara.activa = true;
}
function cameraReset(){
    animCamara.inicio.copy(camera.position);
    animCamara.objetivo.set(-6, 3, 17);
    animCamara.lookInicio.copy(destinoLook);
    animCamara.lookObjetivo.set(0, 0, 0);
    animCamara.tiempo = 0;
    animCamara.activa = true;
}
function easeInOut(t){
    return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function actualizarInfo(){
    const panel = document.getElementById("panelInfo");
    panel.classList.remove("izquierda", "derecha");
    if(paginaCultura % 2 === 0){
        panel.classList.add("derecha");
    }else{
        panel.classList.add("izquierda");
    }
    document.getElementById("tituloInfo").innerHTML = cultura[paginaCultura].titulo;
    document.getElementById("textoInfo").innerHTML = cultura[paginaCultura].texto;
    const btnSiguiente = document.getElementById("btnSiguiente");
    if(paginaCultura === cultura.length - 1){
        btnSiguiente.disabled = true;
    }else{
        btnSiguiente.disabled = false;
    }
}
function mostrarCultura(){
    document.getElementById("inicioInfo").style.display = "none";
    document.getElementById("panelInfo").style.display = "block";
    paginaCultura = 0;
    actualizarInfo();
    moverCamara(); // 👈 INICIA EN ORIGEN URO
}
function siguienteInfo(){
    if(paginaCultura < cultura.length - 1){
        paginaCultura++;
        actualizarInfo();
        moverCamara();
    }
}
function anteriorInfo(){
    if(paginaCultura > 0){
        paginaCultura--;
        actualizarInfo();
        moverCamara(); // 👈 ESTO ES LO QUE FALTA
    }
    else{
        document.getElementById("panelInfo").style.display = "none";
        document.getElementById("inicioInfo").style.display = "block";
        cameraReset();
    }
}
function crearCasaTotora(x, y, z, rotY = 0){
    let casa = new THREE.Group();
    let colorTotora = new THREE.MeshPhongMaterial({color: 0xd2b16d});
    let radio = 2;
    let altoPared = 2.4;
    let palos = 160;
    // Paredes
    for(let i = 0; i < palos; i++){
        let geo = new THREE.CylinderGeometry(0.04, 0.04, altoPared, 6);
        let palo = new THREE.Mesh(geo, colorTotora);
        let ang = i * Math.PI * 2 / palos;
        palo.position.set(Math.cos(ang) * radio,altoPared / 2,Math.sin(ang) * radio);
        palo.rotation.y = ang;
        casa.add(palo);
    }
    // Techo
    let radioTecho = 1;
    let alturaPunta = altoPared + 2;
    let cantidadTecho = 120;
    for(let i = 0; i < cantidadTecho; i++){
        let geo = new THREE.CylinderGeometry(0.04, 0.04, 3.3, 6);
        let palo = new THREE.Mesh(geo, colorTotora);
        let ang = i * Math.PI * 2 / cantidadTecho;
        let px = Math.cos(ang) * radioTecho;
        let pz = Math.sin(ang) * radioTecho;
        palo.position.set(px,altoPared + 1.15,pz);
        palo.lookAt(0, alturaPunta, 0);
        palo.rotateX(Math.PI / 2);
        casa.add(palo);
    }
    let geoP = new THREE.PlaneGeometry(0.9, 1.7);
    let matP = new THREE.MeshPhongMaterial({color: 0x000000,side: THREE.DoubleSide}); 
    let puerta = new THREE.Mesh(geoP, matP);
    puerta.position.set(0,0.8,radio + 0.04);
    casa.add(puerta);
    casa.position.set(x, y, z);
    casa.rotation.y = rotY;
    scene.add(casa);
    return casa;
}
//luna
function crearLuna(x, y, z){
    const textura = new THREE.TextureLoader().load("luna.jpg");
    const geo = new THREE.SphereGeometry(1.5, 32, 32);
    const mat = new THREE.MeshStandardMaterial({map: textura});
    const luna = new THREE.Mesh(geo, mat);
    luna.position.set(x, y, z);
    // Halo
    const haloGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({color: 0xffffff,transparent: true,opacity: 0.15,side: THREE.BackSide});
    const halo = new THREE.Mesh(haloGeo, haloMat);
    luna.add(halo);
    scene.add(luna);
    return luna;
}
function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1a2b); 
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(-6, 3, 17);
  destinoCamara.set(-6,3,17);
  destinoLook.set(0,0,0);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.getElementById("contenedor3D").appendChild(renderer.domElement);  
  const luzDir2 = new THREE.DirectionalLight(0xE4D96F, 3);
  luzDir2.position.set(-5, -5, 5);
  scene.add(luzDir2);
  const luzPunt = new THREE.PointLight(0xE4D96F, 1);
  luzPunt.position.set(0, 0, 0);
  scene.add(luzPunt);
  const luzPunt2 = new THREE.PointLight(0xE4D96F, 1);
  luzPunt2.position.set(-21, -3, 17);
  scene.add(luzPunt2);
  scene.fog = new THREE.Fog(0x0b1a2b, 10, 80);
  crearCasa(-2.7,0,-3);
  crearCasa(2,0,-3);
  crearCasaTotora(-7,-1.5,1.8);
  crearCasa(5,0,2);
  // isla de la izquierda
  cargarModelo("isla.glb", -18, -2.2, -10, 1, 0.5, 0.5, 0);
  crearCasa(-21,-0.1,-11,20*(Math.PI/180));
  cargarModelo("cisne.glb", -15, -1.5, -8.3,0.5, 0.6, 0.5, 150 * Math.PI / 180); 
  cargarModelo("planta.glb", -23.5, -2.1, -8.3, 0.3, 0.3, 0.3, 2); 
  cargarModelo("planta.glb", -13.5, -2.1, -6.8, 0.3, 0.3, 0.3, 2); 
  cargarModelo("barco3.glb",-18, -1.8, -5,0.5, 0.5, 0.5,0.5);
  // isla de la derecha
  cargarModelo("isla.glb", 18, -2.2, -10, 1, 0.5, 0.5, 3);
  crearCasaTotora(21,-1.5,-10,320*(Math.PI/180));
  cargarModelo("cisne.glb", 15, -1.5, -9,0.5, 0.6, 0.5, 20 * Math.PI / 180); 
  cargarModelo("planta.glb", 22.8, -2.1, -7, 0.3, 0.3, 0.3, 2); 
  cargarModelo("planta.glb", 12, -2.1, -8.8, 0.3, 0.3, 0.3, 2); 
  cargarModelo("planta.glb", 13, -2.1, -15, 0.3, 0.3, 0.3, 2); 
  cargarModelo("barco3.glb",17, -1.8, -4.5,0.5, 0.5, 0.5,2.5);
  //isla del medio
  cargarModelo("isla.glb", 0, -3, 0, 1.8, 1, 1, 3);
  cargarModelo("planta.glb", -10.3, -2.5, 3.5, 0.3, 0.3, 0.3, 2);
  cargarModelo("planta.glb", -11.5, -2.5, 2.5, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, -2.5, 5.5, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, -2.5, 6, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, -2.5, 6.5, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", -9.4, -2, 5, 0.2, 0.2, 0.2, 1);
  cargarModelo("planta.glb", 8, -2,7.3, 0.2, 0.2, 0.2, 1);
  cargarModelo("barcoDoble.glb",-15, 0, 10,2, 2, 2,3,function(modelo){barco2 = modelo;});
  cargarModelo("barco3.glb",0, -2, 9,0.5, 0.5, 0.5,3,function(modelo){barco = modelo;});
  cargarModelo("arco.glb", -1, -1, 4.5, 1, 1, 1, 3);

  cargarModelo("nube.glb", -20, 11,-5, 9, 9, 9, 1);
  cargarModelo("nube.glb", 25, 15,-5, 9, 9, 9, 1);
  cargarModelo("nube.glb", -10, 15,-30, 9, 9, 9, 2);
  cargarModelo("nube.glb", 20, 15,-30, 9, 9, 9, 5.5);
  cargarModelo("nube.glb", 26, 16,-30, 9, 9, 9, 1);
  cargarModelo("nube.glb", -45, 11,-10, 9, 9, 9, 3);
  cargarModelo("nube.glb", -45, 11,20, 9, 9, 9, 3);
  cargarModelo("nube.glb", 35, 11,20, 9, 9, 9, 3);

  //adelante izquierda
  cargarModelo("isla.glb", -25, -3, 17, 1.3, 1, 1, 0.5);
  crearCasaTotora(-25,-1.5,16,10 * Math.PI / 180);
  crearCasa(-29,-0.5,19,40 * Math.PI / 180);
  cargarModelo("mirador.glb", -20, -3, 17, 0.7, 1, 0.7, 2);
  cargarModelo("barco3.glb",-18, -1.8, 23,0.5, 0.5, 0.5,0.5 );
  cargarModelo("planta.glb", -16, -2,15.5, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -15.5, -2,17, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -15, -2,18, 0.4, 0.3, 0.4, 1);
  
  cargarModelo("planta.glb", -28, -2,23.5, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -27.5, -2,24, 0.4, 0.3, 0.4, 1);

  //adelante derecha
  cargarModelo("isla.glb", 17, -3, 25, 1.3, 1, 1.5, 0.5);
  crearCasaTotora(17,-1.5,19,-45 * Math.PI / 180);
  crearCasa(21.5,-0.5,23.5,-60* Math.PI / 180);
  crearCasaTotora(22.5,-1.5,29,-60 * Math.PI / 180);
  crearCasa(12,-0.5,19,-10* Math.PI / 180);
  cargarModelo("miradorPez.glb", 14, -1.5, 29, 0.5, 0.6, 0.5, -50 * Math.PI / 180);
  cargarModelo("barcoDoble.glb", 7, -2.5, 27, 2, 2, 2, 120 * Math.PI / 180);

  // totora 
  cargarModelo("planta.glb", -13.5, -2,39, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -14, -2,38.5, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -14.5, -2,38, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -15, -2,37.5, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -15.5, -2,37, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -16, -2,36.5, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -16.5, -2,36, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -17, -2,35.5, 0.4, 0.3, 0.4, 1);
  //estrellas
  materialEstrellas = crearEstrellas(scene);
  //luna
  crearLuna(0,22,-35);

  aguaGeo = new THREE.PlaneGeometry(200, 200, 100, 100);
  aguaMat = new THREE.MeshPhongMaterial({color: 0x2E42FF,transparent: true,opacity: 0.7,shininess: 100});
  agua = new THREE.Mesh(aguaGeo, aguaMat);
  agua.rotation.x = -Math.PI / 2;
  agua.position.y = -2; 
  scene.add(agua);
  
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 50;
}
function animate() {
  if (materialEstrellas) {
    materialEstrellas.opacity =
        0.7 + Math.sin(tiempo * 4) * 0.3;
  }
 if(animCamara.activa){
    animCamara.tiempo += 0.016; // ~60fps
    let t = animCamara.tiempo / animCamara.duracion;
    if(t >= 1){
        t = 1;
        animCamara.activa = false;
    }
    const e = easeInOut(t);
    camera.position.lerpVectors(animCamara.inicio,animCamara.objetivo,e);

    destinoLook.lerpVectors(animCamara.lookInicio,animCamara.lookObjetivo,e);
  }
  camera.lookAt(destinoLook);
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
    anguloBarco -= 0.002;
    barco.position.x = Math.cos(anguloBarco) * 14;
    barco.position.z = Math.sin(anguloBarco) * 12;
    barco.position.y = -2 + Math.sin(tiempo * 2) * 0.08;
    barco.rotation.y = -anguloBarco + 5;
}
  if (barco2) {
  barco2.position.x += 0.025;
  barco2.position.y = -2.4 + Math.sin(tiempo * 2) * 0.08;
  if (barco2.position.x > 30) {
    barco2.position.x = -18;
  }
}
  // controls.update();

//   const info = document.getElementById("posCamara");

// info.innerHTML =
// `Camara:
// x: ${camera.position.x.toFixed(2)}
// y: ${camera.position.y.toFixed(2)}
// z: ${camera.position.z.toFixed(2)}

// Look:
// x: ${destinoLook.x.toFixed(2)}
// y: ${destinoLook.y.toFixed(2)}
// z: ${destinoLook.z.toFixed(2)}`;


  renderer.render(scene, camera);
}
init();
animate();
