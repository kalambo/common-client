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
var React = require("react");
var react_helmet_1 = require("react-helmet");
function Spinner(_a) {
    var style = _a.style;
    var spinnerStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '24px',
        height: '24px',
        margin: '-6px 0 0 -12px',
    };
    var circleBaseStyle = {
        position: 'absolute',
        display: 'block',
        width: '24px',
        height: '24px',
        background: (style && style.color) || 'black',
        borderRadius: '24px',
    };
    var delay = -Date.now() % 1500;
    var circle1Style = __assign({ top: -24, left: 0, animation: "1.5s ease-in-out " + delay + "ms infinite spin1" }, circleBaseStyle);
    var circle2Style = __assign({ top: 12, left: 20.8, animation: "1.5s ease-in-out " + delay + "ms infinite spin2" }, circleBaseStyle);
    var circle3Style = __assign({ top: 12, left: -20.8, animation: "1.5s ease-in-out " + delay + "ms infinite spin3" }, circleBaseStyle);
    return (React.createElement(React.Fragment, null,
        React.createElement(react_helmet_1.default, null,
            React.createElement("style", { type: "text/css" }, "\n          @keyframes spin1 {\n            0% {\n              top: -24px;\n              left: 0;\n              transform: scale(1);\n            }\n            17% {\n              transform: scale(0.5);\n            }\n            33% {\n              top: 12px;\n              left: 20.8px;\n              transform: scale(1);\n            }\n            50% {\n              transform: scale(0.5);\n            }\n            66% {\n              top: 12px;\n              left: -20.8px;\n              transform: scale(1);\n            }\n            83% {\n              transform: scale(0.5);\n            }\n            100% {\n              top: -24px;\n              left: 0;\n              transform: scale(1);\n            }\n          }\n          @keyframes spin2 {\n            0% {\n              top: 12px;\n              left: 20.8px;\n              transform: scale(1);\n            }\n            17% {\n              transform: scale(0.5);\n            }\n            33% {\n              top: 12px;\n              left: -20.8px;\n              transform: scale(1);\n            }\n            50% {\n              transform: scale(0.5);\n            }\n            66% {\n              top: -24px;\n              left: 0;\n              transform: scale(1);\n            }\n            83% {\n              transform: scale(0.5);\n            }\n            100% {\n              top: 12px;\n              left: 20.8px;\n              transform: scale(1);\n            }\n          }\n          @keyframes spin3 {\n            0% {\n              top: 12px;\n              left: -20.8px;\n              transform: scale(1);\n            }\n            17% {\n              transform: scale(0.5);\n            }\n            33% {\n              top: -24px;\n              left: 0;\n              transform: scale(1);\n            }\n            50% {\n              transform: scale(0.5);\n            }\n            66% {\n              top: 12px;\n              left: 20.8px;\n              transform: scale(1);\n            }\n            83% {\n              transform: scale(0.5);\n            }\n            100% {\n              top: 12px;\n              left: -20.8px;\n              transform: scale(1);\n            }\n          }\n          ")),
        React.createElement("div", { style: __assign({ position: 'relative', height: 60 }, style) },
            React.createElement("div", { style: spinnerStyle },
                React.createElement("i", { style: circle1Style }),
                React.createElement("i", { style: circle2Style }),
                React.createElement("i", { style: circle3Style })))));
}
exports.default = Spinner;
