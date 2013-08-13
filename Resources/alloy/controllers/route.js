function Controller() {
    function decodeLine(encoded) {
        var len = encoded.length;
        var index = 0;
        var array = [];
        var lat = 0;
        var lng = 0;
        while (len > index) {
            var b;
            var shift = 0;
            var result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (31 & b) << shift;
                shift += 5;
            } while (b >= 32);
            var dlat = 1 & result ? ~(result >> 1) : result >> 1;
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (31 & b) << shift;
                shift += 5;
            } while (b >= 32);
            var dlng = 1 & result ? ~(result >> 1) : result >> 1;
            lng += dlng;
            array.push([ 1e-5 * lat, 1e-5 * lng ]);
        }
        return array;
    }
    function addRoute(obj) {
        var xhr = Ti.Network.createHTTPClient();
        xhr.onload = function() {
            var response = this.responseText;
            var json = JSON.parse(response);
            var step = json.routes[0].legs[0].steps;
            obj.lblAB.setVisible(true);
            obj.lblAB.setHtml("<font color='green'>From:</font>" + json.routes[0].legs[0].start_address + "<br/>" + "<font color='red'>To:</font>" + json.routes[0].legs[0].end_address + "<br/>" + "<font color='green'>Distance: </font>" + json.routes[0].legs[0].distance.text + "<br/><font color='green'>Duration: </font>" + json.routes[0].legs[0].duration.text);
            var intStep = 0, intSteps = step.length;
            var decodedPolyline, intPoint = 0, intPoints = 0;
            obj.map.addAnnotation(Ti.Map.createAnnotation({
                animate: true,
                pincolor: Titanium.Map.ANNOTATION_DRAG_STATE_START,
                title: "Start",
                latitude: step[0].start_location.lat,
                longitude: step[0].start_location.lng,
                image: "http://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png"
            }));
            var objdata = [];
            data.createDataTravel("location");
            for (intStep = 0; intSteps > intStep; intStep += 1) {
                objdata = [ step[intStep].maneuver, step[intStep].end_location.lat, step[intStep].end_location.lng ];
                data.insertDataTravel(objdata, "location");
                obj.map.addAnnotation(Ti.Map.createAnnotation({
                    animate: true,
                    title: step[intStep].html_instructions,
                    latitude: step[intStep].end_location.lat,
                    longitude: step[intStep].end_location.lng
                }));
                if (intStep == intSteps - 1) {
                    obj.map.addAnnotation(Ti.Map.createAnnotation({
                        animate: true,
                        title: step[intStep].html_instructions,
                        latitude: step[intStep].end_location.lat,
                        longitude: step[intStep].end_location.lng,
                        image: "/images/marker_greenB.png"
                    }));
                    obj.map.setLocation({
                        latitude: step[intStep].end_location.lat,
                        longitude: step[intStep].end_location.lng,
                        latitudeDelta: .01,
                        longitudeDelta: .01
                    });
                }
                decodedPolyline = decodeLine(step[intStep].polyline.points);
                intPoints = decodedPolyline.length;
                for (intPoint = 0; intPoints > intPoint; intPoint += 1) null != decodedPolyline[intPoint] && points.push({
                    latitude: decodedPolyline[intPoint][0],
                    longitude: decodedPolyline[intPoint][1]
                });
                points.push({
                    latitude: step[intStep].end_location.lat,
                    longitude: step[intStep].end_location.lng
                });
            }
            var route = {
                name: "Route",
                points: points,
                color: "green",
                width: 4
            };
            obj.map.addRoute(route);
            return points;
        };
        xhr.onerror = function(e) {
            alert("Error");
            Ti.API.info("error", JSON.stringify(e));
            return points;
        };
        var param = [ "destination=" + obj.stop, "origin=" + obj.start, "region=" + obj.region, "mode=" + obj.travel_mode, "units=" + obj.units, "sensor=false" ];
        xhr.open("GET", "http://maps.googleapis.com/maps/api/directions/json?" + param.join("&"));
        xhr.send();
        return points;
    }
    function drawAnnotation(lbl, map, obj) {
        map.removeAllAnnotations();
        timer = setInterval(function() {
            annotation = Ti.Map.createAnnotation({
                animate: false,
                latitude: obj[i].latitude,
                longitude: obj[i].longitude,
                image: "/images/traffic/arrow.png",
                title: "MyLocationAtThemoment"
            });
            objNear = {
                types: "cafe",
                metric: "500",
                map: map,
                latitude: obj[i].latitude,
                longitude: obj[i].longitude
            };
            setTimeout(function() {
                map.addAnnotation(annotation);
                map.setLocation({
                    latitude: obj[i].latitude,
                    longitude: obj[i].longitude,
                    latitudeDelta: .01,
                    longitudeDelta: .01
                });
                Alloy.createController("near").recevierNear(objNear);
            }, 50);
            i++;
            map.removeAnnotation(annotation.getTitle());
            i == obj.length - 2 && (i = 1);
        }, 1e3);
    }
    function stopDrawAnnotation(obj, points) {
        var dataLocation = [];
        var dataIntruction;
        var stop, start;
        dataLocation = data.reviewDataTableGetAllLocation();
        stop = points[i].latitude + "," + points[i].longitude;
        start = points[0].latitude + "," + points[0].longitude;
        var objInstruction = {
            pointX: points[i].latitude,
            pointY: points[i].longitude
        };
        dataIntruction = data.reviewDataTableGetIntruction(objInstruction);
        var txtIntruction;
        if (0 == dataIntruction.search("left")) {
            txtIntruction = "Turn left";
            data.play("/audio/1.mp3");
        } else if (0 == dataIntruction.search("right")) {
            txtIntruction = "Turn right";
            data.play("/audio/2.mp3");
        } else if (0 == dataIntruction.search("null") || 0 == dataIntruction.search("straight")) {
            txtIntruction = "Straight";
            data.play("/audio/3.mp3");
        }
        if (null != timer) {
            clearInterval(timer);
            var xhr = Ti.Network.createHTTPClient();
            xhr.onload = function() {
                var response = this.responseText;
                var json = JSON.parse(response);
                json.routes[0].legs[0].steps;
                obj.lblAB.setVisible(true);
                obj.lblAB.setHtml("<font color='green'>From:</font>" + json.routes[0].legs[0].start_address + "<br/>" + "<font color='red'>To:</font>" + json.routes[0].legs[0].end_address + "<br/>" + "<font color='green'>Distance Actual: </font>" + json.routes[0].legs[0].distance.text + "<br/><font color='green'>Duration: </font>" + json.routes[0].legs[0].duration.text + "<br/><font color='green'>Distance Straight:</font>" + getDistanceFromLatLonInKm(points[0].latitude, points[0].longitude, points[i].latitude, points[i].longitude) + " km" + "<br/><font color='green'>Instruction: </font>" + txtIntruction);
                obj.map.removeAnnotation(annotation.getTitle());
                obj.map.addAnnotation(Ti.Map.createAnnotation({
                    animate: true,
                    title: "Stop here",
                    latitude: points[i].latitude,
                    longitude: points[i].longitude,
                    image: "/images/marker_greenB.png"
                }));
            };
            xhr.onerror = function(e) {
                alert("Error");
                Ti.API.info("error", JSON.stringify(e));
                return points;
            };
            var param = [ "destination=" + stop, "origin=" + start, "region=" + obj.region, "mode=" + obj.travel_mode, "units=" + obj.units, "sensor=false" ];
            xhr.open("GET", "http://maps.googleapis.com/maps/api/directions/json?" + param.join("&"));
            xhr.send();
        }
    }
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    function onChangePicker(e) {
        Titanium.App.Properties.setString("start", $.txtStart.value);
        Titanium.App.Properties.setString("stop", $.txtStop.value);
        Titanium.App.Properties.setString("travel", e.row.title);
        $.winIntruction.close();
        Alloy.createController("index").getView().open();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winIntruction = Ti.UI.createWindow({
        fullscreen: false,
        backgroundImage: "backgroud.jpg",
        id: "winIntruction"
    });
    $.__views.winIntruction && $.addTopLevelView($.__views.winIntruction);
    $.__views.viewStartStop = Ti.UI.createView({
        top: 0,
        height: 90,
        width: Ti.UI.FILL,
        id: "viewStartStop"
    });
    $.__views.winIntruction.add($.__views.viewStartStop);
    $.__views.imgPlay = Ti.UI.createImageView({
        top: 0,
        left: 5,
        height: 40,
        width: 40,
        image: "/images/play.png",
        id: "imgPlay"
    });
    $.__views.viewStartStop.add($.__views.imgPlay);
    $.__views.txtStart = Ti.UI.createTextField({
        right: 5,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        left: 50,
        width: Ti.UI.FILL,
        height: 40,
        top: 0,
        hintText: "Select point start",
        id: "txtStart"
    });
    $.__views.viewStartStop.add($.__views.txtStart);
    $.__views.imgPause = Ti.UI.createImageView({
        left: 5,
        top: 45,
        width: 40,
        image: "/images/stop.png",
        id: "imgPause"
    });
    $.__views.viewStartStop.add($.__views.imgPause);
    $.__views.txtStop = Ti.UI.createTextField({
        right: 5,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        left: 50,
        width: Ti.UI.FILL,
        height: 40,
        top: 45,
        hintText: "Select point stop",
        id: "txtStop"
    });
    $.__views.viewStartStop.add($.__views.txtStop);
    $.__views.viewPicker = Ti.UI.createView({
        right: 5,
        left: 5,
        top: 92,
        width: Ti.UI.FILL,
        id: "viewPicker"
    });
    $.__views.winIntruction.add($.__views.viewPicker);
    var __alloyId7 = [];
    $.__views.picker = Ti.UI.createPicker({
        top: 0,
        selectionIndicator: true,
        useSpinner: false,
        width: Ti.UI.FILL,
        id: "picker"
    });
    $.__views.viewPicker.add($.__views.picker);
    $.__views.__alloyId8 = Ti.UI.createPickerRow({
        title: "Selection",
        id: "__alloyId8"
    });
    __alloyId7.push($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createPickerRow({
        title: "driving",
        id: "__alloyId9"
    });
    __alloyId7.push($.__views.__alloyId9);
    $.__views.__alloyId10 = Ti.UI.createPickerRow({
        title: "bicycling",
        id: "__alloyId10"
    });
    __alloyId7.push($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createPickerRow({
        title: "transit",
        id: "__alloyId11"
    });
    __alloyId7.push($.__views.__alloyId11);
    $.__views.__alloyId12 = Ti.UI.createPickerRow({
        title: "walking",
        id: "__alloyId12"
    });
    __alloyId7.push($.__views.__alloyId12);
    $.__views.picker.add(__alloyId7);
    onChangePicker ? $.__views.picker.addEventListener("change", onChangePicker) : __defers["$.__views.picker!change!onChangePicker"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var points = [];
    var data = Alloy.createController("databasetravel");
    exports.addRoute = addRoute;
    var timer = null;
    var i = 1;
    var annotation;
    var objNear;
    exports.drawAnnotation = drawAnnotation;
    exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
    exports.stopDrawAnnotation = stopDrawAnnotation;
    $.winIntruction.addEventListener("android:back", function() {
        $.winIntruction.close();
        Alloy.createController("index").getView().open();
    });
    $.winIntruction.open();
    __defers["$.__views.picker!change!onChangePicker"] && $.__views.picker.addEventListener("change", onChangePicker);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;