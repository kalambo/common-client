import * as React from 'react';
import m, { yieldLifted } from 'mishmash';
import st from 'style-transform';
import { Div, Hover, Input, Txt } from 'elmnt';
import { root } from 'common';
import * as debounce from 'lodash.debounce';
import * as memoize from 'fast-memoize';

import config from '../config';

const memoizeValue = memoize(x => x);

const getFieldHelp = field => {
  if (field.meta && field.meta.options) {
    return 'selection:\n' + field.meta.options.join('\n');
  }
  if (field.scalar === 'boolean') return 'true / false';
  if (field.scalar === 'int') return 'whole number';
  if (field.scalar === 'float') return 'decimal number';
  if (field.scalar === 'string') return 'text';
  return field.scalar;
};

const Help = m.merge('style', style => ({
  style: {
    base: style,
    title: st(style).mergeKeys('title'),
    subtitle: st(style).mergeKeys('title'),
    text: st(style).mergeKeys('text'),
    indent: st(style).mergeKeys('indent'),
    note: st(style).mergeKeys('note'),
    op: st(style).mergeKeys('op'),
    fields: st(style).mergeKeys('fields'),
  },
}))(({ type, toggleOpen, style }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'rgba(0,0,0,0.5)',
    }}
  >
    <div
      onClick={toggleOpen}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
    <div
      style={{
        position: 'relative',
        height: '100%',
        padding: 50,
        maxWidth: 700,
        margin: '0 auto',
      }}
    >
      <Div
        style={{
          height: ' 100%',
          background: 'white',
          boxShadow: '0 2px 20px 5px rgba(0,0,0,0.4)',
          borderRadius: 3,
          padding: 40,
          overflow: 'auto',
          spacing: 25,
        }}
      >
        <Txt style={style.title}>Filtering</Txt>
        <Txt style={style.text}>A basic filter is a rule in the format:</Txt>
        <Txt style={{ ...style.indent, paddingLeft: 40 }}>
          [field] [operation] [value]
        </Txt>
        <Txt style={style.text}>For example:</Txt>
        <Txt style={{ ...style.indent, paddingLeft: 40 }}>
          firstname = David
        </Txt>
        <Txt style={style.text}>
          Multiple of these basic filters can be combined together, using
          commas, 'OR', and brackets:
        </Txt>
        <Div style={{ spacing: 15 }}>
          <Txt style={{ ...style.indent, paddingLeft: 40 }}>
            firstname = David, (lastname = Smith OR sex = Male)
          </Txt>
          <Txt style={{ ...style.note, paddingLeft: 40 }}>
            (This filter will show records where firstname equals 'David', and
            either lastname equals 'Smith' or sex equals 'Male')
          </Txt>
        </Div>
        <Txt style={style.base}>
          Note: If the current filter is invalid the input will go red and the
          page will act as if no filter is entered.
        </Txt>
        <Txt style={style.text}>The available operations are:</Txt>
        <Div style={{ spacing: 10, paddingLeft: 40 }}>
          {[
            ['=', 'equal to'],
            ['!=', 'not equal to'],
            ['<', 'less than'],
            ['>', 'greater than'],
            ['<=', 'less than or equal to'],
            ['>=', 'greater than or equal to'],
          ].map(([op, label], i) => (
            <Div style={{ layout: 'bar', spacing: 10 }} key={i}>
              <Txt style={{ ...style.op, width: 40 }}>{op}</Txt>
              <Txt style={style.op}>{label}</Txt>
            </Div>
          ))}
        </Div>
        <Txt style={style.base}>
          Note: The last 4 operations are only valid for number and date fields.
        </Txt>
        <Div
          style={{
            spacing: 20,
            background: '#eee',
            borderRadius: 3,
            padding: 20,
          }}
        >
          <Txt style={style.subtitle}>Available fields</Txt>
          <Div style={{ spacing: 15 }}>
            {Object.keys(root.rgo.schema[type])
              .sort()
              .map((field, i) => (
                <Div
                  style={{
                    layout: 'bar',
                    spacing: 10,
                    verticalAlign: 'top',
                  }}
                  key={i}
                >
                  <Txt style={{ ...style.fields, width: 150 }} key={field}>
                    {field}
                  </Txt>
                  <Txt style={style.fields} key={field}>
                    {getFieldHelp(root.rgo.schema[type][field])}
                  </Txt>
                </Div>
              ))}
          </Div>
        </Div>
      </Div>
    </div>
  </div>
));

export default m
  .merge('style', style => ({
    style: {
      label: st(style).mergeKeys('label'),
      helpLabel: st(style).mergeKeys('helpLabel'),
      field: st(style).mergeKeys('field'),
      help: st(style).mergeKeys('help'),
    },
  }))
  .merge((_, push) => {
    push({
      schemaLoaded: false,
      isOpen: false,
      toggleIsOpen: () => push(({ isOpen }) => ({ isOpen: !isOpen })),
    });
    let mounted = true;
    root.rgo.query().then(() => mounted && push({ schemaLoaded: true }));
    return () => (mounted = false);
  })
  .merge('type', 'onChange', (type, onChange, push) => {
    const debounceChange = debounce(v => onChange(v), 1000);
    return {
      text: null,
      filter: null,
      setText: text => {
        const parsedValue = config.parseFilter(text, type);
        const filter = !parsedValue ? parsedValue : memoizeValue(parsedValue);
        push({ text, filter });
        debounceChange(filter);
      },
    };
  })
  .do(
    yieldLifted(
      'bounds',
      'setBoundsElem',
      ({ type, toggleOpen, style }) => (
        <Help type={type} toggleOpen={toggleOpen} style={style.help} />
      ),
      ({ isOpen, schemaLoaded }) => isOpen && schemaLoaded,
    ),
  )(({ text, setText, filter, toggleOpen, style }) => (
  <Div
    style={{
      layout: 'bar',
      spacing: 10,
      width: '100%',
      padding: 10,
      background: '#eee',
      borderRadius: 3,
    }}
  >
    <Txt style={style.label}>Filter:</Txt>
    <Input
      type="string"
      value={text}
      onChange={setText}
      style={style.field}
      spellCheck={false}
      invalid={text && !filter}
    />
    <div style={{ width: style.helpLabel.width }}>
      <Hover
        style={{
          ...style.helpLabel,
          cursor: 'pointer',
          textAlign: 'right',
          width: 'auto',
        }}
      >
        {({ hoverProps, style }) => (
          <Txt onClick={toggleOpen} {...hoverProps} style={style}>
            Open help
          </Txt>
        )}
      </Hover>
    </div>
  </Div>
));
