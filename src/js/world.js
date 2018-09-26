const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

let renderer,
    camera,
    scene;

function initWorld(canvasEl) {
  // Scene, camera, canvas, renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvasEl });

  camera.position.z = 300;
  scene.add(camera);
  renderer.setSize(WIDTH, HEIGHT);

  // Light
  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(0, 0, 6);
  scene.add(light);

  return scene;
}

// Convert range function
const convertRange = (value, r1, r2) => {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
};


function updateMeshes(meshPromise, mappaMap, scene) {
  meshPromise.then((meshes) => {
    for (let mesh of meshes) {
      const pos = mappaMap.latLngToPixel(mesh.appData.latitude, mesh.appData.longitude);
      const vector = new THREE.Vector3();
      vector.set((pos.x / WIDTH) * 2 - 1, -(pos.y / HEIGHT) * 2 + 1, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const newPos = camera.position.clone().add(dir.multiplyScalar(distance));

      mesh.position.set(newPos.x, newPos.y, newPos.z);
      scene.add(mesh);
    }
  });
}


async function createMeshes(dataPromise) {

  let meshes = [];
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: 2});

  await dataPromise.then((response) => {
    for (let i = 0; i < 100; i++) {// (let entry of response.data) {
      const radius = 0.2;
      const height = 10;
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.appData = response.data[i];
      meshes.push(mesh);
    }
  });


  return meshes;
}



// Animate loop
const animate = (callback) => {
  callback();
  requestAnimationFrame(animate.bind(null, callback));
  renderer.render(scene, camera);
};


export default {initWorld, animate, createMeshes, updateMeshes}