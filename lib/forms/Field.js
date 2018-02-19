"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
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
var elmnt_1 = require("elmnt");
var mishmash_1 = require("mishmash");
var common_1 = require("common");
var style_transform_1 = require("style-transform");
var FileButton = mishmash_1.compose(mishmash_1.branch(function (_a) {
    var value = _a.value;
    return !value;
}, mishmash_1.render()), mishmash_1.map(mishmash_1.restyle([['mergeKeys', 'button'], ['merge', { width: '100%' }]])))(function (_a) {
    var value = _a.value, style = _a.style;
    return (React.createElement("a", { href: process.env.DATA_URL + "/storage/file/" + value.split(':')[0], target: "_blank" },
        React.createElement(mishmash_1.Use, { hoc: mishmash_1.withHover }, function (_a) {
            var hover = _a.isHovered, hoverProps = _a.hoverProps;
            return (React.createElement(elmnt_1.Txt, __assign({}, hoverProps, { style: style_transform_1.default(__assign({}, style, { fontSize: 15, padding: 8 }), [
                    ['mergeKeys', { hover: hover }],
                ]) }), "View file"));
        })));
});
exports.default = mishmash_1.compose(mishmash_1.branch(function (_a) {
    var type = _a.type, admin = _a.admin;
    return type === 'file' && admin;
}, mishmash_1.render(function (_a) {
    var value = _a.value, style = _a.style, inner = _a.inner;
    return (React.createElement("div", { style: { width: '100%' } },
        React.createElement(elmnt_1.Div, { style: { spacing: 40, layout: 'bar', width: '100%' } },
            React.createElement("div", { style: { width: 150 } },
                React.createElement(FileButton, { value: value, style: style })),
            inner())));
})), mishmash_1.branch(function (_a) {
    var type = _a.type, options = _a.options, admin = _a.admin;
    return admin && !type.endsWith('list') && Array.isArray(options);
}, mishmash_1.map(function (_a) {
    var options = _a.options, labels = _a.labels, props = __rest(_a, ["options", "labels"]);
    return (__assign({}, props, { options: options && (!options.includes(null) ? __spread(options, [null]) : options), labels: labels &&
            (!options.includes(null) ? __spread(labels, ['-- None --']) : labels) }));
})), mishmash_1.branch(function (_a) {
    var view = _a.view;
    return view;
}, mishmash_1.compose(mishmash_1.map(mishmash_1.restyle([__spread(['filter'], elmnt_1.css.groups.text)])), mishmash_1.render(function (_a) {
    var type = _a.type, value = _a.value, style = _a.style;
    return (React.createElement(elmnt_1.Txt, { style: style }, common_1.getValueString(value, type)));
}))))(elmnt_1.Input);
