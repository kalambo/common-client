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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var mishmash_1 = require("mishmash");
var common_1 = require("common");
var elmnt_1 = require("elmnt");
var deepEqual = require("deep-equal");
var d3_1 = require("./d3");
var dataToRows_1 = require("./dataToRows");
exports.default = mishmash_1.default
    .map(mishmash_1.restyle({
    base: [
        ['mergeKeys', 'data'],
        ['defaults', { fontStyle: 'normal', fontWeight: 'normal' }],
        [
            'scale',
            {
                paddingTop: { paddingTop: 1, fontSize: 0.5, lineHeight: -0.5 },
                paddingBottom: {
                    paddingBottom: 1,
                    fontSize: 0.5,
                    lineHeight: -0.5,
                },
            },
        ],
        __spread([
            'filter'
        ], elmnt_1.css.groups.text, [
            'padding',
            'border',
            'background',
            'maxWidth',
        ]),
        [
            'merge',
            {
                position: 'relative',
                verticalAlign: 'top',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
            },
        ],
    ],
    input: [
        ['mergeKeys', 'data', 'input'],
        ['scale', { maxWidth: { maxWidth: 1, borderLeftWidth: 1 } }],
        ['merge', { zIndex: 200 }],
    ],
}))
    .map(mishmash_1.restyle({
    base: {
        null: [['mergeKeys', 'null']],
        empty: [['mergeKeys', 'empty']],
        fileLink: [['mergeKeys', 'fileLink'], __spread(['filter'], elmnt_1.css.groups.text)],
        changed: [['mergeKeys', 'changed']],
    },
}))
    .stream(function (_a) {
    var initial = _a.initial, observe = _a.observe, push = _a.push;
    initial.context.store.watch('unchanged', function (unchanged) {
        if (unchanged === void 0) { unchanged = {}; }
        return push({ unchanged: unchanged });
    }, observe);
    return function (_a, _b) {
        var context = _a.context, query = _a.query, data = _a.data, style = _a.style;
        var unchanged = _b.unchanged;
        return ({
            context: context,
            dataRows: dataToRows_1.default(context, query, data),
            style: style,
            unchanged: unchanged,
        });
    };
})(mishmash_1.isolate(function (elem, initial, observe) {
    var Input = initial.context.input;
    var startEditing = function (key, value) {
        initial.context.store.set('editing', { key: key, value: value });
        initial.context.store.update('unchanged', function (unchanged) {
            if (unchanged === void 0) { unchanged = {}; }
            return (__assign({}, unchanged, (unchanged[key] === undefined ? (_a = {}, _a[key] = value, _a) : {})));
            var _a;
        });
    };
    var stopEditing = function (invalid) {
        var _a = initial.context.store.get('editing'), key = _a.key, value = _a.value;
        initial.context.store.set('editing', {});
        initial.context.store.update('unchanged', function (_a) {
            var _b = key, v = _a[_b], unchanged = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            if (deepEqual(v, value, { strict: true }) || invalid) {
                common_1.root.rgo.set({ key: key.split('.'), value: undefined });
                return unchanged;
            }
            common_1.root.rgo.set({ key: key.split('.'), value: value });
            return __assign({}, unchanged, (_c = {}, _c[key] = v, _c));
            var _c;
        });
    };
    var inputRef = null;
    var unlisten = initial.context.store.listen('editing', function (editing) {
        if (editing === void 0) { editing = {}; }
        if (editing.key) {
            var splitKey = editing.key.split('.');
            var elems = elem.querySelectorAll("[data-key='" + editing.key + "']");
            for (var i = 0; i < elems.length; i++) {
                if (elems[i] !== inputRef) {
                    elems[i].textContent = initial.context.config.printValue(editing.value, common_1.root.rgo.schema[splitKey[0]][splitKey[2]]);
                }
            }
        }
    });
    observe(function (props) {
        if (props) {
            var editing_1 = props.context.store.get('editing') || {};
            var rows = d3_1.default
                .select(elem)
                .selectAll('tr')
                .data(__spread(props.dataRows));
            rows
                .exit()
                .selectAll('td')
                .each(function () {
                ReactDOM.unmountComponentAtNode(this);
            });
            rows.exit().remove();
            var allRows = rows
                .enter()
                .append('tr')
                .merge(rows);
            var cells = allRows.selectAll('td').data(function (d) { return d; });
            cells
                .exit()
                .each(function () {
                ReactDOM.unmountComponentAtNode(this);
            })
                .remove();
            var allCells = cells
                .enter()
                .append('td')
                .merge(cells)
                .datum(function (d) { return (__assign({}, d, { style: inputRef !== _this && Object.keys(props.unchanged).includes(d.key)
                    ? 'changed'
                    : d.empty
                        ? 'empty'
                        : d.field.startsWith('#') || d.value === null
                            ? 'null'
                            : 'base' })); })
                .style(function (d) { return props.style[d.style]; })
                .style(function (d) { return ({
                borderTopWidth: (!d.first ? 1 : 0) * props.style.base.borderTopWidth,
                borderBottomWidth: 0,
                borderLeftWidth: ((!d.firstCol && (d.field === '#1' ? 2 : 1)) || 0) *
                    props.style.base.borderLeftWidth,
                borderRightWidth: ((!d.lastCol && d.field === '#2' && 1) || 0) *
                    props.style.base.borderRightWidth,
            }); })
                .attr('rowspan', function (d) { return d.span; })
                .attr('data-key', function (d) { return d.key; });
            allCells
                .filter(function (_a) {
                var key = _a.key;
                return key;
            })
                .style({ cursor: 'pointer' })
                .on('mouseenter', function (d) {
                var s = props.style[d.style];
                this.style.background =
                    (s.hover && s.hover.background) || s.background;
            })
                .on('mouseleave', function (d) {
                this.style.background = props.style[d.style].background;
            })
                .on('dblclick', function (_a) {
                var key = _a.key, value = _a.value;
                startEditing(key, value);
                inputRef = this;
            })
                .each(function (_a) {
                var _this = this;
                var type = _a.type, field = _a.field, key = _a.key, text = _a.text;
                if (inputRef === this) {
                    this.style.padding = null;
                    ReactDOM.render(React.createElement(Input, { context: props.context, dataKey: key.split('.'), onBlur: function (invalid) {
                            stopEditing(invalid);
                            if (inputRef === _this)
                                inputRef = null;
                        }, inputRef: function (elem) {
                            if (elem && inputRef === _this)
                                elem.focus();
                        }, style: props.style.input }), this);
                }
                else {
                    ReactDOM.unmountComponentAtNode(this);
                    if (editing_1.key === key) {
                        this.textContent = props.context.config.printValue(editing_1.value, common_1.root.rgo.schema[type][field]);
                    }
                    else {
                        this.textContent = text;
                    }
                }
            });
            allCells
                .filter(function (_a) {
                var key = _a.key;
                return !key;
            })
                .style({ cursor: null })
                .on('mouseenter', null)
                .on('mouseleave', null)
                .on('dblclick', null)
                .each(function (_a) {
                var text = _a.text, link = _a.link;
                ReactDOM.unmountComponentAtNode(this);
                this.textContent = link ? '' : text;
                if (link) {
                    var a = document.createElement('a');
                    a.textContent = text;
                    a.href = link;
                    a.target = '_blank';
                    d3_1.applyStyle(a, props.style.fileLink);
                    this.appendChild(a);
                }
            });
            props.context.updateWidths();
        }
        else {
            unlisten();
            d3_1.default
                .select(elem)
                .selectAll('tr')
                .selectAll('td')
                .each(function () {
                ReactDOM.unmountComponentAtNode(this);
            });
        }
    });
}, 'tbody'));
