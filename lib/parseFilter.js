"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var peg = require("pegjs");
var rgo_1 = require("rgo");
var common_1 = require("common");
var parser = peg.generate(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\nstart\n= _ main:or _ { return main[0]; }\n/ _ { return {}; }\n\nor\n= lhs:and _ '|' _ rhs:or2 { return [['OR'].concat(lhs).concat(rhs)]; }\n/ and\n\nor2\n= lhs:block _ '|' _ rhs:or2 { return lhs.concat(rhs); }\n/ and\n\nand\n= lhs:block _ ',' _ rhs:and2 { return [['AND'].concat(lhs).concat(rhs)]; }\n/ block\n\nand2\n= lhs:block _ ',' _ rhs:and2 { return lhs.concat(rhs); }\n/ block\n\nblock\n= '(' _ sentence:or _ ')' { return sentence; }\n/ statement\n\nstatement\n= f:field _ o:op _ e:expr { return [[f, o, e]]; }\n/ '!' _ f:field { return [[f, '=', 'null']]; }\n/ f:field { return [[f, '!=', 'null']]; }\n\nfield\n= ''' f:[a-z0-9-_]i+ ''' { return f.join(''); }\n/ '\"' f:[a-z0-9-_]i+ '\"' { return f.join(''); }\n/ f:[a-z0-9-_]i+ { return f.join(''); }\n\nop\n= '!=' / '<=' / '>=' / '=' / '<' / '>' { return text(); }\n\nexpr\n= ''' t:[^']* ''' { return t.join('').trim(); }\n/ '\"' t:[^\"]i* '\"' { return t.join('').trim(); }\n/ '[' t:[^]]i* ']' { return t.join('').split(',').map(function(s) { return s.trim() }); }\n/ t:[^'\",|()]* { return t.join('').trim(); }\n\n_\n= whiteSpace*\n\nwhiteSpace\n= [ \t\n\r]+\n\n"], ["\n\nstart\n= _ main:or _ { return main[0]; }\n/ _ { return {}; }\n\nor\n= lhs:and _ '|' _ rhs:or2 { return [['OR'].concat(lhs).concat(rhs)]; }\n/ and\n\nor2\n= lhs:block _ '|' _ rhs:or2 { return lhs.concat(rhs); }\n/ and\n\nand\n= lhs:block _ ',' _ rhs:and2 { return [['AND'].concat(lhs).concat(rhs)]; }\n/ block\n\nand2\n= lhs:block _ ',' _ rhs:and2 { return lhs.concat(rhs); }\n/ block\n\nblock\n= '(' _ sentence:or _ ')' { return sentence; }\n/ statement\n\nstatement\n= f:field _ o:op _ e:expr { return [[f, o, e]]; }\n/ '!' _ f:field { return [[f, '=', 'null']]; }\n/ f:field { return [[f, '!=', 'null']]; }\n\nfield\n= '\\'' f:[a-z0-9-_]i+ '\\'' { return f.join(''); }\n/ '\"' f:[a-z0-9-_]i+ '\"' { return f.join(''); }\n/ f:[a-z0-9-_]i+ { return f.join(''); }\n\nop\n= '!=' / '<=' / '>=' / '=' / '<' / '>' { return text(); }\n\nexpr\n= '\\'' t:[^']* '\\'' { return t.join('').trim(); }\n/ '\"' t:[^\"]i* '\"' { return t.join('').trim(); }\n/ '[' t:[^\\]]i* ']' { return t.join('').split(',').map(function(s) { return s.trim() }); }\n/ t:[^'\",|()]* { return t.join('').trim(); }\n\n_\n= whiteSpace*\n\nwhiteSpace\n= [ \\t\\n\\r]+\n\n"])))).parse;
var parseValue = function (value, scalar) {
    if (value === 'null')
        return null;
    if (scalar === 'boolean')
        return { true: true, false: false }[value];
    if (scalar === 'int')
        return parseInt(value, 10);
    if (scalar === 'float')
        return parseFloat(value);
    if (scalar === 'date') {
        var parts = value
            .split(/^(\d\d?)\/(\d\d?)\/(\d\d(?:\d\d)?)$/)
            .slice(1)
            .map(parseFloat);
        if (parts.length === 0)
            return undefined;
        var dd = parts[0];
        var mm = parts[1] - 1;
        var yy = parts[2] + (parts[2] < 100 ? (parts[2] < 30 ? 2000 : 1900) : 0);
        var d = new Date(yy, mm, dd);
        if (d.getDate() !== dd || d.getMonth() !== mm || d.getFullYear() !== yy) {
            return undefined;
        }
        return d;
    }
    return value;
};
var parseFilterValues = function (filter, fields) {
    if (filter[0] === 'AND' || filter[0] === 'OR') {
        return __spread([
            filter[0]
        ], filter.slice(1).map(function (f) { return parseFilterValues(f, fields); }));
    }
    var field = fields[filter[0]];
    if (!field || !rgo_1.fieldIs.scalar(field))
        throw new Error('Invalid field');
    var op = filter.length === 3 ? filter[1] : '=';
    var value = filter[filter.length - 1];
    if (['boolean', 'string', 'json'].includes(field.scalar) &&
        !['=', '!='].includes(op)) {
        throw new Error('Invalid operator for data type');
    }
    if (field.scalar === 'boolean' &&
        (op === '=' || op === '!=') &&
        value === 'null') {
        return [
            op === '=' ? 'OR' : 'AND',
            [[filter[0], op, null], [filter[0], op, false]],
        ];
    }
    var parsedValue = parseValue(value, field.scalar);
    if (parsedValue === undefined || parsedValue !== parsedValue) {
        throw new Error('Invalid value');
    }
    return [filter[0], op, parsedValue];
};
function parseFilter(filter, type) {
    try {
        return parseFilterValues(parser(filter.replace(/OR/g, '|')), common_1.root.rgo.schema[type]);
    }
    catch (error) {
        return null;
    }
}
exports.default = parseFilter;
var templateObject_1;
