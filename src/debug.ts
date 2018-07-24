import * as React from 'react';

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
