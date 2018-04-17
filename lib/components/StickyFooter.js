"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var refluent_1 = require("refluent");
var utils_1 = require("../utils");
exports.default = refluent_1.default
    .do(function (_, push) { return ({
    setBoundsElem: utils_1.resizeRef(function (_a) {
        var _b = _a.height, height = _b === void 0 ? 0 : _b;
        return push({ height: height });
    }),
}); })
    .yield(function (_a) {
    var content = _a.content, footer = _a.footer, height = _a.height, setBoundsElem = _a.setBoundsElem;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: { minHeight: '100%', marginBottom: -height } },
            content,
            React.createElement("div", { style: { height: height } })),
        React.createElement("div", { ref: setBoundsElem }, footer)));
});
