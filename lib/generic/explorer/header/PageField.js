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
exports.default = mishmash_1.default()
    .enhance(function (_a) {
    var firstProps = _a.firstProps, onProps = _a.onProps, setState = _a.setState, methods = _a.methods;
    firstProps.context.store.watch(function (props) { return props.path + "_start"; }, function (start) {
        if (start === void 0) { start = 1; }
        return setState({ start: start });
    }, onProps, firstProps);
    firstProps.context.store.watch(function (props) { return props.path + "_end"; }, function (end) {
        if (end === void 0) { end = null; }
        return setState({ end: end });
    }, onProps, firstProps);
    return function (_a, _b) {
        var start = _b.start, end = _b.end;
        var path = _a.path, props = __rest(_a, ["path"]);
        return (__assign({ show: props.up ? start && start > 1 && end : end }, props, methods({
            onMouseMove: function () {
                return props.context.setActive({
                    type: props.up ? 'pageup' : 'pagedown',
                    path: path,
                });
            },
            onMouseLeave: function () { return props.context.setActive(null); },
            onClick: function () {
                var move = props.up
                    ? -Math.min(start - 1, end - (start || 1) + 1)
                    : end - (start || 1) + 1;
                var newStart = (start || 1) + move;
                var newEnd = end + move;
                props.context.store.set(path + "_start", newStart);
                props.context.store.set(path + "_end", newEnd);
                props.context.query.limit(path, newStart - 1, newEnd);
            },
        })));
    };
})
    .branch(function (_a) {
    var show = _a.show;
    return !show;
}, mishmash_1.default().render())(function (_a) {
    var up = _a.up, active = _a.active, onMouseMove = _a.onMouseMove, onMouseLeave = _a.onMouseLeave, onClick = _a.onClick, style = _a.style;
    return (React.createElement("div", { style: __assign({ position: 'absolute', left: 0, right: 0, zIndex: 21 }, (up
            ? { top: 0, height: style.base.paddingTop * 2.2 }
            : { bottom: 0, height: style.base.paddingBottom * 2.2 })) },
        active && (React.createElement(React.Fragment, null,
            React.createElement("div", { style: __assign({ position: 'absolute', right: 0, bottom: 0, left: 0, height: style.base.borderBottomWidth * 3, background: style.icon.background }, (up ? { top: 0 } : { bottom: 0 })) }),
            React.createElement(elmnt_1.Icon, __assign({}, (up ? icons_1.default.up : icons_1.default.down), { style: __assign({}, style.icon, { position: 'absolute', left: '50%', marginLeft: -style.icon.radius }, (up
                    ? { top: style.base.borderTopWidth }
                    : { bottom: style.base.borderBottomWidth })) })))),
        React.createElement("div", { onMouseMove: onMouseMove, onMouseLeave: onMouseLeave, onDoubleClick: onClick, style: {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                cursor: 'pointer',
            } })));
});
