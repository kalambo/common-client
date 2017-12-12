import { createEventHandler } from 'recompose';
import { HOC, mapPropsStream } from 'mishmash';
import * as most from 'most';
import keysToObject from 'keys-to-object';
import { isValid } from 'common';

import runFilter from '../runFilter';

export default mapPropsStream(props$ => {
  const states = ['rgo', 'local'].map(_ => createEventHandler<any, any>());
  let unsubscribes: (() => void)[] = [];
  props$.observe(() => {}).then(() => unsubscribes.forEach(u => u()));
  let prevJSON;
  return props$
    .tap(({ fields, stores }) => {
      const nextJSON = JSON.stringify(fields);
      if (nextJSON !== prevJSON) {
        unsubscribes.forEach(u => u());
        const storeFields = ['rgo', 'local'].map(store =>
          fields.filter(f => f.key.store === store),
        );
        unsubscribes = ['rgo', 'local'].map((store, i) =>
          stores[store].get(
            storeFields[i].map(f => f.key.key),
            states[i].handler,
          ),
        );
      }
      prevJSON = nextJSON;
    })
    .combine(
      (props, rgoState, localState) => {
        const combinedStates = { rgo: rgoState, local: localState };
        const indices = { rgo: 0, local: 0 };
        const values =
          rgoState &&
          keysToObject(
            props.fields,
            f => combinedStates[f.key.store][indices[f.key.store]++],
            f => f.key.name,
          );
        return {
          state:
            rgoState &&
            props.fields.map(f => {
              const value = values[f.key.name];
              const hidden =
                typeof f.showIf === 'function'
                  ? !f.showIf(values)
                  : !runFilter(f.showIf, values);
              return {
                value,
                invalid: !isValid(f, value, values),
                ...hidden ? { hidden: true } : {},
              };
            }),
          ...props,
        };
      },
      most.from(states[0].stream),
      most.from(states[1].stream),
    );
}) as HOC;
