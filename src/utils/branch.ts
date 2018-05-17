const select = (selector, props) => {
  if (typeof selector === 'number') {
    return props[selector];
  }
  if (typeof selector === 'string') {
    return selector.split('.').reduce((res, k) => res && res[k], props);
  }
  return selector(props);
};

const Root = ({ next, children, ...props }) => {
  if (next) return next({ ...props, children });
  if (typeof children === 'function') return children(props);
  return children || null;
};

export default (test, pass, fail: any = Root) => props =>
  (select(test, props) ? pass : fail)(props);
