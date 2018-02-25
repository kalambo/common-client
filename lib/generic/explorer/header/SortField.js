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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var elmnt_1 = require("elmnt");
var mishmash_1 = require("mishmash");
var icons_1 = require("../icons");
exports.default = mishmash_1.default
    .map(function (_a) {
    var path = _a.path, props = __rest(_a, ["path"]);
    return (__assign({}, props, { onMouseMove: function () { return props.context.setActive({ type: 'sort', path: path }); }, onMouseLeave: function () { return props.context.setActive(null); }, onClick: function () { return props.context.query.sort(path); } }));
})
    .cache('onMouseMove', 'onMouseLeave', 'onClick')(function (_a) {
    var sort = _a.sort, active = _a.active, onMouseMove = _a.onMouseMove, onMouseLeave = _a.onMouseLeave, onClick = _a.onClick, style = _a.style;
    return (React.createElement(React.Fragment, null,
        (sort || active) && (React.createElement(elmnt_1.Icon, __assign({}, icons_1.default[sort === 'asc' ? 'up' : sort === 'desc' ? 'down' : ''], { style: __assign({}, style.icon, { position: 'absolute', left: '50%', marginLeft: -style.icon.radius, top: -style.icon.radius }) }))),
        React.createElement("div", { onMouseMove: onMouseMove, onMouseLeave: onMouseLeave, onClick: onClick, style: {
                position: 'absolute',
                top: -style.icon.radius,
                left: 0,
                right: 0,
                bottom: 0,
                cursor: 'pointer',
            } })));
});
