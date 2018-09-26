// // Scene Configurations
require("@babel/polyfill");



const {createMappa, setupMappa, update, map} = require("./map").default;
const {initWorld, animate, createMeshes, updateMeshes, world} = require("./world").default;
const {getData, data} = require("./data").default;

//const getData = data.getData;


const canvas = document.getElementById("canvas");
const ZOOM_LEVEL_OVERVIEW = 10;
const ZOOM_LEVEL_CITYVIEW = 13;
let meshPromise = null;
const centerLat = 47.5964863;
const centerLong = -122.3303769;
let uri = `https://data.seattle.gov/resource/k44w-2dcq.json?$where=within_circle(location_2, ${centerLat}, ${centerLong}, 1609.34)`;



// Init
let dataPromise = getData(uri);
const scene = initWorld(canvas);
const mappaMap = createMappa();
setupMappa(startListeningToEvents);


// Animation Loop
animate(() => {
  if (meshPromise !== null) {
    updateMeshes(meshPromise, mappaMap, scene);
  }
});



// This is to trigger when the Mapbox map has finished loading.
function onInit() {
  mappaMap.map.zoomTo(ZOOM_LEVEL_CITYVIEW);
  meshPromise = createMeshes(dataPromise);
}

/**
 * Attaches listeners onto the mapboxgl map
 */
function startListeningToEvents () {
  mappaMap.map.on("load", function() {

    mappaMap.map.addControl(new mapboxgl.NavigationControl());
  
    // Fly
    document.getElementById('fly').addEventListener('click', function () {
      // Fly to a random location by offsetting the point -74.50, 40
      // by up to 5 degrees.
      mappaMap.map.flyTo({
          center: [
              centerLong + (Math.random() * 0.01),
              centerLat  + (Math.random() * 0.01)
            ]
      });

      //myMap.map.rotateTo(Math.random() * 10);
    });

    onInit();
  });

  mappaMap.map.on("move", function() {
    console.log("Map is moving");
  });
}











