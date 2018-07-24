import { Rgo, Scalar } from 'rgo';
export declare type Obj<T = any> = {
    [key: string]: T;
};
export declare const noUndef: (v: any) => any;
export declare const getValueString: (value: any, scalar: Scalar) => string;
export declare const root: Global;
declare global {
    interface Window {
        rgo: Rgo;
    }
    interface Global {
        rgo: Rgo;
    }
}
declare global {
    namespace NodeJS {
        interface Global {
            rgo: Rgo;
        }
    }
}
