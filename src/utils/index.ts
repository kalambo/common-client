export { default as clickOutsideRef } from './clickOutsideRef';
export { default as debug } from './debug';
export { default as getValueString } from './getValueString';
export { default as resizeRef } from './resizeRef';
export { default as restyle } from './restyle';
export { default as root } from './root';
export { watchFocus, watchHover } from './watchStates';
export { default as withWidth } from './withWidth';

export type Obj<T = any> = { [key: string]: T };

export const noUndef = (v: any) => (v === undefined ? null : v);
