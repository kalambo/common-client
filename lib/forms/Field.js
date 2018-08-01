"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var refluent_1 = require("refluent");
var getData_1 = require("../getData");
var restyle_1 = require("../restyle");
var utils_1 = require("../utils");
exports.default = (function (fileServer) {
    var FileButton = refluent_1.default
        .yield(function (_a) {
        var value = _a.value, next = _a.next;
        return (value ? next() : null);
    })
        .do(restyle_1.default(function (style) { return style.mergeKeys('button').merge({ width: '100%' }); }))
        .yield(function (_a) {
        var value = _a.value, style = _a.style;
        return (React.createElement("a", { href: fileServer + "/storage/file/" + value.split(':')[0], target: "_blank" },
            React.createElement(elmnt_1.Hover, { style: __assign({}, style, { fontSize: 15, padding: 8 }) }, function (_a) {
                var hoverProps = _a.hoverProps, style = _a.style;
                return (React.createElement(elmnt_1.Txt, __assign({}, hoverProps, { style: style }), "View file"));
            })));
    });
    return refluent_1.default
        .yield(refluent_1.branch(function (_a) {
        var index = _a.index;
        return index !== undefined;
    }, refluent_1.default.do('value', 'onChange', 'index', function (value, onChange, index) { return ({
        value: (value && value[index]) || null,
        onChange: function (indexValue) {
            var newValue = __spread(__spread(new Array(index)).map(function (_, i) {
                return utils_1.noUndef(value && value[i]);
            }), [
                indexValue
            ], (value || []).slice(index + 1).map(utils_1.noUndef));
            onChange(newValue.some(function (v) { return v !== null; }) ? newValue : null);
        },
    }); })))
        .yield(refluent_1.branch('view', refluent_1.default
        .do(restyle_1.default(function (style) { return style.filter.apply(style, __spread(elmnt_1.css.groups.text)); }))
        .yield(function (_a) {
        var type = _a.type, value = _a.value, style = _a.style;
        return (React.createElement(elmnt_1.Txt, { style: style }, utils_1.getValueString(value, type)));
    })))
        .yield(refluent_1.branch(function (_a) {
        var type = _a.type, admin = _a.admin;
        return type === 'file' && admin;
    }, function (_a) {
        var value = _a.value, style = _a.style, next = _a.next;
        return (React.createElement("div", { style: { width: '100%' } },
            React.createElement(elmnt_1.Div, { style: { spacing: 40, layout: 'bar', width: '100%' } },
                React.createElement("div", { style: { width: 150 } },
                    React.createElement(FileButton, { value: value, style: style })),
                next())));
    }))
        .yield(refluent_1.branch(function (_a) {
        var type = _a.type, options = _a.options, admin = _a.admin;
        return admin && !type.endsWith('list') && Array.isArray(options);
    }, refluent_1.default.do('options', 'labels', function (options, labels) { return ({
        options: options && (!options.includes(null) ? __spread(options, [null]) : options),
        labels: labels &&
            (!options.includes(null) ? __spread(labels, ['-- None --']) : labels),
    }); })))
        .yield(refluent_1.branch('relation', refluent_1.default
        .do(getData_1.default(function (_a) {
        var relation = _a.relation, filter = _a.filter, sort = _a.sort, label = _a.label;
        return ({
            name: relation,
            filter: filter,
            sort: sort,
            fields: __spread([
                'id'
            ], (Array.isArray(label)
                ? label.filter(function (l) { return l.startsWith('$'); }).map(function (l) { return l.slice(1); })
                : [label])),
        });
    }))
        .do('relation', 'label', 'data', function (relation, label, data) { return ({
        options: data ? data[relation].map(function (d) { return d.id; }) : [],
        labels: data
            ? data[relation].map(function (d) {
                return Array.isArray(label)
                    ? label
                        .map(function (l) { return (l.startsWith('$') ? d[l.slice(1)] : l); })
                        .join('')
                    : d[label];
            })
            : [],
    }); })))
        .yield(refluent_1.branch('other', refluent_1.default
        .do('value', 'options', function (value, options) { return ({
        otherOpen: value !== null && !options.includes(value),
    }); })
        .do('onChange', 'other', function (onChange, other, push) { return ({
        onBaseChange: function (value) {
            if (value === other) {
                push({ otherOpen: true });
                onChange(null);
            }
            else {
                push({ otherOpen: false });
                onChange(value);
            }
        },
    }); })
        .yield(function (_a) {
        var value = _a.value, options = _a.options, other = _a.other, otherOpen = _a.otherOpen, onBaseChange = _a.onBaseChange, props = __rest(_a, ["value", "options", "other", "otherOpen", "onBaseChange"]);
        return (React.createElement(elmnt_1.Div, { style: { spacing: 10 } },
            React.createElement(elmnt_1.Input, __assign({}, props, { value: otherOpen ? other : value, onChange: onBaseChange, options: __spread(options, [other]) })),
            otherOpen && (React.createElement(elmnt_1.Input, __assign({}, props, { value: value, placeholder: "Please specify" })))));
    })))
        .yield(elmnt_1.Input);
});
