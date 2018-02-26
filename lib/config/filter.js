"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
var value_1 = require("./value");
exports.printFilter = function (filter, type) {
    if (!filter)
        return '';
    if (filter[0] === 'AND' || filter[0] === 'OR') {
        return "(" + filter
            .slice(1)
            .map(function (f) { return exports.printFilter(f, type); })
            .join(filter[0] === 'AND' ? ', ' : ' OR ') + ")";
    }
    var field = common_1.root.rgo.schema[type][filter[0]];
    if (!field || !rgo_1.fieldIs.scalar(field))
        throw new Error('Invalid field');
    var op = filter.length === 3 ? filter[1] : '=';
    var value = filter[filter.length - 1];
    return filter[0] + " " + op + " " + value_1.printValue(value, field);
};
var simpleField = function (f) { return f.replace(/\s/g, '').toLowerCase(); };
var parser = peg.generate(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\nstart\n= _ main:or _ { return main[0]; }\n/ _ { return {}; }\n\nor\n= lhs:and _ '|' _ rhs:or2 { return [['OR'].concat(lhs).concat(rhs)]; }\n/ and\n\nor2\n= lhs:block _ '|' _ rhs:or2 { return lhs.concat(rhs); }\n/ and\n\nand\n= lhs:block _ ',' _ rhs:and2 { return [['AND'].concat(lhs).concat(rhs)]; }\n/ block\n\nand2\n= lhs:block _ ',' _ rhs:and2 { return lhs.concat(rhs); }\n/ block\n\nblock\n= '(' _ sentence:or _ ')' { return sentence; }\n/ statement\n\nstatement\n= f:field _ o:op _ e:expr { return [[f, o, e]]; }\n/ '!' _ f:field { return [[f, '=', 'null']]; }\n/ f:field { return [[f, '!=', 'null']]; }\n\nfield\n= ''' f:[a-z0-9-_ ]i+ ''' { return f.join('').trim(); }\n/ '\"' f:[a-z0-9-_ ]i+ '\"' { return f.join('').trim(); }\n/ f:[a-z0-9-_ ]i+ { return f.join('').trim(); }\n\nop\n= '!=' / '<=' / '>=' / '=' / '<' / '>' { return text(); }\n\nexpr\n= ''' t:[^']* ''' { return t.join('').trim(); }\n/ '\"' t:[^\"]i* '\"' { return t.join('').trim(); }\n/ '[' t:[^]]i* ']' { return t.join('').split(',').map(function(s) { return s.trim() }); }\n/ t:[^'\",|()]* { return t.join('').trim(); }\n\n_\n= whiteSpace*\n\nwhiteSpace\n= [ \t\n\r]+\n\n"], ["\n\nstart\n= _ main:or _ { return main[0]; }\n/ _ { return {}; }\n\nor\n= lhs:and _ '|' _ rhs:or2 { return [['OR'].concat(lhs).concat(rhs)]; }\n/ and\n\nor2\n= lhs:block _ '|' _ rhs:or2 { return lhs.concat(rhs); }\n/ and\n\nand\n= lhs:block _ ',' _ rhs:and2 { return [['AND'].concat(lhs).concat(rhs)]; }\n/ block\n\nand2\n= lhs:block _ ',' _ rhs:and2 { return lhs.concat(rhs); }\n/ block\n\nblock\n= '(' _ sentence:or _ ')' { return sentence; }\n/ statement\n\nstatement\n= f:field _ o:op _ e:expr { return [[f, o, e]]; }\n/ '!' _ f:field { return [[f, '=', 'null']]; }\n/ f:field { return [[f, '!=', 'null']]; }\n\nfield\n= '\\'' f:[a-z0-9-_ ]i+ '\\'' { return f.join('').trim(); }\n/ '\"' f:[a-z0-9-_ ]i+ '\"' { return f.join('').trim(); }\n/ f:[a-z0-9-_ ]i+ { return f.join('').trim(); }\n\nop\n= '!=' / '<=' / '>=' / '=' / '<' / '>' { return text(); }\n\nexpr\n= '\\'' t:[^']* '\\'' { return t.join('').trim(); }\n/ '\"' t:[^\"]i* '\"' { return t.join('').trim(); }\n/ '[' t:[^\\]]i* ']' { return t.join('').split(',').map(function(s) { return s.trim() }); }\n/ t:[^'\",|()]* { return t.join('').trim(); }\n\n_\n= whiteSpace*\n\nwhiteSpace\n= [ \\t\\n\\r]+\n\n"])))).parse;
var parseFilterValues = function (filter, fields) {
    if (filter[0] === 'AND' || filter[0] === 'OR') {
        return __spread([
            filter[0]
        ], filter.slice(1).map(function (f) { return parseFilterValues(f, fields); }));
    }
    var simple = simpleField(filter[0]);
    var fieldKey = fields[filter[0]]
        ? filter[0]
        : Object.keys(fields).find(function (k) { return simpleField(fields[k].meta.name) === simple; });
    var field = fields[fieldKey];
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
            [[fieldKey, op, null], [fieldKey, op, false]],
        ];
    }
    var parsedValue = value_1.parseValue(value, field);
    if (parsedValue === undefined || parsedValue !== parsedValue) {
        throw new Error('Invalid value');
    }
    return [fieldKey, op, parsedValue];
};
exports.parseFilter = function (filter, type) {
    try {
        return parseFilterValues(parser(filter.replace(/OR/g, '|')), __assign({}, common_1.root.rgo.schema[type], { id: { scalar: 'string', meta: { name: 'id' } } }));
    }
    catch (error) {
        return null;
    }
};
var templateObject_1;
