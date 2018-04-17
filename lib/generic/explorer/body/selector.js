"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doSelector = function (selector, props) {
    if (selector === undefined)
        return undefined;
    if (selector === null)
        return props;
    if (typeof selector === 'string') {
        return selector.split('.').reduce(function (res, k) { return res && res[k]; }, props);
    }
    return selector(props);
};
var runSelectors = function (selectors, props) {
    var args = [];
    var length = selectors.length;
    for (var i = 0; i < length; i++) {
        args.push(doSelector(selectors[i], props));
    }
    return args;
};
var argsEqual = function (prev, next) {
    var length = prev.length;
    for (var i = 0; i < length; i++) {
        if (prev[i] !== next[i])
            return false;
    }
    return true;
};
exports.default = (function (selectors, map, onCreate, onDispose) {
    var extra = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        extra[_i - 4] = arguments[_i];
    }
    var lastArgs;
    var current;
    return function (props) {
        if (props) {
            var args = runSelectors(selectors, props);
            if (!lastArgs || !argsEqual(lastArgs, args)) {
                if (lastArgs && onDispose)
                    onDispose(current);
                current = map.apply(null, args.concat(extra));
                if (onCreate)
                    current = onCreate(current) || current;
            }
            lastArgs = args;
            return current;
        }
        if (onDispose)
            onDispose(current);
    };
});
