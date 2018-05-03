import * as React from 'react';
import r from 'refluent';
import * as set from 'lodash.set';
import keysToObject from 'keys-to-object';
import { getId } from 'rgo';
import { Obj, root, transformValue } from 'common';

import ejson from '../../ejson';
import { branch } from '../../utils';

import createStores from './createStores';
import getState from './getState';
import prepareFields from './prepareFields';

export type Comp<T = any> =
  | React.ComponentClass<T>
  | React.StatelessComponent<T>;

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
  const Block = r
    .yield(
      branch(
        'fields',
        r
          .do(getState)
          .yield(({ state, next }) => (state ? next() : null))
          .do('stores', 'fields', 'state', (stores, fields, state) => ({
            fields: fields.map(({ key, initial: _, ...f }, i) => ({
              ...state[i],
              onChange: value =>
                stores[key.store].set([
                  { key: key.key, value: transformValue(value, f.transform) },
                ]),
              ...f,
              field: key,
            })),
            stores: undefined,
            state: undefined,
          })),
        r.do(() => ({
          fields: undefined,
          stores: undefined,
          state: undefined,
        })),
      ),
    )
    .yield(block);

  return r
    .yield(({ next }) => next(props => props, true))
    .yield(({ next }) =>
      next(({ objects, blocks, onCommit, onError, onSubmit, ...props }) => ({
        objects,
        blocks,
        onCommit,
        onError,
        onSubmit,
        props,
      })),
    )
    .do((props$, push) => {
      const stores = createStores();
      let count = 0;
      props$(
        props => ejson.stringify(props.objects),
        props => ejson.stringify(props.blocks),
        (objectsJSON, blocksJSON) => {
          setTimeout(async () => {
            const index = ++count;
            const info = await prepareFields(
              blockProps,
              ejson.parse(objectsJSON),
              ejson.parse(blocksJSON),
              stores,
            );
            if (index === count) push(info);
          });
          return () =>
            setTimeout(() => {
              root.rgo.set(
                ...(props$().$fields || [])
                  .filter(f => f.key.store === 'rgo')
                  .map(f => ({ key: f.key.key })),
              );
            });
        },
      );
      return {
        stores,
        objects: undefined,
        blocks: undefined,
      };
    })
    .do((_, push) => {
      let heightElem: HTMLElement | null = null;
      return {
        height: null,
        setHeightElem: elem => (heightElem = elem),
        lockHeight: () =>
          push({ height: heightElem && heightElem.offsetHeight }),
      };
    })
    .yield(
      branch(
        'fields',
        r
          .do((_, push) => {
            let mounted = true;
            push({
              processing: null,
              setProcessing: processing => mounted && push({ processing }),
            });
            return () => (mounted = false);
          })
          .do(getState)
          .yield(
            branch(
              'state',
              r.do((props$, _) => {
                const submit = async () => {
                  const {
                    onCommit,
                    onSubmit,
                    onError,
                    stores,
                    objects,
                    fields,
                    state,
                    lockHeight,
                    setProcessing,
                  } = props$();

                  if (!state.some(s => !s.hidden && s.invalid)) {
                    lockHeight();
                    setProcessing(true);
                    const visibleFields = fields.filter(
                      (_, i) => !state[i].hidden,
                    );
                    const values = visibleFields.reduce(
                      (res, f, i) => set(res, f.key.name, state[i].value),
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
                              key: [objects[obj].type, objects[obj].id, field],
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
                      for (const obj of Object.keys(objects)) {
                        const { type, id } = objects[obj];
                        values[obj].id = getId(id, newIds[type]);
                      }
                      changes = onSubmit && (await onSubmit(values));
                    } catch {
                      changes = onError && (await onError(values));
                    }
                    stores.rgo.set(
                      Object.keys(changes || {})
                        .filter(k => objects[k])
                        .reduce<any[]>(
                          (res, k) => [
                            ...res,
                            ...Object.keys(changes[k]).map(field => ({
                              key: [objects[k].type, objects[k].id, field],
                              value: changes[k][field],
                            })),
                          ],
                          [],
                        ),
                    );
                    stores.local.set(
                      Object.keys(changes || {})
                        .filter(k => !objects[k])
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
                  submit,
                  onKeyDown: event => event.which === 13 && submit(),
                };
              }),
            ),
          ),
      ),
    )
    .yield(
      branch(
        ({ fields, processing, state }) => !fields || processing || !state,
        ({ props, height }) =>
          React.createElement(container, { height, ...props }),
      ),
    )
    .do('state', state => ({
      invalid: state.some(s => !s.hidden && s.invalid),
      hidden: JSON.stringify(state.map(s => s.hidden)),
      state: undefined,
    }))
    .yield(({ next }) => next(props => props))
    .do('fields', 'hidden', (fields, hidden) => ({
      hidden: keysToObject(
        JSON.parse(hidden),
        h => h,
        (_, i) => fields[i].key.name,
      ),
    }))
    .yield(
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
    ) as r<FormProps & T>;
}
