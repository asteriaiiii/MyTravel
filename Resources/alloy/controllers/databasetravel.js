function Controller() {
    function insertDataTravel(obj, tbl) {
        var db = Ti.Database.open("DataPoint");
        switch (tbl) {
          case "user":
            db.execute("INSERT INTO user (username,pass,sex,birthday) VALUES(?,?,?)", obj);
            break;

          case "route":
            db.execute("INSERT INTO route (idUser, placeStart, placeStop) VALUES(?,?,?)", obj);
            break;

          case "location":
            db.execute("INSERT INTO location (instruction,pointX,pointY) VALUES(?,?,?)", obj);
            break;

          case "icon":
            db.execute("INSERT INTO icon (name, url, idCateIcon) VALUES(?,?,?)", obj);
            break;

          case "cateicon":
            db.execute("INSERT INTO cateicon (name, type) VALUES(?,?)", obj);
            break;

          default:        }
        db.close();
    }
    function reviewDataTableGetAllLocation() {
        var db = Ti.Database.open("DataPoint");
        var rows = db.execute("SELECT instruction, pointX , pointY FROM location");
        var location = [];
        while (rows.isValidRow()) {
            location.push({
                instruction: rows.fieldByName("instruction"),
                pointX: rows.fieldByName("pointX"),
                pointY: rows.fieldByName("pointY")
            });
            rows.next();
        }
        rows.close();
        db.close();
        return location;
    }
    function reviewDataTableGetIntruction(obj) {
        var db = Ti.Database.open("DataPoint");
        var row = db.execute("SELECT instruction FROM location WHERE pointX=" + obj.pointX + " and pointY=" + obj.pointY);
        var instruction = "null";
        0 != row.rowCount && (instruction = row.fieldByName("instruction"));
        row.close();
        db.close();
        return instruction;
    }
    function play(url) {
        var audioPlayer = Titanium.Media.createAudioPlayer({
            url: url,
            allowBackground: true,
            volume: 1
        });
        if (audioPlayer.playing || audioPlayer.paused) {
            audioPlayer.stop();
            audioPlayer.release();
        } else audioPlayer.start();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.createDataTravel = function(tbl) {
        var db = Ti.Database.open("DataPoint");
        switch (tbl) {
          case "user":
            db.execute("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, pass TEXT, sex TEXT, birthday TEXT)");
            break;

          case "route":
            db.execute("CREATE TABLE IF NOT EXISTS route (id INTEGER PRIMARY KEY AUTOINCREMENT, idUser INTEGER, placeStart TEXT, placeStop TEXT)");
            break;

          case "location":
            db.execute("CREATE TABLE IF NOT EXISTS location (id INTEGER PRIMARY KEY AUTOINCREMENT, instruction TEXT, pointX TEXT, pointY TEXT)");
            db.execute("DELETE FROM location");
            break;

          case "icon":
            db.execute("CREATE TABLE IF NOT EXISTS icon (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT, idCateIcon INTEGER)");
            break;

          case "cateicon":
            db.execute("CREATE TABLE IF NOT EXISTS cateicon (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, type TEXT)");
            break;

          default:        }
        db.close();
    };
    exports.insertDataTravel = insertDataTravel;
    exports.reviewDataTableGetAllLocation = reviewDataTableGetAllLocation;
    exports.reviewDataTableGetIntruction = reviewDataTableGetIntruction;
    exports.play = play;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;