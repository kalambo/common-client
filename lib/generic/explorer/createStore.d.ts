declare const _default: () => {
    get: (key: any) => any;
    set: (key: any, value?: any) => void;
    update: (key: any, map: (v: any) => any) => void;
    listen: (key: any, listener: any) => () => any;
    watch: (key: any, listener: any, onProps: any, firstProps: any) => void;
};
export default _default;
