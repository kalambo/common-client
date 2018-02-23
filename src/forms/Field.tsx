import * as React from 'react';
import { css, Div, Input, Txt } from 'elmnt';
import m, { watchHover } from 'mishmash';
import { getValueString, noUndef } from 'common';
import st from 'style-transform';

import getData from '../generic/getData';

const Hover = m()
  .enhance(watchHover)
  .toComp();

export default fileServer => {
  const FileButton = m()
    .branch(({ value }) => !value, m().render())
    .style([['mergeKeys', 'button'], ['merge', { width: '100%' }]])(
    ({ value, style }) => (
      <a
        href={`${fileServer}/storage/file/${value.split(':')[0]}`}
        target="_blank"
      >
        <Hover>
          {({ isHovered: hover, hoverProps }) => (
            <Txt
              {...hoverProps}
              style={st({ ...style, fontSize: 15, padding: 8 }, [
                ['mergeKeys', { hover }],
              ])}
            >
              View file
            </Txt>
          )}
        </Hover>
      </a>
    ),
  );
  return m()
    .branch(
      ({ index }) => index !== undefined,
      m()
        .enhance(({ methods }) => props => ({
          ...props,
          ...methods({
            onChange: indexValue => {
              const newValue = [
                ...[...new Array(props.index)].map((_, i) =>
                  noUndef(props.value && props.value[i]),
                ),
                indexValue,
                ...(props.value || []).slice(props.index + 1).map(noUndef),
              ];
              props.onChange(newValue.some(v => v !== null) ? newValue : null);
            },
          }),
        }))
        .map(({ value, ...props }) => ({
          ...props,
          value: (value && value[props.index]) || null,
        })),
    )
    .branch(
      ({ view }) => view,
      m()
        .style([['filter', ...css.groups.text]])
        .render(({ type, value, style }) => (
          <Txt style={style}>{getValueString(value, type)}</Txt>
        )),
    )
    .branch(
      ({ type, admin }) => type === 'file' && admin,
      m().render(({ value, style, next }) => (
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
      m().map(({ options, labels, ...props }) => ({
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
      m()
        .merge(
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
      m()
        .enhance(({ firstProps, setState, methods }) => {
          setState({
            otherOpen:
              firstProps.value !== null &&
              !firstProps.options.includes(firstProps.value),
          });
          return (props, state) => ({
            ...props,
            ...state,
            ...methods({
              onBaseChange: value => {
                if (value === props.other) {
                  setState({ otherOpen: true });
                  props.onChange(null);
                } else {
                  setState({ otherOpen: false });
                  props.onChange(value);
                }
              },
            }),
          });
        })
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
