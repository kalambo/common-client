import { ScalarField } from 'rgo';
declare const _default: {
    parseFilter: (filter: string, type: string) => any;
    printFilter: (filter: any[] | null, type: string) => any;
    parseValue: (value: string, field: ScalarField) => any;
    printValue: (value: any, field: ScalarField) => any;
};
export default _default;
