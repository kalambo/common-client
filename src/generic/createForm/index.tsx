import * as React from 'react';
import m, { Comp } from 'mishmash';
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
  onCommit?: (values: any) => Obj | void | Promise<Obj | void>;
  onError?: (values: any) => Obj | void | Promise<Obj | void>;
  onSubmit?: (values: any) => Obj | void | Promise<Obj | void>;
}
export default function createForm<T = {}>(
  container: Comp<{
    blocks: React.ReactElement<any>[][];
    setHeightElem: (elem: HTMLElement) => null;
    height: number | null;
    invalid: boolean;
    attempted: boolean;
    submit: () => Promise<void>;
    [key: string]: any;
  }>,
  blockProps: string[],
  block: Comp,
) {
  const Block = m.branch(
    ({ fields }) => fields,
    m
      .do(getState)
      .branch(({ state }) => !state, m.render())
      .map(({ stores, fields, state, ...props }) => ({
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
    m.map(({ fields: _a, stores: _b, state: _c, ...props }) => props),
  )(block);

  return m
    .cache('objects', 'blocks')
    .pure()
    .stream(({ initial, observe, push }) => {
      push({ info: {} });
      const stores = createStores();

      let fields;
      let count = 0;
      const prepare = async props => {
        if (props) {
          const index = ++count;
          const info = await prepareFields(
            blockProps,
            props.objects,
            props.blocks,
            stores,
          );
          if (index === count) {
            fields = info.fields;
            push({ info });
          }
        } else {
          root.rgo.set(
            ...(fields || [])
              .filter(f => f.key.store === 'rgo')
              .map(f => ({ key: f.key.key })),
          );
        }
      };
      setTimeout(() => prepare(initial));
      observe(prepare);

      return (
        { objects: _a, blocks: _b, onCommit, onError, onSubmit, ...props },
        { info },
      ) => ({ onCommit, onError, onSubmit, props, stores, ...info });
    })
    .stream(({ push }) => {
      push({ height: null as number | null });
      let heightElem: HTMLElement | null = null;
      const setHeightElem = elem => (heightElem = elem);
      const lockHeight = () =>
        push({ height: heightElem && heightElem.offsetHeight });
      return (props, { height }) => ({
        ...props,
        height,
        setHeightElem,
        lockHeight,
      });
    })
    .branch(
      ({ fields }) => fields,
      m
        .stream(({ observe, push }) => {
          push({ processing: null });
          let mounted = true;
          observe(props => !props && (mounted = false));
          const setProcessing = processing => mounted && push({ processing });
          return (props, { processing }) => ({
            ...props,
            processing,
            setProcessing,
          });
        })
        .do(getState)
        .branch(
          ({ state }) => state,
          m
            .map(
              ({
                onCommit,
                onSubmit,
                onError,
                lockHeight,
                setProcessing,
                ...props
              }) => {
                const submit = async () => {
                  if (!props.state.some(s => !s.hidden && s.invalid)) {
                    lockHeight();
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
                            ({ key }) =>
                              !rgoKeys.some(k => k.name === key.name),
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
                  submit,
                  onKeyDown: event => event.which === 13 && submit(),
                };
              },
            )
            .cache('submit', 'onKeyDown'),
        ),
    )
    .branch(
      ({ fields, processing, state }) => !fields || processing || !state,
      m.render(({ props, height }) =>
        React.createElement(container, { height, ...props }),
      ),
    )
    .map(({ state, ...props }) => ({
      invalid: state.some(s => !s.hidden && s.invalid),
      hidden: JSON.stringify(state.map(s => s.hidden)),
      ...props,
    }))
    .pure()
    .map(({ hidden, ...props }) => ({
      ...props,
      hidden: keysToObject(
        JSON.parse(hidden),
        h => h,
        (_, i) => props.fields[i].key.name,
      ),
    }))(
    ({
      blocks,
      stores,
      props,
      setHeightElem,
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
        setHeightElem,
        attempted: processing !== null,
        submit,
        onKeyDown,
        invalid,
        ...props,
      }),
  ) as Comp<FormProps & T>;
}
