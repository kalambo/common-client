import * as React from 'react';
import { css, Div, Icon, Txt } from 'elmnt';
import m, { watchHover } from 'mishmash';
import { root } from 'common';

import download from '../download';

import jsonUrl from './jsonUrl';
import icons from './icons';

const Link = m()
  .enhance(watchHover)
  .style(['isHovered'], isHovered => [
    ['mergeKeys', { link: true, hover: isHovered }],
    ['filter', ...css.groups.text, 'padding', 'background'],
    ['scale', { paddingLeft: 2, paddingRight: 2 }],
    [
      'merge',
      {
        float: 'left',
        display: 'inline-block',
        verticalAlign: 'top',
        textAlign: 'center',
        userSelect: 'none',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        cursor: 'pointer',
      },
    ],
  ])(({ text, onClick, hoverProps, style }) => (
  <Txt onClick={onClick} {...hoverProps} style={style}>
    {text}
  </Txt>
));

const Button = m()
  .enhance(watchHover)
  .style(['isHovered', 'save'], (isHovered, save) => [
    ['mergeKeys', { button: true, hover: isHovered, cancel: !save }],
    [
      'scale',
      {
        fontSize: { fontSize: 1, borderTopWidth: 2, borderBottomWidth: 2 },
        spacing: { fontSize: 0.75 },
        margin: { borderWidth: -2 },
        ...(save ? { paddingLeft: 2.5, paddingRight: 2.5 } : {}),
      },
    ],
    [
      'merge',
      { layout: 'bar', float: 'right', cursor: 'pointer', border: 'none' },
    ],
  ])
  .style({
    div: [['filter', ...css.groups.box, ...css.groups.other]],
    text: [['filter', ...css.groups.text]],
  })(({ save, onClick, hoverProps, style }) => (
  <Div onClick={onClick} {...hoverProps} style={style.div}>
    {save && <Txt style={style.text}>Save</Txt>}
    <Icon {...icons[save ? 'tick' : 'cross']} style={style.text} />
  </Div>
));

export default m()
  .style({
    base: null,
    div: [
      ['filter', 'height', 'background', 'border'],
      ['scale', { borderWidth: 2 }],
      [
        'merge',
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
        },
      ],
    ],
  })
  .enhance(({ firstProps, onProps, setState, methods }) => {
    firstProps.context.store.watch(
      'initial',
      (initial = {}) => setState({ editing: Object.keys(initial).length > 0 }),
      onProps,
    );
    const clear = () => {
      root.rgo.set(
        ...Object.keys(firstProps.context.store.get('initial') || {}).map(
          k => ({
            key: k.split('.') as [string, string, string],
            value: undefined,
          }),
        ),
      );
      firstProps.context.store.set('initial', {});
    };
    return (props, state) => ({
      ...props,
      ...state,
      ...methods({
        save: async () => {
          try {
            await root.rgo.commit(
              ...(Object.keys(
                firstProps.context.store.get('initial') || {},
              ).map(k => k.split('.')) as [string, string, string][]),
            );
            firstProps.context.store.set('initial', {});
          } catch (error) {}
        },
        clear,
        reset: () => {
          clear();
          firstProps.context.reset();
        },
        permalink: () => {
          window.open(
            `${firstProps.context.permalink}?${jsonUrl.stringify(props.query)}`,
          );
        },
        download: () => {
          download(
            props.context.config,
            props.context.types,
            props.query,
            props.data,
          );
        },
      }),
    });
  })(({ reset, download, permalink, save, clear, editing, style }) => (
  <div style={style.div}>
    <Link text="Reset" onClick={reset} style={style.base} />
    <Link text="Download" onClick={download} style={style.base} />
    <Link text="Permalink" onClick={permalink} style={style.base} />
    {editing && (
      <>
        <Button save onClick={save} style={style.base} />
        <Button onClick={clear} style={style.base} />
      </>
    )}
  </div>
));
