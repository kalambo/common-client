import { HOC, memoize, withSize } from 'mishmash';

export default memoize(
  toggleWidth =>
    withSize(
      'small',
      'setWidthElem',
      ({ width }) => width && width <= toggleWidth,
    ),
  (...args) => JSON.stringify(args),
) as (toggleWidth: number) => HOC;
