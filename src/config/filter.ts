import * as peg from 'pegjs';
import { Field, fieldIs } from 'rgo';
import { Obj, root } from 'common';

import { parseValue, printValue } from './value';

export const printFilter = (filter: any[] | null, type: string) => {
  if (!filter) return '';
  if (filter[0] === 'AND' || filter[0] === 'OR') {
    return `(${filter
      .slice(1)
      .map(f => printFilter(f, type))
      .join(filter[0] === 'AND' ? ', ' : ' OR ')})`;
  }
  const field = root.rgo.schema[type][filter[0]];
  if (!field || !fieldIs.scalar(field)) throw new Error('Invalid field');
  const op = filter.length === 3 ? filter[1] : '=';
  const value = filter[filter.length - 1];
  return `${filter[0]} ${op} ${printValue(value, field)}`;
};

const simpleField = f => f.replace(/\s/g, '').toLowerCase();

const parser = peg.generate(String.raw`

start
= _ main:or _ { return main[0]; }
/ _ { return {}; }

or
= lhs:and _ '|' _ rhs:or2 { return [['OR'].concat(lhs).concat(rhs)]; }
/ and

or2
= lhs:block _ '|' _ rhs:or2 { return lhs.concat(rhs); }
/ and

and
= lhs:block _ ',' _ rhs:and2 { return [['AND'].concat(lhs).concat(rhs)]; }
/ block

and2
= lhs:block _ ',' _ rhs:and2 { return lhs.concat(rhs); }
/ block

block
= '(' _ sentence:or _ ')' { return sentence; }
/ statement

statement
= f:field _ o:op _ e:expr { return [[f, o, e]]; }
/ '!' _ f:field { return [[f, '=', 'null']]; }
/ f:field { return [[f, '!=', 'null']]; }

field
= '\'' f:[a-z0-9-_ ]i+ '\'' { return f.join('').trim(); }
/ '"' f:[a-z0-9-_ ]i+ '"' { return f.join('').trim(); }
/ f:[a-z0-9-_ ]i+ { return f.join('').trim(); }

op
= '!=' / '<=' / '>=' / '=' / '<' / '>' { return text(); }

expr
= '\'' t:[^']* '\'' { return t.join('').trim(); }
/ '"' t:[^"]i* '"' { return t.join('').trim(); }
/ '[' t:[^\]]i* ']' { return t.join('').split(',').map(function(s) { return s.trim() }); }
/ t:[^'",|()]* { return t.join('').trim(); }

_
= whiteSpace*

whiteSpace
= [ \t\n\r]+

`).parse;

const parseFilterValues = (filter: any[], fields: Obj<Field>) => {
  if (filter[0] === 'AND' || filter[0] === 'OR') {
    return [
      filter[0],
      ...filter.slice(1).map(f => parseFilterValues(f, fields)),
    ];
  }
  const simple = simpleField(filter[0]);
  const fieldKey = fields[filter[0]]
    ? filter[0]
    : Object.keys(fields).find(
        k => simpleField(fields[k].meta.name) === simple,
      );
  const field = fields[fieldKey];
  if (!field || !fieldIs.scalar(field)) throw new Error('Invalid field');
  const op = filter.length === 3 ? filter[1] : '=';
  const value = filter[filter.length - 1];
  if (
    ['boolean', 'string', 'json'].includes(field.scalar) &&
    !['=', '!='].includes(op)
  ) {
    throw new Error('Invalid operator for data type');
  }
  if (
    field.scalar === 'boolean' &&
    (op === '=' || op === '!=') &&
    value === 'null'
  ) {
    return [
      op === '=' ? 'OR' : 'AND',
      [[fieldKey, op, null], [fieldKey, op, false]],
    ];
  }
  const parsedValue = parseValue(value, field);
  if (parsedValue === undefined || parsedValue !== parsedValue) {
    throw new Error('Invalid value');
  }
  return [fieldKey, op, parsedValue];
};

export const parseFilter = (filter: string, type: string) => {
  try {
    return parseFilterValues(parser(filter.replace(/OR/g, '|')), {
      ...root.rgo.schema[type],
      id: { scalar: 'string', meta: { name: 'id' } },
    });
  } catch (error) {
    return null;
  }
};
