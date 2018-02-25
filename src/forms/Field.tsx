import * as React from 'react';
import { css, Div, Hover, Input, Txt } from 'elmnt';
import m, { restyle } from 'mishmash';
import { getValueString, noUndef } from 'common';

import getData from '../generic/getData';

export default fileServer => {
  const FileButton = m
    .branch(({ value }) => !value, m.render())
    .map(restyle([['mergeKeys', 'button'], ['merge', { width: '100%' }]]))(
    ({ value, style }) => (
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
    ),
  );
  return m
    .branch(
      ({ index }) => index !== undefined,
      m
        .map(({ value, ...props }) => ({
          ...props,
          value: (value && value[props.index]) || null,
          onChange: indexValue => {
            const newValue = [
              ...[...new Array(props.index)].map((_, i) =>
                noUndef(value && value[i]),
              ),
              indexValue,
              ...(value || []).slice(props.index + 1).map(noUndef),
            ];
            props.onChange(newValue.some(v => v !== null) ? newValue : null);
          },
        }))
        .cache('onChange'),
    )
    .branch(
      ({ view }) => view,
      m
        .map(restyle([['filter', ...css.groups.text]]))
        .render(({ type, value, style }) => (
          <Txt style={style}>{getValueString(value, type)}</Txt>
        )),
    )
    .branch(
      ({ type, admin }) => type === 'file' && admin,
      m.render(({ value, style, next }) => (
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
    .branch(
      ({ type, options, admin }) =>
        admin && !type.endsWith('list') && Array.isArray(options),
      m.map(({ options, labels, ...props }) => ({
        ...props,
        options:
          options && (!options.includes(null) ? [...options, null] : options),
        labels:
          labels &&
          (!options.includes(null) ? [...labels, '-- None --'] : labels),
      })),
    )
    .branch(
      ({ relation }) => relation,
      m
        .do(
          getData(({ relation, filter, sort, label }) => ({
            name: relation,
            filter,
            sort,
            fields: ['id', ...(Array.isArray(label) ? label[0] : [label])],
          })),
        )
        .map(props => ({
          ...props,
          options: props.data ? props.data[props.relation].map(d => d.id) : [],
          labels: props.data
            ? props.data[props.relation].map(
                d =>
                  Array.isArray(props.label)
                    ? props.label[1](...props.label[0].map(k => d[k]))
                    : d[props.label],
              )
            : [],
        })),
    )
    .branch(
      ({ other }) => other,
      m
        .stream(
          ({ initial, push }) =>
            push({
              otherOpen:
                initial.value !== null &&
                !initial.options.includes(initial.value),
            }) ||
            ((props, state) => ({
              ...props,
              ...state,
              onBaseChange: value => {
                if (value === props.other) {
                  push({ otherOpen: true });
                  props.onChange(null);
                } else {
                  push({ otherOpen: false });
                  props.onChange(value);
                }
              },
            })),
        )
        .cache('onBaseChange')
        .render(
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
