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
    onCommit?: (values: Obj) => Obj | void | Promise<Obj | void>;
    onError?: (values: Obj) => Obj | void | Promise<Obj | void>;
    onSubmit?: (values: Obj) => Obj | void | Promise<Obj | void>;
}
export default function createForm<T = {}>(container: Comp<{
    blocks: React.ReactElement<any>[][];
    HeightWrap: Comp;
    invalid: boolean;
    attempted: boolean;
    submit: () => Promise<void>;
    [key: string]: any;
}>, block: Comp | [string[], Comp]): React.ComponentClass<FormProps & T>;
