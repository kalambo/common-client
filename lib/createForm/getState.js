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
var keys_to_object_1 = require("keys-to-object");
var common_1 = require("common");
var ejson_1 = require("../ejson");
var runFilter_1 = require("./runFilter");
exports.default = (function (props$, push) {
    return props$('stores', function (props) { return ejson_1.default.stringify(props.fields); }, function (stores, jsonFields) {
        var fields = ejson_1.default.parse(jsonFields);
        push({ state: null });
        var storeValues = { rgo: null, local: null };
        var storeFields = ['rgo', 'local'].map(function (store) {
            return fields.filter(function (f) { return f.key.store === store; });
        });
        var unsubscribes = ['rgo', 'local'].map(function (store, i) {
            return stores[store].get(storeFields[i].map(function (f) { return f.key.key; }), function (value) {
                storeValues[store] = value;
                if (!storeValues.rgo || !storeValues.local) {
                    push({ state: null });
                }
                else {
                    var indices_1 = { rgo: 0, local: 0 };
                    var values_1 = keys_to_object_1.default(fields, function (f) { return storeValues[f.key.store][indices_1[f.key.store]++]; }, function (f) { return f.key.name; });
                    push({
                        state: fields.map(function (f) {
                            var value = values_1[f.key.name];
                            var hidden = typeof f.showIf === 'function'
                                ? !f.showIf(values_1)
                                : !runFilter_1.default(f.showIf, values_1);
                            return __assign({ value: value, invalid: !common_1.isValid(f, value, values_1) }, (hidden ? { hidden: true } : {}));
                        }),
                    });
                }
            });
        });
        return function () { return unsubscribes.forEach(function (u) { return u(); }); };
    });
});
