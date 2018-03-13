import * as React from 'react';
import m, { watchSize } from 'mishmash';
import st from 'style-transform';

import Body from './body';
import Header, { fieldToRows } from './header';

const Pure = m.pure().toComp();

export default m
  .pure()
  .merge('style', style => ({
    style: {
      base: style,
      div: st(style)
        .filter('borderRight', 'borderBottom', 'borderLeft')
        .scale({ borderWidth: 2 })
        .scale({ borderLeftWidth: 5 }),
      pad: st(style).scale({
        height: {
          fontSize: 1,
          borderTopWidth: 1,
          paddingTop: 1,
          paddingBottom: 1,
        },
        extra: {
          borderBottomWidth: 1,
        },
      }),
    },
  }))
  .merge('query', 'context', 'index', (query, context, index) => ({
    fieldRows: fieldToRows(context, { fields: query }, null, '', index),
  }))
  .do(watchSize('height', 'setHeightElem', ({ height = 0 }) => height))
  .merge('context', 'index', (context, index, push) =>
    context.store.listen(`table_${index}_width`, (width = 0) =>
      push({ width }),
    ),
  )
  .merge(props$ => {
    let elem;
    const noScrollEvent = () => (elem.scrollLeft = 0);
    return {
      setSizeElem: elem => {
        const { context, index, setHeightElem } = props$();
        setHeightElem(elem);
        context.setWidthElem(`table_${index}_width`, elem);
      },
      setNoScrollElem: e => {
        if (elem) elem.removeEventListener('scroll', noScrollEvent);
        elem = e;
        if (elem) elem.addEventListener('scroll', noScrollEvent);
      },
    };
  })(
  ({
    context,
    query,
    fetching,
    data,
    fieldRows,
    setNoScrollElem,
    height,
    width,
    setSizeElem,
    style,
  }) => (
    <div
      style={{
        position: 'relative',
        visibility: width && height ? 'visible' : 'hidden',
        maxHeight: '100%',
        height: height + style.div.borderBottomWidth,
        ...style.div,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
        ref={setNoScrollElem}
      >
        <div
          style={{
            height: '100%',
            paddingTop: fieldRows.length * style.pad.height + style.pad.extra,
            overflow: 'hidden',
          }}
        >
          <div style={{ height: '100%', overflow: 'scroll' }}>
            <div
              style={{
                height: '100%',
                marginTop: -(
                  fieldRows.length * style.pad.height +
                  style.pad.extra
                ),
              }}
            >
              <div style={{ width, overflow: 'hidden' }}>
                <div style={{ width: 100000 }}>
                  <div style={{ display: 'table' }} ref={setSizeElem}>
                    <Pure
                      context={context}
                      query={query}
                      data={data}
                      fieldRows={fieldRows}
                    >
                      {({ context, query, data, fieldRows }) => (
                        <table
                          style={{
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            tableLayout: 'fixed',
                          }}
                        >
                          <Header
                            context={context}
                            fieldRows={fieldRows}
                            style={style.base}
                          />
                          <Body
                            context={context}
                            query={query}
                            data={data}
                            style={style.base}
                          />
                        </table>
                      )}
                    </Pure>
                  </div>
                </div>
              </div>
              {fetching && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background: 'rgba(255,255,255,0.9)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 100000,
          }}
        >
          <table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <Header
              context={context}
              fieldRows={fieldRows}
              live
              style={style.base}
            />
          </table>
        </div>
      </div>
    </div>
  ),
);
