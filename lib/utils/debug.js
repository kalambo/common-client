"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// export default label => (props$, push) => {
//   let prev;
//   props$(true, (props, commit) => {
//     if (prev) {
//       const keys = Array.from(
//         new Set([...Object.keys(prev), ...Object.keys(props)]),
//       ).sort();
//       console.log(
//         `${label}: ${keys.filter(k => prev[k] !== props[k]).join(', ')}`,
//       );
//     }
//     prev = props;
//   });
// };
exports.default = (function (label) { return function (C) {
    return /** @class */ (function (_super) {
        __extends(Debug, _super);
        function Debug() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Debug.prototype.componentWillReceiveProps = function (nextProps) {
            var _this = this;
            var keys = Array.from(new Set(__spread(Object.keys(this.props), Object.keys(nextProps)))).sort();
            console.log(label + ": " + keys
                .filter(function (k) { return _this.props[k] !== nextProps[k]; })
                .join(', '));
        };
        Debug.prototype.render = function () {
            return React.createElement(C, this.props);
        };
        return Debug;
    }(React.Component));
}; });
