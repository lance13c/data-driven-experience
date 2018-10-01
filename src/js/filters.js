
import noUiSlider from "nouislider";
import wNumb from "wnumb";
import moment from "moment";

let activeFilters = {
  cost: false,
  time: false
}

let costMin = 0;
let costMax = 0;

let filterSliders = new Map();
let filters = new Map();

filters.set("cost", costFilter);
filters.set("time", timeFilter);
//filters.set("time", )


/**
 * Generates the cost filter's HTML
 * @param {Number} minCost 
 * @param {Number} maxCost 
 */
function getFilterHTML(type) {
  switch (type) {
    case "cost":
      return `<div class="filter__cost filter">
        <div class="filter__title">Cost</div>
        <div class="filter__cost__input filter__input" type="range"></div>
      </div>`;
    case "time":
      return `<div class="filter__time filter">
        <div class="filter__title">Time</div>
        <div class="filter__time__input filter__input" type="range"></div>
      </div>`
  }
}

//         <div class="filter__title">Cost</div>
// {/* <input class="filter-input__cost slider" type="range"></input> */}

 /**
  *  Allows the filter to be removed with an animation effect.
  * @param {String} type - Filter type 
  * @param {HTMLElement} element - The root element of the filter 
  */
function _removeFilter(type, element) {
  const REMOVAL_DELAY = 500; // ms


  if (element !== null) {
    element.classList.add("close-filter");

    setTimeout(() => {
      filterSliders.delete(type);
      element.parentElement.removeChild(element);
      activeFilters[type] = false;
    }, REMOVAL_DELAY); 
  } else {
    console.warn("Element is null");
  }
}

/**
 * 
 * @param {Object} data - Object of any information  
 */
function costFilter(data) {
  let slider = filterSliders.get("cost");
  if (data.estprojectcost !== undefined && slider !== undefined) {
    let valArr = slider.get();
    let min = parseInt(valArr[0].replace(/(\$|,)/g, ""));
    let max = parseInt(valArr[1].replace(/(\$|,)/g, ""));
    let dataCost = parseInt(data.estprojectcost);

    if (dataCost > min && dataCost < max) {
      return true;
    }
  }

  return false;
}

/**
 * 
 * @param {Object} data - Object of any information  
 */
function timeFilter(data) {
  let slider = filterSliders.get("time");
  if (data.issueddate !== undefined && data.expiresdate && slider !== undefined) {
    let valArr = slider.get();
    let min = moment(valArr[0]);
    let max = moment(valArr[1]);
    let startTime = moment(data.issueddate);
    let endTime = moment(data.expiresdate);

    if (startTime.isBetween(min, max, "year") || endTime.isBetween(min, max, "year")) {
      return true;
    }
  }

  return false;
}

/**
 * This should be run when all data is initalized.
 * @param {*} data 
 */
function setCostMaxMin(data) {
  if (data.estprojectcost !== undefined) {
    let cost = parseInt((data.estprojectcost).replace(/(\$|,)/g, ""));

    if (costMin > cost) {costMin = cost;}
    if (costMax < cost) {costMax = cost;}
  }
}

function getCostMin() {
  return costMin;
}

function getCostMax() {
  return costMax;
}




function getActiveFilters() {
  let resultFilters = [];
  for (let [type] of filterSliders) {
    let filter = filters.get(type);

    if (filter !== undefined) {
      resultFilters.push(filter);
    }
  }

  return resultFilters;
}


function toggleFilterUI(type, min, max) {
  let filterContainer = document.getElementById("filter-container");

  
  let options = {
    start: [min, max],

    connect: true,
    range: {
        'min': min,
        'max': max
    },
    behaviour: 'tap-drag',
    tooltips: true,
  };

  console.log("Toggle Filter ", type);

  if (activeFilters[type] === true) {
    let filterEl = document.getElementsByClassName(`filter__${type}`)[0];
    _removeFilter(type, filterEl);
    
    return false;
  } else {
    let el = document.createElement("div");
    el.innerHTML = getFilterHTML(type);
    filterContainer.appendChild(el); //.innerHTML += getFilterHTML(type);
    let filterEl = document.getElementsByClassName(`filter__${type}__input`)[0];

    switch(type) {
      case "cost": {
        options.format = wNumb({
          decimals: 0,
          thousand: ',',
          prefix: '$'
        }),
    
        options.pips = {
            mode: 'steps',
            stepped: true,
            density: 1
        }
      }
      break;
      case "time": {
        options.format = wNumb({
          decimals: 0,
          thousand: ''
        }),
    
        options.pips = {
            mode: 'steps',
            stepped: true,
            density: 1
        }
      }
    }

    let filterSlider = noUiSlider.create(filterEl, options);
    filterSliders.set(type, filterSlider);
    activeFilters[type] = true;
    return true;
  }
}

export default {toggleFilterUI, getActiveFilters, setCostMaxMin, getCostMin, getCostMax}