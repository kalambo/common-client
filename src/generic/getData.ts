import m, { HOC } from 'mishmash';
import { Query } from 'rgo';
import { root } from 'common';

import ejson from '../ejson';

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
  return m.merge(
    props =>
      typeof queries[0] === 'function' && ejson.stringify(queries[0](props)),
    (jsonQueries, push) => {
      push({ data: null });
      return root.rgo.query(
        ...(jsonQueries ? ejson.parse(jsonQueries) : queries),
        data => push({ [propName]: data && { ...data } }),
      );
    },
  );
}
