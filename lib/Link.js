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
var gatsby_link_1 = require("gatsby-link");
exports.default = (function (_a) {
    var to = _a.to, newTab = _a.newTab, _ = _a.route, props = __rest(_a, ["to", "newTab", "route"]);
    var external = to.startsWith('http');
    return external ? (React.createElement("a", __assign({ href: to, target: "_blank" }, props))) : (React.createElement(gatsby_link_1.default, __assign({ to: to }, (newTab ? { target: '_blank' } : {}), props)));
});
