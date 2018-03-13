import * as React from 'react';
import m, { Comp } from 'mishmash';
import * as set from 'lodash.set';
import keysToObject from 'keys-to-object';
import { getId } from 'rgo';
import { Obj, root, transformValue } from 'common';

import createStores from './createStores';
import getState from './getState';
import prepareFields from './prepareFields';

const mapProps = map => C => props => React.createElement(C, map(props));

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
  const Block = m.doIf(
    'fields',
    m
      .do(getState)
      .doIf(({ state }) => !state, m.yield(() => null))
      .merge('stores', 'fields', 'state', (stores, fields, state) => ({
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
    m.merge({ fields: undefined, stores: undefined, state: undefined }),
  )(block);

  return m
    .pure(true)
    .do(
      mapProps(
        ({ objects, blocks, onCommit, onError, onSubmit, ...props }) => ({
          objects,
          blocks,
          onCommit,
          onError,
          onSubmit,
          props,
        }),
      ),
    )
    .merge((props$, push) => {
      const stores = createStores();
      let count = 0;
      props$('objects', 'blocks', (objects, blocks) => {
        setTimeout(async () => {
          const index = ++count;
          const info = await prepareFields(blockProps, objects, blocks, stores);
          if (index === count) push(info);
        });
        return () => {
          root.rgo.set(
            ...(props$().$fields || [])
              .filter(f => f.key.store === 'rgo')
              .map(f => ({ key: f.key.key })),
          );
        };
      });
      return {
        stores,
        objects: undefined,
        blocks: undefined,
      };
    })
    .merge((_, push) => {
      let heightElem: HTMLElement | null = null;
      return {
        height: null,
        setHeightElem: elem => (heightElem = elem),
        lockHeight: () =>
          push({ height: heightElem && heightElem.offsetHeight }),
      };
    })
    .doIf(
      'fields',
      m
        .merge((_, push) => {
          let mounted = true;
          push({
            processing: null,
            setProcessing: processing => mounted && push({ processing }),
          });
          return () => (mounted = false);
        })
        .do(getState)
        .doIf(
          'state',
          m.merge(props$ => {
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
                const visibleFields = fields.filter((_, i) => !state[i].hidden);
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
    )
    .doIf(
      ({ fields, processing, state }) => !fields || processing || !state,
      m.yield(({ props, height }) =>
        React.createElement(container, { height, ...props }),
      ),
    )
    .merge('state', state => ({
      invalid: state.some(s => !s.hidden && s.invalid),
      hidden: JSON.stringify(state.map(s => s.hidden)),
      state: undefined,
    }))
    .pure()
    .merge('fields', 'hidden', (fields, hidden) => ({
      hidden: keysToObject(
        JSON.parse(hidden),
        h => h,
        (_, i) => fields[i].key.name,
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
