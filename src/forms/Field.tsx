import * as React from 'react';
import { css, Div, Hover, Input, Txt } from 'elmnt';
import r from 'refluent';
import { getValueString, noUndef } from 'common';

import getData from '../generic/getData';
import { branch, restyle } from '../utils';

export default fileServer => {
  const FileButton = r
    .yield(({ value, next }) => (value ? next() : null))
    .do(restyle(style => style.mergeKeys('button').merge({ width: '100%' })))
    .yield(({ value, style }) => (
      <a
        href={`${fileServer}/storage/file/${value.split(':')[0]}`}
        target="_blank"
      >
        <Hover style={{ ...style, fontSize: 15, padding: 8 }}>
          {({ hoverProps, style }) => (
            <Txt {...hoverProps} style={style}>
              View file
            </Txt>
          )}
        </Hover>
      </a>
    ));
  return r
    .yield(
      branch(
        ({ index }) => index !== undefined,
        r.do('value', 'onChange', 'index', (value, onChange, index) => ({
          value: (value && value[index]) || null,
          onChange: indexValue => {
            const newValue = [
              ...[...new Array(index)].map((_, i) =>
                noUndef(value && value[i]),
              ),
              indexValue,
              ...(value || []).slice(index + 1).map(noUndef),
            ];
            onChange(newValue.some(v => v !== null) ? newValue : null);
          },
        })),
      ),
    )
    .yield(
      branch(
        'view',
        r
          .do(restyle(style => style.filter(...css.groups.text)))
          .yield(({ type, value, style }) => (
            <Txt style={style}>{getValueString(value, type)}</Txt>
          )),
      ),
    )
    .yield(
      branch(
        ({ type, admin }) => type === 'file' && admin,
        ({ value, style, next }) => (
          <div style={{ width: '100%' }}>
            <Div style={{ spacing: 40, layout: 'bar', width: '100%' }}>
              <div style={{ width: 150 }}>
                <FileButton value={value} style={style} />
              </div>
              {next()}
            </Div>
          </div>
        ),
      ),
    )
    .yield(
      branch(
        ({ type, options, admin }) =>
          admin && !type.endsWith('list') && Array.isArray(options),
        r.do('options', 'labels', (options, labels) => ({
          options:
            options && (!options.includes(null) ? [...options, null] : options),
          labels:
            labels &&
            (!options.includes(null) ? [...labels, '-- None --'] : labels),
        })),
      ),
    )
    .yield(
      branch(
        'relation',
        r
          .do(
            getData(({ relation, filter, sort, label }) => ({
              name: relation,
              filter,
              sort,
              fields: [
                'id',
                ...(Array.isArray(label)
                  ? label.filter(l => l.startsWith('$')).map(l => l.slice(1))
                  : [label]),
              ],
            })),
          )
          .do('relation', 'label', 'data', (relation, label, data) => ({
            options: data ? data[relation].map(d => d.id) : [],
            labels: data
              ? data[relation].map(
                  d =>
                    Array.isArray(label)
                      ? label
                          .map(l => (l.startsWith('$') ? d[l.slice(1)] : l))
                          .join('')
                      : d[label],
                )
              : [],
          })),
      ),
    )
    .yield(
      branch(
        'other',
        r
          .do('value', 'options', (value, options) => ({
            otherOpen: value !== null && !options.includes(value),
          }))
          .do('onChange', 'other', (onChange, other, push) => ({
            onBaseChange: value => {
              if (value === other) {
                push({ otherOpen: true });
                onChange(null);
              } else {
                push({ otherOpen: false });
                onChange(value);
              }
            },
          }))
          .yield(
            ({ value, options, other, otherOpen, onBaseChange, ...props }) => (
              <Div style={{ spacing: 10 }}>
                <Input
                  {...props}
                  value={otherOpen ? other : value}
                  onChange={onBaseChange}
                  options={[...options, other]}
                />
                {otherOpen && (
                  <Input
                    {...props}
                    value={value}
                    placeholder="Please specify"
                  />
                )}
              </Div>
            ),
          ),
      ),
    )
    .yield(Input);
};
