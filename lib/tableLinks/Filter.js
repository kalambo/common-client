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
var recompose_1 = require("recompose");
var mishmash_1 = require("mishmash");
var elmnt_1 = require("elmnt");
var common_1 = require("common");
var debounce = require("lodash.debounce");
var parseFilter_1 = require("./parseFilter");
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
var Help = mishmash_1.mapStyle({
    base: null,
    title: [['mergeKeys', 'title']],
    subtitle: [['mergeKeys', 'title']],
    text: [['mergeKeys', 'text']],
    indent: [['mergeKeys', 'indent']],
    note: [['mergeKeys', 'note']],
    op: [['mergeKeys', 'op']],
    fields: [['mergeKeys', 'fields']],
})(function (_a) {
    var type = _a.type, toggleOpen = _a.toggleOpen, style = _a.style;
    return (React.createElement("div", { style: {
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'rgba(0,0,0,0.5)',
        } },
        React.createElement("div", { onClick: toggleOpen, style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            } }),
        React.createElement("div", { style: {
                position: 'relative',
                height: '100%',
                padding: 50,
                maxWidth: 700,
                margin: '0 auto',
            } },
            React.createElement(elmnt_1.Div, { style: {
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
                    React.createElement(elmnt_1.Div, { style: { spacing: 15 } }, Object.keys(common_1.root.rgo.schema[type])
                        .sort()
                        .map(function (field, i) { return (React.createElement(elmnt_1.Div, { style: {
                            layout: 'bar',
                            spacing: 10,
                            verticalAlign: 'top',
                        }, key: i },
                        React.createElement(elmnt_1.Txt, { style: __assign({}, style.fields, { width: 150 }), key: field }, field),
                        React.createElement(elmnt_1.Txt, { style: style.fields, key: field }, getFieldHelp(common_1.root.rgo.schema[type][field])))); })))))));
});
exports.default = recompose_1.compose(mishmash_1.mapStyle({
    label: [['mergeKeys', 'label']],
    helpLabel: [['mergeKeys', 'helpLabel']],
    field: [['mergeKeys', 'field']],
    help: [['mergeKeys', 'help']],
}), recompose_1.withState('text', 'setText', null), recompose_1.withState('filter', 'setFilter', null), recompose_1.withState('isOpen', 'setIsOpen', false), mishmash_1.combineState(function (_a) {
    var onChange = _a.initialProps.onChange, setState = _a.setState, onUnmount = _a.onUnmount;
    var debounceChange = debounce(onChange, 1000);
    var mounted = true;
    common_1.root.rgo.query().then(function () { return mounted && setState({ schemaLoaded: true }); });
    onUnmount(function () { return (mounted = false); });
    return function (props, _a) {
        var schemaLoaded = _a.schemaLoaded;
        return (__assign({}, props, { onChange: debounceChange, schemaLoaded: schemaLoaded }));
    };
}, { schemaLoaded: false }), recompose_1.withHandlers({
    setText: function (_a) {
        var type = _a.type, onChange = _a.onChange, setText = _a.setText, setFilter = _a.setFilter;
        return function (text) {
            setText(text);
            var parsedValue = parseFilter_1.default(text, type);
            var filter = !parsedValue ? parsedValue : mishmash_1.memoizeObject(parsedValue);
            setFilter(filter);
            onChange(filter);
        };
    },
    toggleOpen: function (_a) {
        var isOpen = _a.isOpen, setIsOpen = _a.setIsOpen;
        return function () { return setIsOpen(!isOpen); };
    },
}), mishmash_1.renderLifted(function (_a) {
    var type = _a.type, toggleOpen = _a.toggleOpen, style = _a.style;
    return (React.createElement(Help, { type: type, toggleOpen: toggleOpen, style: style.help }));
}, function (_a) {
    var isOpen = _a.isOpen, schemaLoaded = _a.schemaLoaded;
    return isOpen && schemaLoaded;
}))(function (_a) {
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
        React.createElement(mishmash_1.Hover, { style: __assign({}, style.helpLabel, { cursor: 'pointer', textAlign: 'right' }) },
            React.createElement(elmnt_1.Txt, { onClick: toggleOpen }, "Open help"))));
});
