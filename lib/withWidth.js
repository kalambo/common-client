"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var refluent_1 = require("refluent");
var memoize = require("fast-memoize");
var resizeRef_1 = require("./resizeRef");
exports.default = memoize(function (toggleWidth) {
    return refluent_1.default.do(function (_, push) { return ({
        setWidthElem: resizeRef_1.default(function (_a) {
            var width = _a.width;
            return push({ small: width && width <= toggleWidth });
        }),
    }); });
});
