
import noUiSlider from "nouislider";
import wNumb from "wnumb";

let activeFilters = {
  cost: false,
  time: false
}

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
        <div class="filter__cost__input" type="range"></div>
      </div>`;
    case "time":
      return `<div class="filter__time filter">
        <div class="filter__title">Time</div>
        <div class="filter__time__input" type="range"></div>
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
      element.parentElement.removeChild(element);
      activeFilters[type] = false;
    }, REMOVAL_DELAY); 
  } else {
    console.warn("Element is null");
  }
}


function toggleFilter(type, min, max) {
  let filterContainer = document.getElementById("filter-container");
  let filterEl;

  
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
    filterEl = document.getElementsByClassName(`filter__${type}`)[0];
    _removeFilter(type, filterEl);
    
    return false;
  } else {
    filterContainer.innerHTML += getFilterHTML(type);
    filterEl = document.getElementsByClassName(`filter__${type}__input`)[0];

    switch(type) {
      case "cost": {
        options.format = wNumb({
          decimals: 1,
          thousand: '.',
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
          decimals: 1,
          thousand: '.'
        }),
    
        options.pips = {
            mode: 'steps',
            stepped: true,
            density: 1
        }
      }
    }

    noUiSlider.create(filterEl, options);
    activeFilters[type] = true;
    return true;
  }
}

export default {toggleFilter}