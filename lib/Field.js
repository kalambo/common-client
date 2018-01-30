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
var elmnt_1 = require("elmnt");
var mishmash_1 = require("mishmash");
var common_1 = require("common");
var FileButton = recompose_1.compose(recompose_1.branch(function (_a) {
    var value = _a.value;
    return !value;
}, recompose_1.renderNothing), mishmash_1.mapStyle([['mergeKeys', 'button'], ['merge', { width: '100%' }]]))(function (_a) {
    var value = _a.value, style = _a.style;
    return (React.createElement("a", { href: process.env.DATA_URL + "/storage/file/" + value.split(':')[0], target: "_blank" },
        React.createElement(mishmash_1.Hover, { style: __assign({}, style, { fontSize: 15, padding: 8 }) },
            React.createElement(elmnt_1.Txt, null, "View file"))));
});
exports.default = recompose_1.compose(recompose_1.branch(function (_a) {
    var type = _a.type, showFile = _a.showFile;
    return type === 'file' && showFile;
}, mishmash_1.renderLayer(function (_a) {
    var value = _a.value, style = _a.style, children = _a.children;
    return (React.createElement("div", { style: { width: '100%' } },
        React.createElement(elmnt_1.Div, { style: { spacing: 40, layout: 'bar', width: '100%' } },
            React.createElement("div", { style: { width: 150 } },
                React.createElement(FileButton, { value: value, style: style })),
            children)));
})), recompose_1.branch(function (_a) {
    var type = _a.type, options = _a.options, addNull = _a.addNull;
    return addNull && !type.endsWith('list') && Array.isArray(options);
}, recompose_1.withProps(function (_a) {
    var options = _a.options, labels = _a.labels;
    return ({
        options: options && (!options.includes(null) ? __spread(options, [null]) : options),
        labels: labels &&
            (!options.includes(null) ? __spread(labels, ['-- None --']) : labels),
    });
})), recompose_1.branch(function (_a) {
    var view = _a.view;
    return view;
}, recompose_1.compose(mishmash_1.mapStyle([__spread(['filter'], mishmash_1.cssGroups.text)]), recompose_1.renderComponent(function (_a) {
    var type = _a.type, value = _a.value, style = _a.style;
    return (React.createElement(elmnt_1.Txt, { style: style }, common_1.getValueString(value, type)));
}))))(elmnt_1.Input);
