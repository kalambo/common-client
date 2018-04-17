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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var selector_1 = require("./selector");
exports.default = (function (init, elemType) {
    if (elemType === void 0) { elemType = 'div'; }
    return /** @class */ (function (_super) {
        __extends(Isolate, _super);
        function Isolate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.listeners = [];
            return _this;
        }
        Isolate.prototype.componentWillReceiveProps = function (nextProps) {
            var _this = this;
            setTimeout(function () { return _this.listeners.forEach(function (l) { return l(nextProps); }); });
        };
        Isolate.prototype.shouldComponentUpdate = function () {
            return false;
        };
        Isolate.prototype.componentDidMount = function () {
            var _this = this;
            setTimeout(function () {
                init(_this.root, function () {
                    var selectors = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        selectors[_i] = arguments[_i];
                    }
                    if (selectors.length === 0)
                        return _this.props;
                    var map = selectors.pop();
                    var listener = selector_1.default(selectors, map, null, function (result) {
                        if (typeof result === 'function')
                            result();
                    });
                    _this.listeners.push(listener);
                    listener(_this.props);
                    return function () {
                        return _this.listeners.splice(_this.listeners.indexOf(listener), 1);
                    };
                });
            });
        };
        Isolate.prototype.render = function () {
            var _this = this;
            return React.createElement(elemType, { ref: function (elem) { return (_this.root = elem); } });
        };
        return Isolate;
    }(React.Component));
});
