import * as React from 'react';
import { css, Div, Txt } from 'elmnt';
import { map, omit, restyle } from 'mishmash';

import withWidth from '../withWidth';

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

export default withWidth(600)(
  ({
    text,
    prompt,
    vertical,
    view,
    fields,
    style,
    small = false,
    setWidthElem,
    children,
  }) =>
    text ? (
      <div ref={setWidthElem}>
        {vertical || small ? (
          <Div style={{ spacing: 10 }}>
            <Question style={style}>
              {text}
              {fields.some(f => !f.optional) && (
                <span style={style.required}>&nbsp;*</span>
              )}
            </Question>
            {prompt && <Prompt style={style}>{prompt}</Prompt>}
            {children}
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
                  (fields[0].options && fields[0].style.layout !== 'modal')
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
            {children}
          </Div>
        )}
      </div>
    ) : (
      children
    ),
);
