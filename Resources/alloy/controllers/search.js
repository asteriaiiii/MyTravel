function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    var GOOGLE_BASE_URL = "http://maps.google.com/maps/api/geocode/json?address=";
    var ERROR_MESSAGE = "There was an error geocoding. Please try again.";
    exports.LATITUDE_BASE = 37.389569;
    exports.LONGITUDE_BASE = -122.050212;
    var GeoData = function(title, latitude, longitude) {
        this.title = title;
        this.coords = {
            latitude: latitude,
            longitude: longitude
        };
    };
    exports.forwardGeocode = function(address, callback) {
        forwardGeocodeNative(address, callback);
    };
    var forwardGeocodeNative = function(address, callback) {
        var url = GOOGLE_BASE_URL + address.replace(" ", "+");
        url += "&sensor=" + (true == Titanium.Geolocation.locationServicesEnabled);
        var xhr = Titanium.Network.createHTTPClient();
        xhr.open("GET", url);
        xhr.onload = function() {
            var json = JSON.parse(this.responseText);
            if ("OK" != json.status) {
                alert("Unable to geocode the address");
                return;
            }
            callback(new GeoData(address, json.results[0].geometry.location.lat, json.results[0].geometry.location.lng));
        };
        xhr.onerror = function(e) {
            Ti.API.error(e.error);
            alert(ERROR_MESSAGE);
        };
        xhr.send();
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;