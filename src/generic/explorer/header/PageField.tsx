import * as React from 'react';
import { Icon } from 'elmnt';
import m from 'mishmash';

import icons from '../icons';

export default m
  .stream(({ initial, observe, push }) => {
    initial.context.store.watch(
      props => `${props.path}_start`,
      (start = 1) => push({ start }),
      observe,
      initial,
    );
    initial.context.store.watch(
      props => `${props.path}_end`,
      (end = null) => push({ end }),
      observe,
      initial,
    );
    return ({ path, ...props }, { start, end }) => ({
      show: props.up ? start && start > 1 && end : end,
      ...props,
      onMouseMove: () =>
        props.context.setActive({
          type: props.up ? 'pageup' : 'pagedown',
          path,
        }),
      onMouseLeave: () => props.context.setActive(null),
      onClick: () => {
        const move = props.up
          ? -Math.min(start - 1, end - (start || 1) + 1)
          : end - (start || 1) + 1;
        const newStart = (start || 1) + move;
        const newEnd = end + move;
        props.context.store.set(`${path}_start`, newStart);
        props.context.store.set(`${path}_end`, newEnd);
        props.context.query.limit(path, newStart - 1, newEnd);
      },
    });
  })
  .cache('onMouseMove', 'onMouseLeave', 'onClick')
  .branch(({ show }) => !show, m.render())(
  ({ up, active, onMouseMove, onMouseLeave, onClick, style }) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 21,
        ...(up
          ? { top: 0, height: style.base.paddingTop * 2.2 }
          : { bottom: 0, height: style.base.paddingBottom * 2.2 }),
      }}
    >
      {active && (
        <>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              left: 0,
              height: style.base.borderBottomWidth * 3,
              background: style.icon.background,
              ...(up ? { top: 0 } : { bottom: 0 }),
            }}
          />
          <Icon
            {...(up ? icons.up : icons.down)}
            style={{
              ...style.icon,
              position: 'absolute',
              left: '50%',
              marginLeft: -style.icon.radius,
              ...(up
                ? { top: style.base.borderTopWidth }
                : { bottom: style.base.borderBottomWidth }),
            }}
          />
        </>
      )}
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onClick}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          cursor: 'pointer',
          // background: 'rgba(255,0,255,0.1)',
        }}
      />
    </div>
  ),
);
