import { enclose, HOC } from 'mishmash';
import keysToObject from 'keys-to-object';
import { isValid } from 'common';

import runFilter from './runFilter';

export default enclose(({ initialProps, onProps, setState }) => {
  setState({ rgo: null as any, local: null as any });

  let unsubscribes: (() => void)[] = [];
  let prevJSON;
  const update = props => {
    if (props) {
      const nextJSON = JSON.stringify(props.fields);
      if (nextJSON !== prevJSON) {
        unsubscribes.forEach(u => u());
        const storeFields = ['rgo', 'local'].map(store =>
          props.fields.filter(f => f.key.store === store),
        );
        unsubscribes = ['rgo', 'local'].map((store, i) =>
          props.stores[store].get(storeFields[i].map(f => f.key.key), value =>
            setState({ [store]: value }),
          ),
        );
      }
      prevJSON = nextJSON;
    } else {
      unsubscribes.forEach(u => u());
    }
  };
  update(initialProps);
  onProps(update);

  return (props, state) => {
    const indices = { rgo: 0, local: 0 };
    const values =
      state.rgo &&
      state.local &&
      keysToObject(
        props.fields,
        f => state[f.key.store][indices[f.key.store]++],
        f => f.key.name,
      );
    return {
      state:
        state.rgo &&
        state.local &&
        props.fields.map(f => {
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
      ...props,
    };
  };
}) as HOC;
