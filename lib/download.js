"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("common");
var processQuery = function (query) { return (__assign({}, query, { fields: __spread((query.fields || ['id']).map(function (f) { return (typeof f === 'string' ? f : processQuery(f)); })) })); };
exports.default = (function (query, filename) { return __awaiter(_this, void 0, void 0, function () {
    var fullData, headers, processLayer, rows, csv, link;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, common_1.root.rgo.query(processQuery(query))];
            case 1:
                fullData = _a.sent();
                headers = [];
                processLayer = function (_a, data, type, indent) {
                    var name = _a.name, alias = _a.alias, fields = _a.fields;
                    if (indent === void 0) { indent = ''; }
                    headers.push("" + indent + (alias || name));
                    var fullValues = fields.reduce(function (result, f) {
                        if (typeof f === 'string') {
                            headers.push(indent + "      " + f);
                            return __spread(result, [
                                data.map(function (d) { return [
                                    common_1.getValueString(d && d[f], common_1.root.rgo.schema[type][f].scalar || 'string'),
                                ]; }),
                            ]);
                        }
                        var val = processLayer(f, data.reduce(function (res, d) { return res.concat(d && d[f.alias || f.name]); }, []), common_1.root.rgo.schema[type][f.name].type, indent + '      ');
                        return __spread(result, val.map(function (row) {
                            var index = 0;
                            return data.map(function (d) {
                                return []
                                    .concat(d && d[f.alias || f.name])
                                    .reduce(function (res) { return __spread(res, row[index++]); }, []);
                            });
                        }));
                    }, []);
                    var spans = data.map(function (_, i) {
                        return Math.max.apply(Math, __spread(fullValues.map(function (row) { return row[i].length; })));
                    });
                    return __spread([
                        spans.map(function (s) { return Array(s).fill(''); })
                    ], fullValues.map(function (row) {
                        return row.map(function (v, i) {
                            var start = v.length;
                            v[spans[i] - 1] = v[spans[i] - 1] || '';
                            return v.fill('', start, spans[i]);
                        });
                    }));
                };
                rows = Array.isArray(query)
                    ? query
                    : [query].reduce(function (res, q) { return __spread(res, processLayer(q, fullData[q.alias || q.name], q.name)); }, []);
                csv = rows
                    .map(function (row, i) { return __spread([headers[i]], row[0]).map(function (v) { return "\u00B0" + (v || '') + "\u00B0"; }).join(','); })
                    .join('\n')
                    .replace(/"/g, '""')
                    .replace(/°/g, '"');
                link = document.createElement('a');
                link.setAttribute('href', encodeURI("data:text/csv;charset=utf-8," + csv));
                link.setAttribute('download', (filename || 'data') + ".csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return [2 /*return*/];
        }
    });
}); });
