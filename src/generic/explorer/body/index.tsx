import * as React from 'react';
import * as ReactDOM from 'react-dom';
import m, { isolate } from 'mishmash';
import { root } from 'common';
import { css } from 'elmnt';
import * as deepEqual from 'deep-equal';

import d3 from './d3';
import dataToRows from './dataToRows';

export default m()
  .style({
    base: [
      ['mergeKeys', 'data'],
      ['defaults', { fontStyle: 'normal', fontWeight: 'normal' }],
      [
        'scale',
        {
          paddingTop: { paddingTop: 1, fontSize: 0.5, lineHeight: -0.5 },
          paddingBottom: {
            paddingBottom: 1,
            fontSize: 0.5,
            lineHeight: -0.5,
          },
        },
      ],
      [
        'filter',
        ...css.groups.text,
        'padding',
        'border',
        'background',
        'maxWidth',
      ],
      [
        'merge',
        {
          position: 'relative',
          verticalAlign: 'top',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        },
      ],
    ],
    input: [
      ['mergeKeys', 'data', 'input'],
      ['scale', { maxWidth: { maxWidth: 1, borderLeftWidth: 1 } }],
      ['merge', { zIndex: 200 }],
    ],
  })
  .style({
    base: {
      null: [['mergeKeys', 'null']],
      empty: [['mergeKeys', 'empty']],
      changed: [['mergeKeys', 'changed']],
    },
  })
  .enhance(({ firstProps, onProps, setState }) => {
    firstProps.context.store.watch(
      'initial',
      (initial = {}) => setState({ initial }),
      onProps,
    );
    return ({ context, query, data, style }, { initial }) => ({
      context,
      dataRows: dataToRows(context, query, data),
      style,
      initial,
    });
  })(
  isolate((elem, firstProps, onProps) => {
    const Input = firstProps.context.input;

    const startEditing = (key, value) => {
      firstProps.context.store.set('editing', { key, value });
      firstProps.context.store.update('initial', (initial = {}) => ({
        ...initial,
        ...(initial[key] === undefined ? { [key]: value } : {}),
      }));
    };
    const stopEditing = invalid => {
      const { key, value } = firstProps.context.store.get('editing');
      firstProps.context.store.set('editing', {});
      firstProps.context.store.update('initial', ({ [key]: v, ...initial }) => {
        if (deepEqual(v, value, { strict: true }) || invalid) {
          root.rgo.set({ key: key.split('.'), value: undefined });
          return initial;
        }
        root.rgo.set({ key: key.split('.'), value });
        return { ...initial, [key]: v };
      });
    };

    let inputRef = null;
    const unlisten = firstProps.context.store.listen(
      'editing',
      (editing = {} as any) => {
        if (editing.key) {
          const splitKey = editing.key.split('.');
          const elems = elem.querySelectorAll(`[data-key='${editing.key}']`);
          for (let i = 0; i < elems.length; i++) {
            if (elems[i] !== inputRef) {
              elems[i].textContent = firstProps.context.config.printValue(
                editing.value,
                (root.rgo.schema[splitKey[0]][splitKey[2]] as any).scalar,
              );
            }
          }
        }
      },
    );

    onProps(props => {
      if (props) {
        const editing = props.context.store.get('editing') || {};

        const rows = d3
          .select(elem)
          .selectAll('tr')
          .data([...props.dataRows]);

        rows
          .exit()
          .selectAll('td')
          .each(function() {
            ReactDOM.unmountComponentAtNode(this);
          });
        rows.exit().remove();

        const allRows = rows
          .enter()
          .append('tr')
          .merge(rows);

        const cells = allRows.selectAll('td').data(d => d);

        cells
          .exit()
          .each(function() {
            ReactDOM.unmountComponentAtNode(this);
          })
          .remove();

        const allCells = cells
          .enter()
          .append('td')
          .merge(cells)
          .datum(d => ({
            ...d,
            style:
              inputRef !== this && Object.keys(props.initial).includes(d.key)
                ? 'changed'
                : d.empty
                  ? 'empty'
                  : d.field.startsWith('#') || d.value === null
                    ? 'null'
                    : 'base',
          }))
          .style(d => props.style[d.style])
          .style(d => ({
            borderTopWidth:
              (!d.first ? 1 : 0) * props.style.base.borderTopWidth,
            borderBottomWidth: 0,
            borderLeftWidth:
              ((!d.firstCol && (d.field === '#1' ? 2 : 1)) || 0) *
              props.style.base.borderLeftWidth,
            borderRightWidth:
              ((!d.lastCol && d.field === '#2' && 1) || 0) *
              props.style.base.borderRightWidth,
          }))
          .attr('rowspan', d => d.span)
          .attr('data-key', d => d.key);

        allCells
          .filter(({ key }) => key)
          .style({ cursor: 'pointer' })
          .on('mouseenter', function(d) {
            const s = props.style[d.style];
            this.style.background =
              (s.hover && s.hover.background) || s.background;
          })
          .on('mouseleave', function(d) {
            this.style.background = props.style[d.style].background;
          })
          .on('dblclick', function({ key, value }) {
            startEditing(key, value);
            inputRef = this;
          })
          .each(function({ type, field, key, text }) {
            if (inputRef === this) {
              this.style.padding = null;
              ReactDOM.render(
                <Input
                  context={props.context}
                  dataKey={key.split('.')}
                  onBlur={invalid => {
                    stopEditing(invalid);
                    if (inputRef === this) inputRef = null;
                  }}
                  inputRef={elem => {
                    if (elem && inputRef === this) elem.focus();
                  }}
                  style={props.style.input}
                />,
                this,
              );
            } else {
              ReactDOM.unmountComponentAtNode(this);
              if (editing.key === key) {
                this.textContent = props.context.config.printValue(
                  editing.value,
                  (root.rgo.schema[type][field] as any).scalar,
                );
              } else {
                this.textContent = text;
              }
            }
          });

        allCells
          .filter(({ key }) => !key)
          .style({ cursor: null })
          .on('mouseenter', null)
          .on('mouseleave', null)
          .on('dblclick', null)
          .each(function({ text }) {
            ReactDOM.unmountComponentAtNode(this);
            this.textContent = text;
          });

        props.context.updateWidths();
      } else {
        unlisten();
        d3
          .select(elem)
          .selectAll('tr')
          .selectAll('td')
          .each(function() {
            ReactDOM.unmountComponentAtNode(this);
          });
      }
    });
  }, 'tbody'),
);
