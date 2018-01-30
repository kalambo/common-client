"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var mishmash_1 = require("mishmash");
exports.default = mishmash_1.withSize('bounds', 'setBoundsElem')(function (_a) {
    var content = _a.content, footer = _a.footer, _b = _a.bounds, bounds = _b === void 0 ? { height: 0 } : _b, setBoundsElem = _a.setBoundsElem;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: { minHeight: '100%', marginBottom: -bounds.height } },
            content,
            React.createElement("div", { style: { height: bounds.height } })),
        React.createElement("div", { ref: setBoundsElem }, footer)));
});
