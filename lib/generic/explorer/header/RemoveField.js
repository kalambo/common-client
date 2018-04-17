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
var React = require("react");
var elmnt_1 = require("elmnt");
var refluent_1 = require("refluent");
var icons_1 = require("../icons");
exports.default = refluent_1.default
    .do(function (props$) { return ({
    onMouseMove: function () {
        var _a = props$(), context = _a.context, path = _a.path;
        context.setActive({ type: 'remove', path: path });
    },
    onMouseLeave: function () {
        var context = props$().context;
        context.setActive(null);
    },
    onClick: function () {
        var _a = props$(), context = _a.context, path = _a.path;
        context.query.remove(path);
        context.setActive(null);
    },
}); })
    .yield(function (_a) {
    var relation = _a.relation, active = _a.active, onMouseMove = _a.onMouseMove, onMouseLeave = _a.onMouseLeave, onClick = _a.onClick, style = _a.style;
    return (React.createElement(React.Fragment, null,
        active && (React.createElement(elmnt_1.Icon, __assign({}, icons_1.default.cross, { style: __assign({}, style.icon, { position: 'absolute', left: '50%', marginLeft: -style.icon.radius }, (relation
                ? { top: style.icon.radius * 0.7 }
                : { bottom: style.base.borderBottomWidth })) }))),
        React.createElement("div", { onMouseMove: onMouseMove, onMouseLeave: onMouseLeave, onDoubleClick: onClick, style: {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                cursor: 'pointer',
            } })));
});
