"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deepEqual = require("deep-equal");
var common_1 = require("common");
var isEqual = function (v1, v2) { return deepEqual(v1, v2, { strict: true }); };
var runFilterValue = function (value, op, filterValue) {
    if (op === '=')
        return isEqual(value, filterValue);
    if (op === '!=')
        return !isEqual(value, filterValue);
    if (op === '<')
        return value < filterValue;
    if (op === '<=')
        return value <= filterValue;
    if (op === '>')
        return value > filterValue;
    if (op === '>=')
        return value >= filterValue;
    return Array.isArray(value)
        ? value.some(function (x) { return filterValue.includes(x); })
        : filterValue.includes(value);
};
function runFilter(filter, values) {
    if (!filter)
        return true;
    if (['AND', 'OR'].includes(filter[0])) {
        if (filter[0] === 'AND') {
            return filter.slice(1).every(function (f) { return runFilter(f, values); });
        }
        else if (filter[0] === 'OR') {
            return filter.slice(1).some(function (f) { return runFilter(f, values); });
        }
    }
    return runFilterValue(common_1.noUndef(values[filter[0]]), filter.length === 3 ? filter[1] : '=', filter[filter.length - 1]);
}
exports.default = runFilter;
