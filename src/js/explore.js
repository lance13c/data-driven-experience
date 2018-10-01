import data from "./data";

const {getActiveMeshes, test} = require("./world").default;


/**
 * This acts as a wrapper to any data value.
 * It checks if the value is undefined or null and
 * returns the appropiate value, otherwise it returns
 * the value provided.
 * @param {*} dataValue - value of any object property 
 */
function getValue(dataValue) {
  if (dataValue === undefined || dataValue === null) {
    return "Unknown";
  }

  return dataValue;
}

/**
 * Adds an overlay with information about a particular building permit
 * @param {Object} permitData - The data related to a specific permit issued
 */
function addOverlay(permitData) {
  let overlay = document.createElement('div');
  overlay.id = "info-overlay";
  overlay.innerHTML = `

      <div class="info__top-bar">
        <a class="info__link" href="${getValue(permitData.link)}"><i class="fas fa-info"></i></a>
        <span class="info__dates">${getValue(permitData.issueddate)} - ${getValue(permitData.expiresdate)}</span>
        <span class="info__status">${getValue(permitData.statuscurrent)}</span>
      </div>

      <div class="info__description-block">
        <div class="info__cost">$ ${getValue(permitData.estprojectcost)}</div>
        <div class="info__description">${getValue(permitData.description)}</div>
        <div class="info__type">${getValue(permitData.permittype)}, ${getValue(permitData.permittypedesc)}</div>
      </div>


      <div class="info__footer">
        <div class="info__address">
          <div class="info__address-main">${getValue(permitData.originaladdress1)}</div>
          <div class="info__address-city-state">${getValue(permitData.originalcity)} ${getValue(permitData.originalstate)}, ${getValue(permitData.originalzip)}</div>
        </div>

        <div class="info__permit-number">${getValue(permitData.permitnum)}</div>
      </div>
      `

  document.body.appendChild(overlay);
}

function removeOverlay() {
  let overlayEl = document.getElementById("info-overlay");
  if (overlayEl !== null) {
    overlayEl.parentElement.removeChild(overlayEl);
  }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

function initExplore(mappaMap) {
    document.getElementById('explore').addEventListener('click', function () {
        // Fly to a random location by offsetting the point -74.50, 40
        // by up to 5 degrees.

        removeOverlay();

        let activeMeshes = getActiveMeshes();

        if (activeMeshes.length > 0) {
          let randNum = getRandomInt(0, activeMeshes.length - 1);
          let mesh = activeMeshes[randNum];

          mappaMap.map.flyTo({
              center: [
                mesh.appData.longitude,
                mesh.appData.latitude
              ],
              zoom: 16
          });

          addOverlay(mesh.appData);
        }
      });

    document.getElementById('canvas').addEventListener('click', () => {
      removeOverlay();
    });
}


export default {initExplore};