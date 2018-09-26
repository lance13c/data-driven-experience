const axios = require("axios");

async function getData(uri) {
    let options = {
        headers: {
        "X-App-Token": "Fw92XRaGzqhGLVWlR6ANSnmQX"
        }
    }

    return await axios.get(uri, options)
        .catch(function (error) {
        console.log(error);
        });
}


export default {getData}