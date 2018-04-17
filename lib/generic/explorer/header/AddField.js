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
var common_1 = require("common");
var utils_1 = require("../../../utils");
var icons_1 = require("../icons");
var Item = refluent_1.default
    .do('onClick', 'field', function (onClick, field) { return ({
    onClick: function () { return onClick(field); },
}); })
    .do(utils_1.watchHover)
    .do(utils_1.restyle('relation', 'isHovered', function (relation, isHovered, style) { return ({
    style: style
        .mergeKeys({ item: true, relation: relation, hover: isHovered })
        .merge({ border: 'none', cursor: 'pointer' }),
}); }))
    .yield(function (_a) {
    var context = _a.context, type = _a.type, field = _a.field, onClick = _a.onClick, hoverProps = _a.hoverProps, style = _a.style;
    return (React.createElement(elmnt_1.Txt, __assign({ onClick: onClick }, hoverProps, { style: style }), type
        ? context.types[type].fields.find(function (x) { return x[0] === field; })[1]
        : context.types[field].name));
});
exports.default = refluent_1.default
    .do(utils_1.restyle(function (style) { return (__assign({}, style, { modal: style.base.mergeKeys('modal').filter('background', 'padding') })); }))
    .do(function (props$) { return ({
    onMouseMove: function () {
        var _a = props$(), context = _a.context, path = _a.path;
        context.setActive({ type: 'add', path: path });
    },
    onMouseLeave: function () {
        var context = props$().context;
        context.setActive(null);
    },
    onClick: function () {
        var _a = props$(), context = _a.context, path = _a.path;
        context.setActive({ type: 'add', path: path }, true);
    },
    onClickItem: function (field) {
        var _a = props$(), context = _a.context, type = _a.type, path = _a.path;
        context.query.add(path, type, field);
        context.setActive(null, true);
    },
}); })
    .do(function (props$, _) { return ({
    onModalClose: function () {
        if (props$().focused) {
            props$().context.setActive(null, true);
            return true;
        }
    },
}); })
    .yield(function (_a) {
    var context = _a.context, type = _a.type, onClickItem = _a.onClickItem, focused = _a.focused, onModalClose = _a.onModalClose, style = _a.style, next = _a.next;
    return (React.createElement(elmnt_1.Modal, { isOpen: focused, onClose: onModalClose, next: next },
        React.createElement(elmnt_1.Div, { style: style.modal }, (type
            ? context.types[type].fields.map(function (x) { return x[0]; })
            : Object.keys(context.types).sort()).map(function (f, i) { return (React.createElement(Item, { context: context, type: type, field: f, relation: f !== 'id' && (!type || common_1.root.rgo.schema[type][f].type), onClick: onClickItem, style: style.base, key: i })); }))));
})
    .yield(function (_a) {
    var wide = _a.wide, setModalBase = _a.setModalBase, active = _a.active, focused = _a.focused, onMouseMove = _a.onMouseMove, onMouseLeave = _a.onMouseLeave, onClick = _a.onClick, empty = _a.empty, style = _a.style;
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
                    }), { background: !empty && style.icon.background }), ref: setModalBase }),
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
