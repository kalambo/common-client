import { createEventHandler } from 'recompose';
import { HOC, mapPropsStream } from 'mishmash';
import * as most from 'most';
import { Query } from 'rgo';

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
  return mapPropsStream(props$ => {
    const { handler: setState, stream } = createEventHandler<any, any>();
    let unsubscribe;
    let prevJSON;
    props$.observe(() => {}).then(() => unsubscribe());
    return most.from(stream).combine(
      (state, props) => ({
        ...props,
        [propName
          ? typeof propName === 'string' ? propName : propName(props)
          : 'data']: state,
      }),
      props$.tap(props => {
        const q: Query[] =
          typeof queries[0] === 'function' ? queries[0](props) : queries;
        const nextJSON = JSON.stringify(q);
        if (nextJSON !== prevJSON) {
          if (unsubscribe) unsubscribe();
          unsubscribe = window.rgo.query(...q, setState);
        }
        prevJSON = nextJSON;
      }),
    );
  });
}
