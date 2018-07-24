import { noUndef, Obj, root } from '../../utils';

export default () => {
  const state = {};
  const listeners: {
    keys: string[];
    emit: (value: any[]) => void;
  }[] = [];
  return {
    rgo: {
      get(keys: [string, string, string], emit: (value: any[] | null) => void) {
        const queries: Obj<Obj<true>> = {};
        keys.forEach(([type, id, field]) => {
          const key = `${type}.${id}`;
          queries[key] = queries[key] || {};
          queries[key][field] = true;
        });
        const queryKeys = Object.keys(queries);
        return root.rgo.query(
          ...queryKeys.map((key, i) => ({
            name: key.split('.')[0],
            alias: `obj${i}`,
            filter: key.split('.')[1],
            fields: Object.keys(queries[key]),
          })),
          data =>
            emit(
              data &&
                keys.map(([type, id, field]) => {
                  const record =
                    data[`obj${queryKeys.indexOf(`${type}.${id}`)}`][0];
                  return noUndef(record && record[field]);
                }),
            ),
        );
      },
      set(values: { key: [string, string, string]; value: any }[]) {
        root.rgo.set(...values);
      },
    },
    local: {
      get(keys: string[], emit: (value: any[]) => void) {
        emit(keys.map(key => noUndef(state[key])));
        if (keys.length > 0) {
          const listener = { keys, emit };
          listeners.push(listener);
          return () => listeners.splice(listeners.indexOf(listener), 1);
        }
        return () => {};
      },
      set(values: { key: string; value: any }[]) {
        values.forEach(({ key, value }) => (state[key] = value));
        listeners.forEach(l => {
          if (values.some(({ key }) => l.keys.includes(key))) {
            l.emit(l.keys.map(key => noUndef(state[key])));
          }
        });
      },
    },
  };
};
