// // Scene Configurations
// const WIDTH = 640;
// const HEIGHT = 580;
// const VIEW_ANGLE = 45;
// const ASPECT = WIDTH / HEIGHT;
// const NEAR = 0.1;
// const FAR = 10000;

// // Scene, camera, canvas, renderer
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
//const canvas = document.getElementById("canvas");
// const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });

// camera.position.z = 300;
// scene.add(camera);
// renderer.setSize(WIDTH, HEIGHT);

// // Light
// const light = new THREE.PointLight(0xffffff, 1.2);
// light.position.set(0, 0, 6);
// scene.add(light);

// API Key for Mapboxgl. Get one here:
// https://www.mapbox.com/studio/account/tokens/






const key = 'pk.eyJ1IjoibGFuY2UxM2MiLCJhIjoiY2ptZmdyemN0Nm1xODN3bGlrb2FpY2F3ayJ9.ZEzkKAoyRhZMWe0z5tBqaw'

const options = {
  lat: 47.5964863,
  lng: -122.3303769,
  zoom: 10,
  pitch: 50,
}

let mappa;
let myMap;
let data;
let polygons;
let canvas;

function preload() {
  // Load a GeoJSON file using p5 loadJSON.
  try {
    data = loadJSON('./reference_files/SPD_Beats.geojson');
  } catch (e) {
    console.error(e);
  }
  
  console.log("test");
  console.log(data);
}

function setup(){
  // Store all Polygons features in an array called polygons.
  canvas = createCanvas(800, 700); //document.getElementById("canvas");
  mappa = new Mappa('MapboxGL', key);
  myMap = mappa.tileMap(options);

  polygons = myMap.geoJSON(data, 'Polygon');
  console.log("polygons");
  console.log(polygons);

  myMap.overlay(canvas);
  myMap.onChange(update);

  // https://www.mapbox.com/mapbox-gl-js/example/geojson-polygon/
  // TEST
  console.log(myMap);
  myMap.mappaDiv.addEventListener('load', function () {

    myMap.addLayer({
        'id': 'maine',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[[-67.13734351262877, 45.137451890638886],
                        [-66.96466, 44.8097],
                        [-68.03252, 44.3252],
                        [-69.06, 43.98],
                        [-70.11617, 43.68405],
                        [-70.64573401557249, 43.090083319667144],
                        [-70.75102474636725, 43.08003225358635],
                        [-70.79761105007827, 43.21973948828747],
                        [-70.98176001655037, 43.36789581966826],
                        [-70.94416541205806, 43.46633942318431],
                        [-71.08482, 45.3052400000002],
                        [-70.6600225491012, 45.46022288673396],
                        [-70.30495378282376, 45.914794623389355],
                        [-70.00014034695016, 46.69317088478567],
                        [-69.23708614772835, 47.44777598732787],
                        [-68.90478084987546, 47.184794623394396],
                        [-68.23430497910454, 47.35462921812177],
                        [-67.79035274928509, 47.066248887716995],
                        [-67.79141211614706, 45.702585354182816],
                        [-67.13734351262877, 45.137451890638886]]]
                }
            }
        },
        'layout': {},
        'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.8
        }
    });
  });
}



function update() {
// //   if (dataLoaded) {
// //     meshes.forEach((mesh, item) => {
// //       const pos = myMap.latLngToPixel(meteorites[item].lat, meteorites[item].lng);
// //       const vector = new THREE.Vector3();
// //       vector.set((pos.x / WIDTH) * 2 - 1, -(pos.y / HEIGHT) * 2 + 1, 0.5);
// //       vector.unproject(camera);
// //       const dir = vector.sub(camera.position).normalize();
// //       const distance = -camera.position.z / dir.z;
// //       const newPos = camera.position.clone().add(dir.multiplyScalar(distance));

// //       mesh.position.set(newPos.x, newPos.y, newPos.z);
// //       scene.add(mesh);
// //     })
// //   }


}

// // Animate loop
// const animate = () => {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// };

// animate();