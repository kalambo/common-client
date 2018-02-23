import { Scalar } from 'rgo';
import * as moment from 'moment';

const printSingleValue = (value: any, scalar: Scalar) => {
  if (value === undefined) return '';
  else if (value === null) return '-';
  else if (scalar === 'boolean') return value ? 'Yes' : 'No';
  else if (scalar === 'date') return moment(value).format('DD/MM/YY');
  return `${value}`;
};
export const printValue = (value: any, scalar: Scalar) => {
  if (Array.isArray(value)) {
    if (value.length === 0) return '-';
    return value.map(v => printSingleValue(v, scalar)).join(', ');
  }
  return printSingleValue(value, scalar);
};

export const parseValue = (value: string, scalar: Scalar) => {
  if (value === 'null') return null;
  if (scalar === 'boolean') return { true: true, false: false }[value];
  if (scalar === 'int') return parseInt(value, 10);
  if (scalar === 'float') return parseFloat(value);
  if (scalar === 'date') {
    const parts = value
      .split(/^(\d\d?)\/(\d\d?)\/(\d\d(?:\d\d)?)$/)
      .slice(1)
      .map(parseFloat);
    if (parts.length === 0) return undefined;

    const dd = parts[0];
    const mm = parts[1] - 1;
    const yy = parts[2] + (parts[2] < 100 ? (parts[2] < 30 ? 2000 : 1900) : 0);

    const d = new Date(yy, mm, dd);
    if (d.getDate() !== dd || d.getMonth() !== mm || d.getFullYear() !== yy) {
      return undefined;
    }

    return d;
  }
  return value;
};
