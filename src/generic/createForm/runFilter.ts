import * as deepEqual from 'deep-equal';

import { noUndef, Obj } from '../../utils';

type FilterOp = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'in';

const isEqual = (v1: any, v2: any) => deepEqual(v1, v2, { strict: true });

const runFilterValue = (value: any, op: FilterOp, filterValue: any) => {
  if (value === undefined) return false;
  if (op === '=') {
    return (
      isEqual(value, filterValue) ||
      (Array.isArray(value) && value.some(v => isEqual(v, filterValue)))
    );
  }
  if (op === '!=') {
    return (
      !isEqual(value, filterValue) &&
      (!Array.isArray(value) || value.every(v => !isEqual(v, filterValue)))
    );
  }
  if (op === '<') return value < filterValue;
  if (op === '<=') return value <= filterValue;
  if (op === '>') return value > filterValue;
  if (op === '>=') return value >= filterValue;
  return Array.isArray(value)
    ? value.some(x => filterValue.includes(x))
    : filterValue.includes(value);
};
export default function runFilter(
  filter: any[] | undefined,
  values: Obj,
): boolean {
  if (!filter) return true;
  if (['AND', 'OR'].includes(filter[0])) {
    if (filter[0] === 'AND') {
      return filter.slice(1).every(f => runFilter(f, values));
    } else if (filter[0] === 'OR') {
      return filter.slice(1).some(f => runFilter(f, values));
    }
  }
  return runFilterValue(
    noUndef(values[filter[0]]),
    filter.length === 3 ? filter[1] : '=',
    filter[filter.length - 1],
  );
}
