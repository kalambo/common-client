import { Query } from 'rgo';
export default function getData(...queries: Query[]): any;
export default function getData(propName: string, ...queries: Query[]): any;
export default function getData(mapPropsToQuery: (props: any) => Query | Query[]): any;
export default function getData(propName: string, mapPropsToQuery: (props: any) => Query | Query[]): any;
