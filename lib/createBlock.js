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
var recompose_1 = require("recompose");
var elmnt_1 = require("elmnt");
var mishmash_1 = require("mishmash");
var Field_1 = require("./Field");
var Question = mishmash_1.mapStyle([
    ['mergeKeys', 'question'],
    __spread(['filter'], mishmash_1.cssGroups.text),
])(elmnt_1.Txt);
var Prompt = mishmash_1.mapStyle([
    ['mergeKeys', 'prompt'],
    __spread(['filter'], mishmash_1.cssGroups.text),
])(elmnt_1.Txt);
var Vertical = recompose_1.compose(mishmash_1.mapStyle(['view', 'small'], function (view, small) { return [
    [
        'scale',
        {
            paddingTop: view
                ? 0
                : { paddingTop: small ? 0.4 : 1, borderTopWidth: 1 },
        },
    ],
    ['filter', 'paddingTop'],
    ['merge', { spacing: 10 }],
]; }), mishmash_1.omitProps('view', 'small'))(elmnt_1.Div);
var Column = mishmash_1.mapStyle([
    ['mergeKeys', 'column'],
    __spread(['filter'], mishmash_1.cssGroups.text),
    ['merge', { padding: '8px 15px' }],
])(elmnt_1.Txt);
exports.default = (function (blockProps, blockHOC, style, admin, fieldHOC) {
    var Field = fieldHOC(Field_1.default);
    return [
        __spread(blockProps, ['text', 'prompt', 'vertical', 'bar', 'view']),
        recompose_1.compose(blockHOC, recompose_1.mapProps(function (_a) {
            var fields = _a.fields, attempted = _a.attempted, props = __rest(_a, ["fields", "attempted"]);
            return (__assign({ fields: fields.map(function (_a) {
                    var scalar = _a.scalar, isList = _a.isList, _ = _a.type, file = _a.file, invalid = _a.invalid, field = __rest(_a, ["scalar", "isList", "type", "file", "invalid"]);
                    return (__assign({}, field, { type: "" + (file ? 'file' : scalar || 'string') + (isList && field.index === undefined ? 'list' : ''), invalid: invalid && (admin || attempted), style: __assign({}, style, field.style), view: props.view, admin: admin }));
                }) }, props, (admin ? { prompt: undefined, vertical: false } : {})));
        }), mishmash_1.renderLayer(function (_a) {
            var text = _a.text, prompt = _a.prompt, vertical = _a.vertical, view = _a.view, fields = _a.fields, children = _a.children;
            return text ? (React.createElement(elmnt_1.Div, { style: { spacing: 10 } }, vertical ? (React.createElement(elmnt_1.Div, { style: { spacing: 10 } },
                React.createElement(Question, { style: style },
                    text,
                    fields.some(function (f) { return !f.optional; }) && (React.createElement("span", { style: style.required }, "\u00A0*"))),
                prompt && React.createElement(Prompt, { style: style }, prompt),
                children)) : (React.createElement(elmnt_1.Div, { style: {
                    layout: 'bar',
                    width: '100%',
                    verticalAlign: 'top',
                    spacing: 30,
                } },
                React.createElement("div", { style: { width: 200 } },
                    React.createElement(Vertical, { view: view, small: fields[0].type === 'boolean' ||
                            (fields[0].options &&
                                fields[0].style.layout !== 'modal'), style: style },
                        React.createElement(Question, { style: style },
                            text,
                            fields.some(function (f) { return !f.optional; }) && (React.createElement("span", { style: style.required }, "\u00A0*"))),
                        prompt && React.createElement(Prompt, { style: style }, prompt))),
                children)))) : (children);
        }), recompose_1.branch(function (_a) {
            var fields = _a.fields;
            return fields.length > 1;
        }, recompose_1.renderComponent(function (_a) {
            var fields = _a.fields, bar = _a.bar;
            return bar ? (React.createElement("div", null,
                React.createElement(elmnt_1.Div, { style: { layout: 'bar', width: '100%' } },
                    React.createElement("div", { style: { width: '50%', paddingRight: 5 } },
                        React.createElement(Field, __assign({}, fields[0], { style: fields[0].style }))),
                    React.createElement("div", { style: { width: '50%', paddingLeft: 5 } },
                        React.createElement(Field, __assign({}, fields[1], { style: fields[1].style })))))) : fields[0].style.layout === 'table' ? (React.createElement("table", { style: { width: '100%' } },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null),
                        (fields[0].labels || fields[0].options).map(function (l) { return (React.createElement("td", { style: { verticalAlign: 'middle' }, key: l },
                            React.createElement(Column, { style: style }, l))); })),
                    fields.map(function (field, i) { return (React.createElement(Field, __assign({}, field, { labels: field.options.map(function () { return ''; }), key: i }))); })))) : (React.createElement(elmnt_1.Div, { style: { spacing: 10 } }, fields.map(function (field, i) { return React.createElement(Field, __assign({}, field, { key: i })); })));
        }), recompose_1.mapProps(function (_a) {
            var fields = _a.fields;
            return fields[0];
        })))(Field),
    ];
});
