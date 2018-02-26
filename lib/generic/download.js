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
var common_1 = require("common");
var csvHeader = function (config, types, _a, type) {
    var _b = _a.sort, sort = _b === void 0 ? [] : _b, fields = _a.fields;
    if (type === void 0) { type = null; }
    if (fields.length === 0)
        return [['Add field']];
    var blocks = fields.map(function (f) {
        if (typeof f === 'string') {
            var fieldName_1 = type
                ? types[type].fields.find(function (x) { return x[0] === f; })[1]
                : types[f].name;
            var fieldSort = sort.includes(f)
                ? 'asc'
                : sort.includes("-" + f) ? 'desc' : '';
            return [[fieldSort ? fieldName_1 + " [" + fieldSort + "]" : fieldName_1]];
        }
        var fieldName = type
            ? types[type].fields.find(function (x) { return x[0] === f.name; })[1]
            : types[f.name].name;
        var newType = type ? common_1.root.rgo.schema[type][f.name].type : f.name;
        var filter = config.printFilter(f.filter, newType);
        var rows = csvHeader(config, types, f, newType);
        return __spread([
            __spread([
                "" + ((f.start || 0) + 1)
            ], rows[0].map(function (_, i) {
                return i === 0 ? (filter ? fieldName + " (" + filter + ")" : fieldName) : '';
            }))
        ], rows.map(function (row, i) { return __spread([i === 0 ? "" + (f.end || '') : ''], row); }));
    });
    var height = Math.max.apply(Math, __spread(blocks.map(function (rows) { return rows.length; })));
    return blocks.reduce(function (res, rows) {
        Array.from({ length: height }).forEach(function (_, i) {
            res[i] = __spread((res[i] || []), (rows[i] || rows[0].map(function () { return ''; })));
        });
        return res;
    }, []);
};
var csvData = function (config, fields, data, type, start) {
    if (type === void 0) { type = null; }
    if (start === void 0) { start = 0; }
    var dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0)
        dataArray.push(undefined);
    return dataArray.reduce(function (result, values, i) {
        var blocks = fields.map(function (f) {
            if (typeof f === 'string') {
                var value = common_1.noUndef(values && values[f]);
                return [
                    [
                        f === '' || values === undefined
                            ? ''
                            : f.startsWith('#')
                                ? "" + (start + i + 1)
                                : config.printValue(value, f === 'id'
                                    ? 'string'
                                    : common_1.root.rgo.schema[type][f].scalar),
                    ],
                ];
            }
            return csvData(config, __spread(['#'], (f.fields.length === 0 ? [''] : f.fields)), (values || {})[f.alias || f.name], type ? common_1.root.rgo.schema[type][f.name].type : f.name, f.start || 0);
        });
        var height = Math.max.apply(Math, __spread(blocks.map(function (rows) { return rows.length; })));
        return __spread(result, blocks.reduce(function (res, rows) {
            Array.from({ length: height }).forEach(function (_, j) {
                res[j] = __spread((res[j] || []), (rows[j] || rows[0].map(function () { return ''; })));
            });
            return res;
        }, []));
    }, []);
};
exports.default = (function (config, types, query, data, filename) {
    if (filename === void 0) { filename = 'data'; }
    var blocks = query.map(function (q) { return __spread(csvHeader(config, types, { fields: [q] }), csvData(config, [q], data)); });
    var height = Math.max.apply(Math, __spread(blocks.map(function (rows) { return rows.length; })));
    var allRows = blocks.reduce(function (res, rows, i) {
        Array.from({ length: height }).forEach(function (_, j) {
            res[j] = __spread((res[j] || []), (i === 0 ? [] : ['']), (rows[j] || rows[0].map(function () { return ''; })));
        });
        return res;
    }, []);
    var csv = allRows
        .map(function (row) { return row.map(function (s) { return "\u00B0" + s.replace(/\n|\r/g, '\r\n') + "\u00B0"; }).join(','); })
        .join('\r\n')
        .replace(/"/g, '""')
        .replace(/°/g, '"');
    var link = document.createElement('a');
    link.setAttribute('href', encodeURI("data:text/csv;charset=utf-8," + csv));
    link.setAttribute('download', filename + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
