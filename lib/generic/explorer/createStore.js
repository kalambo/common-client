"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    var values = {};
    var listeners = {};
    var set = function (key, value) {
        if (value !== values[key]) {
            if (value === undefined)
                delete values[key];
            else
                values[key] = value;
            listeners[''] && listeners[''].forEach(function (l) { return l(values); });
            listeners[key] && listeners[key].forEach(function (l) { return l(value); });
        }
    };
    var listen = function (key, listener) {
        listener(key ? values[key] : values);
        listeners[key] = listeners[key] || [];
        listeners[key].push(listener);
        return function () { return listeners[key].splice(listeners[key].indexOf(listener), 1); };
    };
    return {
        get: function (key) { return values[key]; },
        set: set,
        update: function (key, map) { return set(key, map(values[key])); },
        listen: listen,
        watch: function (key, listener, observe, initial) {
            var getKey = function (props) { return (typeof key === 'string' ? key : key(props)); };
            var currentKey = getKey(initial);
            var unlisten = listen(currentKey, listener);
            observe(function (props) {
                var newKey = props && getKey(props);
                if (newKey !== currentKey) {
                    unlisten();
                    currentKey = newKey;
                    if (currentKey)
                        unlisten = listen(currentKey, listener);
                }
            });
        },
    };
});
