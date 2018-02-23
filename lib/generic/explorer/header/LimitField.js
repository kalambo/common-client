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
exports.default = mishmash_1.default()
    .enhance(function (_a) {
    var firstProps = _a.firstProps, onProps = _a.onProps, setState = _a.setState, methods = _a.methods;
    var inputElem1;
    var setInputElem1 = function (e) { return (inputElem1 = e); };
    var inputElem2;
    var setInputElem2 = function (e) { return (inputElem2 = e); };
    firstProps.context.store.watch(function (props) { return props.path + "_start"; }, function (start) {
        if (start === void 0) { start = 1; }
        return setState({ start: start });
    }, onProps, firstProps);
    firstProps.context.store.watch(function (props) { return props.path + "_end"; }, function (end) {
        if (end === void 0) { end = null; }
        return setState({ end: end });
    }, onProps, firstProps);
    var diff = -1;
    return function (props, _a) {
        var start = _a.start, end = _a.end;
        if (diff === -1)
            diff = end ? end - start : null;
        var invalid = start && end && start > end;
        return __assign({}, props, { start: start,
            end: end,
            invalid: invalid }, methods({
            onChangeStart: function (v) {
                props.context.store.set(props.path + "_start", v);
                if (v && end) {
                    props.context.store.set(props.path + "_end", Math.max(v + diff, 1));
                }
            },
            onChangeEnd: function (v) {
                props.context.store.set(props.path + "_end", v);
                diff = start && v ? v - start : null;
            },
            onMouseMove: function () {
                return props.context.setActive({ type: 'limit', path: props.path });
            },
            onMouseLeave: function () { return props.context.setActive(null); },
            onClick: function () {
                props.context.setActive({ type: 'limit', path: props.path }, true);
                inputElem1 && inputElem1.focus();
                // if (e.clientY - e.target.getBoundingClientRect().top <= 44) {
                //   inputElem1 && inputElem1.focus();
                // } else {
                //   inputElem2 && inputElem2.focus();
                // }
            },
            onClickOutside: function () {
                if (props.focused) {
                    if (!invalid) {
                        if (!start)
                            props.context.store.set(props.path + "_start", 1);
                        if (end === 0)
                            props.context.store.set(props.path + "_end", null);
                        props.context.query.limit(props.path, start ? start - 1 : 0, end);
                        props.context.setActive(null, true);
                    }
                    return true;
                }
            },
            onKeyDown: function (event) {
                if (props.focused && event.keyCode === 13) {
                    if (!invalid) {
                        if (!start)
                            props.context.store.set(props.path + "_start", 1);
                        if (end === 0)
                            props.context.store.set(props.path + "_end", null);
                        props.context.query.limit(props.path, start ? start - 1 : 0, end);
                        props.context.setActive(null, true);
                        document.activeElement.blur();
                    }
                }
            },
        }), { setInputElem1: setInputElem1,
            setInputElem2: setInputElem2 });
    };
})
    .style(['active', 'focused', 'invalid'], function (active, focused, invalid) { return ({
    base: {
        input: [
            ['mergeKeys', { input: true, hover: active, focus: focused, invalid: invalid }],
        ],
    },
}); })
    .style(['active', 'focused'], function (active, focused) { return ({
    input: {
        div: [
            ['scale', { margin: { padding: -1 } }],
            __spread(['filter', 'margin'], (active && !focused ? ['background'] : [])),
            ['merge', { position: 'relative', zIndex: focused ? 30 : 6 }],
        ],
        text: [
            __spread([
                'filter'
            ], elmnt_1.css.groups.text, [
                'padding'
            ], (active && !focused ? [] : ['background'])),
            ['scale', { minWidth: { fontSize: 2 } }],
            ['merge', { display: 'inline-block', verticalAlign: 'top' }],
        ],
        arrow: [
            ['mergeKeys', 'connect'],
            [
                'scale',
                {
                    fontSize: 0.9,
                    paddingTop: 0,
                    paddingBottom: 0,
                    minWidth: { fontSize: 2 },
                },
            ],
            ['filter', 'fontSize', 'color', 'padding', 'minWidth'],
        ],
    },
}); })
    .enhance(mishmash_1.onClickOutside(function (props) { return props.onClickOutside(); }, 'setClickElem'))(function (_a) {
    var live = _a.live, start = _a.start, end = _a.end, onChangeStart = _a.onChangeStart, onChangeEnd = _a.onChangeEnd, focused = _a.focused, onMouseMove = _a.onMouseMove, onMouseLeave = _a.onMouseLeave, onClick = _a.onClick, setClickElem = _a.setClickElem, onKeyDown = _a.onKeyDown, setInputElem1 = _a.setInputElem1, setInputElem2 = _a.setInputElem2, style = _a.style;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { onKeyDown: onKeyDown, style: style.div, ref: setClickElem },
            React.createElement(elmnt_1.Input, { type: "int", value: start, onChange: onChangeStart, style: style.text, ref: setInputElem1 }),
            React.createElement(elmnt_1.Icon, __assign({}, icons_1.default.down, { style: style.arrow })),
            React.createElement(elmnt_1.Input, { type: "int", value: end, onChange: onChangeEnd, style: style.text, ref: setInputElem2 })),
        live &&
            !focused && (React.createElement("div", { onMouseMove: onMouseMove, onMouseLeave: onMouseLeave, onClick: onClick, style: {
                position: 'absolute',
                top: -style.base.borderTopWidth * 2 - style.icon.radius,
                right: -style.base.borderRightWidth,
                bottom: -style.base.borderBottomWidth * 2,
                left: -style.base.borderLeftWidth,
                zIndex: 6,
                cursor: 'pointer',
            } }))));
});
