const {getActiveMeshes, test} = require("./world").default;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

function initExplore(mappaMap) {
    document.getElementById('explore').addEventListener('click', function () {
        // Fly to a random location by offsetting the point -74.50, 40
        // by up to 5 degrees.

        let activeMeshes = getActiveMeshes();

        if (activeMeshes.length > 0) {
          let randNum = getRandomInt(0, activeMeshes.length - 1);
          let mesh = activeMeshes[randNum];

          mappaMap.map.flyTo({
              center: [
                mesh.appData.longitude,
                mesh.appData.latitude
              ],
              minZoom: 15
          });
        }
      });
}


export default {initExplore};