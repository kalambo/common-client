import * as React from 'react';
import { branch, compose, enclose, map, render, restyle } from 'mishmash';
import { css, Div, Mark, Txt } from 'elmnt';

import getData from '../generic/getData';
import Spinner from '../components/Spinner';

import Filter from './Filter';
import Link from './Link';

const joinFilters = (...filters) => {
  const f = filters.filter(f => f);
  if (f.length === 0) return undefined;
  if (f.length === 1) return f[0];
  return ['AND', ...f];
};

export default compose(
  map(
    restyle({
      base: null,
      spinner: [['mergeKeys', 'spinner']],
      header: [['mergeKeys', 'header']],
      columnCell: [
        ['mergeKeys', 'column'],
        ['filter', ...css.groups.box, ...css.groups.other],
        ['expandFor', 'paddingLeft', 'borderTopLeftRadius'],
      ],
      columnText: [['mergeKeys', 'column'], ['filter', ...css.groups.text]],
      link: [['mergeKeys', 'link'], ['merge', { position: 'relative' }]],
      filter: [['mergeKeys', 'filter']],
    }),
  ),
  enclose(({ setState }) => {
    setState({ filter: null });
    const setFilter = filter => setState({ filter });
    return (props, state) => ({ ...props, ...state, setFilter });
  }),
  render(({ rows, setFilter, style, inner }) => (
    <Div style={{ spacing: 15 }}>
      <Filter type={rows[0].name} onChange={setFilter} style={style.filter} />
      {inner()}
    </Div>
  )),
  getData(({ rows, filter }) => ({
    ...rows[0],
    filter: joinFilters(rows[0].filter, filter),
  })),
  branch(
    ({ data }) => !data,
    render(({ style }) => <Spinner style={style.spinner} />),
  ),
  map(({ rows, data, ...props }) => {
    const result = rows[1](data);
    return {
      ...props,
      rows: Array.isArray(result[0] && result[0][1]) ? result : [['', result]],
    };
  }),
)(({ path, columns, rows, style }) => (
  <table style={{ width: '100%' }}>
    <tbody>
      {rows.reduce(
        (res, [group, values], i) => [
          ...res,
          ...(group
            ? [
                <tr key={`${i}_0`}>
                  <td colSpan={columns.length} style={{ verticalAlign: 'top' }}>
                    <Mark style={style.header}>{group}</Mark>
                  </td>
                </tr>,
              ]
            : []),
          <tr key={`${i}_1`}>
            {['#', ...columns].map((c, j) => (
              <td
                style={{
                  ...style.columnCell,
                  ...(j !== 0
                    ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
                    : {}),
                  ...(j !== columns.length
                    ? { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
                    : { paddingRight: style.columnCell.paddingLeft }),
                }}
                key={c}
              >
                <Txt style={style.columnText}>{c}</Txt>
              </td>
            ))}
          </tr>,
          ...values.map((v, j) => (
            <Link
              path={path}
              values={v}
              index={j}
              style={style.link}
              key={`${i}_${j + 2}`}
            />
          )),
        ],
        [],
      )}
    </tbody>
  </table>
));
