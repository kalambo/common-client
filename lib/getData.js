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
var recompose_1 = require("recompose");
var mishmash_1 = require("mishmash");
var most = require("most");
function getQuery() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var propName = typeof args[0] === 'string' ? args[0] : 'data';
    var queries = typeof args[0] === 'string' ? args.slice(1) : args;
    return mishmash_1.mapPropsStream(function (props$) {
        var _a = recompose_1.createEventHandler(), setState = _a.handler, stream = _a.stream;
        var unsubscribe;
        var prevJSON;
        props$.observe(function () { }).then(function () { return unsubscribe(); });
        return most.from(stream).combine(function (state, props) {
            return (__assign({}, props, (_a = {}, _a[propName
                ? typeof propName === 'string' ? propName : propName(props)
                : 'data'] = state, _a)));
            var _a;
        }, props$.tap(function (props) {
            var q = typeof queries[0] === 'function' ? queries[0](props) : queries;
            var nextJSON = JSON.stringify(q);
            if (nextJSON !== prevJSON) {
                if (unsubscribe)
                    unsubscribe();
                unsubscribe = (_a = window.rgo).query.apply(_a, __spread(q, [setState]));
            }
            prevJSON = nextJSON;
            var _a;
        }));
    });
}
exports.default = getQuery;
