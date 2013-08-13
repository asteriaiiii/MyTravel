function Controller() {
    function locationClick() {
        Titanium.Geolocation.getCurrentPosition(function(e) {
            $.map.region = {
                latitude: e.coords.latitude,
                longitude: e.coords.longitude,
                latitudeDelta: .01,
                longitudeDelta: .01
            };
        });
        $.txtSearch.setVisible(false);
        $.btnSearch.setVisible(false);
        $.lblAB.setVisible(false);
        $.lblAB.setText("");
    }
    function searchChange() {
        "" != $.txtSearch.value && Alloy.createController("search").forwardGeocode($.txtSearch.value, function(geodata) {
            $.map.addAnnotation(Ti.Map.createAnnotation({
                animate: true,
                pincolor: Titanium.Map.ANNOTATION_RED,
                title: geodata.title.value,
                latitude: geodata.coords.latitude,
                longitude: geodata.coords.longitude
            }));
            $.map.setLocation({
                latitude: geodata.coords.latitude,
                longitude: geodata.coords.longitude,
                latitudeDelta: .01,
                longitudeDelta: .01
            });
        });
    }
    function mapClick() {}
    function mapLocationChange() {}
    function onPinChanged() {}
    function mapLongpress(e) {
        data = coordxy.getLL(e);
        Titanium.App.Properties.setObject("data", data);
        $.map.addAnnotation(Ti.Map.createAnnotation({
            animate: true,
            pincolor: Titanium.Map.ANNOTATION_RED,
            latitude: data.latitude,
            longitude: data.longitude
        }));
        if (false == $.viewIcon.getVisible()) {
            $.viewIcon.setVisible(true);
            imageIconGallery();
        }
    }
    function menuSearchClick() {
        $.txtSearch.setVisible(true);
        $.btnSearch.setVisible(true);
        $.lblAB.setVisible(false);
        $.lblAB.setText("");
    }
    function menuRouteClick() {
        $.main.close();
        Alloy.createController("route").getView().open();
    }
    function menuNearClick() {
        $.main.close();
        Alloy.createController("near").getView().open();
    }
    function menuTestAudioLocationClick() {
        $.main.close();
    }
    function lblIntruction() {
        Alloy.createController("instructions").getView().open();
    }
    function deleterouteClick() {
        null != route && $.map.removeRoute(route);
    }
    function getPlayMP3Click() {
        audioPlayer = Titanium.Media.createAudioPlayer({
            url: "/audio/tlt.mp3",
            allowBackground: true,
            volume: 1
        });
        if (audioPlayer.playing || audioPlayer.paused) {
            audioPlayer.stop();
            audioPlayer.release();
        } else audioPlayer.start();
    }
    function getStopMp3Click() {
        audioPlayer.stop();
    }
    function incrementClick() {
        var dataLocation = [];
        dataLocation = database.reviewDataTableGetAllLocation();
        for (var i = 0; dataLocation.length > i; i++) alert(dataLocation[i].instruction + "\n" + dataLocation[i].pointX + "\n" + dataLocation[i].pointY);
    }
    function stopClick() {
        var obj = {
            map: $.map,
            lblAB: $.lblAB,
            travel_mode: "driving",
            units: "metric"
        };
        method.stopDrawAnnotation(obj, pointsDraw);
    }
    function startClick() {
        method.drawAnnotation($.lblAB, $.map, pointsDraw);
    }
    function getRouteClick() {
        var view = Ti.UI.createView({
            layout: "vertical"
        });
        var pointA = Ti.UI.createTextField({
            width: Ti.UI.FILL,
            hintText: "INPUT ADDRESS A",
            value: "ha dinh"
        });
        var pointB = Ti.UI.createTextField({
            width: Ti.UI.FILL,
            hintText: "INPUT ADDRESS B",
            value: "ho guom"
        });
        view.add(pointA);
        view.add(pointB);
        var dialog = Ti.UI.createOptionDialog({
            title: "Input A->B",
            androidView: view,
            buttonNames: [ "Ok", "Cancel" ]
        });
        dialog.addEventListener("click", function(e) {
            0 == e.index && (pointsDraw = method.addRoute({
                lblAB: $.lblAB,
                map: $.map,
                start: pointA.value,
                stop: pointB.value,
                travel_mode: "driving",
                units: "metric"
            }));
        });
        dialog.show();
    }
    function imageIconGallery() {
        setTimeout(function() {
            $.fg.createGrid({
                map: $.map,
                columns: 3,
                space: 10,
                data: items,
                layout: "gallery",
                params: {
                    padding: 10,
                    showTitle: false,
                    backgroundColor: "#eee",
                    gridColor: "#ccc"
                },
                width: $.main.size.width
            });
        }, 800);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.main = Ti.UI.createWindow({
        backgroundColor: "white",
        fullscreen: true,
        id: "main"
    });
    $.__views.main && $.addTopLevelView($.__views.main);
    var __alloyId0 = [];
    $.__views.map = Ti.Map.createView({
        mapType: Titanium.Map.STANDARD_TYPE,
        animate: true,
        region: {
            latitude: 39.30109620906199,
            longitude: 39.30109620906199,
            latitudeDelta: .1,
            longitudeDelta: .1
        },
        userLocation: true,
        regionFit: true,
        annotations: __alloyId0,
        ns: Ti.Map,
        id: "map"
    });
    $.__views.main.add($.__views.map);
    mapClick ? $.__views.map.addEventListener("click", mapClick) : __defers["$.__views.map!click!mapClick"] = true;
    mapLongpress ? $.__views.map.addEventListener("longpress", mapLongpress) : __defers["$.__views.map!longpress!mapLongpress"] = true;
    mapLocationChange ? $.__views.map.addEventListener("regionchanged", mapLocationChange) : __defers["$.__views.map!regionchanged!mapLocationChange"] = true;
    onPinChanged ? $.__views.map.addEventListener("pinchangedragstate", onPinChanged) : __defers["$.__views.map!pinchangedragstate!onPinChanged"] = true;
    $.__views.lblAB = Ti.UI.createLabel({
        top: 0,
        color: "black",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundColor: "white",
        visible: false,
        text: "",
        id: "lblAB"
    });
    $.__views.main.add($.__views.lblAB);
    lblIntruction ? $.__views.lblAB.addEventListener("click", lblIntruction) : __defers["$.__views.lblAB!click!lblIntruction"] = true;
    $.__views.viewSearch = Ti.UI.createView({
        id: "viewSearch",
        top: "0",
        height: "40"
    });
    $.__views.main.add($.__views.viewSearch);
    $.__views.txtSearch = Ti.UI.createTextField({
        top: 0,
        hintText: "Search address",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        right: 65,
        visible: false,
        id: "txtSearch"
    });
    $.__views.viewSearch.add($.__views.txtSearch);
    $.__views.btnSearch = Ti.UI.createButton({
        right: 5,
        top: 0,
        title: "",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        visible: false,
        id: "btnSearch"
    });
    $.__views.viewSearch.add($.__views.btnSearch);
    searchChange ? $.__views.btnSearch.addEventListener("click", searchChange) : __defers["$.__views.btnSearch!click!searchChange"] = true;
    $.__views.checkSpeed = Ti.UI.createView({
        id: "checkSpeed",
        bottom: "0",
        height: "30%",
        layout: "horizontal",
        width: Ti.UI.FILL
    });
    $.__views.main.add($.__views.checkSpeed);
    $.__views.btnDeleteRoute = Ti.UI.createButton({
        id: "btnDeleteRoute",
        width: Ti.UI.SIZE,
        title: "DELETEROUTE"
    });
    $.__views.checkSpeed.add($.__views.btnDeleteRoute);
    deleterouteClick ? $.__views.btnDeleteRoute.addEventListener("click", deleterouteClick) : __defers["$.__views.btnDeleteRoute!click!deleterouteClick"] = true;
    $.__views.btnLocation = Ti.UI.createButton({
        id: "btnLocation",
        width: Ti.UI.SIZE,
        title: "GETLOCATION"
    });
    $.__views.checkSpeed.add($.__views.btnLocation);
    locationClick ? $.__views.btnLocation.addEventListener("click", locationClick) : __defers["$.__views.btnLocation!click!locationClick"] = true;
    $.__views.btnStart = Ti.UI.createButton({
        id: "btnStart",
        width: Ti.UI.SIZE,
        title: "START"
    });
    $.__views.checkSpeed.add($.__views.btnStart);
    startClick ? $.__views.btnStart.addEventListener("click", startClick) : __defers["$.__views.btnStart!click!startClick"] = true;
    $.__views.btnStop = Ti.UI.createButton({
        id: "btnStop",
        title: "STOP",
        width: Ti.UI.SIZE
    });
    $.__views.checkSpeed.add($.__views.btnStop);
    stopClick ? $.__views.btnStop.addEventListener("click", stopClick) : __defers["$.__views.btnStop!click!stopClick"] = true;
    $.__views.btnIncrementSpeed = Ti.UI.createButton({
        id: "btnIncrementSpeed",
        width: Ti.UI.SIZE,
        title: "INCREMENT++"
    });
    $.__views.checkSpeed.add($.__views.btnIncrementSpeed);
    incrementClick ? $.__views.btnIncrementSpeed.addEventListener("click", incrementClick) : __defers["$.__views.btnIncrementSpeed!click!incrementClick"] = true;
    $.__views.btnRoute = Ti.UI.createButton({
        id: "btnRoute",
        width: Ti.UI.SIZE,
        title: "GETROUTE"
    });
    $.__views.checkSpeed.add($.__views.btnRoute);
    getRouteClick ? $.__views.btnRoute.addEventListener("click", getRouteClick) : __defers["$.__views.btnRoute!click!getRouteClick"] = true;
    $.__views.btnPlayMP3 = Ti.UI.createButton({
        id: "btnPlayMP3",
        width: Ti.UI.SIZE,
        title: "PLAYMP3"
    });
    $.__views.checkSpeed.add($.__views.btnPlayMP3);
    getPlayMP3Click ? $.__views.btnPlayMP3.addEventListener("click", getPlayMP3Click) : __defers["$.__views.btnPlayMP3!click!getPlayMP3Click"] = true;
    $.__views.btnStopMP3 = Ti.UI.createButton({
        id: "btnStopMP3",
        width: Ti.UI.SIZE,
        title: "STOPMP3"
    });
    $.__views.checkSpeed.add($.__views.btnStopMP3);
    getStopMp3Click ? $.__views.btnStopMP3.addEventListener("click", getStopMp3Click) : __defers["$.__views.btnStopMP3!click!getStopMp3Click"] = true;
    $.__views.viewIcon = Ti.UI.createView({
        bottom: 0,
        height: "30%",
        visible: false,
        id: "viewIcon"
    });
    $.__views.main.add($.__views.viewIcon);
    $.__views.fg = Alloy.createWidget("tiflexigrid", "widget", {
        id: "fg",
        __parentSymbol: $.__views.viewIcon
    });
    $.__views.fg.setParent($.__views.viewIcon);
    $.__views.main.activity.onCreateOptionsMenu = function(e) {
        var __alloyId2 = {
            title: "Search",
            icon: "/images/traffic/sm8yoyo3.gif",
            id: "menuSearch"
        };
        $.__views.menuSearch = e.menu.add(_.pick(__alloyId2, Alloy.Android.menuItemCreateArgs));
        $.__views.menuSearch.applyProperties(_.omit(__alloyId2, Alloy.Android.menuItemCreateArgs));
        menuSearchClick ? $.__views.menuSearch.addEventListener("click", menuSearchClick) : __defers["$.__views.menuSearch!click!menuSearchClick"] = true;
        var __alloyId3 = {
            title: "Route",
            icon: "/images/route.png",
            id: "menuRoute"
        };
        $.__views.menuRoute = e.menu.add(_.pick(__alloyId3, Alloy.Android.menuItemCreateArgs));
        $.__views.menuRoute.applyProperties(_.omit(__alloyId3, Alloy.Android.menuItemCreateArgs));
        menuRouteClick ? $.__views.menuRoute.addEventListener("click", menuRouteClick) : __defers["$.__views.menuRoute!click!menuRouteClick"] = true;
        var __alloyId4 = {
            title: "Near places",
            icon: "/images/places.png",
            id: "menuNear"
        };
        $.__views.menuNear = e.menu.add(_.pick(__alloyId4, Alloy.Android.menuItemCreateArgs));
        $.__views.menuNear.applyProperties(_.omit(__alloyId4, Alloy.Android.menuItemCreateArgs));
        menuNearClick ? $.__views.menuNear.addEventListener("click", menuNearClick) : __defers["$.__views.menuNear!click!menuNearClick"] = true;
        var __alloyId5 = {
            title: "Test",
            id: "menuTestAudioLocation"
        };
        $.__views.menuTestAudioLocation = e.menu.add(_.pick(__alloyId5, Alloy.Android.menuItemCreateArgs));
        $.__views.menuTestAudioLocation.applyProperties(_.omit(__alloyId5, Alloy.Android.menuItemCreateArgs));
        menuTestAudioLocationClick ? $.__views.menuTestAudioLocation.addEventListener("click", menuTestAudioLocationClick) : __defers["$.__views.menuTestAudioLocation!click!menuTestAudioLocationClick"] = true;
    };
    exports.destroy = function() {};
    _.extend($, $.__views);
    var route;
    var pointsDraw = [];
    var method = Alloy.createController("route");
    var database = Alloy.createController("databasetravel");
    Titanium.Geolocation.getCurrentPosition(function(e) {
        $.map.region = {
            latitude: e.coords.latitude,
            longitude: e.coords.longitude,
            latitudeDelta: .01,
            longitudeDelta: .01
        };
        alert(e.coords.latitude + ":" + e.coords.longitude);
    });
    var coordxy = require("coordFromXY");
    coordxy.watchMap($.map);
    var audioPlayer;
    var items = [ {
        title: "Type 1",
        image: "/images/traffic/image1.png"
    }, {
        title: "Type 2",
        image: "/images/traffic/image2.png"
    }, {
        title: "Type 2",
        image: "/images/traffic/image3.png"
    }, {
        title: "Type 3",
        image: "/images/traffic/image4.png"
    } ];
    Ti.Gesture.addEventListener("orientationchange", function(e) {
        var orientation = e.orientation;
        if (1 > orientation || orientation > 4) return;
        if (1 == orientation) {
            $.fg.clearGrid();
            var params = {
                columns: 3,
                space: 10,
                data: items,
                layout: "gallery",
                params: {
                    padding: 10,
                    showTitle: false,
                    backgroundColor: "#eee",
                    gridColor: "#ccc"
                },
                width: $.main.size.width,
                map: $.map
            };
            $.fg.createGrid(params);
        } else if (2 == orientation) {
            $.fg.clearGrid();
            var params = {
                map: $.map,
                columns: 4,
                space: 10,
                data: items,
                layout: "gallery",
                params: {
                    padding: 10,
                    showTitle: false,
                    backgroundColor: "#eee",
                    gridColor: "#ccc"
                },
                width: $.main.size.width
            };
            $.fg.createGrid(params);
        }
    });
    $.main.open();
    __defers["$.__views.map!click!mapClick"] && $.__views.map.addEventListener("click", mapClick);
    __defers["$.__views.map!longpress!mapLongpress"] && $.__views.map.addEventListener("longpress", mapLongpress);
    __defers["$.__views.map!regionchanged!mapLocationChange"] && $.__views.map.addEventListener("regionchanged", mapLocationChange);
    __defers["$.__views.map!pinchangedragstate!onPinChanged"] && $.__views.map.addEventListener("pinchangedragstate", onPinChanged);
    __defers["$.__views.lblAB!click!lblIntruction"] && $.__views.lblAB.addEventListener("click", lblIntruction);
    __defers["$.__views.btnSearch!click!searchChange"] && $.__views.btnSearch.addEventListener("click", searchChange);
    __defers["$.__views.btnDeleteRoute!click!deleterouteClick"] && $.__views.btnDeleteRoute.addEventListener("click", deleterouteClick);
    __defers["$.__views.btnLocation!click!locationClick"] && $.__views.btnLocation.addEventListener("click", locationClick);
    __defers["$.__views.btnStart!click!startClick"] && $.__views.btnStart.addEventListener("click", startClick);
    __defers["$.__views.btnStop!click!stopClick"] && $.__views.btnStop.addEventListener("click", stopClick);
    __defers["$.__views.btnIncrementSpeed!click!incrementClick"] && $.__views.btnIncrementSpeed.addEventListener("click", incrementClick);
    __defers["$.__views.btnRoute!click!getRouteClick"] && $.__views.btnRoute.addEventListener("click", getRouteClick);
    __defers["$.__views.btnPlayMP3!click!getPlayMP3Click"] && $.__views.btnPlayMP3.addEventListener("click", getPlayMP3Click);
    __defers["$.__views.btnStopMP3!click!getStopMp3Click"] && $.__views.btnStopMP3.addEventListener("click", getStopMp3Click);
    __defers["$.__views.menuSearch!click!menuSearchClick"] && $.__views.menuSearch.addEventListener("click", menuSearchClick);
    __defers["$.__views.menuRoute!click!menuRouteClick"] && $.__views.menuRoute.addEventListener("click", menuRouteClick);
    __defers["$.__views.menuNear!click!menuNearClick"] && $.__views.menuNear.addEventListener("click", menuNearClick);
    __defers["$.__views.menuTestAudioLocation!click!menuTestAudioLocationClick"] && $.__views.menuTestAudioLocation.addEventListener("click", menuTestAudioLocationClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;