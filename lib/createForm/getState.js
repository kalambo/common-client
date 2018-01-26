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
var recompose_1 = require("recompose");
var mishmash_1 = require("mishmash");
var most = require("most");
var keys_to_object_1 = require("keys-to-object");
var common_1 = require("common");
var runFilter_1 = require("../runFilter");
exports.default = mishmash_1.mapPropsStream(function (props$) {
    var states = ['rgo', 'local'].map(function (_) { return recompose_1.createEventHandler(); });
    var unsubscribes = [];
    props$.observe(function () { }).then(function () { return unsubscribes.forEach(function (u) { return u(); }); });
    var prevJSON;
    return props$
        .tap(function (_a) {
        var fields = _a.fields, stores = _a.stores;
        var nextJSON = JSON.stringify(fields);
        if (nextJSON !== prevJSON) {
            unsubscribes.forEach(function (u) { return u(); });
            var storeFields_1 = ['rgo', 'local'].map(function (store) {
                return fields.filter(function (f) { return f.key.store === store; });
            });
            unsubscribes = ['rgo', 'local'].map(function (store, i) {
                return stores[store].get(storeFields_1[i].map(function (f) { return f.key.key; }), states[i].handler);
            });
        }
        prevJSON = nextJSON;
    })
        .combine(function (props, rgoState, localState) {
        var combinedStates = { rgo: rgoState, local: localState };
        var indices = { rgo: 0, local: 0 };
        var values = rgoState &&
            keys_to_object_1.default(props.fields, function (f) { return combinedStates[f.key.store][indices[f.key.store]++]; }, function (f) { return f.key.name; });
        return __assign({ state: rgoState &&
                props.fields.map(function (f) {
                    var value = values[f.key.name];
                    var hidden = typeof f.showIf === 'function'
                        ? !f.showIf(values)
                        : !runFilter_1.default(f.showIf, values);
                    return __assign({ value: value, invalid: !common_1.isValid(f, value, values) }, (hidden ? { hidden: true } : {}));
                }) }, props);
    }, most.from(states[0].stream), most.from(states[1].stream));
});
