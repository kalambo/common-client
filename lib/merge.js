"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isObject = function (v) {
    return Object.prototype.toString.call(v) === '[object Object]';
};
var mergeTwo = function (target, source, depth) {
    var result = {};
    if (isObject(target)) {
        Object.keys(target).forEach(function (k) { return (result[k] = clone(target[k])); });
    }
    Object.keys(source).forEach(function (k) {
        if (!isObject(source[k]) || !target[k] || depth === 0) {
            result[k] = clone(source[k]);
        }
        else {
            result[k] = mergeTwo(target[k], source[k], depth - 1);
        }
    });
    return result;
};
var clone = function (obj, depth) {
    if (depth === void 0) { depth = -1; }
    return isObject(obj) ? mergeTwo({}, obj, depth) : obj;
};
exports.default = function (objs, depth) {
    if (depth === void 0) { depth = -1; }
    return objs.reduce(function (res, obj) { return mergeTwo(res, obj, depth); }, {});
};
