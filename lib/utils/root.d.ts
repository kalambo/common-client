import { Rgo } from 'rgo';
declare const _default: Global;
export default _default;
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
