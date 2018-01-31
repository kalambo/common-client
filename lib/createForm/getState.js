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
var mishmash_1 = require("mishmash");
var keys_to_object_1 = require("keys-to-object");
var common_1 = require("common");
var runFilter_1 = require("./runFilter");
exports.default = mishmash_1.combineState(function (_a) {
    var initialProps = _a.initialProps, onNextProps = _a.onNextProps, setState = _a.setState, onUnmount = _a.onUnmount;
    var unsubscribes = [];
    var prevJSON;
    var update = function (props) {
        var nextJSON = JSON.stringify(props.fields);
        if (nextJSON !== prevJSON) {
            unsubscribes.forEach(function (u) { return u(); });
            var storeFields_1 = ['rgo', 'local'].map(function (store) {
                return props.fields.filter(function (f) { return f.key.store === store; });
            });
            unsubscribes = ['rgo', 'local'].map(function (store, i) {
                return props.stores[store].get(storeFields_1[i].map(function (f) { return f.key.key; }), function (value) {
                    return setState((_a = {}, _a[store] = value, _a));
                    var _a;
                });
            });
        }
        prevJSON = nextJSON;
    };
    update(initialProps);
    onNextProps(update);
    onUnmount(function () { return unsubscribes.forEach(function (u) { return u(); }); });
    return function (props, state) {
        var indices = { rgo: 0, local: 0 };
        var values = state.rgo &&
            state.local &&
            keys_to_object_1.default(props.fields, function (f) { return state[f.key.store][indices[f.key.store]++]; }, function (f) { return f.key.name; });
        return __assign({ state: state.rgo &&
                state.local &&
                props.fields.map(function (f) {
                    var value = values[f.key.name];
                    var hidden = typeof f.showIf === 'function'
                        ? !f.showIf(values)
                        : !runFilter_1.default(f.showIf, values);
                    return __assign({ value: value, invalid: !common_1.isValid(f, value, values) }, (hidden ? { hidden: true } : {}));
                }) }, props);
    };
}, { rgo: null, local: null });
