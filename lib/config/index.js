"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("common");
var filter_1 = require("./filter");
var value_1 = require("./value");
var fieldName = function (field, type) {
    if (field === 'id')
        return 'Id';
    return common_1.root.rgo.schema[type][field].meta.name || field;
};
exports.default = {
    parseFilter: filter_1.parseFilter,
    printFilter: filter_1.printFilter,
    parseValue: value_1.parseValue,
    printValue: value_1.printValue,
    fieldName: fieldName,
};
