// @flow
import React, { PureComponent } from 'react';
import type { Element } from 'react';

export default class CellWrapper extends PureComponent {
  props: {
    children: Element<*>,
    style: {},
  };

  render() {
    const { style, children } = this.props;
    return <div style={style}>{children}</div>;
  }
}
