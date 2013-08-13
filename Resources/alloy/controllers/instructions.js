function Controller() {
    function clickLocation(e) {
        alert(e.rowData.id + ":" + e.rowData.title);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.idintruction = Ti.UI.createWindow({
        backgroundColor: "white",
        title: "Intruction",
        id: "idintruction"
    });
    $.__views.idintruction && $.addTopLevelView($.__views.idintruction);
    $.__views.rowintruction = Ti.UI.createTableViewRow({
        id: "rowintruction"
    });
    var __alloyId6 = [];
    __alloyId6.push($.__views.rowintruction);
    clickLocation ? $.__views.rowintruction.addEventListener("click", clickLocation) : __defers["$.__views.rowintruction!click!clickLocation"] = true;
    $.__views.lblid = Ti.UI.createLabel({
        left: 10,
        text: "No",
        color: "green",
        fontWeight: "bold",
        id: "lblid"
    });
    $.__views.rowintruction.add($.__views.lblid);
    $.__views.lblintruction = Ti.UI.createLabel({
        left: 35,
        textAlign: "left",
        html: "Intruction",
        right: 60,
        id: "lblintruction"
    });
    $.__views.rowintruction.add($.__views.lblintruction);
    $.__views.lblkm = Ti.UI.createLabel({
        right: 5,
        textAlign: "center",
        height: 30,
        width: 70,
        text: "Km",
        id: "lblkm"
    });
    $.__views.rowintruction.add($.__views.lblkm);
    $.__views.tableviewintruction = Ti.UI.createTableView({
        data: __alloyId6,
        id: "tableviewintruction"
    });
    $.__views.idintruction.add($.__views.tableviewintruction);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.idintruction.addEventListener("android:back", function() {
        $.idintruction.close();
    });
    $.idintruction.open();
    __defers["$.__views.rowintruction!click!clickLocation"] && $.__views.rowintruction.addEventListener("click", clickLocation);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;