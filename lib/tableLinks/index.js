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
var React = require("react");
var recompose_1 = require("recompose");
var mishmash_1 = require("mishmash");
var elmnt_1 = require("elmnt");
var getData_1 = require("../getData");
var Spinner_1 = require("../Spinner");
var Filter_1 = require("./Filter");
var Link_1 = require("./Link");
var joinFilters = function () {
    var filters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        filters[_i] = arguments[_i];
    }
    var f = filters.filter(function (f) { return f; });
    if (f.length === 0)
        return undefined;
    if (f.length === 1)
        return f[0];
    return __spread(['AND'], f);
};
exports.default = recompose_1.compose(mishmash_1.mapStyle({
    base: null,
    spinner: [['mergeKeys', 'spinner']],
    header: [['mergeKeys', 'header']],
    columnCell: [
        ['mergeKeys', 'column'],
        __spread(['filter'], mishmash_1.cssGroups.box, mishmash_1.cssGroups.other),
        ['expandFor', 'paddingLeft', 'borderTopLeftRadius'],
    ],
    columnText: [['mergeKeys', 'column'], __spread(['filter'], mishmash_1.cssGroups.text)],
    link: [['mergeKeys', 'link'], ['merge', { position: 'relative' }]],
    filter: [['mergeKeys', 'filter']],
}), recompose_1.withState('filter', 'setFilter', null), mishmash_1.renderLayer(function (_a) {
    var rows = _a.rows, setFilter = _a.setFilter, style = _a.style, children = _a.children;
    return (React.createElement(elmnt_1.Div, { style: { spacing: 15 } },
        React.createElement(Filter_1.default, { type: rows[0].name, onChange: setFilter, style: style.filter }),
        children));
}), getData_1.default(function (_a) {
    var rows = _a.rows, filter = _a.filter;
    return (__assign({}, rows[0], { filter: joinFilters(rows[0].filter, filter) }));
}), recompose_1.branch(function (_a) {
    var data = _a.data;
    return !data;
}, recompose_1.renderComponent(function (_a) {
    var style = _a.style;
    return React.createElement(Spinner_1.default, { style: style.spinner });
})), recompose_1.withProps(function (_a) {
    var rows = _a.rows, data = _a.data;
    var result = rows[1](data);
    return {
        rows: Array.isArray(result[0] && result[0][1]) ? result : [['', result]],
    };
}))(function (_a) {
    var path = _a.path, columns = _a.columns, rows = _a.rows, style = _a.style;
    return (React.createElement("table", { style: { width: '100%' } },
        React.createElement("tbody", null, rows.reduce(function (res, _a, i) {
            var _b = __read(_a, 2), group = _b[0], values = _b[1];
            return __spread(res, (group
                ? [
                    React.createElement("tr", { key: i + "_0" },
                        React.createElement("td", { colSpan: columns.length, style: { verticalAlign: 'top' } },
                            React.createElement(elmnt_1.Mark, { style: style.header }, group))),
                ]
                : []), [
                React.createElement("tr", { key: i + "_1" }, __spread(['#'], columns).map(function (c, j) { return (React.createElement("td", { style: __assign({}, style.columnCell, (j !== 0
                        ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
                        : {}), (j !== columns.length
                        ? { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
                        : { paddingRight: style.columnCell.paddingLeft })), key: c },
                    React.createElement(elmnt_1.Txt, { style: style.columnText }, c))); }))
            ], values.map(function (v, j) { return (React.createElement(Link_1.default, { path: path, values: v, index: j, style: style.link, key: i + "_" + (j + 2) })); }));
        }, []))));
});
