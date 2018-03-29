import m, { HOC } from 'mishmash';
import keysToObject from 'keys-to-object';
import { isValid } from 'common';

import ejson from '../../ejson';

import runFilter from './runFilter';

export default m.merge(
  'stores',
  props => ejson.stringify(props.fields),
  (stores, jsonFields, push) => {
    const fields = ejson.parse(jsonFields);
    push({ state: null });
    const storeValues = { rgo: null as any, local: null as any };
    const storeFields = ['rgo', 'local'].map(store =>
      fields.filter(f => f.key.store === store),
    );
    const unsubscribes = ['rgo', 'local'].map((store, i) =>
      stores[store].get(storeFields[i].map(f => f.key.key), value => {
        storeValues[store] = value;
        if (!storeValues.rgo || !storeValues.local) {
          push({ state: null });
        } else {
          const indices = { rgo: 0, local: 0 };
          const values = keysToObject(
            fields,
            f => storeValues[f.key.store][indices[f.key.store]++],
            f => f.key.name,
          );
          push({
            state: fields.map(f => {
              const value = values[f.key.name];
              const hidden =
                typeof f.showIf === 'function'
                  ? !f.showIf(values)
                  : !runFilter(f.showIf, values);
              return {
                value,
                invalid: !isValid(f, value, values),
                ...(hidden ? { hidden: true } : {}),
              };
            }),
          });
        }
      }),
    );
    return () => unsubscribes.forEach(u => u());
  },
) as HOC;
