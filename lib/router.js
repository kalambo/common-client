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
var refluent_1 = require("refluent");
var elmnt_1 = require("elmnt");
var getData_1 = require("./generic/getData");
var utils_1 = require("./utils");
var LocationContext = React.createContext();
var BreadcrumbContext = React.createContext();
exports.withLocation = refluent_1.default
    .transform(react_router_dom_1.withRouter)
    .yield(function (_a) {
    var next = _a.next, location = _a.location;
    return (React.createElement(LocationContext.Provider, { value: location }, next()));
});
exports.getLocation = refluent_1.default.yield(function (_a) {
    var next = _a.next;
    return (React.createElement(LocationContext.Consumer, null, function (location) { return next(function (p) { return (__assign({}, p, { location: location })); }); }));
});
exports.withBreadcrumbs = function (base) {
    return refluent_1.default
        .yield(exports.getLocation)
        .do(function (props$, push) {
        var labels = {};
        return {
            setBreadcrumb: function (path, label) {
                var location = props$().location;
                labels[path.slice(base.length + 1).replace(/\/$/, '')] = label;
                push({
                    breadcrumbs: location.pathname
                        .slice(base.length + 1)
                        .replace(/\/$/, '')
                        .split('/')
                        .map(function (path, i, paths) {
                        var current = paths.slice(0, i + 1).join('/');
                        return ["/" + base + current, labels[current] || path];
                    }),
                });
            },
        };
    })
        .yield(function (_a) {
        var setBreadcrumb = _a.setBreadcrumb, breadcrumbs = _a.breadcrumbs, next = _a.next;
        return (React.createElement(BreadcrumbContext.Provider, { value: setBreadcrumb }, next(function (p) { return (__assign({}, p, { breadcrumbs: breadcrumbs })); })));
    });
};
var RouteComponent = function (_a) {
    var Comp = _a.component, render = _a.render, data = _a.data, props = _a.props;
    return Comp ? React.createElement(Comp, __assign({ data: data }, props)) : render(__assign({ data: data }, props));
};
var Breadcrumb = refluent_1.default
    .yield(refluent_1.branch(function (_a) {
    var label = _a.label;
    return typeof label === 'function';
}, refluent_1.default.do('label', 'match', function (label, match) { return ({
    label: label(match.params),
}); })))
    .yield(refluent_1.branch(function (_a) {
    var label = _a.label;
    return Array.isArray(label);
}, refluent_1.default
    .do(getData_1.default(function (_a) {
    var label = _a.label;
    return label[0];
}))
    .do('label', 'data', function (label, data) { return ({
    label: data ? label[1](data) : '...',
}); })))
    .yield(function (_a) {
    var next = _a.next;
    return (React.createElement(BreadcrumbContext.Consumer, null, function (setBreadcrumb) { return next(function (props) { return (__assign({}, props, { setBreadcrumb: setBreadcrumb })); }); }));
})
    .do('label', 'match', 'setBreadcrumb', function (label, match, setBreadcrumb) {
    setTimeout(function () { return setBreadcrumb(match.url, label); });
})
    .yield(function (_a) {
    var path = _a.path, loader = _a.loader, component = _a.component, render = _a.render, routeProps = _a.routeProps, data = _a.data;
    return (React.createElement(react_router_dom_1.Route, __assign({ path: path }, routeProps, { render: function (props) {
            return !loader || data ? (React.createElement(RouteComponent, { component: component, render: render, data: data, props: props })) : (loader);
        } })));
});
exports.Route = function (_a) {
    var path = _a.path, label = _a.label, loader = _a.loader, component = _a.component, render = _a.render, routeProps = __rest(_a, ["path", "label", "loader", "component", "render"]);
    return (React.createElement(react_router_dom_1.Route, { path: path, render: function (_a) {
            var match = _a.match;
            return (React.createElement(Breadcrumb, { path: path, label: label, loader: loader, component: component, render: Object.assign(render, { noCache: true }), routeProps: routeProps, match: match }));
        } }));
};
exports.Breadcrumbs = refluent_1.default
    .do(utils_1.restyle(function (style) { return ({
    base: style,
    link: style.mergeKeys('link'),
    icon: style.scale({ fontSize: 0.9 }),
}); }))
    .yield(function (_a) {
    var _b = _a.breadcrumbs, breadcrumbs = _b === void 0 ? [] : _b, style = _a.style;
    return (React.createElement(elmnt_1.Div, { style: {
            layout: 'bar',
            spacing: 10,
            paddingRight: 200,
            minHeight: style.base.fontSize,
        } }, breadcrumbs.map(function (_a, i) {
        var _b = __read(_a, 2), path = _b[0], label = _b[1];
        return (React.createElement(elmnt_1.Div, { style: { layout: 'bar', spacing: 10 }, key: i },
            i !== 0 && (React.createElement(elmnt_1.Icon, { viewBox: "0 0 8 16", path: "M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z", style: style.icon })),
            i === breadcrumbs.length - 1 ? (React.createElement(elmnt_1.Txt, { style: style.base }, label)) : (React.createElement(gatsby_link_1.default, { to: path },
                React.createElement(elmnt_1.Hover, { style: style.link }, function (_a) {
                    var hoverProps = _a.hoverProps, style = _a.style;
                    return (React.createElement(elmnt_1.Txt, __assign({}, hoverProps, { style: style }), label));
                })))));
    })));
});
exports.Link = function (_a) {
    var to = _a.to, newTab = _a.newTab, _ = _a.route, props = __rest(_a, ["to", "newTab", "route"]);
    var external = to.startsWith('http');
    return external ? (React.createElement("a", __assign({ href: to, target: "_blank" }, props))) : (React.createElement(gatsby_link_1.default, __assign({ to: to }, (newTab ? { target: '_blank' } : {}), props)));
};
