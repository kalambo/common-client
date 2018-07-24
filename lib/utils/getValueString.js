"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var getValueStringSub = function (value, scalar) {
    if (value === undefined)
        return '';
    else if (value === null)
        return '---';
    else if (scalar === 'boolean')
        return value ? 'Yes' : 'No';
    else if (scalar === 'date')
        return moment(value).format('DD/MM/YY');
    return "" + value;
};
exports.default = (function (value, scalar) {
    if (Array.isArray(value)) {
        if (value.length === 0)
            return '---';
        return value.map(function (v) { return getValueStringSub(v, scalar); }).join(', ');
    }
    return getValueStringSub(value, scalar);
});
