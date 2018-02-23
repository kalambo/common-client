import * as React from 'react';
import { css, Div, Txt } from 'elmnt';
import m, { Comp, omit } from 'mishmash';

import createForm, { FormProps } from '../generic/createForm';

import FieldBase from './Field';
import Question from './Question';

const Connect = m().style([
  ['filter', ...css.groups.text],
  ['merge', { textAlign: 'center', width: 30, margin: '0 -15px' }],
])(Txt);

const Column = m().style([
  ['mergeKeys', 'column'],
  ['filter', ...css.groups.text, 'padding'],
])(Txt);

export default (container, blockProps, blockHOC, fieldHOC, style, admin) => {
  const Field = fieldHOC(FieldBase);
  const RowField = m()
    .style(['alt'], alt => [['mergeKeys', { alt }]])
    .map(omit('alt'))(Field);
  return createForm(
    container,
    [...blockProps, 'text', 'prompt', 'vertical', 'connect', 'columns', 'view'],
    m()
      .merge(blockHOC)
      .map(({ fields, attempted, ...props }) => ({
        fields: fields.map(
          ({ scalar, isList, type: _, file, invalid, ...field }) => ({
            ...field,
            type: `${file ? 'file' : scalar || 'string'}${
              isList && field.index === undefined ? 'list' : ''
            }`,
            invalid: invalid && (admin || attempted),
            style: { ...style, ...field.style },
            view: props.view,
            admin,
          }),
        ),
        ...props,
        ...(admin ? { prompt: undefined, vertical: false } : {}),
      }))
      .render(({ next, ...props }) => (
        <Question {...props} style={style}>
          {next()}
        </Question>
      ))
      .render(
        ({ fields, connect, columns }) =>
          fields[0].style.layout === 'bar' ? (
            <div>
              <Div style={{ layout: 'bar', width: '100%' }}>
                <div style={{ width: '50%', paddingRight: connect ? 20 : 5 }}>
                  <Field {...fields[0]} />
                </div>
                {connect && (
                  <Connect style={fields[0].style}>{connect}</Connect>
                )}
                <div style={{ width: '50%', paddingLeft: connect ? 20 : 5 }}>
                  <Field {...fields[1]} />
                </div>
              </Div>
            </div>
          ) : fields[0].style.layout === 'table' ? (
            <table style={{ width: '100%' }}>
              <tbody>
                {columns && (
                  <tr>
                    <td />
                    {columns.map(c => (
                      <td style={{ verticalAlign: 'middle' }} key={c}>
                        <Column style={fields[0].style}>{c}</Column>
                      </td>
                    ))}
                  </tr>
                )}
                {fields.map((field, i) => (
                  <RowField
                    {...field}
                    alt={i % 2 === 0}
                    {...(columns
                      ? { labels: field.options.map(() => '') }
                      : {})}
                    key={i}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <Div style={{ spacing: 10 }}>
              {fields.map((field, i) => <Field {...field} key={i} />)}
            </Div>
          ),
      )(Field),
  ) as Comp<FormProps>;
};
