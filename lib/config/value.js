"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var printSingleValue = function (value, field) {
    if (value === undefined)
        return '';
    else if (value === null)
        return '-';
    else if (field.meta && field.meta.labels)
        return field.meta.labels[field.meta.options.indexOf(value)];
    else if (field.scalar === 'boolean')
        return value ? 'Yes' : 'No';
    else if (field.scalar === 'date')
        return moment(value).format('DD/MM/YY');
    else if (field.meta && field.meta.file)
        return value.split(':')[1];
    return "" + value;
};
exports.printValue = function (value, field) {
    if (Array.isArray(value)) {
        if (value.length === 0)
            return '-';
        return value.map(function (v) { return printSingleValue(v, field); }).join(', ');
    }
    return printSingleValue(value, field);
};
exports.parseValue = function (value, field) {
    if (value === 'null')
        return null;
    if (field.scalar === 'boolean')
        return { true: true, false: false }[value];
    if (field.scalar === 'int')
        return parseInt(value, 10);
    if (field.scalar === 'float')
        return parseFloat(value);
    if (field.scalar === 'date') {
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
