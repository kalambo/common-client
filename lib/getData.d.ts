import { HOC } from 'mishmash';
import { Query } from 'rgo';
export default function getQuery(...queries: Query[]): HOC;
export default function getQuery(propName: string, ...queries: Query[]): HOC;
export default function getQuery(mapPropsToQuery: (props: any) => Query | Query[]): HOC;
export default function getQuery(propName: string, mapPropsToQuery: (props: any) => Query | Query[]): HOC;
