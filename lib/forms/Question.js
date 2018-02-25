"use strict";
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
var withWidth_1 = require("../withWidth");
var Question = mishmash_1.default.map(mishmash_1.restyle([['mergeKeys', 'question'], __spread(['filter'], elmnt_1.css.groups.text)]))(elmnt_1.Txt);
var Prompt = mishmash_1.default.map(mishmash_1.restyle([['mergeKeys', 'prompt'], __spread(['filter'], elmnt_1.css.groups.text)]))(elmnt_1.Txt);
var Vertical = mishmash_1.default
    .map(mishmash_1.restyle(['view', 'small'], function (view, small) { return [
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
]; }))
    .map(function (_c) {
    var _a = _c.view, _b = _c.small, props = __rest(_c, ["view", "small"]);
    return props;
})(elmnt_1.Div);
exports.default = withWidth_1.default(600)(function (_c) {
    var text = _c.text, prompt = _c.prompt, vertical = _c.vertical, view = _c.view, fields = _c.fields, style = _c.style, _d = _c.small, small = _d === void 0 ? false : _d, setWidthElem = _c.setWidthElem, children = _c.children;
    return text ? (React.createElement("div", { ref: setWidthElem }, vertical || small ? (React.createElement(elmnt_1.Div, { style: { spacing: 10 } },
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
                    (fields[0].options && fields[0].style.layout !== 'modal'), style: style },
                React.createElement(Question, { style: style },
                    text,
                    fields.some(function (f) { return !f.optional; }) && (React.createElement("span", { style: style.required }, "\u00A0*"))),
                prompt && React.createElement(Prompt, { style: style }, prompt))),
        children)))) : (children);
});
