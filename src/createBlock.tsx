import * as React from 'react';
import { css, Div, Txt } from 'elmnt';
import { branch, Comp, compose, map, omit, render, restyle } from 'mishmash';

import FieldBase from './Field';

const Question = map(
  restyle([['mergeKeys', 'question'], ['filter', ...css.groups.text]]),
)(Txt);

const Prompt = map(
  restyle([['mergeKeys', 'prompt'], ['filter', ...css.groups.text]]),
)(Txt);

const Vertical = map(
  restyle(['view', 'small'], (view, small) => [
    [
      'scale',
      {
        paddingTop: view
          ? 0
          : { paddingTop: small ? 0.4 : 1, borderTopWidth: 1 },
      },
    ],
    ['filter', 'paddingTop'],
    ['merge', { spacing: 10 }],
  ]),
  omit('view', 'small'),
)(Div);

const Column = map(
  restyle([
    ['mergeKeys', 'column'],
    ['filter', ...css.groups.text],
    ['merge', { padding: '8px 15px' }],
  ]),
)(Txt);

export default (blockProps, blockHOC, style, admin, fieldHOC) => {
  const Field = fieldHOC(FieldBase);
  return [
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
      render(
        ({ text, prompt, vertical, view, fields, next }) =>
          text ? (
            <Div style={{ spacing: 10 }}>
              {vertical ? (
                <Div style={{ spacing: 10 }}>
                  <Question style={style}>
                    {text}
                    {fields.some(f => !f.optional) && (
                      <span style={style.required}>&nbsp;*</span>
                    )}
                  </Question>
                  {prompt && <Prompt style={style}>{prompt}</Prompt>}
                  {next()}
                </Div>
              ) : (
                <Div
                  style={{
                    layout: 'bar',
                    width: '100%',
                    verticalAlign: 'top',
                    spacing: 30,
                  }}
                >
                  <div style={{ width: 200 }}>
                    <Vertical
                      view={view}
                      small={
                        fields[0].type === 'boolean' ||
                        (fields[0].options &&
                          fields[0].style.layout !== 'modal')
                      }
                      style={style}
                    >
                      <Question style={style}>
                        {text}
                        {fields.some(f => !f.optional) && (
                          <span style={style.required}>&nbsp;*</span>
                        )}
                      </Question>
                      {prompt && <Prompt style={style}>{prompt}</Prompt>}
                    </Vertical>
                  </div>
                  {next()}
                </Div>
              )}
            </Div>
          ) : (
            next()
          ),
      ),
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
  ] as [string[], Comp];
};
