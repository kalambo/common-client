import * as React from 'react';
import {
  branch,
  compose,
  renderComponent,
  renderNothing,
  withProps,
} from 'recompose';
import { Div, Input, Txt } from 'elmnt';
import { cssGroups, Hover, mapStyle, renderLayer } from 'mishmash';
import { getValueString } from 'common';

const FileButton = compose<any, any>(
  branch(({ value }: any) => !value, renderNothing),
  mapStyle([['mergeKeys', 'button'], ['merge', { width: '100%' }]]),
)(({ value, style }) => (
  <a
    href={`${process.env.DATA_URL!}/storage/file/${value.split(':')[0]}`}
    target="_blank"
  >
    <Hover
      style={{
        ...style,
        fontSize: 15,
        padding: 8,
      }}
    >
      <Txt>View file</Txt>
    </Hover>
  </a>
));

export default compose<any, any>(
  branch(
    ({ type, admin }: any) => type === 'file' && admin,
    renderLayer(({ value, style, children }) => (
      <div style={{ width: '100%' }}>
        <Div style={{ spacing: 40, layout: 'bar', width: '100%' }}>
          <div style={{ width: 150 }}>
            <FileButton value={value} style={style} />
          </div>
          {children}
        </Div>
      </div>
    )),
  ),
  branch(
    ({ type, options, admin }: any) =>
      admin && !type.endsWith('list') && Array.isArray(options),
    withProps(({ options, labels }: any) => ({
      options:
        options && (!options.includes(null) ? [...options, null] : options),
      labels:
        labels &&
        (!options.includes(null) ? [...labels, '-- None --'] : labels),
    })),
  ),
  branch(
    ({ view }: any) => view,
    compose(
      mapStyle([['filter', ...cssGroups.text]]),
      renderComponent(({ type, value, style }: any) => (
        <Txt style={style}>{getValueString(value, type)}</Txt>
      )),
    ),
  ),
)(Input);
