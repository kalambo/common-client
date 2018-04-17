"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var keys_to_object_1 = require("keys-to-object");
var style_transform_1 = require("style-transform");
exports.default = (function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var map = args.pop();
    return function (props$) {
        return props$.apply(void 0, __spread(['style'], args, [function (style) {
                if (style === void 0) { style = {}; }
                var values = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    values[_i - 1] = arguments[_i];
                }
                if (style.expandFor)
                    return { style: map.apply(void 0, __spread(values, [style])) };
                var keys = Object.keys(style);
                if (keys.length && keys.every(function (k) { return typeof style[k] === 'object'; })) {
                    return { style: map.apply(void 0, __spread(values, [keys_to_object_1.default(keys, function (k) { return style_transform_1.default(style[k]); })])) };
                }
                return { style: map.apply(void 0, __spread(values, [style_transform_1.default(style)])) };
            }]));
    };
});
