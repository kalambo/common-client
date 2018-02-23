import { root } from 'common';

import { parseFilter, printFilter } from './filter';
import { parseValue, printValue } from './value';

const fieldName = (field, type) => {
  if (field === 'id') return 'Id';
  return root.rgo.schema[type][field].meta.name || field;
};

export default {
  parseFilter,
  printFilter,
  parseValue,
  printValue,
  fieldName,
};
