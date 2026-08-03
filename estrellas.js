function crearEstrellas(scene) {

    const cantidad = 5000;

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < cantidad; i++) {

        let x = (Math.random() - 0.5) * 200;
        let y = Math.random() * 80 + 20;
        let z = (Math.random() - 0.5) * 200;

        vertices.push(x, y, z);
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
    );

    const materialEstrellas = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const estrellas = new THREE.Points(geometry, materialEstrellas);

    scene.add(estrellas);

    return materialEstrellas;
}