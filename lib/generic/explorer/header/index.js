"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fieldToRows_1 = require("./fieldToRows");
exports.fieldToRows = fieldToRows_1.default;
var React = require("react");
var refluent_1 = require("refluent");
var utils_1 = require("../../../utils");
var HeaderCell_1 = require("./HeaderCell");
var parent = function (path, depth) {
    if (depth === void 0) { depth = 1; }
    return path &&
        path
            .split('.')
            .slice(0, -depth)
            .join('.');
};
exports.default = refluent_1.default
    .yield(function (_a) {
    var next = _a.next;
    return next(function (props) { return props; });
})
    .yield(utils_1.branch('live', refluent_1.default.do('context', function (context, push) {
    return context.store.listen('header', function (header) {
        if (header === void 0) { header = {}; }
        return push(header);
    });
})))
    .yield(function (_a) {
    var context = _a.context, fieldRows = _a.fieldRows, live = _a.live, activeFocus = _a.activeFocus, activeType = _a.activeType, activePath = _a.activePath, style = _a.style;
    return (React.createElement("thead", null, fieldRows.map(function (row, i) { return (React.createElement("tr", { key: i }, row.map(function (d) { return (React.createElement(HeaderCell_1.default, __assign({ context: context, rowSpan: d.span ? 1 : fieldRows.length - i }, d, (live
        ? {
            live: true,
            focused: activeFocus,
            alt: (d.path.split('.').length + (d.name === '#2' ? 1 : 0)) %
                2 ===
                0,
            isPathAdd: activeType === 'add' && activePath === d.path,
            isLastPathAdd: activeType === 'add' && activePath === d.last,
            isPathSort: activeType === 'sort' && activePath === d.path,
            isSiblingSort: activeType === 'sort' &&
                parent(activePath) ===
                    parent(d.path, d.name === '#2' ? 2 : 1),
            isPathRemove: activeType === 'remove' && activePath === d.path,
            isChildRemove: activeType === 'remove' &&
                d.path.startsWith(activePath),
            isPathLimit: activeType === 'limit' && activePath === d.path,
            isPathFilter: activeType === 'filter' && activePath === d.path,
            isPathPageUp: activeType === 'pageup' && activePath === d.path,
            isPathPageDown: activeType === 'pagedown' && activePath === d.path,
        }
        : {}), { style: style, key: d.path + "_" + d.name }))); }))); })));
});
