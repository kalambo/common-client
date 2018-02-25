import * as React from 'react';
import m, { restyle } from 'mishmash';
import { root } from 'common';

import createQuery from './createQuery';
import createStore from './createStore';
import Footer from './Footer';
import jsonUrl from './jsonUrl';
import Table from './Table';

const initStore = (printFilter, store, fields, type?, path?) =>
  fields.forEach((f, i) => {
    if (typeof f !== 'string') {
      const newType = type
        ? (root.rgo.schema[type][f.name] as any).type
        : f.name;
      const newPath = path ? `${path}.${i}` : `${i}`;
      if (f.filter) {
        store.set(`${newPath}_filter`, printFilter(f.filter, newType));
      }
      store.set(`${newPath}_start`, (f.start || 0) + 1);
      if (f.end) store.set(`${newPath}_end`, f.end);
      initStore(printFilter, store, f.fields || [], newType, newPath);
    }
  });

const addAliases = (fields, alias = '') =>
  fields.map((f, i) => {
    if (typeof f === 'string') return f;
    const newAlias = `${alias}_${i}`;
    return {
      ...f,
      alias: newAlias,
      fields: addAliases(f.fields, newAlias),
    };
  });

const addIds = fields =>
  fields.map(f => {
    if (typeof f === 'string') return f;
    return {
      ...f,
      fields: f.fields.includes('id')
        ? addIds(f.fields)
        : ['id', ...addIds(f.fields)],
    };
  });

export default m
  .map(
    restyle({
      base: [
        [
          'numeric',
          'paddingTop',
          'paddingRight',
          'paddingBottom',
          'paddingLeft',
        ],
        [
          'scale',
          {
            borderTopWidth: { borderTopWidth: 0.5, borderBottomWidth: 0.5 },
            borderRightWidth: { borderLeftWidth: 0.5, borderRightWidth: 0.5 },
            borderBottomWidth: { borderTopWidth: 0.5, borderBottomWidth: 0.5 },
            borderLeftWidth: { borderLeftWidth: 0.5, borderRightWidth: 0.5 },
          },
        ],
      ],
      footer: [
        [
          'scale',
          {
            height: {
              fontSize: 1,
              paddingTop: 1,
              paddingBottom: 1,
              borderTopWidth: 2,
              borderBottomWidth: 2,
            },
          },
        ],
      ],
    }),
  )
  .stream(({ push }) => {
    push({ loading: true });
    root.rgo.query().then(() => push({ loading: false }));
    const reset = () => push({ isReset: true }, () => push({ isReset: false }));
    return (props, state) => ({ ...props, ...state, reset });
  })
  .branch(
    ({ loading, isReset }) => loading || isReset,
    m.render(({ loader }) => loader()),
  )
  .stream(({ initial, observe, push }) => {
    const store = createStore();

    let unsubscribe;
    const query = createQuery(
      initial.query || jsonUrl.parse(location.search.slice(1)) || [],
      q => {
        initStore(initial.config.printFilter, store, q);
        const aliasQuery = addAliases(q);
        push({ query: aliasQuery, linkQuery: q });
        if (unsubscribe) unsubscribe();
        unsubscribe = root.rgo.query(...addIds(aliasQuery), data => {
          if (!data) {
            push({ fetching: true });
          } else {
            push({ data: { ...data } }, () =>
              setTimeout(() => push({ fetching: false })),
            );
          }
        });
      },
    );
    observe(props => !props && unsubscribe());

    const widthElems = {};
    const setWidthElem = (key, elem) => {
      if (elem) {
        widthElems[key] = elem;
      } else {
        delete widthElems[key];
        store.set(key);
      }
    };
    const updateWidths = () => {
      Object.keys(widthElems).forEach(key =>
        store.set(key, widthElems[key].getBoundingClientRect().width),
      );
    };
    store.listen('', () => setTimeout(updateWidths));
    initial.resizer && initial.resizer(updateWidths);

    const setActive = (active, focus) => {
      store.update(
        'header',
        (state = {}) =>
          state.activeFocus && !focus
            ? state
            : {
                activeFocus: active && focus,
                activeType: active && active.type,
                activePath: active && active.path,
              },
      );
    };

    let context;
    const updateContext = ({
      config,
      types,
      meta = {},
      editable,
      input,
      permalink,
      reset,
      style,
    }) => {
      context = {
        config,
        types,
        meta,
        editable,
        input,
        permalink,
        reset,
        store,
        query,
        setWidthElem,
        updateWidths,
        setActive,
        style,
      };
    };
    updateContext(initial);
    observe(props => props && updateContext(props));

    return (props, state) => ({ ...props, ...state, context });
  })
  .branch(
    ({ query, data }) => !query || !data,
    m.render(({ loader }) => loader()),
  )(({ context, query, fetching, data, style, linkQuery }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      paddingBottom: 10 + style.footer.height,
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        whiteSpace: 'nowrap',
        overflow: 'auto',
      }}
    >
      {Array.from({ length: query.length + 1 }).map((_, i) => (
        <div
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            height: '100%',
            paddingLeft: i !== 0 && 30,
          }}
          key={i}
        >
          <Table
            context={context}
            query={query[i] ? [query[i]] : []}
            fetching={fetching}
            data={data}
            index={i}
            style={style.base}
          />
        </div>
      ))}
    </div>
    <Footer
      context={context}
      query={query}
      linkQuery={linkQuery}
      data={data}
      style={style.footer}
    />
  </div>
));
