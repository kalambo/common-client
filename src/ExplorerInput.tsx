import * as React from 'react';
import m, { restyle } from 'mishmash';
import { Input } from 'elmnt';
import { isValid, root } from 'common';

export default m
  .map(({ dataKey, ...props }) => {
    const { meta = {}, ...field } = root.rgo.schema[dataKey[0]][dataKey[2]];
    const rules = {
      ...field,
      ...meta,
      ...((props.context.meta[dataKey[0]] &&
        props.context.meta[dataKey[0]][dataKey[2]]) ||
        {}),
      optional: true,
    };
    const { scalar, isList, file, ...info } = rules;
    return {
      ...props,
      ...info,
      type: `${file ? 'file' : scalar || 'string'}${isList ? 'list' : ''}`,
      ...(!isList && Array.isArray(info.options)
        ? {
            options:
              info.options &&
              (!info.options.includes(null)
                ? [...info.options, null]
                : info.options),
            labels:
              info.labels &&
              (!info.options.includes(null)
                ? [...info.labels, '-- None --']
                : info.labels),
          }
        : {}),
      rules,
    };
  })
  .map(
    restyle(({ type, options }) => ({
      margin: [
        [
          'scale',
          {
            margin: {
              borderWidth: -1,
              ...(type === 'boolean' ? { padding: 0.6 } : {}),
            },
          },
        ],
        ['filter', 'margin'],
      ],
      fill: [
        [
          'scale',
          {
            top: {
              borderTopWidth: -1,
              ...(type === 'boolean' ? { paddingTop: 0.6 } : {}),
            },
            right: {
              borderRightWidth: -1,
              ...(type === 'boolean' ? { paddingRight: 0.6 } : {}),
            },
            bottom: {
              borderBottomWidth: -1,
              ...(type === 'boolean' ? { paddingBottom: 0.6 } : {}),
            },
            left: {
              borderLeftWidth: -1,
              ...(type === 'boolean' ? { paddingLeft: 0.6 } : {}),
            },
          },
        ],
        ['filter', 'top', 'right', 'bottom', 'left'],
        ['merge', { position: 'absolute' }],
      ],
      input: Array.isArray(options) && [['merge', { layout: 'modal' }]],
    })),
  )
  .stream(({ initial, observe, push }) => {
    initial.context.store.watch(
      'editing',
      (editing = {}) => push({ editing }),
      observe,
    );
    const onChange = value =>
      initial.context.store.update('editing', v => ({ ...v, value }));
    const onTextChange = text => {
      push({ text });
      setTimeout(() => initial.context.updateWidths());
    };
    let lastValue = initial.context.store.get('editing').value;
    return ({ rules, ...props }, { editing, text }) => {
      const value =
        Object.keys(editing).length > 0
          ? (lastValue = editing.value)
          : lastValue;
      const invalid = !isValid(rules, value, {});
      return {
        ...props,
        value,
        onChange,
        invalid,
        text,
        onTextChange,
        onBlur: () => props.onBlur(invalid),
        onKeyDown: e =>
          (e.keyCode === 13 || e.keyCode === 27) && props.onBlur(invalid),
      };
    };
  })(
  ({
    context: _,
    value,
    onChange,
    text,
    onTextChange,
    onBlur,
    onKeyDown,
    inputRef,
    style,
    ...props
  }) => (
    <div onKeyDown={onKeyDown}>
      <Input
        value={['int', 'float', 'date'].includes(props.type) ? text : value}
        onChange={onChange}
        style={{ ...style.input, ...style.margin }}
        spellCheck={false}
        {...props}
        {...(['int', 'float', 'date'].includes(props.type)
          ? { type: 'string' }
          : {})}
        {...(props.type === 'date' ? { iconRight: 'tick' } : {})}
      />
      <Input
        value={value}
        onChange={onChange}
        onTextChange={onTextChange}
        style={{ ...style.input, ...style.fill }}
        spellCheck={false}
        onBlur={onBlur}
        ref={inputRef}
        {...props}
      />
    </div>
  ),
);
