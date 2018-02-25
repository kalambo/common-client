"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mishmash_1 = require("mishmash");
var memoize = require("fast-memoize");
exports.default = memoize(function (toggleWidth) {
    return mishmash_1.default.do(mishmash_1.watchSize('small', 'setWidthElem', function (_a) {
        var width = _a.width;
        return width && width <= toggleWidth;
    }));
});
