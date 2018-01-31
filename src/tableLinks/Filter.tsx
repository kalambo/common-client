import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import {
  combineState,
  Hover,
  mapStyle,
  memoizeObject,
  renderLifted,
} from 'mishmash';
import { Div, Input, Txt } from 'elmnt';
import { root } from 'common';
import * as debounce from 'lodash.debounce';

import parseFilter from './parseFilter';

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

const Help = mapStyle({
  base: null,
  title: [['mergeKeys', 'title']],
  subtitle: [['mergeKeys', 'title']],
  text: [['mergeKeys', 'text']],
  indent: [['mergeKeys', 'indent']],
  note: [['mergeKeys', 'note']],
  op: [['mergeKeys', 'op']],
  fields: [['mergeKeys', 'fields']],
})(({ type, toggleOpen, style }) => (
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

export default compose<any, any>(
  mapStyle({
    label: [['mergeKeys', 'label']],
    helpLabel: [['mergeKeys', 'helpLabel']],
    field: [['mergeKeys', 'field']],
    help: [['mergeKeys', 'help']],
  }),
  withState('text', 'setText', null),
  withState('filter', 'setFilter', null),
  withState('isOpen', 'setIsOpen', false),
  combineState(
    ({ initialProps: { onChange }, setState, onUnmount }) => {
      let debounceChange = debounce(onChange, 1000);
      let mounted = true;
      root.rgo.query().then(() => mounted && setState({ schemaLoaded: true }));
      onUnmount(() => (mounted = false));
      return (props, { schemaLoaded }) => ({
        ...props,
        onChange: debounceChange,
        schemaLoaded,
      });
    },
    { schemaLoaded: false },
  ),
  withHandlers({
    setText: ({ type, onChange, setText, setFilter }) => text => {
      setText(text);
      const parsedValue = parseFilter(text, type);
      const filter = !parsedValue ? parsedValue : memoizeObject(parsedValue);
      setFilter(filter);
      onChange(filter);
    },
    toggleOpen: ({ isOpen, setIsOpen }) => () => setIsOpen(!isOpen),
  } as any),
  renderLifted(
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
    <Hover
      style={{ ...style.helpLabel, cursor: 'pointer', textAlign: 'right' }}
    >
      <Txt onClick={toggleOpen}>Open help</Txt>
    </Hover>
  </Div>
));
