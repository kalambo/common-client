import { Obj } from 'common';

const isObject = (v: any) =>
  Object.prototype.toString.call(v) === '[object Object]';
const mergeTwo = (target: any, source: Obj, depth: number) => {
  const result = {};
  if (isObject(target)) {
    Object.keys(target).forEach(k => (result[k] = clone(target[k])));
  }
  Object.keys(source).forEach(k => {
    if (!isObject(source[k]) || !target[k] || depth === 0) {
      result[k] = clone(source[k]);
    } else {
      result[k] = mergeTwo(target[k], source[k], depth - 1);
    }
  });
  return result;
};
const clone = (obj: any, depth = -1) =>
  isObject(obj) ? mergeTwo({}, obj, depth) : obj;
export default (objs: Obj[], depth = -1) =>
  objs.reduce((res, obj) => mergeTwo(res, obj, depth), {});
