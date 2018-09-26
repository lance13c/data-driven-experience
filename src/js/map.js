
const key = 'pk.eyJ1IjoibGFuY2UxM2MiLCJhIjoiY2ptZmdyemN0Nm1xODN3bGlrb2FpY2F3ayJ9.ZEzkKAoyRhZMWe0z5tBqaw';
let mappaMap;
let mappa;

const mappaOptions = {
  lat: 47.5964863,
  lng: -122.3303769,
  zoom: 10,
  pitch: 50,
  style: "mapbox://styles/mapbox/dark-v9"
}

function createMappa() {
  mappa = new Mappa('MapboxGL', key);
  mappaMap = mappa.tileMap(mappaOptions);

  return mappaMap;
}

function setupMappa(startListeningToEvents) {
  // Store all Polygons features in an array called polygons.

  mappaMap.overlay(canvas, startListeningToEvents);
  mappaMap.onChange(update);

  return mappaMap;
};


function update(callback) {
  callback();
}







export default {createMappa, setupMappa, update}