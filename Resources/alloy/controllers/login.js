function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.login = function() {
        var login = Ti.UI.createView({
            layout: "vetical",
            backgroundColor: "#467cb3"
        });
        var txtUsername = Ti.UI.createTextField({
            hintText: "Username",
            top: 2,
            height: 40,
            width: Ti.UI.FILL
        });
        login.add(txtUsername);
        var txtPass = Ti.UI.createTextField({
            hintText: "Password",
            top: 45,
            height: 40,
            passwordMask: true,
            width: Ti.UI.FILL
        });
        login.add(txtPass);
        var dialogLogin = Ti.UI.createOptionDialog({
            title: "Login",
            buttonNames: [ "Login", "Cancel" ],
            androidView: login
        });
        dialogLogin.addEventListener("click", function(e) {
            0 == e.index ? alert("Checking User") : 1 == e.index;
        });
        dialogLogin.show();
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;