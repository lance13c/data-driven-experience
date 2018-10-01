// // Scene Configurations
require("@babel/polyfill");

require("@fortawesome/fontawesome-free/js/fontawesome");
const { library, icon, core } = require('@fortawesome/fontawesome-svg-core');
const { faClock, faDollarSign, icons } = require('@fortawesome/free-solid-svg-icons');

library.add(faClock);
library.add(faDollarSign);


const {createMappa, setupMappa, map} = require("./map").default;
const {initWorld, animate, createMeshes, updateMeshes, world} = require("./world").default;
const {getData, data} = require("./data").default;
const {toggleFilterUI, getActiveFilters} = require("./filters").default;
const {initExplore, rand} = require("./explore").default;

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

// Event Listeners
let filterBtnCost = document.getElementsByClassName("filter-btn__cost")[0];
let filterBtnTime = document.getElementsByClassName("filter-btn__time")[0];
let filterBtnTest = document.getElementsByClassName("filter-btn__test")[0];


filterBtnCost.addEventListener("click", () => {
  toggleFilterUI("cost", 0, 1000000);
});

filterBtnTime.addEventListener("click", () => {
  toggleFilterUI("time", 2000, 2030);
});


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
  initExplore(mappaMap);
}

/**
 * Attaches listeners onto the mapboxgl map
 */
function startListeningToEvents () {
  mappaMap.map.on("load", function() {

    mappaMap.map.addControl(new mapboxgl.NavigationControl());

    var layers = mappaMap.map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    mappaMap.map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 14,
        'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
        }
    }, labelLayerId);
  
    onInit();
  });

  mappaMap.map.on("move", function() {
    console.log("Map is moving");
  });
}











