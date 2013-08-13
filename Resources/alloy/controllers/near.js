function Controller() {
    function recevierNear(obj) {
        try {
            var types = obj.types;
            var metric = obj.metric;
            var lat = obj.latitude;
            var lng = obj.longitude;
            if ("null" == types && "null" == metric) ; else {
                Titanium.App.Properties.setString("googlePlacesAPIKey", "AIzaSyBirGBefJkUInC53m7ZyPgeqYa2-x-CpEo");
                Alloy.createController("places").getData(lat, lng, metric, types, "", "false", function(response) {
                    if ("OK" == response.status) for (var i = 0; response.results.length > i; i++) Alloy.createController("places").getPlaceDetails(response.results[i].reference, "false", function(response) {
                        obj.map.addAnnotation(Ti.Map.createAnnotation({
                            animate: true,
                            title: response.result.name,
                            subtitle: "Adress: " + response.result.formatted_address,
                            latitude: response.result.geometry.location.lat,
                            longitude: response.result.geometry.location.lng,
                            image: "/images/places.png"
                        }));
                    }, function() {});
                }, function() {});
            }
        } catch (err) {}
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.recevierNear = recevierNear;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;