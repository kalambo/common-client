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
var rgo_1 = require("rgo");
var fieldToRows = function (context, _a, type, path, baseIndex) {
    var _b = _a.sort, sort = _b === void 0 ? [] : _b, fields = _a.fields;
    if (baseIndex === void 0) { baseIndex = 0; }
    return fields.length === 0
        ? [
            [
                {
                    name: '',
                    type: type,
                    path: path ? path + "." + 0 : "" + baseIndex,
                    text: !path && !baseIndex ? 'Explore' : 'Add field',
                },
            ],
        ]
        : fields.reduce(function (rows, f, i) {
            var newPath = path ? path + "." + i : "" + (baseIndex + i);
            var nextPath = path ? path + "." + (i + 1) : "" + (baseIndex + i + 1);
            if (typeof f === 'string') {
                rows[0].push({
                    name: f,
                    type: type,
                    isList: f !== 'id' && common_1.root.rgo.schema[type][f].isList,
                    path: newPath,
                    sort: sort.includes(f)
                        ? 'asc'
                        : sort.includes("-" + f) ? 'desc' : null,
                    last: i === fields.length - 1 && nextPath,
                    text: context.config.fieldName(f, type),
                });
                return rows;
            }
            var newType = type
                ? common_1.root.rgo.schema[type][f.name].type
                : f.name;
            var newRows = fieldToRows(context, f, newType, newPath);
            var fieldSchema = type && common_1.root.rgo.schema[type][f.name];
            rows[0].push({
                name: '#1',
                type: type,
                isList: !fieldSchema ||
                    rgo_1.fieldIs.foreignRelation(fieldSchema) ||
                    fieldSchema.isList,
                path: newPath,
                firstCol: i === 0 && !path,
            }, {
                name: f.name,
                type: newType,
                path: newPath,
                span: newRows[0].reduce(function (res, g) { return res + (g.span || 1); }, 0),
                text: type
                    ? context.config.fieldName(f.name, type)
                    : context.types[f.name],
            }, {
                name: '#2',
                type: type,
                path: newPath + "." + newRows[0].filter(function (d) { return !d.name.startsWith('#'); }).length,
                last: i === fields.length - 1 && nextPath,
                lastCol: i === fields.length - 1 && !path,
            });
            newRows.forEach(function (r, j) {
                rows[j + 1] = __spread((rows[j + 1] || []), r);
            });
            return rows;
        }, [[]]);
};
exports.default = fieldToRows;
