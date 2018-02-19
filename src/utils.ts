import { Scalar } from 'rgo';
import * as moment from 'moment';

const getValueStringSub = (value: any, scalar: Scalar) => {
  if (value === undefined) return '';
  else if (value === null) return '-';
  else if (scalar === 'boolean') return value ? 'Yes' : 'No';
  else if (scalar === 'date') return moment(value).format('DD/MM/YY');
  return `${value}`;
};
export const getValueString = (value: any, scalar: Scalar) => {
  if (Array.isArray(value)) {
    if (value.length === 0) return '-';
    return value.map(v => getValueStringSub(v, scalar)).join(', ');
  }
  return getValueStringSub(value, scalar);
};
