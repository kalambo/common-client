import m, { HOC, memoize, watchSize } from 'mishmash';

export default memoize(
  toggleWidth =>
    m().enhance(
      watchSize(
        'small',
        'setWidthElem',
        ({ width }) => width && width <= toggleWidth,
      ),
    ),
  (...args) => JSON.stringify(args),
) as (toggleWidth: number) => HOC;
