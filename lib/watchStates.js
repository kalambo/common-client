"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchFocus = function (props$, push) {
    return props$('tabIndex', 'onFocus', 'onBlur', function (tabIndex, onFocus, onBlur) {
        if (tabIndex === void 0) { tabIndex = 0; }
        return ({
            tabIndex: undefined,
            onFocus: undefined,
            onBlur: undefined,
            focusProps: {
                tabIndex: tabIndex,
                onFocus: function (e) { return push({ isFocused: true }) || (onFocus && onFocus(e)); },
                onBlur: function (e) { return push({ isFocused: false }) || (onBlur && onBlur(e)); },
            },
            isFocused: false,
        });
    });
};
exports.watchHover = function (props$, push) {
    return props$('onMouseMove', 'onMouseLeave', function (onMouseMove, onMouseLeave) { return ({
        onMouseMove: undefined,
        onMouseLeave: undefined,
        hoverProps: {
            onMouseMove: function (e) {
                return push({ isHovered: true }) || (onMouseMove && onMouseMove(e));
            },
            onMouseLeave: function (e) {
                return push({ isHovered: false }) || (onMouseLeave && onMouseLeave(e));
            },
        },
        isHovered: false,
    }); });
};
