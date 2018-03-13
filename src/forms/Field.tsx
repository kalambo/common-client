import * as React from 'react';
import { css, Div, Hover, Input, Txt } from 'elmnt';
import m from 'mishmash';
import { getValueString, noUndef } from 'common';
import st from 'style-transform';

import getData from '../generic/getData';

export default fileServer => {
  const FileButton = m
    .yield(({ value, next }) => (value ? next() : null))
    .merge('style', style => ({
      style: st(style)
        .mergeKeys('button')
        .merge({ width: '100%' }),
    }))(({ value, style }) => (
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
  return m
    .doIf(
      ({ index }) => index !== undefined,
      m.merge('value', 'onChange', 'index', (value, onChange, index) => ({
        value: (value && value[index]) || null,
        onChange: indexValue => {
          const newValue = [
            ...[...new Array(index)].map((_, i) => noUndef(value && value[i])),
            indexValue,
            ...(value || []).slice(index + 1).map(noUndef),
          ];
          onChange(newValue.some(v => v !== null) ? newValue : null);
        },
      })),
    )
    .doIf(
      'view',
      m
        .merge('style', style => ({
          style: st(style).filter(...css.groups.text),
        }))
        .yield(({ type, value, style }) => (
          <Txt style={style}>{getValueString(value, type)}</Txt>
        )),
    )
    .doIf(
      ({ type, admin }) => type === 'file' && admin,
      m.yield(({ value, style, next }) => (
        <div style={{ width: '100%' }}>
          <Div style={{ spacing: 40, layout: 'bar', width: '100%' }}>
            <div style={{ width: 150 }}>
              <FileButton value={value} style={style} />
            </div>
            {next()}
          </Div>
        </div>
      )),
    )
    .doIf(
      ({ type, options, admin }) =>
        admin && !type.endsWith('list') && Array.isArray(options),
      m.merge('options', 'labels', (options, labels) => ({
        options:
          options && (!options.includes(null) ? [...options, null] : options),
        labels:
          labels &&
          (!options.includes(null) ? [...labels, '-- None --'] : labels),
      })),
    )
    .doIf(
      'relation',
      m
        .do(
          getData(({ relation, filter, sort, label }) => ({
            name: relation,
            filter,
            sort,
            fields: ['id', ...(Array.isArray(label) ? label[0] : [label])],
          })),
        )
        .merge('relation', 'label', 'data', (relation, label, data) => ({
          options: data ? data[relation].map(d => d.id) : [],
          labels: data
            ? data[relation].map(
                d =>
                  Array.isArray(label)
                    ? label[1](...label[0].map(k => d[k]))
                    : d[label],
              )
            : [],
        })),
    )
    .doIf(
      'other',
      m
        .merge('value', 'options', (value, options) => ({
          otherOpen: value !== null && !options.includes(value),
        }))
        .merge('onChange', 'other', (onChange, other, push) => ({
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
                <Input {...props} value={value} placeholder="Please specify" />
              )}
            </Div>
          ),
        ),
    )(Input);
};
