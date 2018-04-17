import * as React from 'react';

// export default label => (props$, push) => {
//   let prev;
//   props$(true, (props, commit) => {
//     if (prev) {
//       const keys = Array.from(
//         new Set([...Object.keys(prev), ...Object.keys(props)]),
//       ).sort();
//       console.log(
//         `${label}: ${keys.filter(k => prev[k] !== props[k]).join(', ')}`,
//       );
//     }
//     prev = props;
//   });
// };

export default label => C =>
  class Debug extends React.Component {
    componentWillReceiveProps(nextProps) {
      const keys = Array.from(
        new Set([...Object.keys(this.props), ...Object.keys(nextProps)]),
      ).sort();
      console.log(
        `${label}: ${keys
          .filter(k => this.props[k] !== nextProps[k])
          .join(', ')}`,
      );
    }
    render() {
      return React.createElement(C, this.props);
    }
  };
