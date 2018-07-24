"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var utils_1 = require("../../../utils");
var dataToRows = function (context, fields, data, type, start, initial, first) {
    if (type === void 0) { type = null; }
    if (start === void 0) { start = 0; }
    if (initial === void 0) { initial = true; }
    if (first === void 0) { first = true; }
    var dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0)
        dataArray.push(undefined);
    return dataArray.reduce(function (result, values, i) {
        var dataBlocks = fields.map(function (f, j) {
            if (typeof f === 'string') {
                var value = utils_1.noUndef(values && values[f]);
                var editable = values &&
                    f !== '' &&
                    !f.startsWith('#') &&
                    f !== 'id' &&
                    context.editable(type, f);
                var schemaField = type && utils_1.root.rgo.schema[type][f];
                return [
                    [
                        {
                            type: type,
                            id: values && values.id,
                            field: f,
                            key: editable ? type + "." + (values && values.id) + "." + f : '',
                            value: value,
                            text: f === '' || values === undefined
                                ? ''
                                : f.startsWith('#')
                                    ? "" + (start + i + 1)
                                    : context.config.printValue(value, f === 'id' ? { scalar: 'string' } : schemaField),
                            link: schemaField &&
                                schemaField.meta &&
                                schemaField.meta.file &&
                                value &&
                                context.fileServer + "/storage/file/" + value.split(':')[0],
                            first: first && i === 0,
                            firstCol: f === '#0',
                            lastCol: f === '#3',
                        },
                    ],
                ];
            }
            return dataToRows(context, __spread([
                initial && j === 0 ? '#0' : '#1'
            ], (f.fields.length === 0 ? [''] : f.fields), [
                initial && j === fields.length - 1 ? '#3' : '#2',
            ]), (values || {})[f.alias || f.name], type ? utils_1.root.rgo.schema[type][f.name].type : f.name, f.start || 0, false, first && i === 0);
        });
        var height = Math.max.apply(Math, __spread(dataBlocks.map(function (rows) { return rows.length; })));
        return __spread(result, dataBlocks.reduce(function (res, rows) {
            rows.forEach(function (row, j) {
                res[j] = __spread((res[j] || []), row.map(function (v) { return (v.span === undefined ? __assign({}, v, { span: height }) : v); }));
            });
            if (rows[0][0].span !== undefined && height > rows.length) {
                res[rows.length] = __spread((res[rows.length] || []), Array.from({ length: rows[0].length }).map(function (_, j) { return ({
                    type: rows[0][j].type,
                    field: rows[0][j].field,
                    span: height - rows.length,
                    first: false,
                    empty: true,
                }); }));
            }
            return res;
        }, []));
    }, []);
};
exports.default = dataToRows;
