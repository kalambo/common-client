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
exports.applyStyle = function (elem, style) {
    Object.keys(style).forEach(function (k) {
        elem.style[k] =
            typeof style[k] === 'number' && style[k] !== 0 && !isUnitlessNumber[k]
                ? style[k] + "px"
                : style[k];
    });
};
function style(styles) {
    return this.each(function (d) {
        exports.applyStyle(this, typeof styles === 'function' ? styles(d) : styles);
    });
}
d3.selection.prototype.style = style;
exports.default = d3;
