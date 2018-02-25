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
var mishmash_1 = require("mishmash");
var elmnt_1 = require("elmnt");
var common_1 = require("common");
exports.default = mishmash_1.default
    .map(function (_a) {
    var dataKey = _a.dataKey, props = __rest(_a, ["dataKey"]);
    var _b = common_1.root.rgo.schema[dataKey[0]][dataKey[2]], _c = _b.meta, meta = _c === void 0 ? {} : _c, field = __rest(_b, ["meta"]);
    var rules = __assign({}, field, meta, ((props.context.meta[dataKey[0]] &&
        props.context.meta[dataKey[0]][dataKey[2]]) ||
        {}), { optional: true });
    var scalar = rules.scalar, isList = rules.isList, file = rules.file, info = __rest(rules, ["scalar", "isList", "file"]);
    return __assign({}, props, info, { rows: 0, type: "" + (file ? 'file' : scalar || 'string') + (isList ? 'list' : '') }, (!isList && Array.isArray(info.options)
        ? {
            options: info.options &&
                (!info.options.includes(null)
                    ? __spread(info.options, [null]) : info.options),
            labels: info.labels &&
                (!info.options.includes(null)
                    ? __spread(info.labels, ['-- None --']) : info.labels),
        }
        : {}), { rules: rules });
})
    .map(mishmash_1.restyle(function (_a) {
    var type = _a.type, options = _a.options;
    return ({
        margin: [
            [
                'scale',
                {
                    margin: __assign({ borderWidth: -1 }, (type === 'boolean' ? { padding: 0.6 } : {})),
                },
            ],
            ['filter', 'margin'],
        ],
        fill: [
            [
                'scale',
                {
                    top: __assign({ borderTopWidth: -1 }, (type === 'boolean' ? { paddingTop: 0.6 } : {})),
                    right: __assign({ borderRightWidth: -1 }, (type === 'boolean' ? { paddingRight: 0.6 } : {})),
                    bottom: __assign({ borderBottomWidth: -1 }, (type === 'boolean' ? { paddingBottom: 0.6 } : {})),
                    left: __assign({ borderLeftWidth: -1 }, (type === 'boolean' ? { paddingLeft: 0.6 } : {})),
                },
            ],
            ['filter', 'top', 'right', 'bottom', 'left'],
            ['merge', { position: 'absolute' }],
        ],
        input: Array.isArray(options) && [['merge', { layout: 'modal' }]],
    });
}))
    .stream(function (_a) {
    var initial = _a.initial, observe = _a.observe, push = _a.push;
    initial.context.store.watch('editing', function (editing) {
        if (editing === void 0) { editing = {}; }
        return push({ editing: editing });
    }, observe);
    var onChange = function (value) {
        return initial.context.store.update('editing', function (v) { return (__assign({}, v, { value: value })); });
    };
    var onTextChange = function (text) {
        push({ text: text });
        setTimeout(function () { return initial.context.updateWidths(); });
    };
    var lastValue = initial.context.store.get('editing').value;
    return function (_a, _b) {
        var editing = _b.editing, text = _b.text;
        var rules = _a.rules, props = __rest(_a, ["rules"]);
        var value = Object.keys(editing).length > 0
            ? (lastValue = editing.value)
            : lastValue;
        var invalid = !common_1.isValid(rules, value, {});
        return __assign({}, props, { value: value,
            onChange: onChange,
            invalid: invalid,
            text: text,
            onTextChange: onTextChange, onBlur: function () { return props.onBlur(invalid); }, onKeyDown: function (e) {
                return (e.keyCode === 13 || e.keyCode === 27) && props.onBlur(invalid);
            } });
    };
})(function (_a) {
    var _ = _a.context, value = _a.value, onChange = _a.onChange, text = _a.text, onTextChange = _a.onTextChange, onBlur = _a.onBlur, onKeyDown = _a.onKeyDown, inputRef = _a.inputRef, style = _a.style, props = __rest(_a, ["context", "value", "onChange", "text", "onTextChange", "onBlur", "onKeyDown", "inputRef", "style"]);
    return (React.createElement("div", { onKeyDown: onKeyDown },
        React.createElement(elmnt_1.Input, __assign({ value: ['int', 'float', 'date'].includes(props.type) ? text : value, onChange: onChange, style: __assign({}, style.input, style.margin), spellCheck: false }, props, (['int', 'float', 'date'].includes(props.type)
            ? { type: 'string' }
            : {}), (props.type === 'date' ? { iconRight: 'tick' } : {}))),
        React.createElement(elmnt_1.Input, __assign({ value: value, onChange: onChange, onTextChange: onTextChange, style: __assign({}, style.input, style.fill), spellCheck: false, onBlur: onBlur, ref: inputRef }, props))));
});
