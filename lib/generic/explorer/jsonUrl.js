"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encode = function (s) {
    return !/[^\w-.]/.test(s)
        ? s
        : s.replace(/[^\w-.]/g, function (c) {
            if (c === '$')
                return '!';
            var code = c.charCodeAt(0);
            return code < 0x100
                ? "*" + ("00" + code.toString(16)).slice(-2)
                : "**" + ("0000" + code.toString(16)).slice(-4);
        });
};
var stringify = function (v) {
    switch (typeof v) {
        case 'number':
            return isFinite(v) ? '~' + v : '~null';
        case 'boolean':
            return '~' + v;
        case 'string':
            return '~"' + encode(v);
        case 'object':
            if (!v)
                return '~null';
            return "~(" + (Array.isArray(v)
                ? v.map(function (x) { return stringify(x) || '~null'; }).join('') || '~'
                : Object.keys(v)
                    .map(function (k) {
                    var s = stringify(v[k]);
                    return s && "" + encode(k) + s;
                })
                    .filter(function (s) { return s; })
                    .join('~')) + ")";
        default:
            return;
    }
};
var reserved = { true: true, false: false, null: null };
var parse = function (str) {
    try {
        if (!str)
            return null;
        var s_1 = str.replace(/%(25)*22/g, '"');
        var i_1 = 0;
        var eat_1 = function (ex) {
            var c = s_1.charAt(i_1);
            if (c !== ex)
                throw new Error("bad JSURL syntax: expected " + ex + ", got " + c);
            i_1++;
        };
        var decode_1 = function () {
            var beg = i_1;
            var ch;
            var r = '';
            while (i_1 < s_1.length && (ch = s_1.charAt(i_1)) !== '~' && ch !== ')') {
                switch (ch) {
                    case '*':
                        if (beg < i_1)
                            r += s_1.substring(beg, i_1);
                        if (s_1.charAt(i_1 + 1) === '*') {
                            r += String.fromCharCode(parseInt(s_1.substring(i_1 + 2, i_1 + 6), 16));
                            beg = i_1 += 6;
                        }
                        else {
                            r += String.fromCharCode(parseInt(s_1.substring(i_1 + 1, i_1 + 3), 16));
                            beg = i_1 += 3;
                        }
                        break;
                    case '!':
                        if (beg < i_1)
                            r += s_1.substring(beg, i_1);
                        r += '$';
                        beg = ++i_1;
                        break;
                    default:
                        i_1++;
                }
            }
            return r + s_1.substring(beg, i_1);
        };
        var parseOne_1 = function () {
            eat_1('~');
            var ch = s_1.charAt(i_1);
            var result;
            switch (ch) {
                case '(':
                    i_1++;
                    if (s_1.charAt(i_1) === '~') {
                        result = [];
                        if (s_1.charAt(i_1 + 1) === ')') {
                            i_1++;
                        }
                        else {
                            do {
                                result.push(parseOne_1());
                            } while (s_1.charAt(i_1) === '~');
                        }
                    }
                    else {
                        result = {};
                        if (s_1.charAt(i_1) !== ')') {
                            do {
                                var key = decode_1();
                                result[key] = parseOne_1();
                            } while (s_1.charAt(i_1) === '~' && ++i_1);
                        }
                    }
                    eat_1(')');
                    break;
                case '"':
                    i_1++;
                    result = decode_1();
                    break;
                default:
                    var beg = i_1++;
                    while (i_1 < s_1.length && /[^)~]/.test(s_1.charAt(i_1)))
                        i_1++;
                    var sub = s_1.substring(beg, i_1);
                    if (/[\d\-]/.test(ch)) {
                        result = parseFloat(sub);
                    }
                    else {
                        result = reserved[sub];
                        if (typeof result === 'undefined') {
                            throw new Error("bad value keyword: " + sub);
                        }
                    }
            }
            return result;
        };
        return parseOne_1();
    }
    catch (error) {
        return null;
    }
};
exports.default = { stringify: stringify, parse: parse };
