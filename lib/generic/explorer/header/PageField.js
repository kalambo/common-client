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
    .do('context', 'path', function (context, path, push) {
    var unlistens = [
        context.store.listen(path + "_start", function (start) {
            if (start === void 0) { start = 1; }
            return push({ start: start });
        }),
        context.store.listen(path + "_end", function (end) {
            if (end === void 0) { end = null; }
            return push({ end: end });
        }),
    ];
    return function () { return unlistens.forEach(function (u) { return u(); }); };
})
    .do('up', 'start', 'end', function (up, start, end) { return ({
    show: up ? start && start > 1 && end : end,
}); })
    .do(function (props$, _) { return ({
    onMouseMove: function () {
        var _a = props$(), context = _a.context, path = _a.path, up = _a.up;
        context.setActive({
            type: up ? 'pageup' : 'pagedown',
            path: path,
        });
    },
    onMouseLeave: function () {
        var context = props$().context;
        context.setActive(null);
    },
    onClick: function () {
        var _a = props$(), context = _a.context, path = _a.path, up = _a.up, start = _a.start, end = _a.end;
        var move = up
            ? -Math.min(start - 1, end - (start || 1) + 1)
            : end - (start || 1) + 1;
        var newStart = (start || 1) + move;
        var newEnd = end + move;
        context.store.set(path + "_start", newStart);
        context.store.set(path + "_end", newEnd);
        context.query.limit(path, newStart - 1, newEnd);
    },
}); })
    .yield(function (_a) {
    var show = _a.show, next = _a.next;
    return (show ? next() : null);
})
    .yield(function (_a) {
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
