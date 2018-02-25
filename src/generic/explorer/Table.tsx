import * as React from 'react';
import m, { restyle, watchSize } from 'mishmash';

import Body from './body';
import Header, { fieldToRows } from './header';

const Pure = m.pure().toComp();

export default m
  .pure()
  .map(
    restyle({
      base: null,
      div: [
        ['filter', 'borderRight', 'borderBottom', 'borderLeft'],
        ['scale', { borderWidth: 2 }],
        ['scale', { borderLeftWidth: 5 }],
      ],
      pad: [
        [
          'scale',
          {
            height: {
              fontSize: 1,
              borderTopWidth: 1,
              paddingTop: 1,
              paddingBottom: 1,
            },
            extra: {
              borderBottomWidth: 1,
            },
          },
        ],
      ],
    }),
  )
  .map(props => ({
    ...props,
    fieldRows: fieldToRows(
      props.context,
      { fields: props.query },
      null,
      '',
      props.index,
    ),
  }))
  .do(watchSize('height', 'setHeightElem', ({ height = 0 }) => height))
  .stream(({ initial, observe, push }) => {
    initial.context.store.watch(
      props => `table_${props.index}_width`,
      (width = 0) => push({ width }),
      observe,
      initial,
    );
    let elem;
    const noScrollEvent = () => (elem.scrollLeft = 0);
    const setNoScrollElem = e => {
      if (elem) elem.removeEventListener('scroll', noScrollEvent);
      elem = e;
      if (elem) elem.addEventListener('scroll', noScrollEvent);
    };
    return (props, state) => ({
      ...props,
      ...state,
      setNoScrollElem,
      setSizeElem: elem => {
        props.setHeightElem(elem);
        props.context.setWidthElem(`table_${props.index}_width`, elem);
      },
    });
  })
  .cache('setSizeElem')(
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
