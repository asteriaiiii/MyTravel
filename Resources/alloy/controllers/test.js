function Controller() {
    function clickAudio() {
        if ("" != $.txtLat.value && "" != $.txtLng.value) {
            var obj = {
                lat: $.txtLat.value,
                lng: $.txtLng.value
            };
            try {
                Alloy.createController("databasepoint").reviewDataPoint(obj);
            } catch (err) {
                alert("Not found");
            }
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.idTest = Ti.UI.createWindow({
        backgroundColor: "white",
        fullscreen: true,
        title: "Test",
        id: "idTest"
    });
    $.__views.idTest && $.addTopLevelView($.__views.idTest);
    $.__views.txtLat = Ti.UI.createTextField({
        top: 5,
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        hintText: "Latitude",
        id: "txtLat"
    });
    $.__views.idTest.add($.__views.txtLat);
    $.__views.txtLng = Ti.UI.createTextField({
        top: 45,
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        hintText: "Longitude",
        id: "txtLng"
    });
    $.__views.idTest.add($.__views.txtLng);
    $.__views.btnTestOK = Ti.UI.createButton({
        top: 85,
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        title: "Test Audio",
        id: "btnTestOK"
    });
    $.__views.idTest.add($.__views.btnTestOK);
    clickAudio ? $.__views.btnTestOK.addEventListener("click", clickAudio) : __defers["$.__views.btnTestOK!click!clickAudio"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.idTest.addEventListener("android:back", function() {
        $.idTest.close();
        Alloy.createController("index").getView().open();
    });
    $.idTest.open();
    __defers["$.__views.btnTestOK!click!clickAudio"] && $.__views.btnTestOK.addEventListener("click", clickAudio);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;