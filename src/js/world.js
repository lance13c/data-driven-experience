const {toggleFilterUI, getActiveFilters, setCostMaxMin, randVal} = require("./filters").default;


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

let activeMeshes = [];

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

function getNewMaterialColor(hexColor) {

}

function getActiveMeshes() {
  return activeMeshes;
}


function updateMeshes(meshPromise, mappaMap, scene) {
  activeMeshes = [];

  meshPromise.then((meshes) => {
    for (let mesh of meshes) {

      let valid = checkFilters(getActiveFilters(), mesh.appData);
      
      if (valid) {
        mesh.material.visible = true;
        activeMeshes.push(mesh);
      } else {
        mesh.material.visible = false;
      }

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

/**
 * 
 * @param {Array} filterArray - An array of filter functions that return true if the data provided is valid within the filter.
 * @param {Object} data - Data provided by the getData function. Ex: A specific build permit data object
 */
function checkFilters(filterArray, data) {
  for (let filter of filterArray) {
    if (filter(data) === false) {
      return false;
    }
  }

  return true;
}

/**
 * 
 * @param {*} dataPromise 
 * @param {Array} filterArray - An array of filter functions that return true if the data provided is valid within the filter.
 */
async function createLineMeshes(dataPromise) {

  let meshes = [];

  await dataPromise.then((response) => {
    for (let i = 0; i < response.data.length; i++) {// (let entry of response.data) {
      const radius = 0.2;
      const height = 10;
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: 2});
      const mesh = new THREE.Mesh(geometry, material);
      mesh.appData = response.data[i];
      
      // Set Filter Mins and Maxes
      setCostMaxMin(response.data[i]);
      
      meshes.push(mesh);
    }
  });


  return meshes;
}


/**
 * 
 * @param {*} dataPromise 
 * @param {Array} filterArray - An array of filter functions that return true if the data provided is valid within the filter.
 */
async function createSphereMeshes(dataPromise) {

  let meshes = [];

  await dataPromise.then((response) => {
    for (let i = 0; i < response.data.length; i++) {// (let entry of response.data) {
      const radius = 1;
      const geometry = new THREE.SphereGeometry(radius, radius, 20, 20);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: 2});
      const mesh = new THREE.Mesh(geometry, material);
      mesh.appData = response.data[i];
      
      // Set Filter Mins and Maxes
      setCostMaxMin(response.data[i]);
      
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


export default {initWorld, animate, createLineMeshes, createSphereMeshes, updateMeshes, getActiveMeshes}