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
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var gatsby_link_1 = require("gatsby-link");
var mishmash_1 = require("mishmash");
var elmnt_1 = require("elmnt");
var getData_1 = require("./generic/getData");
exports.routerPure = mishmash_1.default.do(react_router_dom_1.withRouter).pure();
exports.withRouter = function (basename) {
    return mishmash_1.default
        .render(function (_d) {
        var next = _d.next;
        return (React.createElement(react_router_dom_1.BrowserRouter, { basename: basename }, next()));
    })
        .do(react_router_dom_1.withRouter)
        .stream(function (_d) {
        var push = _d.push;
        var setBreadcrumb = function (path, label) {
            return push((_d = {}, _d[path] = label, _d));
            var _d;
        };
        return function (_d, labels) {
            var location = _d.location, props = __rest(_d, ["location"]);
            return (__assign({}, props, { breadcrumbs: location.pathname === '/'
                    ? [['/', labels['/'] || '']]
                    : location.pathname.split('/').map(function (path, i, paths) {
                        var current = paths.slice(0, i + 1).join('/');
                        return [current || '/', labels[current || '/'] || path];
                    }), setBreadcrumb: setBreadcrumb }));
        };
    })
        .context('setBreadcrumb', function (_d) {
        var setBreadcrumb = _d.setBreadcrumb;
        return setBreadcrumb;
    })
        .map(function (_d) {
        var _a = _d.setBreadcrumb, _b = _d.match, _c = _d.history, props = __rest(_d, ["setBreadcrumb", "match", "history"]);
        return props;
    });
};
var RouteComponent = mishmash_1.default.branch(function (_d) {
    var component = _d.component;
    return component;
}, mishmash_1.default.render(function (_d) {
    var Comp = _d.component, data = _d.data, props = _d.props;
    return (React.createElement(Comp, __assign({ data: data }, props)));
}))(function (_d) {
    var render = _d.render, data = _d.data, props = _d.props;
    return render(__assign({ data: data }, props));
});
var Breadcrumb = mishmash_1.default
    .branch(function (_d) {
    var label = _d.label;
    return typeof label === 'function';
}, mishmash_1.default.map(function (_d) {
    var label = _d.label, props = __rest(_d, ["label"]);
    return (__assign({}, props, { label: label(props.match.params) }));
}))
    .branch(function (_d) {
    var label = _d.label;
    return Array.isArray(label);
}, mishmash_1.default.do(getData_1.default(function (_d) {
    var label = _d.label;
    return label[0];
})).map(function (_d) {
    var label = _d.label, props = __rest(_d, ["label"]);
    return (__assign({}, props, { label: props.data ? label[1](props.data) : '...' }));
}))
    .context('setBreadcrumb')
    .stream(function (_d) {
    var initial = _d.initial, observe = _d.observe;
    var update = function (_d) {
        var label = _d.label, match = _d.match, setBreadcrumb = _d.setBreadcrumb;
        return setBreadcrumb(match.url, label);
    };
    update(initial);
    observe(function (props) { return props && update(props); });
    return function (props) { return props; };
})(function (_d) {
    var path = _d.path, loader = _d.loader, component = _d.component, render = _d.render, routeProps = _d.routeProps, data = _d.data;
    return (React.createElement(react_router_dom_1.Route, __assign({ path: path }, routeProps, { render: function (props) {
            return !loader || data ? (React.createElement(RouteComponent, { component: component, render: render, data: data, props: props })) : (loader);
        } })));
});
exports.Route = function (_d) {
    var path = _d.path, label = _d.label, loader = _d.loader, component = _d.component, render = _d.render, routeProps = __rest(_d, ["path", "label", "loader", "component", "render"]);
    return (React.createElement("div", null,
        React.createElement(react_router_dom_1.Route, { path: path, render: function (_d) {
                var match = _d.match;
                return (React.createElement(Breadcrumb, { path: path, label: label, loader: loader, component: component, render: render, routeProps: routeProps, match: match }));
            } })));
};
exports.Breadcrumbs = mishmash_1.default.map(mishmash_1.restyle({
    base: null,
    link: [['mergeKeys', 'link']],
    icon: [['scale', { fontSize: 0.9 }]],
}))(function (_d) {
    var breadcrumbs = _d.breadcrumbs, style = _d.style;
    return (React.createElement(elmnt_1.Div, { style: { layout: 'bar', spacing: 10, paddingRight: 200 } }, breadcrumbs.map(function (_d, i) {
        var _e = __read(_d, 2), path = _e[0], label = _e[1];
        return (React.createElement(elmnt_1.Div, { style: { layout: 'bar', spacing: 10 }, key: i },
            i !== 0 && (React.createElement(elmnt_1.Icon, { viewBox: "0 0 8 16", path: "M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z", style: style.icon })),
            i === breadcrumbs.length - 1 ? (React.createElement(elmnt_1.Txt, { style: style.base }, label)) : (React.createElement(react_router_dom_1.Link, { to: path },
                React.createElement(elmnt_1.Hover, { style: style.link }, function (_d) {
                    var hoverProps = _d.hoverProps, style = _d.style;
                    return (React.createElement(elmnt_1.Txt, __assign({}, hoverProps, { style: style }), label));
                })))));
    })));
});
exports.Link = function (_d) {
    var to = _d.to, newTab = _d.newTab, route = _d.route, props = __rest(_d, ["to", "newTab", "route"]);
    var external = to.startsWith('http');
    var Comp = route ? react_router_dom_1.Link : gatsby_link_1.default;
    return external ? (React.createElement("a", __assign({ href: to, target: "_blank" }, props))) : (React.createElement(Comp, __assign({ to: to }, (newTab ? { target: '_blank' } : {}), props)));
};
