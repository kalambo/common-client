import * as React from 'react';
import m from 'mishmash';
import { root } from 'common';

import createQuery from './createQuery';
import createStore from './createStore';
import Footer from './Footer';
import jsonUrl from './jsonUrl';
import Table from './Table';

const initStore = (printFilter, store, fields, type?, path?) =>
  fields.filter(f => typeof f !== 'string').forEach((f, i) => {
    const newType = type ? (root.rgo.schema[type][f.name] as any).type : f.name;
    const newPath = path ? `${path}.${i}` : `${i}`;
    if (f.filter) {
      store.set(
        `${newPath}_filter`,
        printFilter(f.filter, root.rgo.schema[newType]),
      );
    }
    store.set(`${newPath}_start`, (f.start || 0) + 1);
    if (f.end) store.set(`${newPath}_end`, f.end);
    initStore(printFilter, store, f.fields || [], newType, newPath);
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
      fields: f.fields.includes('id') ? f.fields : ['id', ...f.fields],
    };
  });

export default m()
  .style({
    base: [
      ['numeric', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
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
  })
  .enhance(({ setState }) => {
    setState({ loading: true });
    root.rgo.query().then(() => setState({ loading: false }));
    const reset = () =>
      setState({ isReset: true }, () => setState({ isReset: false }));
    return (props, state) => ({ ...props, ...state, reset });
  })
  .branch(
    ({ loading, isReset }) => loading || isReset,
    m().render(({ loader }) => loader()),
  )
  .enhance(({ firstProps, onProps, setState }) => {
    const store = createStore();

    const initial =
      firstProps.query || jsonUrl.parse(location.search.slice(1)) || [];
    initStore(firstProps.config.printFilter, store, initial);
    let unsubscribe;
    const query = createQuery(initial, (q, addPath) => {
      if (addPath) {
        store.set(`${addPath}_filter`, '');
        store.set(`${addPath}_start`, 1);
        store.set(`${addPath}_end`, 100);
      }

      const aliasQuery = addAliases(q);
      setState({ query: aliasQuery });
      if (unsubscribe) unsubscribe();
      unsubscribe = root.rgo.query(...addIds(aliasQuery), data => {
        if (!data) {
          setState({ fetching: true });
        } else {
          setState({ data: { ...data } }, () =>
            setTimeout(() => setState({ fetching: false })),
          );
        }
      });
    });
    onProps(props => !props && unsubscribe());

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
    firstProps.resizer && firstProps.resizer(updateWidths);

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
    updateContext(firstProps);
    onProps(props => props && updateContext(props));

    return (props, state) => ({ ...props, ...state, context });
  })
  .branch(
    ({ query, data }) => !query || !data,
    m().render(({ loader }) => loader()),
  )(({ context, query, fetching, data, style }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      paddingBottom: 25 + style.footer.height,
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
            paddingLeft: i !== 0 && 25,
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
    <Footer context={context} query={query} data={data} style={style.footer} />
  </div>
));
