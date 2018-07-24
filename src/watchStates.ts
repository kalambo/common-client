export const watchFocus = (props$, push) =>
  props$('tabIndex', 'onFocus', 'onBlur', (tabIndex = 0, onFocus, onBlur) => ({
    tabIndex: undefined,
    onFocus: undefined,
    onBlur: undefined,
    focusProps: {
      tabIndex,
      onFocus: e => push({ isFocused: true }) || (onFocus && onFocus(e)),
      onBlur: e => push({ isFocused: false }) || (onBlur && onBlur(e)),
    },
    isFocused: false,
  }));

export const watchHover = (props$, push) =>
  props$('onMouseMove', 'onMouseLeave', (onMouseMove, onMouseLeave) => ({
    onMouseMove: undefined,
    onMouseLeave: undefined,
    hoverProps: {
      onMouseMove: e =>
        push({ isHovered: true }) || (onMouseMove && onMouseMove(e)),
      onMouseLeave: e =>
        push({ isHovered: false }) || (onMouseLeave && onMouseLeave(e)),
    },
    isHovered: false,
  }));
