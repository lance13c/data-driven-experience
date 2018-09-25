// // Scene Configurations
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

// Scene, camera, canvas, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });

// Convert range function
const convertRange = (value, r1, r2) => {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
};

camera.position.z = 300;
scene.add(camera);
renderer.setSize(WIDTH, HEIGHT);

// Light
const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(0, 0, 6);
scene.add(light);



// API Key for Mapboxgl. Get one here:
// https://www.mapbox.com/studio/account/tokens/


const centerLat = 47.5964863;
const centerLong = -122.3303769;
let uri = `https://data.seattle.gov/resource/k44w-2dcq.json?$where=within_circle(location_2, ${centerLat}, ${centerLong}, 1609.34)`;
const key = 'pk.eyJ1IjoibGFuY2UxM2MiLCJhIjoiY2ptZmdyemN0Nm1xODN3bGlrb2FpY2F3ayJ9.ZEzkKAoyRhZMWe0z5tBqaw'
let dataPromise = getData(uri);

const mappaOptions = {
  lat: 47.5964863,
  lng: -122.3303769,
  zoom: 10,
  pitch: 50,
  style: "mapbox://styles/mapbox/dark-v9"
}

let mappa;
let myMap;
let data;
let polygons;


  // Store all Polygons features in an array called polygons.
  mappa = new Mappa('MapboxGL', key);
  myMap = mappa.tileMap(mappaOptions);

  myMap.overlay(canvas);
  myMap.onChange(update);

  // https://www.mapbox.com/mapbox-gl-js/example/geojson-polygon/
  // TEST
  console.log(myMap);


let controlsAdded = false;
function addControls() {
  if (controlsAdded === false) {
    myMap.map.addControl(new mapboxgl.NavigationControl());
  }

  controlsAdded = true;
}


let meshPromise = createMeshes(dataPromise);
function update() {
  addControls();
}


// Animate loop
const animate = () => {

  
  updateMeshes(meshPromise, myMap, scene);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();




async function getData(uri) {
  let options = {
    headers: {
      "X-App-Token": "Fw92XRaGzqhGLVWlR6ANSnmQX"
    }
  }
  
  return await axios.get(uri, options)
    .catch(function (error) {
      console.log(error);
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

//updateMeshes(meshPromise, myMap, scene);

// meshPromise.then((meshes) => {
//   console.log("meshes");
//   console.log(meshes);
// });


