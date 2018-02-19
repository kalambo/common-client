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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mishmash_1 = require("mishmash");
var common_1 = require("common");
function getData() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var propName = typeof args[0] === 'string' ? args[0] : 'data';
    var queries = typeof args[0] === 'string' ? args.slice(1) : args;
    return mishmash_1.enclose(function (_a) {
        var initialProps = _a.initialProps, onProps = _a.onProps, setState = _a.setState;
        setState({ data: null });
        var unsubscribe;
        if (typeof queries[0] !== 'function') {
            unsubscribe = (_b = common_1.root.rgo).query.apply(_b, __spread(queries, [function (data) {
                    return setState({ data: data && __assign({}, data) });
                }]));
        }
        else {
            var prevJSON_1;
            var update = function (props) {
                if (props) {
                    var q = queries[0](props);
                    var nextJSON = JSON.stringify(q);
                    if (nextJSON !== prevJSON_1) {
                        if (unsubscribe) {
                            unsubscribe();
                            setState({ data: null });
                        }
                        unsubscribe = (_a = common_1.root.rgo).query.apply(_a, __spread(q, [function (data) {
                                return setState({ data: data && __assign({}, data) });
                            }]));
                    }
                    prevJSON_1 = nextJSON;
                }
                else {
                    unsubscribe();
                }
                var _a;
            };
            update(initialProps);
            onProps(update);
        }
        return function (props, _a) {
            var data = _a.data;
            return (__assign({}, props, (_b = {}, _b[propName] = data, _b)));
            var _b;
        };
        var _b;
    });
}
exports.default = getData;
