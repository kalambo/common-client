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
var mishmash_1 = require("mishmash");
var body_1 = require("./body");
var header_1 = require("./header");
var Pure = mishmash_1.default()
    .pure()
    .toComp();
exports.default = mishmash_1.default()
    .pure()
    .style({
    base: null,
    div: [
        ['filter', 'borderRight', 'borderBottom', 'borderLeft'],
        ['scale', { borderWidth: 2 }],
    ],
    pad: [
        [
            'scale',
            {
                height: {
                    fontSize: 1,
                    borderTopWidth: 1,
                    paddingTop: 1,
                    paddingBottom: 1,
                },
                extra: {
                    borderBottomWidth: 1,
                },
            },
        ],
    ],
})
    .map(function (props) { return (__assign({}, props, { fieldRows: header_1.fieldToRows(props.context, { fields: props.query }, null, '', props.index) })); })
    .enhance(mishmash_1.watchSize('height', 'setHeightElem', function (_a) {
    var _b = _a.height, height = _b === void 0 ? 0 : _b;
    return height;
}))
    .enhance(function (_a) {
    var firstProps = _a.firstProps, onProps = _a.onProps, setState = _a.setState, methods = _a.methods;
    firstProps.context.store.watch(function (props) { return "table_" + props.index + "_width"; }, function (width) {
        if (width === void 0) { width = 0; }
        return setState({ width: width });
    }, onProps, firstProps);
    var elem;
    var noScrollEvent = function () { return (elem.scrollLeft = 0); };
    var setNoScrollElem = function (e) {
        if (elem)
            elem.removeEventListener('scroll', noScrollEvent);
        elem = e;
        if (elem)
            elem.addEventListener('scroll', noScrollEvent);
    };
    return function (props, state) { return (__assign({}, props, state, { setNoScrollElem: setNoScrollElem }, methods({
        setSizeElem: function (elem) {
            props.setHeightElem(elem);
            props.context.setWidthElem("table_" + props.index + "_width", elem);
        },
    }))); };
})(function (_a) {
    var context = _a.context, query = _a.query, fetching = _a.fetching, data = _a.data, fieldRows = _a.fieldRows, setNoScrollElem = _a.setNoScrollElem, height = _a.height, width = _a.width, setSizeElem = _a.setSizeElem, style = _a.style;
    return (React.createElement("div", { style: __assign({ position: 'relative', visibility: width && height ? 'visible' : 'hidden', maxHeight: '100%', height: height + style.div.borderBottomWidth }, style.div) },
        React.createElement("div", { style: {
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }, ref: setNoScrollElem },
            React.createElement("div", { style: {
                    height: '100%',
                    paddingTop: fieldRows.length * style.pad.height + style.pad.extra,
                    overflow: 'hidden',
                } },
                React.createElement("div", { style: { height: '100%', overflow: 'scroll' } },
                    React.createElement("div", { style: {
                            height: '100%',
                            marginTop: -(fieldRows.length * style.pad.height +
                                style.pad.extra),
                        } },
                        React.createElement("div", { style: { width: width, overflow: 'hidden' } },
                            React.createElement("div", { style: { width: 100000 } },
                                React.createElement("div", { style: { display: 'table' }, ref: setSizeElem },
                                    React.createElement(Pure, { context: context, query: query, data: data, fieldRows: fieldRows }, function (_a) {
                                        var context = _a.context, query = _a.query, data = _a.data, fieldRows = _a.fieldRows;
                                        return (React.createElement("table", { style: {
                                                borderCollapse: 'separate',
                                                borderSpacing: 0,
                                                tableLayout: 'fixed',
                                            } },
                                            React.createElement(header_1.default, { context: context, fieldRows: fieldRows, style: style.base }),
                                            React.createElement(body_1.default, { context: context, query: query, data: data, style: style.base })));
                                    })))),
                        fetching && (React.createElement("div", { style: {
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                background: 'rgba(255,255,255,0.9)',
                            } }))))),
            React.createElement("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 100000,
                } },
                React.createElement("table", { style: { borderCollapse: 'separate', borderSpacing: 0 } },
                    React.createElement(header_1.default, { context: context, fieldRows: fieldRows, live: true, style: style.base }))))));
});
