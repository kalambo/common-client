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
var elmnt_1 = require("elmnt");
var mishmash_1 = require("mishmash");
var icons_1 = require("../icons");
exports.default = mishmash_1.default
    .stream(function (_a) {
    var initial = _a.initial, observe = _a.observe, push = _a.push;
    var inputElem;
    var setInputElem = function (e) { return (inputElem = e); };
    var filter;
    initial.context.store.watch(function (props) { return props.path + "_filter"; }, function (text) {
        if (text === void 0) { text = ''; }
        return push({ text: text });
    }, observe, initial);
    return function (props, _a) {
        var text = _a.text;
        var invalid = text && !filter;
        return __assign({}, props, { text: text,
            invalid: invalid, setText: function (text) {
                filter = props.context.config.parseFilter(text, props.type);
                props.context.store.set(props.path + "_filter", text);
            }, onMouseMove: function () {
                return props.context.setActive({ type: 'filter', path: props.path });
            }, onMouseLeave: function () { return props.context.setActive(null); }, onClick: function () {
                props.context.setActive({ type: 'filter', path: props.path }, true);
                inputElem && inputElem.focus();
            }, onClickOutside: function () {
                if (props.focused) {
                    if (!invalid) {
                        props.context.query.filter(props.path, filter);
                        props.context.setActive(null, true);
                    }
                    return true;
                }
            }, onKeyDown: function (event) {
                if (props.focused && event.keyCode === 13 && !invalid) {
                    props.context.query.filter(props.path, filter);
                    props.context.setActive(null, true);
                    document.activeElement.blur();
                }
            }, setInputElem: setInputElem });
    };
})
    .cache('setText', 'onMouseMove', 'onMouseLeave', 'onClick', 'onClickOutside', 'onKeyDown')
    .map(mishmash_1.restyle(['active', 'focused', 'invalid'], function (active, focused, invalid) { return ({
    base: {
        input: [
            [
                'mergeKeys',
                { input: true, hover: active, focus: focused, invalid: invalid },
            ],
        ],
    },
}); }))
    .map(mishmash_1.restyle(['focused'], function (focused) { return ({
    input: {
        div: [
            ['scale', { margin: { padding: -1 } }],
            ['filter', 'margin', 'background'],
            ['merge', { position: 'relative' }],
        ],
        bar: [
            ['scale', { minWidth: { fontSize: 5 } }],
            ['filter', 'minWidth'],
            [
                'merge',
                { layout: 'bar', position: 'relative', zIndex: focused ? 30 : 5 },
            ],
        ],
        filterIcon: [
            ['scale', { fontSize: 0.8 }],
            ['filter', 'color', 'fontSize', 'padding'],
        ],
        iconWidth: [
            [
                'scale',
                { width: { fontSize: 0.8, paddingLeft: 0.5, paddingRight: 0.5 } },
            ],
        ],
        text: [
            __spread(['filter'], elmnt_1.css.groups.text, ['padding']),
            ['scale', { paddingRight: 2 }],
        ],
    },
}); }))
    .do(mishmash_1.onClickOutside(function (props) { return props.onClickOutside(); }, 'setClickElem'))(function (_a) {
    var live = _a.live, text = _a.text, setText = _a.setText, focused = _a.focused, onMouseMove = _a.onMouseMove, onMouseLeave = _a.onMouseLeave, onClick = _a.onClick, setClickElem = _a.setClickElem, onKeyDown = _a.onKeyDown, setInputElem = _a.setInputElem, style = _a.style;
    return (React.createElement("div", { onKeyDown: onKeyDown, style: style.div, ref: setClickElem },
        React.createElement(elmnt_1.Div, { style: style.bar },
            React.createElement("div", { style: { width: style.iconWidth.width } },
                React.createElement(elmnt_1.Icon, __assign({}, icons_1.default.filter, { style: style.filterIcon }))),
            React.createElement(elmnt_1.Input, { type: "string", value: text, onChange: setText, spellCheck: false, style: style.text, ref: setInputElem })),
        live &&
            !focused && (React.createElement("div", { onMouseMove: onMouseMove, onMouseLeave: onMouseLeave, onClick: onClick, style: {
                position: 'absolute',
                top: -(style.base.paddingTop + style.div.marginTop) -
                    style.base.borderTopWidth -
                    style.icon.radius,
                right: -(style.base.paddingRight + style.div.marginRight) -
                    style.base.borderRightWidth,
                bottom: -(style.base.paddingBottom + style.div.marginBottom) -
                    style.base.borderBottomWidth,
                left: -(style.base.paddingLeft + style.div.marginLeft) -
                    style.base.borderLeftWidth,
                cursor: 'pointer',
                // background: 'rgba(255,0,0,0.1)',
                zIndex: 5,
            } }))));
});
