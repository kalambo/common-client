import { ScalarField } from 'rgo';
import * as moment from 'moment';

const isDate = v => Object.prototype.toString.call(v) === '[object Date]';

const getIndex = (options, value) => {
  if (!isDate(value)) return options.indexOf(value);
  return options.map(o => o && o.getTime()).indexOf(value.getTime());
};

const printSingleValue = (value: any, field: ScalarField) => {
  if (value === undefined) return '';
  else if (value === null) return '-';
  else if (field.meta && field.meta.labels)
    return field.meta.labels[getIndex(field.meta.options, value)];
  else if (field.scalar === 'boolean') return value ? 'Yes' : 'No';
  else if (field.scalar === 'date') return moment(value).format('DD/MM/YY');
  else if (field.meta && field.meta.file) return value.split(':')[1];
  return `${value}`;
};
export const printValue = (value: any, field: ScalarField) => {
  if (Array.isArray(value)) {
    if (value.length === 0) return '-';
    return value.map(v => printSingleValue(v, field)).join(', ');
  }
  return printSingleValue(value, field);
};

export const parseValue = (value: string, field: ScalarField) => {
  if (value === 'null') return null;
  if (field.scalar === 'boolean') return { true: true, false: false }[value];
  if (field.scalar === 'int') return parseInt(value, 10);
  if (field.scalar === 'float') return parseFloat(value);
  if (field.scalar === 'date') {
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
