import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import DefaultRenderCellWrapper from './defaultRenderCellWrapper';

test('renders a div with the provided style and children', t => {
  const style = {
    position: 'absolute',
    left: 1234,
    width: 2345,
  };
  const element = <h1>Hello!</h1>;
  const expected = <div style={style}>{element}</div>;

  const actual = shallow(
    <DefaultRenderCellWrapper
      style={style}
      garbage="data"
    >
      {element}
    </DefaultRenderCellWrapper>
  );

  t.true(actual.equals(expected));
});
