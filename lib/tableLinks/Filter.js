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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var refluent_1 = require("refluent");
var elmnt_1 = require("elmnt");
var debounce = require("lodash.debounce");
var memoize = require("fast-memoize");
var config_1 = require("../config");
var utils_1 = require("../utils");
var memoizeValue = memoize(function (x) { return x; });
var getFieldHelp = function (field) {
    if (field.meta && field.meta.options) {
        return 'selection:\n' + field.meta.options.join('\n');
    }
    if (field.scalar === 'boolean')
        return 'true / false';
    if (field.scalar === 'int')
        return 'whole number';
    if (field.scalar === 'float')
        return 'decimal number';
    if (field.scalar === 'string')
        return 'text';
    return field.scalar;
};
var Help = refluent_1.default
    .do(utils_1.restyle(function (style) { return ({
    base: style,
    title: style.mergeKeys('title'),
    subtitle: style.mergeKeys('title'),
    text: style.mergeKeys('text'),
    indent: style.mergeKeys('indent'),
    note: style.mergeKeys('note'),
    op: style.mergeKeys('op'),
    fields: style.mergeKeys('fields'),
}); }))
    .yield(function (_a) {
    var type = _a.type, style = _a.style;
    return (React.createElement(elmnt_1.Div, { style: {
            height: ' 100%',
            background: 'white',
            boxShadow: '0 2px 20px 5px rgba(0,0,0,0.4)',
            borderRadius: 3,
            padding: 40,
            overflow: 'auto',
            spacing: 25,
        } },
        React.createElement(elmnt_1.Txt, { style: style.title }, "Filtering"),
        React.createElement(elmnt_1.Txt, { style: style.text }, "A basic filter is a rule in the format:"),
        React.createElement(elmnt_1.Txt, { style: __assign({}, style.indent, { paddingLeft: 40 }) }, "[field] [operation] [value]"),
        React.createElement(elmnt_1.Txt, { style: style.text }, "For example:"),
        React.createElement(elmnt_1.Txt, { style: __assign({}, style.indent, { paddingLeft: 40 }) }, "firstname = David"),
        React.createElement(elmnt_1.Txt, { style: style.text }, "Multiple of these basic filters can be combined together, using commas, 'OR', and brackets:"),
        React.createElement(elmnt_1.Div, { style: { spacing: 15 } },
            React.createElement(elmnt_1.Txt, { style: __assign({}, style.indent, { paddingLeft: 40 }) }, "firstname = David, (lastname = Smith OR sex = Male)"),
            React.createElement(elmnt_1.Txt, { style: __assign({}, style.note, { paddingLeft: 40 }) }, "(This filter will show records where firstname equals 'David', and either lastname equals 'Smith' or sex equals 'Male')")),
        React.createElement(elmnt_1.Txt, { style: style.base }, "Note: If the current filter is invalid the input will go red and the page will act as if no filter is entered."),
        React.createElement(elmnt_1.Txt, { style: style.text }, "The available operations are:"),
        React.createElement(elmnt_1.Div, { style: { spacing: 10, paddingLeft: 40 } }, [
            ['=', 'equal to'],
            ['!=', 'not equal to'],
            ['<', 'less than'],
            ['>', 'greater than'],
            ['<=', 'less than or equal to'],
            ['>=', 'greater than or equal to'],
        ].map(function (_a, i) {
            var _b = __read(_a, 2), op = _b[0], label = _b[1];
            return (React.createElement(elmnt_1.Div, { style: { layout: 'bar', spacing: 10 }, key: i },
                React.createElement(elmnt_1.Txt, { style: __assign({}, style.op, { width: 40 }) }, op),
                React.createElement(elmnt_1.Txt, { style: style.op }, label)));
        })),
        React.createElement(elmnt_1.Txt, { style: style.base }, "Note: The last 4 operations are only valid for number and date fields."),
        React.createElement(elmnt_1.Div, { style: {
                spacing: 20,
                background: '#eee',
                borderRadius: 3,
                padding: 20,
            } },
            React.createElement(elmnt_1.Txt, { style: style.subtitle }, "Available fields"),
            React.createElement(elmnt_1.Div, { style: { spacing: 15 } }, Object.keys(utils_1.root.rgo.schema[type])
                .sort()
                .map(function (field, i) { return (React.createElement(elmnt_1.Div, { style: {
                    layout: 'bar',
                    spacing: 10,
                    verticalAlign: 'top',
                }, key: i },
                React.createElement(elmnt_1.Txt, { style: __assign({}, style.fields, { width: 150 }), key: field }, field),
                React.createElement(elmnt_1.Txt, { style: style.fields, key: field }, getFieldHelp(utils_1.root.rgo.schema[type][field])))); })))));
});
exports.default = refluent_1.default
    .do(utils_1.restyle(function (style) { return ({
    label: style.mergeKeys('label'),
    helpLabel: style.mergeKeys('helpLabel'),
    field: style.mergeKeys('field'),
    help: style.mergeKeys('help'),
}); }))
    .do(function (props$, push) {
    push({
        schemaLoaded: false,
        isOpen: false,
        toggleIsOpen: function () { return push({ isOpen: !props$(true).isOpen }); },
    });
    var mounted = true;
    utils_1.root.rgo.query().then(function () { return mounted && push({ schemaLoaded: true }); });
    return function () { return (mounted = false); };
})
    .do('type', 'onChange', function (type, onChange, push) {
    var debounceChange = debounce(function (v) { return onChange(v); }, 1000);
    return {
        text: null,
        filter: null,
        setText: function (text) {
            var parsedValue = config_1.default.parseFilter(text, type);
            var filter = !parsedValue ? parsedValue : memoizeValue(parsedValue);
            push({ text: text, filter: filter });
            debounceChange(filter);
        },
    };
})
    .yield(function (_a) {
    var isOpen = _a.isOpen, schemaLoaded = _a.schemaLoaded, type = _a.type, toggleOpen = _a.toggleOpen, style = _a.style, next = _a.next;
    return (React.createElement(elmnt_1.Modal, { isOpen: isOpen && schemaLoaded, onClose: toggleOpen, next: next },
        React.createElement(Help, { type: type, style: style.help })));
})
    .yield(function (_a) {
    var text = _a.text, setText = _a.setText, filter = _a.filter, toggleOpen = _a.toggleOpen, style = _a.style;
    return (React.createElement(elmnt_1.Div, { style: {
            layout: 'bar',
            spacing: 10,
            width: '100%',
            padding: 10,
            background: '#eee',
            borderRadius: 3,
        } },
        React.createElement(elmnt_1.Txt, { style: style.label }, "Filter:"),
        React.createElement(elmnt_1.Input, { type: "string", value: text, onChange: setText, style: style.field, spellCheck: false, invalid: text && !filter }),
        React.createElement("div", { style: { width: style.helpLabel.width } },
            React.createElement(elmnt_1.Hover, { style: __assign({}, style.helpLabel, { cursor: 'pointer', textAlign: 'right', width: 'auto' }) }, function (_a) {
                var hoverProps = _a.hoverProps, style = _a.style;
                return (React.createElement(elmnt_1.Txt, __assign({ onClick: toggleOpen }, hoverProps, { style: style }), "Open help"));
            }))));
});
