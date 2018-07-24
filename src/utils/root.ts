import { Rgo } from 'rgo';

export default (typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
      ? global
      : ({} as Window | Global));

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
