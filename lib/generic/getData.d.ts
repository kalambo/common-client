import { HOC } from 'mishmash';
import { Query } from 'rgo';
export default function getData(...queries: Query[]): HOC;
export default function getData(propName: string, ...queries: Query[]): HOC;
export default function getData(mapPropsToQuery: (props: any) => Query | Query[]): HOC;
export default function getData(propName: string, mapPropsToQuery: (props: any) => Query | Query[]): HOC;
