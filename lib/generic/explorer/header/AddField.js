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
var icons_1 = require("../icons");
var Item = mishmash_1.default
    .map(function (props) { return (__assign({}, props, { onClick: function () { return props.onClick(props.field); } })); })
    .cache('onClick')
    .do(mishmash_1.watchHover)
    .map(mishmash_1.restyle(['relation', 'isHovered'], function (relation, isHovered) { return [
    ['mergeKeys', { item: true, relation: relation, hover: isHovered }],
    ['merge', { border: 'none', cursor: 'pointer' }],
]; }))(function (_a) {
    var context = _a.context, type = _a.type, field = _a.field, onClick = _a.onClick, hoverProps = _a.hoverProps, style = _a.style;
    return (React.createElement(elmnt_1.Txt, __assign({ onClick: onClick }, hoverProps, { style: style }), type ? context.config.fieldName(field, type) : context.types[field]));
});
exports.default = mishmash_1.default
    .map(mishmash_1.restyle({
    base: {
        modal: [['mergeKeys', 'modal'], ['filter', 'background', 'padding']],
    },
}))
    .map(function (_a) {
    var path = _a.path, props = __rest(_a, ["path"]);
    return (__assign({}, props, { onMouseMove: function () { return props.context.setActive({ type: 'add', path: path }); }, onMouseLeave: function () { return props.context.setActive(null); }, onClick: function () { return props.context.setActive({ type: 'add', path: path }, true); }, onClickItem: function (field) {
            props.context.query.add(path, props.type, field);
            props.context.setActive(null, true);
        } }));
})
    .cache('onMouseMove', 'onMouseLeave', 'onClick', 'onClickItem')
    .do(mishmash_1.onClickOutside(function (props) {
    if (props.focused) {
        props.context.setActive(null, true);
        return true;
    }
}, 'setClickElem'))
    .do(mishmash_1.renderLifted(mishmash_1.fitScreen(function (_a) {
    var _b = _a.liftBounds, top = _b.top, left = _b.left, height = _b.height, width = _b.width;
    return ({
        base: { top: top + height, left: left + width * 0.5 - 100, width: 203 },
        gap: 4,
    });
})(function (_a) {
    var context = _a.context, type = _a.type, onClickItem = _a.onClickItem, setClickElem = _a.setClickElem, setInnerElem = _a.setInnerElem, fitStyle = _a.fitStyle, fitSmall = _a.fitSmall, style = _a.style;
    return (React.createElement("div", null,
        React.createElement("div", { style: {
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: fitSmall ? 'rgba(0,0,0,0.5)' : 'none',
                zIndex: 99999,
            } }),
        React.createElement("div", { style: __assign({}, fitStyle, { boxShadow: fitSmall
                    ? '0 2px 25px rgba(0,0,0,0.5)'
                    : '0 2px 20px 5px rgba(0,0,0,0.4)', zIndex: 99999 }), ref: setClickElem },
            React.createElement("div", { ref: setInnerElem },
                React.createElement(elmnt_1.Div, { style: style.modal }, (type
                    ? __spread(['id'], Object.keys(common_1.root.rgo.schema[type])) : Object.keys(context.types)).map(function (f, i) { return (React.createElement(Item, { context: context, type: type, field: f, relation: f !== 'id' &&
                        (!type || common_1.root.rgo.schema[type][f].type), onClick: onClickItem, style: style.base, key: i })); }))))));
}), function (_a) {
    var focused = _a.focused;
    return focused;
}))(function (_a) {
    var wide = _a.wide, setLiftBaseElem = _a.setLiftBaseElem, active = _a.active, focused = _a.focused, onMouseMove = _a.onMouseMove, onMouseLeave = _a.onMouseLeave, onClick = _a.onClick, empty = _a.empty, style = _a.style;
    return (React.createElement(React.Fragment, null,
        (active || focused) && (React.createElement(React.Fragment, null,
            React.createElement("div", { style: __assign({ position: 'absolute' }, (wide
                    ? {
                        right: 0,
                        bottom: 0,
                        left: 0,
                        height: style.base.borderBottomWidth * 3,
                    }
                    : {
                        top: 0,
                        left: -style.base.borderLeftWidth,
                        bottom: 0,
                        width: style.base.borderLeftWidth * 3,
                    }), { background: !empty && style.icon.background }), ref: setLiftBaseElem }),
            !empty && (React.createElement(elmnt_1.Icon, __assign({}, icons_1.default.plus, { style: __assign({}, style.icon, { position: 'absolute' }, (wide
                    ? {
                        left: '50%',
                        marginLeft: -style.icon.radius,
                        bottom: style.base.borderBottomWidth,
                    }
                    : {
                        bottom: '50%',
                        left: -style.icon.radius,
                        marginBottom: -style.icon.radius,
                    })) }))))),
        React.createElement("div", { onMouseMove: onMouseMove, onMouseLeave: onMouseLeave, onClick: onClick, style: {
                position: 'absolute',
                top: -style.icon.radius,
                left: wide ? 0 : -style.base.paddingLeft,
                right: wide ? 0 : -style.base.paddingRight,
                bottom: 0,
                cursor: 'pointer',
            } })));
});
