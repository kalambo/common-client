import * as React from 'react';
import { css, Div, Txt } from 'elmnt';
import r from 'refluent';

import restyle from '../restyle';
import withWidth from '../withWidth';

const Question = r
  .do(restyle(style => style.mergeKeys('question').filter(...css.groups.text)))
  .yield(Txt);

const Prompt = r
  .do(restyle(style => style.mergeKeys('prompt').filter(...css.groups.text)))
  .yield(Txt);

const Vertical = r
  .do(
    restyle('view', 'small', (view, small, style) =>
      style
        .scale({
          paddingTop: view
            ? 0
            : { paddingTop: small ? 0.4 : 1, borderTopWidth: 1 },
        })
        .filter('paddingTop')
        .merge({ spacing: 10 }),
    ),
  )
  .do(() => ({ view: undefined, small: undefined }))
  .yield(Div);

export default r.yield(withWidth(600)).yield(
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
