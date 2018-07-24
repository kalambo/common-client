"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (onClickOutside) {
    var elem;
    var stopClick = false;
    var downListener = function (e) {
        if (!(elem && (elem === e.target || elem.contains(e.target)))) {
            if (onClickOutside()) {
                e.stopPropagation();
                stopClick = true;
            }
        }
    };
    var upListener = function (e) {
        if (stopClick) {
            e.stopPropagation();
            setTimeout(function () { return (stopClick = false); });
        }
    };
    var clickListener = function (e) {
        if (stopClick) {
            e.stopPropagation();
            setTimeout(function () { return (stopClick = false); });
        }
    };
    return Object.assign(function (e) {
        elem = e;
        if (typeof document !== 'undefined') {
            if (elem) {
                document.addEventListener('mousedown', downListener, true);
                document.addEventListener('mouseup', upListener, true);
                document.addEventListener('click', clickListener, true);
            }
            else {
                document.removeEventListener('mousedown', downListener, true);
                document.removeEventListener('mouseup', upListener, true);
                document.removeEventListener('click', clickListener, true);
            }
        }
    }, { noCache: true });
});
