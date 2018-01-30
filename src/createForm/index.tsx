import * as React from 'react';
import {
  branch,
  compose,
  mapProps,
  pure,
  renderComponent,
  renderNothing,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { combineState, Comp, memoizeProps, omitProps } from 'mishmash';
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
  const Block = branch<any>(
    ({ fields }) => fields,
    compose(
      getState,
      branch(({ state }: any) => !state, renderNothing),
      mapProps(({ stores, fields, state, ...props }: any) => ({
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
    omitProps('fields', 'stores', 'state') as any,
  )(Array.isArray(block) ? block[1] : block);

  return compose<any, FormProps & T>(
    memoizeProps('objects', 'blocks'),
    pure,
    combineState(
      ({ initialProps, onNextProps, setState, onUnmount }) => {
        const stores = createStores();

        let prepared;
        let count = 0;
        const prepare = async ({ objects, blocks }: Obj) => {
          const index = ++count;
          const newPrepared = await prepareFields(
            Array.isArray(block) ? block[0] : [],
            objects,
            blocks,
            stores,
          );
          if (index === count) {
            prepared = newPrepared;
            setState({});
          }
        };
        setTimeout(() => prepare(initialProps));
        onNextProps(prepare);
        onUnmount(() => {
          root.rgo.set(
            ...(prepared.fields || [])
              .filter(f => f.key.store === 'rgo')
              .map(f => ({ key: f.key.key })),
          );
        });

        return ({
          objects: _a,
          blocks: _b,
          onCommit,
          onError,
          onSubmit,
          ...props
        }) => ({ onCommit, onError, onSubmit, props, stores, ...prepared });
      },
      {},
      () => false,
    ),
    withState('elem', 'setElem', null),
    withHandlers({
      HeightWrap: ({ setElem }: any) => ({ children }) => (
        <div ref={setElem}>{children}</div>
      ),
    }),
    withState('height', 'setHeight', null),
    branch(
      ({ fields }: any) => fields,
      compose(
        combineState(
          ({ setState, onUnmount }) => {
            let mounted = true;
            onUnmount(() => (mounted = false));
            return (props, { processing }) => [
              { ...props, processing },
              { setProcessing: p => mounted && setState({ processing: p }) },
            ];
          },
          { processing: null },
        ),
        getState,
        branch(
          ({ state }: any) => state,
          compose(
            withHandlers<any, any>({
              submit: ({
                onCommit,
                onSubmit,
                onError,
                stores,
                objects,
                fields,
                elem,
                setHeight,
                setProcessing,
                state,
              }) => async () => {
                if (!state.some(s => !s.hidden && s.invalid)) {
                  if (elem) setHeight(elem.offsetHeight);
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
                            key: [
                              objects[obj].type,
                              objects[obj].id,
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
              },
            }),
            withHandlers({
              onKeyDown: ({ submit }: any) => event => {
                if (event.which === 13) submit();
              },
            }),
          ),
        ),
      ),
    ),
    branch(
      ({ fields, processing, state }: any) => !fields || processing || !state,
      renderComponent<any>(({ props, height }) =>
        React.createElement(container as any, {
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
    mapProps(({ state, ...props }: any) => ({
      invalid: state.some(s => !s.hidden && s.invalid),
      hidden: JSON.stringify(state.map(s => s.hidden)),
      ...props,
    })),
    pure,
    withProps<any, any>(({ fields, hidden }) => ({
      hidden: keysToObject(
        JSON.parse(hidden),
        h => h,
        (_, i) => fields[i].key.name,
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
      React.createElement(container as any, {
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
