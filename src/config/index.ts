import { ScalarField } from 'rgo';

x => x as ScalarField;

import { parseFilter, printFilter } from './filter';
import { parseValue, printValue } from './value';

export default {
  parseFilter,
  printFilter,
  parseValue,
  printValue,
};
