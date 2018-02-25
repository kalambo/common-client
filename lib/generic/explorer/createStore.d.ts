declare const _default: () => {
    get: (key: any) => any;
    set: (key: any, value?: any) => void;
    update: (key: any, map: (v: any) => any) => void;
    listen: (key: any, listener: any) => () => any;
    watch: (key: any, listener: any, observe: any, initial: any) => void;
};
export default _default;
