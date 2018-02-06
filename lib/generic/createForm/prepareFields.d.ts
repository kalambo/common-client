import { Obj } from 'common';
export declare const getFieldKey: (objects: Obj<any>, key: string) => [string, string, string];
declare const _default: (blockProps: any, configObjects: {} | undefined, blocks: any, stores: any) => Promise<{
    objects: {
        [key: string]: any;
    };
    blocks: any;
    fields: any[];
}>;
export default _default;
