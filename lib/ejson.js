"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var keys_to_object_1 = require("keys-to-object");
exports.default = {
    stringify: function (value) {
        return JSON.stringify(value, function (_, v) {
            if (Array.isArray(v)) {
                return v.map(function (x) {
                    return Object.prototype.toString.call(x) === '[object Date]'
                        ? { $date: x.getTime() }
                        : x;
                });
            }
            if (Object.prototype.toString.call(v) === '[object Object]') {
                return keys_to_object_1.default(Object.keys(v), function (k) {
                    return Object.prototype.toString.call(v[k]) === '[object Date]'
                        ? { $date: v[k].getTime() }
                        : v[k];
                });
            }
            return v;
        });
    },
    parse: function (value) {
        return JSON.parse(value, function (_, v) {
            return Object.prototype.toString.call(v) === '[object Object]' &&
                Object.keys(v).join(',') === '$date'
                ? new Date(v.$date)
                : v;
        });
    },
};
