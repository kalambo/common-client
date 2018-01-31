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
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
exports.Link = react_router_dom_1.Link;
var React = require("react");
var PropTypes = require("prop-types");
var react_router_dom_2 = require("react-router-dom");
var recompose_1 = require("recompose");
var mishmash_1 = require("mishmash");
var elmnt_1 = require("elmnt");
var getData_1 = require("./getData");
exports.routerPure = recompose_1.compose(react_router_dom_2.withRouter, recompose_1.pure);
exports.withRouter = function (basename) {
    return recompose_1.compose(mishmash_1.renderLayer(function (_a) {
        var children = _a.children;
        return (React.createElement(react_router_dom_2.BrowserRouter, { basename: basename }, children));
    }), react_router_dom_2.withRouter, mishmash_1.combineState(function (_a) {
        var setState = _a.setState;
        var setBreadcrumb = function (path, label) {
            return setState((_a = {}, _a[path] = label, _a));
            var _a;
        };
        return function (_a, labels) {
            var location = _a.location, props = __rest(_a, ["location"]);
            return (__assign({}, props, { breadcrumbs: location.pathname === '/'
                    ? [['/', labels['/'] || '']]
                    : location.pathname.split('/').map(function (path, i, paths) {
                        var current = paths.slice(0, i + 1).join('/');
                        return [current || '/', labels[current || '/'] || path];
                    }), setBreadcrumb: setBreadcrumb }));
        };
    }, {}), recompose_1.withContext({ setBreadcrumb: PropTypes.func }, function (_a) {
        var setBreadcrumb = _a.setBreadcrumb;
        return ({ setBreadcrumb: setBreadcrumb });
    }), mishmash_1.omitProps('setBreadcrumb', 'match', 'history'));
};
var RouteComponent = recompose_1.compose(recompose_1.branch(function (_a) {
    var component = _a.component;
    return component;
}, recompose_1.renderComponent(function (_a) {
    var Comp = _a.component, data = _a.data, props = _a.props;
    return (React.createElement(Comp, __assign({ data: data }, props)));
})))(function (_a) {
    var render = _a.render, data = _a.data, props = _a.props;
    return render(__assign({ data: data }, props));
});
var Breadcrumb = recompose_1.compose(recompose_1.branch(function (_a) {
    var label = _a.label;
    return typeof label === 'function';
}, recompose_1.compose(recompose_1.withProps(function (_a) {
    var label = _a.label, match = _a.match;
    return ({ label: label(match.params) });
}))), recompose_1.branch(function (_a) {
    var label = _a.label;
    return Array.isArray(label);
}, recompose_1.compose(getData_1.default(function (_a) {
    var label = _a.label;
    return label[0];
}), recompose_1.withProps(function (_a) {
    var label = _a.label, data = _a.data;
    return ({
        label: data ? label[1](data) : '...',
    });
}))), recompose_1.getContext({ setBreadcrumb: PropTypes.func }), mishmash_1.combineState(function (_a) {
    var initialProps = _a.initialProps, onNextProps = _a.onNextProps;
    var update = function (_a) {
        var label = _a.label, match = _a.match, setBreadcrumb = _a.setBreadcrumb;
        return setBreadcrumb(match.url, label);
    };
    update(initialProps);
    onNextProps(update);
    return function (props) { return props; };
}))(function (_a) {
    var path = _a.path, loader = _a.loader, component = _a.component, render = _a.render, routeProps = _a.routeProps, data = _a.data;
    return (React.createElement(react_router_dom_2.Route, __assign({ path: path }, routeProps, { render: function (props) {
            return !loader || data ? (React.createElement(RouteComponent, { component: component, render: render, data: data, props: props })) : (loader);
        } })));
});
exports.Route = function (_a) {
    var path = _a.path, label = _a.label, loader = _a.loader, component = _a.component, render = _a.render, routeProps = __rest(_a, ["path", "label", "loader", "component", "render"]);
    return (React.createElement("div", null,
        React.createElement(react_router_dom_2.Route, { path: path, render: function (_a) {
                var match = _a.match;
                return (React.createElement(Breadcrumb, { path: path, label: label, loader: loader, component: component, render: render, routeProps: routeProps, match: match }));
            } })));
};
exports.Breadcrumbs = mishmash_1.mapStyle({
    base: null,
    link: [['mergeKeys', 'link']],
    icon: [['scale', { fontSize: 0.9 }]],
})(function (_a) {
    var breadcrumbs = _a.breadcrumbs, style = _a.style;
    return (React.createElement(elmnt_1.Div, { style: { layout: 'bar', spacing: 10, paddingRight: 200 } }, breadcrumbs.map(function (_a, i) {
        var _b = __read(_a, 2), path = _b[0], label = _b[1];
        return (React.createElement(elmnt_1.Div, { style: { layout: 'bar', spacing: 10 }, key: i },
            i !== 0 && (React.createElement(elmnt_1.Icon, { viewBox: "0 0 8 16", path: "M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z", style: style.icon })),
            i === breadcrumbs.length - 1 ? (React.createElement(elmnt_1.Txt, { style: style.base }, label)) : (React.createElement(react_router_dom_2.Link, { to: path },
                React.createElement(mishmash_1.Hover, { style: style.link },
                    React.createElement(elmnt_1.Txt, null, label))))));
    })));
});
