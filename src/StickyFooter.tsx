import * as React from 'react';
import { withSize } from 'mishmash';

export default withSize('bounds', 'setBoundsElem')(
  ({ content, footer, bounds: { height = 0 }, setBoundsElem }) => (
    <>
      <div style={{ minHeight: '100%', marginBottom: -height }}>
        {content}
        <div style={{ height: height }} />
      </div>
      <div ref={setBoundsElem}>{footer}</div>
    </>
  ),
);
