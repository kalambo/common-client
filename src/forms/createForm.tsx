import * as React from 'react';
import { css, Div, Txt } from 'elmnt';
import { branch, Comp, compose, map, render, restyle } from 'mishmash';

import createForm, { FormProps } from '../generic/createForm';

import FieldBase from './Field';
import Question from './Question';

const Column = map(
  restyle([
    ['mergeKeys', 'column'],
    ['filter', ...css.groups.text],
    ['merge', { padding: '8px 15px' }],
  ]),
)(Txt);

export default (container, blockProps, blockHOC, fieldHOC, style, admin) => {
  const Field = fieldHOC(FieldBase);
  return createForm(
    container,
    [...blockProps, 'text', 'prompt', 'vertical', 'bar', 'view'],
    compose(
      blockHOC,
      map(({ fields, attempted, ...props }) => ({
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
      })),
      render(({ next, ...props }) => (
        <Question {...props} style={style}>
          {next()}
        </Question>
      )),
      branch(
        ({ fields }) => fields.length > 1,
        render(
          ({ fields, bar }) =>
            bar ? (
              <div>
                <Div style={{ layout: 'bar', width: '100%' }}>
                  <div style={{ width: '50%', paddingRight: 5 }}>
                    <Field {...fields[0]} style={fields[0].style} />
                  </div>
                  <div style={{ width: '50%', paddingLeft: 5 }}>
                    <Field {...fields[1]} style={fields[1].style} />
                  </div>
                </Div>
              </div>
            ) : fields[0].style.layout === 'table' ? (
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td />
                    {(fields[0].labels || fields[0].options).map(l => (
                      <td style={{ verticalAlign: 'middle' }} key={l}>
                        <Column style={style}>{l}</Column>
                      </td>
                    ))}
                  </tr>
                  {fields.map((field, i) => (
                    <Field
                      {...field}
                      labels={field.options.map(() => '')}
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
        ),
        map(({ fields }) => fields[0]),
      ),
    )(Field),
  ) as Comp<FormProps>;
};
