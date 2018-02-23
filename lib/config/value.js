"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var printSingleValue = function (value, scalar) {
    if (value === undefined)
        return '';
    else if (value === null)
        return '-';
    else if (scalar === 'boolean')
        return value ? 'Yes' : 'No';
    else if (scalar === 'date')
        return moment(value).format('DD/MM/YY');
    return "" + value;
};
exports.printValue = function (value, scalar) {
    if (Array.isArray(value)) {
        if (value.length === 0)
            return '-';
        return value.map(function (v) { return printSingleValue(v, scalar); }).join(', ');
    }
    return printSingleValue(value, scalar);
};
exports.parseValue = function (value, scalar) {
    if (value === 'null')
        return null;
    if (scalar === 'boolean')
        return { true: true, false: false }[value];
    if (scalar === 'int')
        return parseInt(value, 10);
    if (scalar === 'float')
        return parseFloat(value);
    if (scalar === 'date') {
        var parts = value
            .split(/^(\d\d?)\/(\d\d?)\/(\d\d(?:\d\d)?)$/)
            .slice(1)
            .map(parseFloat);
        if (parts.length === 0)
            return undefined;
        var dd = parts[0];
        var mm = parts[1] - 1;
        var yy = parts[2] + (parts[2] < 100 ? (parts[2] < 30 ? 2000 : 1900) : 0);
        var d = new Date(yy, mm, dd);
        if (d.getDate() !== dd || d.getMonth() !== mm || d.getFullYear() !== yy) {
            return undefined;
        }
        return d;
    }
    return value;
};
