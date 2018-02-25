import * as React from 'react';
import { css, Txt } from 'elmnt';
import m, { restyle, watchHover } from 'mishmash';

import { Link } from '../router';

export default m
  .do(watchHover)
  .map(
    restyle(['isHovered'], isHovered => [['mergeKeys', { hover: isHovered }]]),
  )
  .map(
    restyle({
      cell: [
        ['filter', ...css.groups.box, ...css.groups.other],
        ['expandFor', 'paddingLeft'],
      ],
      cellAlt: [
        ['mergeKeys', 'alt'],
        ['filter', ...css.groups.box, ...css.groups.other],
        ['expandFor', 'paddingLeft'],
      ],
      text: [['filter', ...css.groups.text]],
      index: [['mergeKeys', 'index'], ['filter', ...css.groups.text]],
    }),
  )(({ path, values: [url, ...values], index, hoverProps, style }) => (
  <tr {...hoverProps} style={{ cursor: 'pointer' }}>
    {[`${index + 1}`, ...values].map((v, j) => (
      <td
        style={{
          ...(index % 2 === 0 ? style.cell : style.cellAlt),
          ...(j !== 0
            ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
            : {}),
          ...(j !== values.length
            ? { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
            : { paddingRight: style.cell.paddingLeft }),
        }}
        key={j}
      >
        <Txt style={j ? style.text : style.index}>{v}</Txt>
        <Link
          to={`${path}/${url}`}
          route
          style={{
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />
      </td>
    ))}
  </tr>
));
