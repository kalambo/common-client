const select = (selector, props) => {
  if (typeof selector === 'number') {
    return props[selector];
  }
  if (typeof selector === 'string') {
    return selector.split('.').reduce((res, k) => res && res[k], props);
  }
  return selector(props);
};

export default (test, pass, fail: any = ({ next }) => next()) => props =>
  (select(test, props) ? pass : fail)(props);
