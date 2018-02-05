import * as React from 'react';
import {
  branch,
  Comp,
  compose,
  enclose,
  map,
  memoize,
  methodWrap,
  omit,
  pure,
  render,
} from 'mishmash';
import * as set from 'lodash.set';
import keysToObject from 'keys-to-object';
import { getId } from 'rgo';
import { Obj, root, transformValue } from 'common';

import createStores from './createStores';
import getState from './getState';
import prepareFields from './prepareFields';

export interface FormProps {
  objects?: Obj<{
    type: string;
    id?: string;
    filter?: string | any[];
    initial?: Obj;
  }>;
  blocks: any[][];
  onCommit?: (values: Obj) => Obj | void | Promise<Obj | void>;
  onError?: (values: Obj) => Obj | void | Promise<Obj | void>;
  onSubmit?: (values: Obj) => Obj | void | Promise<Obj | void>;
}
export default function createForm<T = {}>(
  container: Comp<{
    blocks: React.ReactElement<any>[][];
    HeightWrap: Comp;
    invalid: boolean;
    attempted: boolean;
    submit: () => Promise<void>;
    [key: string]: any;
  }>,
  block: Comp | [string[], Comp],
) {
  const Block = branch(
    ({ fields }) => fields,
    compose(
      getState,
      branch(({ state }) => !state, render()),
      map(({ stores, fields, state, ...props }) => ({
        ...props,
        fields: fields.map(({ key, initial: _, ...f }, i) => ({
          ...state[i],
          onChange: value =>
            stores[key.store].set([
              { key: key.key, value: transformValue(value, f.transform) },
            ]),
          ...f,
          field: key,
        })),
      })),
    ),
    map(omit('fields', 'stores', 'state')),
  )(Array.isArray(block) ? block[1] : block);

  return compose<FormProps & T>(
    map(({ objects, blocks, ...props }) => ({
      ...props,
      objects: memoize(objects),
      blocks: memoize(blocks),
    })),
    pure,
    enclose(
      ({ initialProps, onProps, setState }) => {
        const stores = createStores();

        let fields;
        let count = 0;
        const prepare = async props => {
          if (props) {
            const index = ++count;
            const info = await prepareFields(
              Array.isArray(block) ? block[0] : [],
              props.objects,
              props.blocks,
              stores,
            );
            if (index === count) {
              fields = info.fields;
              setState({ info });
            }
          } else {
            root.rgo.set(
              ...(fields || [])
                .filter(f => f.key.store === 'rgo')
                .map(f => ({ key: f.key.key })),
            );
          }
        };
        setTimeout(() => prepare(initialProps));
        onProps(prepare);

        return (
          { objects: _a, blocks: _b, onCommit, onError, onSubmit, ...props },
          { info },
        ) => ({ onCommit, onError, onSubmit, props, stores, ...info });
      },
      { info: {} },
    ),
    enclose(
      ({ setState }) => {
        const setElem = elem => setState({ elem });
        const HeightWrap = ({ children }) => (
          <div ref={setElem}>{children}</div>
        );
        const setHeight = height => setState({ height });
        return (props, state) => ({
          ...props,
          ...state,
          HeightWrap,
          setHeight,
        });
      },
      { elem: null, height: null },
    ),
    branch(
      ({ fields }) => fields,
      compose(
        enclose(
          ({ setState, onProps }) => {
            let mounted = true;
            onProps(props => !props && (mounted = false));
            const setProcessing = processing =>
              mounted && setState({ processing });
            return (props, { processing }) => ({
              ...props,
              processing,
              setProcessing,
            });
          },
          { processing: null },
        ),
        getState,
        branch(
          ({ state }) => state,
          enclose(() => {
            const methods = methodWrap();
            return ({
              onCommit,
              onSubmit,
              onError,
              elem,
              setHeight,
              setProcessing,
              ...props
            }) => {
              const submit = async () => {
                if (!props.state.some(s => !s.hidden && s.invalid)) {
                  if (elem) setHeight(elem.offsetHeight);
                  setProcessing(true);
                  const visibleFields = props.fields.filter(
                    (_, i) => !props.state[i].hidden,
                  );
                  const values = visibleFields.reduce(
                    (res, f, i) => set(res, f.key.name, props.state[i].value),
                    {},
                  );
                  const rgoKeys = visibleFields
                    .filter(f => f.key.store === 'rgo')
                    .map(f => f.key);
                  if (onCommit) {
                    const extra = (await onCommit(values)) || {};
                    const extraValues = Object.keys(extra).reduce<any[]>(
                      (res, obj) => [
                        ...res,
                        ...Object.keys(extra[obj] || {}).map(field => ({
                          key: {
                            store: 'rgo',
                            key: [
                              props.objects[obj].type,
                              props.objects[obj].id,
                              field,
                            ] as [string, string, string],
                            name: `${obj}.${field}`,
                          },
                          value: extra[obj][field],
                        })),
                      ],
                      [],
                    );
                    root.rgo.set(
                      ...extraValues.map(({ key, value }) => ({
                        key: key.key,
                        value,
                      })),
                    );
                    rgoKeys.push(
                      ...extraValues
                        .filter(
                          ({ key }) => !rgoKeys.some(k => k.name === key.name),
                        )
                        .map(({ key }) => key),
                    );
                  }
                  let changes: any;
                  try {
                    const newIds = await root.rgo.commit(
                      ...rgoKeys.map(key => key.key),
                    );
                    for (const obj of Object.keys(props.objects)) {
                      const { type, id } = props.objects[obj];
                      values[obj].id = getId(id, newIds[type]);
                    }
                    changes = onSubmit && (await onSubmit(values));
                  } catch {
                    changes = onError && (await onError(values));
                  }
                  props.stores.rgo.set(
                    Object.keys(changes || {})
                      .filter(k => props.objects[k])
                      .reduce<any[]>(
                        (res, k) => [
                          ...res,
                          ...Object.keys(changes[k]).map(field => ({
                            key: [
                              props.objects[k].type,
                              props.objects[k].id,
                              field,
                            ],
                            value: changes[k][field],
                          })),
                        ],
                        [],
                      ),
                  );
                  props.stores.local.set(
                    Object.keys(changes || {})
                      .filter(k => !props.objects[k])
                      .reduce<any[]>(
                        (res, k) => [...res, { key: k, value: changes[k] }],
                        [],
                      ),
                  );
                  setProcessing(changes ? false : null);
                } else {
                  setProcessing(false);
                }
              };
              return {
                ...props,
                ...methods({
                  submit,
                  onKeyDown: event => {
                    if (event.which === 13) submit();
                  },
                }),
              };
            };
          }),
        ),
      ),
    ),
    branch(
      ({ fields, processing, state }) => !fields || processing || !state,
      render(({ props, height }) =>
        React.createElement(container, {
          HeightWrap: ({ style, children }) => (
            <div
              style={{
                position: 'relative',
                ...style,
                height: height || style.height || 'auto',
              }}
            >
              {children}
            </div>
          ),
          ...props,
        }),
      ),
    ),
    map(({ state, ...props }) => ({
      invalid: state.some(s => !s.hidden && s.invalid),
      hidden: JSON.stringify(state.map(s => s.hidden)),
      ...props,
    })),
    pure,
    map(({ hidden, ...props }) => ({
      ...props,
      hidden: keysToObject(
        JSON.parse(hidden),
        h => h,
        (_, i) => props.fields[i].key.name,
      ),
    })),
  )(
    ({
      blocks,
      stores,
      props,
      HeightWrap,
      processing,
      submit,
      onKeyDown,
      invalid,
      hidden,
    }) =>
      React.createElement(container, {
        blocks: blocks
          .map((blockSet, i) =>
            blockSet.map(
              (block, j) =>
                (block.fields.length === 0 ||
                  block.fields.some(f => !hidden[f.key.name])) && (
                  <Block
                    {...block}
                    stores={stores}
                    fields={
                      block.fields.length === 0
                        ? null
                        : block.fields.filter(f => !hidden[f.key.name])
                    }
                    attempted={processing !== null}
                    key={`${i}_${j}`}
                  />
                ),
            ),
          )
          .filter(blockComps => blockComps.some(c => c)),
        HeightWrap,
        attempted: processing !== null,
        submit,
        onKeyDown,
        invalid,
        ...props,
      }),
  );
}
