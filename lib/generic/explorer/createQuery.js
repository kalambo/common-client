"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("common");
var rgo_1 = require("rgo");
var ejson_1 = require("../../ejson");
exports.default = (function (initial, onUpdate) {
    var query = initial && ejson_1.default.parse(ejson_1.default.stringify(initial));
    onUpdate(query);
    return {
        filter: function (path, filter) {
            var splitPath = path.split('.');
            var f = splitPath.reduce(function (res, i) { return res.fields[i]; }, {
                fields: query,
            });
            f.filter = filter;
            if (!f.filter)
                delete f.filter;
            onUpdate(query);
        },
        sort: function (path) {
            var splitPath = path.split('.');
            var index = splitPath[splitPath.length - 1];
            var parent = splitPath
                .slice(0, -1)
                .reduce(function (res, i) { return res.fields[i]; }, { fields: query });
            var f = parent.fields[index];
            var ascIndex = (parent.sort || []).indexOf(f);
            var descIndex = (parent.sort || []).indexOf("-" + f);
            if (ascIndex !== -1) {
                parent.sort[ascIndex] = "-" + f;
            }
            else if (descIndex !== -1) {
                parent.sort.splice(descIndex, 1);
                if (parent.sort.length === 0)
                    delete parent.sort;
            }
            else if (!parent.sort) {
                parent.sort = [f];
            }
            else {
                var i = 0;
                while (i !== -1) {
                    var s = parent.sort[i];
                    if (i === parent.sort.length ||
                        parent.fields.indexOf(s[0] === '-' ? s.slice(1) : s) > index) {
                        parent.sort.splice(i, 0, f);
                        i = -1;
                    }
                    else {
                        i++;
                    }
                }
            }
            onUpdate(query);
        },
        limit: function (path, start, end) {
            var splitPath = path.split('.');
            var f = splitPath.reduce(function (res, i) { return res.fields[i]; }, {
                fields: query,
            });
            f.start = start;
            if (!f.start)
                delete f.start;
            f.end = end;
            if (!f.end)
                delete f.end;
            onUpdate(query);
        },
        add: function (path, type, field) {
            var splitPath = path.split('.');
            var index = parseInt(splitPath[splitPath.length - 1], 10);
            var parent = splitPath
                .slice(0, -1)
                .reduce(function (res, i) { return res.fields[i]; }, { fields: query });
            var fieldSchema = type &&
                (common_1.root.rgo.schema[type][field] || {
                    scalar: 'string',
                });
            var isList = !fieldSchema ||
                rgo_1.fieldIs.foreignRelation(fieldSchema) ||
                fieldSchema.isList;
            parent.fields.splice(index, 0, field === 'id' || (type && rgo_1.fieldIs.scalar(fieldSchema))
                ? field
                : isList
                    ? {
                        name: field,
                        end: path.split('.').length === 1 ? 100 : 10,
                        fields: [],
                    }
                    : { name: field, fields: [] });
            onUpdate(query, (!fieldSchema || !rgo_1.fieldIs.scalar(fieldSchema)) && path);
        },
        remove: function (path) {
            var splitPath = path.split('.');
            var index = parseInt(splitPath[splitPath.length - 1], 10);
            var parent = splitPath
                .slice(0, -1)
                .reduce(function (res, i) { return res.fields[i]; }, { fields: query });
            var f = parent.fields[index];
            if (parent.fields.filter(function (x) { return x === f; }).length === 1) {
                var ascIndex = (parent.sort || []).indexOf(f);
                var descIndex = (parent.sort || []).indexOf("-" + f);
                if (ascIndex !== -1)
                    parent.sort.splice(ascIndex, 1);
                else if (descIndex !== -1)
                    parent.sort.splice(descIndex, 1);
                if (parent.sort && parent.sort.length === 0)
                    delete parent.sort;
            }
            parent.fields.splice(index, 1);
            onUpdate(query);
        },
    };
});
