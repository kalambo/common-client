"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3-selection");
var isUnitlessNumber = {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true,
};
Object.keys(isUnitlessNumber).forEach(function (prop) {
    return ['Webkit', 'ms', 'Moz', 'O'].forEach(function (prefix) {
        isUnitlessNumber[prefix + prop.charAt(0).toUpperCase() + prop.substring(1)] = true;
    });
});
function style(styles) {
    return this.each(function (d) {
        var _this = this;
        var s = typeof styles === 'function' ? styles(d) : styles;
        Object.keys(s).forEach(function (k) {
            _this.style[k] =
                typeof s[k] === 'number' && s[k] !== 0 && !isUnitlessNumber[k]
                    ? s[k] + "px"
                    : s[k];
        });
    });
}
d3.selection.prototype.style = style;
exports.default = d3;
