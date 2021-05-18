const axios = require('axios').create({
    baseURL: 'http://localhost:8080',
    headers: {"Access-Control-Allow-Origin": "*"},
    withCredentials: true
});

module.exports.loggedIn = false;

module.exports.isLoggedIn = async function() {
    let response = await axios.get("/api/user");

    if(response.status === 200) {
        let user = response.data;

        if(user !== null && user !== undefined && user._id !== null && user._id !== undefined) {
            module.exports.loggedIn = true;
            return true;
        }
        module.exports.loggedIn = false;
        return false;
    }
    module.exports.loggedIn = false;
    return false;
}

/**
 * This is a wrapper around axios.post()
 * Gets the response and returns standardized response data.
 * If the response data is null returns default response data.
 */
module.exports.post = async function(url, request) {
    let response = await axios.post(url, request);

    if(response.status === 200) {
        return response.data||{success: true};
    }

    return {success: false, message: ""};
}

/**
 * This is a wrapper around axios.get()
 * Gets the response and returns the response data.
 * If the response data is null returns default response data.
 */
 module.exports.get = async function(url) {
    let response = await axios.get(url);

    if(response.status === 200) {
        return response.data||{success: true};
    }

    return {success: false, message: ""};
}
/**
 * This is a wrapper around axios.delete()
 * Gets the response and returns the response data.
 * If the response data is null returns default response data.
 */
 module.exports.delete = async function(url) {
    let response = await axios.delete(url);

    if(response.status === 200) {
        return response.data||{success: true};
    }

    return {success: false, message: ""};
}

module.exports.getCookie = function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}