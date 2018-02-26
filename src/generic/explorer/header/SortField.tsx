import * as React from 'react';
import { Icon } from 'elmnt';
import m from 'mishmash';

import icons from '../icons';

export default m
  .map(({ path, ...props }) => ({
    ...props,
    onMouseMove: () => props.context.setActive({ type: 'sort', path }),
    onMouseLeave: () => props.context.setActive(null),
    onClick: () => props.context.query.sort(path),
  }))
  .cache('onMouseMove', 'onMouseLeave', 'onClick')(
  ({ sort, active, onMouseMove, onMouseLeave, onClick, style }) => (
    <>
      {(sort || active) && (
        <Icon
          {...icons[sort === 'asc' ? 'up' : sort === 'desc' ? 'down' : '']}
          style={{
            ...style.icon,
            position: 'absolute',
            left: '50%',
            marginLeft: -style.icon.radius,
            top: -style.icon.radius,
          }}
        />
      )}
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onClick}
        style={{
          position: 'absolute',
          top: -style.icon.radius,
          left: 0,
          right: 0,
          bottom: 0,
          cursor: 'pointer',
          // background: 'rgba(0,0,255,0.1)',
        }}
      />
    </>
  ),
);
