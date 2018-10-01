



let loadingScreenHTML = `
  <div class="container">
    <h1 class="title">
      <span class="w-1">Loading<span>
      <span class="w-2">Latest<span>
      <span class="w-3">Seattle<span>
      <span class="w-4">Building<span>
      <span class="w-5">Developments<span>
    <h1>  
    <div class="spinner">
        <div class="cube1"></div>
        <div class="cube2"></div>
    </div>
  </div>
`



function initLoading() {
  let el = document.createElement('div');
  el.id = "loading-screen";
  el.innerHTML = loadingScreenHTML;
  document.body.appendChild(el);
}


function endLoading() {
  let el = document.getElementById("loading-screen");
  el.parentElement.removeChild(el);
}



export default {initLoading, endLoading}