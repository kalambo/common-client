import * as React from 'react';
import { css, Icon, Input } from 'elmnt';
import m, { onClickOutside } from 'mishmash';
import st from 'style-transform';

import icons from '../icons';

export default m
  .merge('context', 'path', (context, path, push) => {
    const unlistens = [
      context.store.listen(`${path}_start`, (start = 1) => push({ start })),
      context.store.listen(`${path}_end`, (end = null) => push({ end })),
    ];
    return () => unlistens.forEach(u => u());
  })
  .merge(props$ => {
    let inputElem1;
    let inputElem2;
    let diff = -1 as number | null;
    props$('start', 'end', (start, end) => {
      if (diff === -1) diff = end ? end - start : null;
      return { invalid: start && end && start > end };
    });
    return {
      setInputElem1: e => (inputElem1 = e),
      setInputElem2: e => (inputElem2 = e),
      onChangeStart: v => {
        const { context, path, end } = props$();
        context.store.set(`${path}_start`, v);
        if (v && end) {
          context.store.set(`${path}_end`, Math.max(v + diff, 1));
        }
      },
      onChangeEnd: v => {
        const { context, path, start } = props$();
        context.store.set(`${path}_end`, v);
        diff = start && v ? v - start : null;
      },
      onMouseMove: () => {
        const { context, path } = props$();
        context.setActive({ type: 'limit', path: path });
      },
      onMouseLeave: () => {
        const { context } = props$();
        context.setActive(null);
      },
      onClick: () => {
        const { context, path } = props$();
        context.setActive({ type: 'limit', path: path }, true);
        inputElem1 && inputElem1.focus();
      },
      onClickOutside: () => {
        const { context, path, focused, $invalid, start, end } = props$();
        if (focused) {
          if (!$invalid) {
            if (!start) context.store.set(`${path}_start`, 1);
            if (end === 0) context.store.set(`${path}_end`, null);
            context.query.limit(path, start ? start - 1 : 0, end);
            context.setActive(null, true);
          }
          return true;
        }
      },
      onKeyDown: event => {
        const { context, path, focused, $invalid, start, end } = props$();
        if (focused && event.keyCode === 13) {
          if (!$invalid) {
            if (!start) context.store.set(`${path}_start`, 1);
            if (end === 0) context.store.set(`${path}_end`, null);
            context.query.limit(path, start ? start - 1 : 0, end);
            context.setActive(null, true);
            (document.activeElement as HTMLElement).blur();
          }
        }
      },
    };
  })
  .merge(
    'style',
    'active',
    'focused',
    'invalid',
    (style, active, focused, invalid) => {
      const input = st(style.base).mergeKeys({
        input: true,
        hover: active,
        focus: focused,
        invalid,
      });
      return {
        style: {
          ...style,
          input,
          div: st(input)
            .scale({ margin: { padding: -1 } })
            .filter('margin', ...(active && !focused ? ['background'] : []))
            .merge({ position: 'relative', zIndex: focused ? 30 : 6 }),
          text: st(input)
            .filter(
              ...css.groups.text,
              'padding',
              ...(active && !focused ? [] : ['background']),
            )
            .scale({ minWidth: { fontSize: 2 } })
            .merge({ display: 'inline-block', verticalAlign: 'top' }),
          arrow: st(input)
            .mergeKeys('connect')
            .scale({
              fontSize: 0.9,
              paddingTop: 0,
              paddingBottom: 0,
              minWidth: { fontSize: 2 },
            })
            .filter('fontSize', 'color', 'padding', 'minWidth'),
        },
      };
    },
  )
  .do(onClickOutside(props => props.onClickOutside(), 'setClickElem'))(
  ({
    live,
    start,
    end,
    onChangeStart,
    onChangeEnd,
    focused,
    onMouseMove,
    onMouseLeave,
    onClick,
    setClickElem,
    onKeyDown,
    setInputElem1,
    setInputElem2,
    style,
  }) => (
    <>
      <div onKeyDown={onKeyDown} style={style.div} ref={setClickElem}>
        <Input
          type="int"
          value={start}
          onChange={onChangeStart}
          style={style.text}
          ref={setInputElem1}
        />
        <Icon {...icons.down} style={style.arrow} />
        <Input
          type="int"
          value={end}
          onChange={onChangeEnd}
          style={style.text}
          ref={setInputElem2}
        />
      </div>
      {live &&
        !focused && (
          <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={{
              position: 'absolute',
              top: -style.base.borderTopWidth * 2 - style.icon.radius,
              right: -style.base.borderRightWidth,
              bottom: -style.base.borderBottomWidth * 2,
              left: -style.base.borderLeftWidth,
              zIndex: 6,
              cursor: 'pointer',
              // background: 'rgba(255,0,0,0.1)',
            }}
          />
        )}
    </>
  ),
);
