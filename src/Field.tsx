import * as React from 'react';
import { css, Div, Input, Txt } from 'elmnt';
import {
  branch,
  compose,
  map,
  render,
  restyle,
  withHover,
  Wrap,
} from 'mishmash';
import { getValueString } from 'common';
import st from 'style-transform';

const FileButton = compose(
  branch(({ value }) => !value, render()),
  map(restyle([['mergeKeys', 'button'], ['merge', { width: '100%' }]])),
)(({ value, style }) => (
  <a
    href={`${process.env.DATA_URL!}/storage/file/${value.split(':')[0]}`}
    target="_blank"
  >
    <Wrap hoc={withHover}>
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
    </Wrap>
  </a>
));

export default compose(
  branch(
    ({ type, admin }) => type === 'file' && admin,
    render(({ value, style, next }) => (
      <div style={{ width: '100%' }}>
        <Div style={{ spacing: 40, layout: 'bar', width: '100%' }}>
          <div style={{ width: 150 }}>
            <FileButton value={value} style={style} />
          </div>
          {next()}
        </Div>
      </div>
    )),
  ),
  branch(
    ({ type, options, admin }) =>
      admin && !type.endsWith('list') && Array.isArray(options),
    map(({ options, labels, ...props }) => ({
      ...props,
      options:
        options && (!options.includes(null) ? [...options, null] : options),
      labels:
        labels &&
        (!options.includes(null) ? [...labels, '-- None --'] : labels),
    })),
  ),
  branch(
    ({ view }) => view,
    compose(
      map(restyle([['filter', ...css.groups.text]])),
      render(({ type, value, style }) => (
        <Txt style={style}>{getValueString(value, type)}</Txt>
      )),
    ),
  ),
)(Input);
