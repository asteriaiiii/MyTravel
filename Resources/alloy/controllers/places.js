function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    var api = {
        xhr: null
    };
    exports.getData = function(lat, lon, radius, types, name, sensor, success, error) {
        null == api.xhr && (api.xhr = Titanium.Network.createHTTPClient());
        var url = "https://maps.googleapis.com/maps/api/place/search/json?";
        url = url + "location=" + lat + "," + lon;
        url = url + "&radius=" + radius;
        url = url + "&types=" + types;
        url = url + "&name=" + name;
        url = url + "&sensor=" + sensor;
        url = url + "&key=" + Titanium.App.Properties.getString("googlePlacesAPIKey");
        Ti.API.info(url);
        api.xhr.open("GET", url);
        api.xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        api.xhr.onerror = function(e) {
            Ti.API.error("API ERROR " + e.error);
            error && error(e);
        };
        api.xhr.onload = function() {
            Ti.API.debug("API response: " + this.responseText);
            if (success) {
                var jsonResponse = JSON.parse(this.responseText);
                success(jsonResponse);
            }
        };
        api.xhr.send();
    };
    exports.getPlaceDetails = function(reference, sensor, success, error) {
        null == api.xhr && (api.xhr = Titanium.Network.createHTTPClient());
        var url = "https://maps.googleapis.com/maps/api/place/details/json?";
        url = url + "reference=" + reference;
        url = url + "&sensor=" + sensor;
        url = url + "&key=" + Titanium.App.Properties.getString("googlePlacesAPIKey");
        Ti.API.info(url);
        api.xhr.open("GET", url);
        api.xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        api.xhr.onerror = function(e) {
            alext("Error");
            Ti.API.error("API ERROR " + e.error);
            error && error(e);
        };
        api.xhr.onload = function() {
            Ti.API.debug("API response: " + this.responseText);
            if (success) {
                var jsonResponse = JSON.parse(this.responseText);
                success(jsonResponse);
            }
        };
        api.xhr.send();
    };
    Titanium.Geolocation.getCurrentPosition(function(e) {
        if (!e.success) {
            alert("Could not retrieve location");
            return;
        }
        e.coords.longitude;
        e.coords.latitude;
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;