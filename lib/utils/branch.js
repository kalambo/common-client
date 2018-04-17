"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var select = function (selector, props) {
    if (typeof selector === 'number') {
        return props[selector];
    }
    if (typeof selector === 'string') {
        return selector.split('.').reduce(function (res, k) { return res && res[k]; }, props);
    }
    return selector(props);
};
exports.default = (function (test, pass, fail) {
    if (fail === void 0) { fail = function (_a) {
        var next = _a.next;
        return next();
    }; }
    return function (props) {
        return (select(test, props) ? pass : fail)(props);
    };
});
