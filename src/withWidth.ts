import m, { watchSize } from 'mishmash';
import * as memoize from 'fast-memoize';

export default memoize(toggleWidth =>
  m.do(
    watchSize(
      'small',
      'setWidthElem',
      ({ width }) => width && width <= toggleWidth,
    ),
  ),
);
