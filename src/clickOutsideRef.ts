export default onClickOutside => {
  let elem;
  let stopClick = false;
  const downListener = e => {
    if (!(elem && (elem === e.target || elem.contains(e.target)))) {
      if (onClickOutside()) {
        e.stopPropagation();
        stopClick = true;
      }
    }
  };
  const upListener = e => {
    if (stopClick) {
      e.stopPropagation();
      setTimeout(() => (stopClick = false));
    }
  };
  const clickListener = e => {
    if (stopClick) {
      e.stopPropagation();
      setTimeout(() => (stopClick = false));
    }
  };
  return Object.assign(
    e => {
      elem = e;
      if (typeof document !== 'undefined') {
        if (elem) {
          document.addEventListener('mousedown', downListener, true);
          document.addEventListener('mouseup', upListener, true);
          document.addEventListener('click', clickListener, true);
        } else {
          document.removeEventListener('mousedown', downListener, true);
          document.removeEventListener('mouseup', upListener, true);
          document.removeEventListener('click', clickListener, true);
        }
      }
    },
    { noCache: true },
  );
};
