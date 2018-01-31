import * as React from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { Txt } from 'elmnt';
import { cssGroups, mapStyle, withHover } from 'mishmash';

export default compose<any, any>(
  withHover,
  mapStyle(['isHovered'], isHovered => [['mergeKeys', { hover: isHovered }]]),
  mapStyle({
    cell: [
      ['filter', ...cssGroups.box, ...cssGroups.other],
      ['expandFor', 'paddingLeft'],
    ],
    cellAlt: [
      ['mergeKeys', 'alt'],
      ['filter', ...cssGroups.box, ...cssGroups.other],
      ['expandFor', 'paddingLeft'],
    ],
    text: [['filter', ...cssGroups.text]],
    index: [['mergeKeys', 'index'], ['filter', ...cssGroups.text]],
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
