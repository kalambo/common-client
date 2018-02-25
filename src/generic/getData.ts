import m, { HOC } from 'mishmash';
import { Query } from 'rgo';
import { root } from 'common';

export default function getData(...queries: Query[]): HOC;
export default function getData(propName: string, ...queries: Query[]): HOC;
export default function getData(
  mapPropsToQuery: (props: any) => Query | Query[],
): HOC;
export default function getData(
  propName: string,
  mapPropsToQuery: (props: any) => Query | Query[],
): HOC;
export default function getData(...args) {
  const propName = typeof args[0] === 'string' ? (args[0] as string) : 'data';
  const queries = typeof args[0] === 'string' ? args.slice(1) : args;
  return m.stream(({ initial, observe, push }) => {
    push({ data: null as any });
    let unsubscribe;
    if (typeof queries[0] !== 'function') {
      unsubscribe = root.rgo.query(...queries, data =>
        push({ data: data && { ...data } }),
      );
    } else {
      let prevJSON;
      const update = props => {
        if (props) {
          const q = queries[0](props);
          const nextJSON = JSON.stringify(q);
          if (nextJSON !== prevJSON) {
            if (unsubscribe) {
              unsubscribe();
              push({ data: null });
            }
            unsubscribe = root.rgo.query(...q, data =>
              push({ data: data && { ...data } }),
            );
          }
          prevJSON = nextJSON;
        } else {
          unsubscribe();
        }
      };
      update(initial);
      observe(update);
    }
    return (props, { data }) => ({ ...props, [propName]: data });
  });
}
