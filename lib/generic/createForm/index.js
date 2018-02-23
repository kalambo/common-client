"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var mishmash_1 = require("mishmash");
var set = require("lodash.set");
var keys_to_object_1 = require("keys-to-object");
var rgo_1 = require("rgo");
var common_1 = require("common");
var createStores_1 = require("./createStores");
var getState_1 = require("./getState");
var prepareFields_1 = require("./prepareFields");
function createForm(container, blockProps, block) {
    var _this = this;
    var Block = mishmash_1.default().branch(function (_c) {
        var fields = _c.fields;
        return fields;
    }, mishmash_1.default()
        .merge(getState_1.default)
        .branch(function (_c) {
        var state = _c.state;
        return !state;
    }, mishmash_1.default().render())
        .map(function (_c) {
        var stores = _c.stores, fields = _c.fields, state = _c.state, props = __rest(_c, ["stores", "fields", "state"]);
        return (__assign({}, props, { fields: fields.map(function (_c, i) {
                var key = _c.key, _ = _c.initial, f = __rest(_c, ["key", "initial"]);
                return (__assign({}, state[i], { onChange: function (value) {
                        return stores[key.store].set([
                            { key: key.key, value: common_1.transformValue(value, f.transform) },
                        ]);
                    } }, f, { field: key }));
            }) }));
    }), mishmash_1.default().map(mishmash_1.omit('fields', 'stores', 'state')))(block);
    return mishmash_1.default()
        .map(function (_c) {
        var objects = _c.objects, blocks = _c.blocks, props = __rest(_c, ["objects", "blocks"]);
        return (__assign({}, props, { objects: mishmash_1.memoize(objects), blocks: mishmash_1.memoize(blocks) }));
    })
        .pure()
        .enhance(function (_c) {
        var firstProps = _c.firstProps, onProps = _c.onProps, setState = _c.setState;
        setState({ info: {} });
        var stores = createStores_1.default();
        var fields;
        var count = 0;
        var prepare = function (props) { return __awaiter(_this, void 0, void 0, function () {
            var index, info, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!props) return [3 /*break*/, 2];
                        index = ++count;
                        return [4 /*yield*/, prepareFields_1.default(blockProps, props.objects, props.blocks, stores)];
                    case 1:
                        info = _d.sent();
                        if (index === count) {
                            fields = info.fields;
                            setState({ info: info });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        (_c = common_1.root.rgo).set.apply(_c, __spread((fields || [])
                            .filter(function (f) { return f.key.store === 'rgo'; })
                            .map(function (f) { return ({ key: f.key.key }); })));
                        _d.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        setTimeout(function () { return prepare(firstProps); });
        onProps(prepare);
        return function (_c, _d) {
            var info = _d.info;
            var _a = _c.objects, _b = _c.blocks, onCommit = _c.onCommit, onError = _c.onError, onSubmit = _c.onSubmit, props = __rest(_c, ["objects", "blocks", "onCommit", "onError", "onSubmit"]);
            return (__assign({ onCommit: onCommit, onError: onError, onSubmit: onSubmit, props: props, stores: stores }, info));
        };
    })
        .enhance(function (_c) {
        var setState = _c.setState;
        setState({ height: null });
        var heightElem = null;
        var setHeightElem = function (elem) { return (heightElem = elem); };
        var lockHeight = function () {
            return setState({ height: heightElem && heightElem.offsetHeight });
        };
        return function (props, _c) {
            var height = _c.height;
            return (__assign({}, props, { height: height,
                setHeightElem: setHeightElem,
                lockHeight: lockHeight }));
        };
    })
        .branch(function (_c) {
        var fields = _c.fields;
        return fields;
    }, mishmash_1.default()
        .enhance(function (_c) {
        var setState = _c.setState, onProps = _c.onProps;
        setState({ processing: null });
        var mounted = true;
        onProps(function (props) { return !props && (mounted = false); });
        var setProcessing = function (processing) {
            return mounted && setState({ processing: processing });
        };
        return function (props, _c) {
            var processing = _c.processing;
            return (__assign({}, props, { processing: processing,
                setProcessing: setProcessing }));
        };
    })
        .merge(getState_1.default)
        .branch(function (_c) {
        var state = _c.state;
        return state;
    }, mishmash_1.default().enhance(function (_c) {
        var methods = _c.methods;
        return function (_c) {
            var onCommit = _c.onCommit, onSubmit = _c.onSubmit, onError = _c.onError, lockHeight = _c.lockHeight, setProcessing = _c.setProcessing, props = __rest(_c, ["onCommit", "onSubmit", "onError", "lockHeight", "setProcessing"]);
            var submit = function () { return __awaiter(_this, void 0, void 0, function () {
                var visibleFields, values, rgoKeys_1, extra_1, extraValues, changes_1, newIds, _c, _d, obj, _e, type, id, _f, _g, _h, _j, _k, e_1, _l;
                return __generator(this, function (_m) {
                    switch (_m.label) {
                        case 0:
                            if (!!props.state.some(function (s) { return !s.hidden && s.invalid; })) return [3 /*break*/, 10];
                            lockHeight();
                            setProcessing(true);
                            visibleFields = props.fields.filter(function (_, i) { return !props.state[i].hidden; });
                            values = visibleFields.reduce(function (res, f, i) { return set(res, f.key.name, props.state[i].value); }, {});
                            rgoKeys_1 = visibleFields
                                .filter(function (f) { return f.key.store === 'rgo'; })
                                .map(function (f) { return f.key; });
                            if (!onCommit) return [3 /*break*/, 2];
                            return [4 /*yield*/, onCommit(values)];
                        case 1:
                            extra_1 = (_m.sent()) || {};
                            extraValues = Object.keys(extra_1).reduce(function (res, obj) { return __spread(res, Object.keys(extra_1[obj] || {}).map(function (field) { return ({
                                key: {
                                    store: 'rgo',
                                    key: [
                                        props.objects[obj].type,
                                        props.objects[obj].id,
                                        field,
                                    ],
                                    name: obj + "." + field,
                                },
                                value: extra_1[obj][field],
                            }); })); }, []);
                            (_j = common_1.root.rgo).set.apply(_j, __spread(extraValues.map(function (_c) {
                                var key = _c.key, value = _c.value;
                                return ({
                                    key: key.key,
                                    value: value,
                                });
                            })));
                            rgoKeys_1.push.apply(rgoKeys_1, __spread(extraValues
                                .filter(function (_c) {
                                var key = _c.key;
                                return !rgoKeys_1.some(function (k) { return k.name === key.name; });
                            })
                                .map(function (_c) {
                                var key = _c.key;
                                return key;
                            })));
                            _m.label = 2;
                        case 2:
                            _m.trys.push([2, 6, , 9]);
                            return [4 /*yield*/, (_k = common_1.root.rgo).commit.apply(_k, __spread(rgoKeys_1.map(function (key) { return key.key; })))];
                        case 3:
                            newIds = _m.sent();
                            try {
                                for (_c = __values(Object.keys(props.objects)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    obj = _d.value;
                                    _e = props.objects[obj], type = _e.type, id = _e.id;
                                    values[obj].id = rgo_1.getId(id, newIds[type]);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_l = _c.return)) _l.call(_c);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            _f = onSubmit;
                            if (!_f) return [3 /*break*/, 5];
                            return [4 /*yield*/, onSubmit(values)];
                        case 4:
                            _f = (_m.sent());
                            _m.label = 5;
                        case 5:
                            changes_1 = _f;
                            return [3 /*break*/, 9];
                        case 6:
                            _g = _m.sent();
                            _h = onError;
                            if (!_h) return [3 /*break*/, 8];
                            return [4 /*yield*/, onError(values)];
                        case 7:
                            _h = (_m.sent());
                            _m.label = 8;
                        case 8:
                            changes_1 = _h;
                            return [3 /*break*/, 9];
                        case 9:
                            props.stores.rgo.set(Object.keys(changes_1 || {})
                                .filter(function (k) { return props.objects[k]; })
                                .reduce(function (res, k) { return __spread(res, Object.keys(changes_1[k]).map(function (field) { return ({
                                key: [
                                    props.objects[k].type,
                                    props.objects[k].id,
                                    field,
                                ],
                                value: changes_1[k][field],
                            }); })); }, []));
                            props.stores.local.set(Object.keys(changes_1 || {})
                                .filter(function (k) { return !props.objects[k]; })
                                .reduce(function (res, k) { return __spread(res, [{ key: k, value: changes_1[k] }]); }, []));
                            setProcessing(changes_1 ? false : null);
                            return [3 /*break*/, 11];
                        case 10:
                            setProcessing(false);
                            _m.label = 11;
                        case 11: return [2 /*return*/];
                    }
                });
            }); };
            return __assign({}, props, methods({
                submit: submit,
                onKeyDown: function (event) {
                    if (event.which === 13)
                        submit();
                },
            }));
        };
    })))
        .branch(function (_c) {
        var fields = _c.fields, processing = _c.processing, state = _c.state;
        return !fields || processing || !state;
    }, mishmash_1.default().render(function (_c) {
        var props = _c.props, height = _c.height;
        return React.createElement(container, __assign({ height: height }, props));
    }))
        .map(function (_c) {
        var state = _c.state, props = __rest(_c, ["state"]);
        return (__assign({ invalid: state.some(function (s) { return !s.hidden && s.invalid; }), hidden: JSON.stringify(state.map(function (s) { return s.hidden; })) }, props));
    })
        .pure()
        .map(function (_c) {
        var hidden = _c.hidden, props = __rest(_c, ["hidden"]);
        return (__assign({}, props, { hidden: keys_to_object_1.default(JSON.parse(hidden), function (h) { return h; }, function (_, i) { return props.fields[i].key.name; }) }));
    })(function (_c) {
        var blocks = _c.blocks, stores = _c.stores, props = _c.props, setHeightElem = _c.setHeightElem, processing = _c.processing, submit = _c.submit, onKeyDown = _c.onKeyDown, invalid = _c.invalid, hidden = _c.hidden;
        return React.createElement(container, __assign({ blocks: blocks
                .map(function (blockSet, i) {
                return blockSet.map(function (block, j) {
                    return (block.fields.length === 0 ||
                        block.fields.some(function (f) { return !hidden[f.key.name]; })) && (React.createElement(Block, __assign({}, block, { stores: stores, fields: block.fields.length === 0
                            ? null
                            : block.fields.filter(function (f) { return !hidden[f.key.name]; }), attempted: processing !== null, key: i + "_" + j })));
                });
            })
                .filter(function (blockComps) { return blockComps.some(function (c) { return c; }); }), setHeightElem: setHeightElem, attempted: processing !== null, submit: submit,
            onKeyDown: onKeyDown,
            invalid: invalid }, props));
    });
}
exports.default = createForm;
