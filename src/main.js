// Scene Configurations
const WIDTH = 640;
const HEIGHT = 580;
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

// Scene, camera, canvas, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });

camera.position.z = 300;
scene.add(camera);
renderer.setSize(WIDTH, HEIGHT);

// Light
const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(0, 0, 6);
scene.add(light);

// API Key for Mapboxgl. Get one here:
// https://www.mapbox.com/studio/account/tokens/
const key = 'pk.eyJ1IjoibGFuY2UxM2MiLCJhIjoiY2ptZmdyemN0Nm1xODN3bGlrb2FpY2F3ayJ9.ZEzkKAoyRhZMWe0z5tBqaw'

const options = {
  lat: 47.5964863,
  lng: -122.3303769,
  zoom: 10,
  pitch: 50,
}

let data;
let polygons;

function preload(){
  // Load a GeoJSON file using p5 loadJSON.
  data = loadJSON('world.geojson');
}

function setup(){
  createCanvas(640, 640);
  // Store all Polygons features in an array called polygons.
  polygons = myMap.geoJSON(data, 'Polygon')
}

const mappa = new Mappa('MapboxGL', key);
const myMap = mappa.tileMap(options);
myMap.overlay(canvas);
myMap.onChange(update);

function update() {
//   if (dataLoaded) {
//     meshes.forEach((mesh, item) => {
//       const pos = myMap.latLngToPixel(meteorites[item].lat, meteorites[item].lng);
//       const vector = new THREE.Vector3();
//       vector.set((pos.x / WIDTH) * 2 - 1, -(pos.y / HEIGHT) * 2 + 1, 0.5);
//       vector.unproject(camera);
//       const dir = vector.sub(camera.position).normalize();
//       const distance = -camera.position.z / dir.z;
//       const newPos = camera.position.clone().add(dir.multiplyScalar(distance));

//       mesh.position.set(newPos.x, newPos.y, newPos.z);
//       scene.add(mesh);
//     })
//   }
}

// Animate loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();