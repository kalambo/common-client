import * as React from 'react';
import { css, Div, Txt } from 'elmnt';
import r from 'refluent';

import createForm, { FormProps } from '../generic/createForm';
import { restyle } from '../utils';

import FieldBase from './Field';
import Question from './Question';

const Connect = r
  .do(
    restyle(style =>
      style
        .filter(...css.groups.text)
        .merge({ textAlign: 'center', width: 30, margin: '0 -15px' }),
    ),
  )
  .yield(Txt);

const Column = r
  .do(
    restyle(style =>
      style.mergeKeys('column').filter(...css.groups.text, 'padding'),
    ),
  )
  .yield(Txt);

const ErrorMessage = r
  .do(
    restyle(style =>
      style.mergeKeys('errorMessage').filter(...css.groups.text),
    ),
  )
  .yield(Txt);

export default function<T>(
  container,
  blockProps,
  blockComp,
  fieldComp,
  style,
  admin,
  fileServer = process.env.DATA_URL,
) {
  const Field = r.yield(fieldComp).yield(FieldBase(fileServer));
  const RowField = r
    .do(restyle('alt', (alt, style) => style.mergeKeys({ alt })))
    .do(() => ({ alt: undefined }))
    .yield(Field);
  return createForm(
    container,
    [
      ...blockProps,
      'text',
      'prompt',
      'errorMessage',
      'vertical',
      'connect',
      'columns',
      'view',
    ],
    r
      .yield(blockComp)
      .do('fields', 'attempted', 'view', (fields, attempted, view) => ({
        fields: fields.map(
          ({ scalar, isList, type, file, invalid, ...field }) => ({
            ...field,
            type: `${file ? 'file' : scalar || 'string'}${
              isList && field.index === undefined ? 'list' : ''
            }`,
            relation: type,
            invalid: invalid && (admin || attempted),
            style: { ...style, ...field.style },
            view,
            admin,
          }),
        ),
        ...(admin ? { prompt: undefined, vertical: false } : {}),
        attempted: undefined,
      }))
      .yield(({ next, ...props }) => (
        <Question {...props} style={style}>
          {next()}
        </Question>
      ))
      .yield(
        ({ errorMessage, fields, next }) =>
          errorMessage ? (
            <Div style={{ spacing: 15 }}>
              {next()}
              {fields.some(f => f.invalid) && (
                <ErrorMessage style={style}>{errorMessage}</ErrorMessage>
              )}
            </Div>
          ) : (
            next()
          ),
      )
      .yield(
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
      )
      .yield(Field),
  ) as r<FormProps & T>;
}
