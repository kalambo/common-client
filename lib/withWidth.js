"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mishmash_1 = require("mishmash");
exports.default = mishmash_1.memoize(function (toggleWidth) {
    return mishmash_1.withSize('small', 'setWidthElem', function (_a) {
        var width = _a.width;
        return width && width <= toggleWidth;
    });
}, function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return JSON.stringify(args);
});
