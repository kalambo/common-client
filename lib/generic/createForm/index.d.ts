/// <reference types="react" />
import * as React from 'react';
import { Comp } from 'mishmash';
import { Obj } from 'common';
export interface FormProps {
    objects?: Obj<{
        type: string;
        id?: string;
        filter?: string | any[];
        initial?: Obj;
    }>;
    blocks: any[][];
    onCommit?: (values: any) => Obj | void | Promise<Obj | void>;
    onError?: (values: any) => Obj | void | Promise<Obj | void>;
    onSubmit?: (values: any) => Obj | void | Promise<Obj | void>;
}
export default function createForm<T = {}>(container: Comp<{
    blocks: React.ReactElement<any>[][];
    setHeightElem: (elem: HTMLElement) => null;
    height: number | null;
    invalid: boolean;
    attempted: boolean;
    submit: () => Promise<void>;
    [key: string]: any;
}>, blockProps: string[], block: Comp): Comp<FormProps & T>;
