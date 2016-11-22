import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { CellMeasurer, Grid, AutoSizer } from 'react-virtualized';
import sinon from 'sinon';
import VirtualizedItemGrid from '.';
import defaultRenderCellWrapper from './defaultRenderCellWrapper';

test('utilizes AutoSizer', t => {
  const wrapper = shallow(<VirtualizedItemGrid
    idealItemWidth={256}
    items={[]}
    renderItem={() => <div />}
  />);

  t.true(wrapper.is(AutoSizer));
});

function wrapWithShallow(element) {
  const ShallowComponent = () => element;
  return shallow(<ShallowComponent />);
}

function shallowWithKnownSize(gridElement, { width, height }) {
  const wrapper = shallow(gridElement);
  const fn = wrapper.prop('children');
  const element = fn({ width, height });
  return wrapWithShallow(element);
}

function shallowWithKnownSizeAndRowHeight(gridElement, size, { getRowHeight }) {
  const wrapper = shallowWithKnownSize(gridElement, size);
  const fn = wrapper.prop('children');
  const element = fn({ getRowHeight });
  return wrapWithShallow(element);
}

function makeArray(length, fn) {
  if (typeof fn !== 'function') {
    return makeArray(length, () => fn);
  }
  const array = new Array(length);
  for (let i = 0; i < length; i += 1) {
    array[i] = fn(i);
  }
  return array;
}

test('renders nothing if width is undeterminable', t => {
  const expected = null;

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={256}
    items={[]}
    renderItem={() => <div />}
  />, {
    width: 0,
    height: 256,
  });
  const actual = wrapper.html();

  t.is(actual, expected);
});

test('utilizes CellMeasurer', t => {
  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={256}
    items={[]}
    renderItem={() => <div />}
  />, {
    width: 1000,
    height: 500,
  });

  t.true(wrapper.is(CellMeasurer));
});

test('utilizes Grid', t => {
  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={256}
    items={[]}
    renderItem={() => <div />}
  />, {
    width: 1000,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });

  t.true(wrapper.is(Grid));
});

[{
  // idealItemWidth evenly divides into containerWidth
  containerWidth: 1000,
  idealItemWidth: 250,
  columnCount: 4,
  itemCount: 16,
}, {
  // idealItemWidth does not evenly divide into containerWidth
  containerWidth: 1000,
  idealItemWidth: 256,
  columnCount: 3,
  itemCount: 12,
}, {
  containerWidth: 768,
  idealItemWidth: 300,
  columnCount: 2,
  itemCount: 8,
}, {
  // idealItemWidth is larger than containerWidth, forcing it to shrink
  containerWidth: 400,
  idealItemWidth: 500,
  columnCount: 1,
  itemCount: 4,
}, {
  // even though 1000 / 250 = 4, we have 3 columns in order to minimize holes
  // on the second row
  containerWidth: 1000,
  idealItemWidth: 250,
  columnCount: 3,
  itemCount: 5,
}, {
  // even though 1000 / 250 = 4, we only have 2 columns because there are only
  // 2 items
  containerWidth: 1000,
  idealItemWidth: 250,
  columnCount: 2,
  itemCount: 2,
}, {
  // the 0-items case
  containerWidth: 1000,
  idealItemWidth: 250,
  columnCount: 1,
  itemCount: 0,
}].forEach(({ containerWidth, idealItemWidth, columnCount, itemCount }) => {
  const columnWidth = containerWidth / columnCount;

  // columnCount
  test(`CellMeasurer has a columnCount of ${columnCount} when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth}`, t => {
    const expected = columnCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
    />, {
      width: containerWidth,
      height: 500,
    });
    const actual = wrapper.prop('columnCount');

    t.is(actual, expected);
  });

  test(`Grid has a columnCount of ${columnCount} when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth}`, t => {
    const expected = columnCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
    />, {
      width: containerWidth,
      height: 500,
    }, {
      getRowHeight() {
        return 50;
      },
    });
    const actual = wrapper.prop('columnCount');

    t.is(actual, expected);
  });

  // rowCount
  test(`CellMeasurer has calculated rowCount when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth}`, t => {
    const rowCount = Math.ceil(itemCount / columnCount);
    const expected = rowCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
    />, {
      width: containerWidth,
      height: 500,
    });
    const actual = wrapper.prop('rowCount');

    t.is(actual, expected);
  });

  test(`Grid has calculated rowCount when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth}`, t => {
    const rowCount = Math.ceil(itemCount / columnCount);
    const expected = rowCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
    />, {
      width: containerWidth,
      height: 500,
    }, {
      getRowHeight() {
        return 50;
      },
    });
    const actual = wrapper.prop('rowCount');

    t.is(actual, expected);
  });

  test(`CellMeasurer has calculated rowCount when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth} with a header`, t => {
    const rowCount = Math.ceil(itemCount / columnCount) + 1;
    const expected = rowCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
      header={<h1>O hai</h1>}
    />, {
      width: containerWidth,
      height: 500,
    });
    const actual = wrapper.prop('rowCount');

    t.is(actual, expected);
  });

  test(`Grid has calculated rowCount when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth} with a header`, t => {
    const rowCount = Math.ceil(itemCount / columnCount) + 1;
    const expected = rowCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
      header={<h1>O hai</h1>}
    />, {
      width: containerWidth,
      height: 500,
    }, {
      getRowHeight() {
        return 50;
      },
    });
    const actual = wrapper.prop('rowCount');

    t.is(actual, expected);
  });

  test(`CellMeasurer has calculated rowCount when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth} with a footer`, t => {
    const rowCount = Math.ceil(itemCount / columnCount) + 1;
    const expected = rowCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
      footer={<h2>Footer</h2>}
    />, {
      width: containerWidth,
      height: 500,
    });
    const actual = wrapper.prop('rowCount');

    t.is(actual, expected);
  });

  test(`Grid has calculated rowCount when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth} with a footer`, t => {
    const rowCount = Math.ceil(itemCount / columnCount) + 1;
    const expected = rowCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
      footer={<h2>Footer</h2>}
    />, {
      width: containerWidth,
      height: 500,
    }, {
      getRowHeight() {
        return 50;
      },
    });
    const actual = wrapper.prop('rowCount');

    t.is(actual, expected);
  });

  test(`CellMeasurer has calculated rowCount when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth} with a header and footer`, t => {
    const rowCount = Math.ceil(itemCount / columnCount) + 2;
    const expected = rowCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
      header={<h1>O hai</h1>}
      footer={<h2>Footer</h2>}
    />, {
      width: containerWidth,
      height: 500,
    });
    const actual = wrapper.prop('rowCount');

    t.is(actual, expected);
  });

  test(`Grid has calculated rowCount when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth} with a header and footer`, t => {
    const rowCount = Math.ceil(itemCount / columnCount) + 2;
    const expected = rowCount;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
      header={<h1>O hai</h1>}
      footer={<h2>Footer</h2>}
    />, {
      width: containerWidth,
      height: 500,
    }, {
      getRowHeight() {
        return 50;
      },
    });
    const actual = wrapper.prop('rowCount');

    t.is(actual, expected);
  });

  // width/columnWidth
  test(`CellMeasurer has a width of ${columnWidth} when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth}`, t => {
    const expected = columnWidth;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
    />, {
      width: containerWidth,
      height: 500,
    });
    const actual = wrapper.prop('width');

    t.is(actual, expected);
  });

  test(`Grid has a columnWidth of ${columnWidth} when containerWidth = ${containerWidth} and idealItemWidth = ${idealItemWidth}`, t => {
    const expected = columnWidth;
    const items = makeArray(itemCount, 'item');

    const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
      idealItemWidth={idealItemWidth}
      items={items}
      renderItem={() => <div />}
    />, {
      width: containerWidth,
      height: 500,
    }, {
      getRowHeight() {
        return 50;
      },
    });
    const actual = wrapper.prop('columnWidth');

    t.is(actual, expected);
  });

  test('CellMeasurer has a calculated width with a dynamic idealItemWidth function', t => {
    const expected = columnWidth;
    const items = makeArray(itemCount, 'item');
    const containerHeight = 500;
    const idealItemWidthFn = sinon.stub();
    idealItemWidthFn
      .withArgs({
        containerWidth,
        containerHeight,
      })
      .returns(idealItemWidth);

    const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
      idealItemWidth={idealItemWidthFn}
      items={items}
      renderItem={() => <div />}
    />, {
      width: containerWidth,
      height: containerHeight,
    });
    const actual = wrapper.prop('width');

    t.is(actual, expected);
  });

  test('Grid has a calculated columnWidth with a dynamic idealItemWidth function', t => {
    const expected = columnWidth;
    const items = makeArray(itemCount, 'item');
    const containerHeight = 500;
    const idealItemWidthFn = sinon.stub();
    idealItemWidthFn
      .withArgs({
        containerWidth,
        containerHeight,
      })
      .returns(idealItemWidth);

    const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
      idealItemWidth={idealItemWidthFn}
      items={items}
      renderItem={() => <div />}
    />, {
      width: containerWidth,
      height: containerHeight,
    }, {
      getRowHeight() {
        return 50;
      },
    });
    const actual = wrapper.prop('columnWidth');

    t.is(actual, expected);
  });
});

// cellRenderer
test('provides a cellRenderer to CellMeasurer that relies on renderItem', t => {
  const cellData = {
    style: {},
    columnIndex: 1,
    rowIndex: 2,
  };
  const CellWrapper = defaultRenderCellWrapper;
  const items = makeArray(6, index => ({ thing: index }));
  const RenderItem = () => null;
  const columnCount = 2;
  const containerWidth = 600;
  const expected = (<CellWrapper
    key="item"
    style={cellData.style}
    isHeader={false}
    isFooter={false}
    isItem
  >
    <RenderItem
      isVisible={false}
      isScrolling={false}
      columnIndex={cellData.columnIndex}
      columnCount={columnCount}
      columnWidth={containerWidth / columnCount}
      rowIndex={cellData.rowIndex}
      rowCount={3}
      item={{ thing: 5 }}
      index={5}
    />
  </CellWrapper>);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
  />, {
    width: containerWidth,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that relies on renderItem and renderCellWrapper', t => {
  const cellData = {
    style: {},
    columnIndex: 1,
    rowIndex: 2,
  };
  const CellWrapper = () => null;
  const items = makeArray(6, index => ({ thing: index }));
  const RenderItem = () => null;
  const columnCount = 2;
  const containerWidth = 600;
  const expected = (<CellWrapper
    key="item"
    style={cellData.style}
    isHeader={false}
    isFooter={false}
    isItem
  >
    <RenderItem
      isVisible={false}
      isScrolling={false}
      columnIndex={cellData.columnIndex}
      columnCount={columnCount}
      columnWidth={containerWidth / columnCount}
      rowIndex={cellData.rowIndex}
      rowCount={3}
      item={{ thing: 5 }}
      index={5}
    />
  </CellWrapper>);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
  />, {
    width: containerWidth,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that relies on renderItem', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {},
    isVisible: true,
    isScrolling: true,
    columnIndex: 1,
    rowIndex: 2,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const RenderItem = () => null;
  const containerWidth = 600;
  const columnCount = 2;
  const CellWrapper = defaultRenderCellWrapper;
  const expected = (<CellWrapper
    key={cellData.key}
    style={cellData.style}
    isHeader={false}
    isFooter={false}
    isItem
  >
    <RenderItem
      isVisible={cellData.isVisible}
      isScrolling={cellData.isScrolling}
      columnIndex={cellData.columnIndex}
      columnCount={columnCount}
      columnWidth={containerWidth / columnCount}
      rowIndex={cellData.rowIndex}
      rowCount={3}
      item={{ thing: 5 }}
      index={5}
    />
  </CellWrapper>);

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
  />, {
    width: containerWidth,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that relies on renderItem and renderCellWrapper', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {},
    isVisible: true,
    isScrolling: true,
    columnIndex: 1,
    rowIndex: 2,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const RenderItem = () => null;
  const CellWrapper = () => null;
  const columnCount = 2;
  const containerWidth = 600;
  const expected = (<CellWrapper
    key={cellData.key}
    style={cellData.style}
    isHeader={false}
    isFooter={false}
    isItem
  >
    <RenderItem
      isVisible={cellData.isVisible}
      isScrolling={cellData.isScrolling}
      columnIndex={cellData.columnIndex}
      columnCount={columnCount}
      columnWidth={containerWidth / columnCount}
      rowIndex={cellData.rowIndex}
      rowCount={3}
      item={{ thing: 5 }}
      index={5}
    />
  </CellWrapper>);

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
  />, {
    width: containerWidth,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that relies on renderItem adjusted for a header', t => {
  const cellData = {
    style: {},
    columnIndex: 1,
    rowIndex: 2,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const containerWidth = 600;
  const columnCount = 2;
  const expected = (<CellWrapper
    key="item"
    style={cellData.style}
    isHeader={false}
    isFooter={false}
    isItem
  >
    <RenderItem
      isVisible={false}
      isScrolling={false}
      columnIndex={cellData.columnIndex}
      columnCount={columnCount}
      columnWidth={containerWidth / columnCount}
      rowIndex={cellData.rowIndex - 1}
      rowCount={3}
      item={{ thing: 3 }}
      index={3}
    />
  </CellWrapper>);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    header={<h1>Oh yeah!</h1>}
  />, {
    width: containerWidth,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that relies on renderItem adjusted for a header', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {},
    isVisible: true,
    isScrolling: true,
    columnIndex: 1,
    rowIndex: 2,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const columnCount = 2;
  const containerWidth = 600;
  const expected = (<CellWrapper
    key={cellData.key}
    style={cellData.style}
    isHeader={false}
    isFooter={false}
    isItem
  >
    <RenderItem
      isVisible={cellData.isVisible}
      isScrolling={cellData.isScrolling}
      columnIndex={cellData.columnIndex}
      columnCount={columnCount}
      columnWidth={containerWidth / columnCount}
      rowIndex={cellData.rowIndex - 1}
      rowCount={3}
      item={{ thing: 3 }}
      index={3}
    />
  </CellWrapper>);

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    header={<h1>Oh yeah!</h1>}
  />, {
    width: containerWidth,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that relies on renderItem adjusted for a footer', t => {
  const cellData = {
    style: {},
    columnIndex: 1,
    rowIndex: 2,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const containerWidth = 600;
  const columnCount = 2;
  const expected = (<CellWrapper
    key="item"
    style={cellData.style}
    isHeader={false}
    isFooter={false}
    isItem
  >
    <RenderItem
      isVisible={false}
      isScrolling={false}
      columnIndex={cellData.columnIndex}
      columnCount={columnCount}
      columnWidth={containerWidth / columnCount}
      rowIndex={cellData.rowIndex}
      rowCount={3}
      item={{ thing: 5 }}
      index={5}
    />
  </CellWrapper>);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    footer={<h2>Footer</h2>}
  />, {
    width: containerWidth,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that relies on renderItem adjusted for a footer', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {},
    isVisible: true,
    isScrolling: true,
    columnIndex: 1,
    rowIndex: 2,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const containerWidth = 600;
  const columnCount = 2;
  const expected = (<CellWrapper
    key={cellData.key}
    style={cellData.style}
    isHeader={false}
    isFooter={false}
    isItem
  >
    <RenderItem
      isVisible={cellData.isVisible}
      isScrolling={cellData.isScrolling}
      columnIndex={cellData.columnIndex}
      columnCount={columnCount}
      columnWidth={containerWidth / columnCount}
      rowIndex={cellData.rowIndex}
      rowCount={3}
      item={{ thing: 5 }}
      index={5}
    />
  </CellWrapper>);

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    footer={<h2>Footer</h2>}
  />, {
    width: containerWidth,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that returns the header', t => {
  const cellData = {
    style: {
      position: 'absolute',
      left: 234,
      width: 345,
      top: 456,
      height: 567,
    },
    columnIndex: 0,
    rowIndex: 0,
  };
  const containerWidth = 600;
  const header = <h1>This is a header</h1>;
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const expected = (<CellWrapper
    key="header"
    style={{ ...cellData.style, width: containerWidth }}
    isHeader
    isFooter={false}
    isItem={false}
  >
    {header}
  </CellWrapper>);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    header={header}
  />, {
    width: containerWidth,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that returns the header', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {
      position: 'absolute',
      left: 234,
      width: 345,
      top: 456,
      height: 567,
    },
    isVisible: true,
    isScrolling: true,
    columnIndex: 0,
    rowIndex: 0,
  };
  const containerWidth = 600;
  const header = <h1>This is a header</h1>;
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const expected = (<CellWrapper
    key="header"
    style={{ ...cellData.style, width: containerWidth }}
    isHeader
    isFooter={false}
    isItem={false}
  >
    {header}
  </CellWrapper>);

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    header={header}
  />, {
    width: containerWidth,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that returns the header when passed as a function', t => {
  const cellData = {
    style: {
      position: 'absolute',
      left: 234,
      width: 345,
      top: 456,
      height: 567,
    },
    columnIndex: 0,
    rowIndex: 0,
  };
  const containerWidth = 600;
  const Header = () => null;
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const expected = (<CellWrapper
    key="header"
    style={{ ...cellData.style, width: containerWidth }}
    isHeader
    isFooter={false}
    isItem={false}
  >
    <Header isVisible={false} isScrolling={false} />
  </CellWrapper>);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    header={Header}
  />, {
    width: containerWidth,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that returns the header when passed as a function', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {
      position: 'absolute',
      left: 234,
      width: 345,
      top: 456,
      height: 567,
    },
    isVisible: true,
    isScrolling: true,
    columnIndex: 0,
    rowIndex: 0,
  };
  const containerWidth = 600;
  const Header = () => null;
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const expected = (<CellWrapper
    key="header"
    style={{ ...cellData.style, width: containerWidth }}
    isHeader
    isFooter={false}
    isItem={false}
  >
    <Header isVisible={cellData.isVisible} isScrolling={cellData.isScrolling} />
  </CellWrapper>);

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    header={Header}
  />, {
    width: containerWidth,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that returns the footer', t => {
  const cellData = {
    style: {
      position: 'absolute',
      left: 234,
      width: 345,
      top: 456,
      height: 567,
    },
    columnIndex: 0,
    rowIndex: 3,
  };
  const containerWidth = 600;
  const footer = <h2>This is a footer</h2>;
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const expected = (<CellWrapper
    key="footer"
    style={{ ...cellData.style, width: containerWidth }}
    isHeader={false}
    isFooter
    isItem={false}
  >
    {footer}
  </CellWrapper>);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    footer={footer}
  />, {
    width: containerWidth,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that returns the footer', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {
      position: 'absolute',
      left: 234,
      width: 345,
      top: 456,
      height: 567,
    },
    isVisible: true,
    isScrolling: true,
    columnIndex: 0,
    rowIndex: 3,
  };
  const containerWidth = 600;
  const footer = <h2>This is a footer</h2>;
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const expected = (<CellWrapper
    key="footer"
    style={{ ...cellData.style, width: containerWidth }}
    isHeader={false}
    isFooter
    isItem={false}
  >
    {footer}
  </CellWrapper>);

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    footer={footer}
  />, {
    width: containerWidth,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that returns the footer when passed as a function', t => {
  const cellData = {
    style: {
      position: 'absolute',
      left: 234,
      width: 345,
      top: 456,
      height: 567,
    },
    columnIndex: 0,
    rowIndex: 3,
  };
  const containerWidth = 600;
  const Footer = () => null;
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const expected = (<CellWrapper
    key="footer"
    style={{ ...cellData.style, width: containerWidth }}
    isHeader={false}
    isFooter
    isItem={false}
  >
    <Footer isVisible={false} isScrolling={false} />
  </CellWrapper>);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    footer={Footer}
  />, {
    width: containerWidth,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that returns the footer when passed as a function', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {
      position: 'absolute',
      left: 234,
      width: 345,
      top: 456,
      height: 567,
    },
    isVisible: true,
    isScrolling: true,
    columnIndex: 0,
    rowIndex: 3,
  };
  const containerWidth = 600;
  const Footer = () => null;
  const items = makeArray(6, index => ({ thing: index }));
  const CellWrapper = () => null;
  const RenderItem = () => null;
  const expected = (<CellWrapper
    key="footer"
    style={{ ...cellData.style, width: containerWidth }}
    isHeader={false}
    isFooter
    isItem={false}
  >
    <Footer isScrolling={cellData.isScrolling} isVisible={cellData.isVisible} />
  </CellWrapper>);

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    renderCellWrapper={CellWrapper}
    footer={Footer}
  />, {
    width: containerWidth,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that returns a span in the null case', t => {
  const cellData = {
    style: {},
    columnIndex: 1,
    rowIndex: 2,
  };
  const items = makeArray(5, index => ({ thing: index }));
  const RenderItem = () => null;
  const expected = (<span />);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
  />, {
    width: 600,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that handles the null case', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {},
    isVisible: true,
    isScrolling: true,
    columnIndex: 1,
    rowIndex: 2,
  };
  const items = makeArray(5, index => ({ thing: index }));
  const RenderItem = () => null;
  const expected = null;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
  />, {
    width: 600,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that returns a span in the undefined case', t => {
  const cellData = {
    style: {},
    columnIndex: 1,
    rowIndex: 1,
  };
  const items = makeArray(6, undefined);
  const RenderItem = () => null;
  const expected = (<span />);

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
  />, {
    width: 600,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that handles the undefined case', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {},
    isVisible: true,
    isScrolling: true,
    columnIndex: 1,
    rowIndex: 1,
  };
  const items = makeArray(6, undefined);
  const RenderItem = () => null;
  const expected = null;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
  />, {
    width: 600,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that returns a blank span on the first row, non-first column with a header', t => {
  const cellData = {
    style: {},
    columnIndex: 1,
    rowIndex: 0,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const RenderItem = () => null;
  const expected = <span />;

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    header={<h1>This is a header</h1>}
  />, {
    width: 600,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that returns null on the first row, non-first column with a header', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {},
    isVisible: true,
    isScrolling: true,
    columnIndex: 1,
    rowIndex: 0,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const RenderItem = () => null;
  const expected = null;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    header={<h1>This is a header</h1>}
  />, {
    width: 600,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.is(actual, expected);
});

test('provides a cellRenderer to CellMeasurer that returns a blank span on the first row, non-first column with a footer', t => {
  const cellData = {
    style: {},
    columnIndex: 1,
    rowIndex: 3,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const RenderItem = () => null;
  const expected = <span />;

  const wrapper = shallowWithKnownSize(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    footer={<h2>This is a footer</h2>}
  />, {
    width: 600,
    height: 500,
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.deepEqual(actual, expected);
});

test('provides a cellRenderer to Grid that returns null on the first row, non-first column with a footer', t => {
  const cellData = {
    key: 'my-cool-key',
    style: {},
    isVisible: true,
    isScrolling: true,
    columnIndex: 1,
    rowIndex: 3,
  };
  const items = makeArray(6, index => ({ thing: index }));
  const RenderItem = () => null;
  const expected = null;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={RenderItem}
    footer={<h2>This is a footer</h2>}
  />, {
    width: 600,
    height: 500,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const cellRenderer = wrapper.prop('cellRenderer');
  const actual = cellRenderer(cellData);

  t.is(actual, expected);
});

test('passes className to Grid', t => {
  const className = 'my-cool-class';
  const expected = className;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    className={className}
    idealItemWidth={300}
    items={[]}
    renderItem={() => <div />}
  />, {
    width: 500,
    height: 400,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const actual = wrapper.prop('className');

  t.is(actual, expected);
});

test('passes height to Grid', t => {
  const height = 432;
  const expected = height;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={[]}
    renderItem={() => <div />}
  />, {
    width: 500,
    height,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const actual = wrapper.prop('height');

  t.is(actual, expected);
});

test('passes overscanRowCount to Grid', t => {
  const overscanRowCount = 4;
  const expected = overscanRowCount;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    overscanRowCount={overscanRowCount}
    idealItemWidth={300}
    items={[]}
    renderItem={() => <div />}
  />, {
    width: 500,
    height: 400,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const actual = wrapper.prop('overscanRowCount');

  t.is(actual, expected);
});

test('passes overscanRowCount={2} to Grid if not provided', t => {
  const expected = 2;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={[]}
    renderItem={() => <div />}
  />, {
    width: 500,
    height: 400,
  }, {
    getRowHeight() {
      return 50;
    },
  });
  const actual = wrapper.prop('overscanRowCount');

  t.is(actual, expected);
});

test('passes through the dynamic rowHeight if dynamicRowHeight is truthy', t => {
  const getRowHeight = sinon.spy();
  const expected = getRowHeight;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    dynamicRowHeight
    idealItemWidth={300}
    items={[]}
    renderItem={() => <div />}
  />, {
    width: 500,
    height: 400,
  }, {
    getRowHeight,
  });
  const actual = wrapper.prop('rowHeight');

  t.is(actual, expected);
  t.false(getRowHeight.called);
});

test('passes a static rowHeight if dynamicRowHeight is falsy and there is no header or footer', t => {
  const rowHeight = 64;
  const getRowHeight = sinon.stub();
  getRowHeight
    .withArgs({ index: 0 })
    .returns(rowHeight);
  const expected = rowHeight;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={[]}
    renderItem={() => <div />}
  />, {
    width: 500,
    height: 400,
  }, {
    getRowHeight,
  });
  const actual = wrapper.prop('rowHeight');

  t.is(actual, expected);
  t.true(getRowHeight.calledOnce);
});

test('precalculates headerRowHeight if dynamicRowHeight is falsy and there is a header', t => {
  const headerRowHeight = 65;
  const getRowHeight = sinon.stub();
  getRowHeight
    .withArgs({ index: 0 })
    .returns(headerRowHeight);
  const expected = headerRowHeight;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={[]}
    renderItem={() => <div />}
    header={<h1>Yep</h1>}
  />, {
    width: 500,
    height: 400,
  }, {
    getRowHeight,
  });
  const rowHeightFn = wrapper.prop('rowHeight');
  rowHeightFn({ index: 0 });
  rowHeightFn({ index: 0 });
  rowHeightFn({ index: 0 });
  rowHeightFn({ index: 0 });
  const actual = rowHeightFn({ index: 0 }); // multiple calls are cached

  t.is(actual, expected);
  t.true(getRowHeight.calledTwice);
});

test('precalculates rowHeight if dynamicRowHeight is falsy and there is a header', t => {
  const rowHeight = 66;
  const getRowHeight = sinon.stub();
  getRowHeight
    .withArgs({ index: 1 })
    .returns(rowHeight);
  const expected = rowHeight;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={300}
    items={[]}
    renderItem={() => <div />}
    header={<h1>Yep</h1>}
  />, {
    width: 500,
    height: 400,
  }, {
    getRowHeight,
  });
  const rowHeightFn = wrapper.prop('rowHeight');
  rowHeightFn({ index: 1 });
  rowHeightFn({ index: 2 });
  rowHeightFn({ index: 3 });
  rowHeightFn({ index: 4 });
  const actual = rowHeightFn({ index: 5 }); // multiple calls are cached

  t.is(actual, expected);
  t.true(getRowHeight.calledTwice);
});

test('precalculates rowHeight if dynamicRowHeight is falsy and there is a footer', t => {
  const rowHeight = 66;
  const getRowHeight = sinon.stub();
  getRowHeight
    .withArgs({ index: 0 })
    .returns(rowHeight);
  const expected = rowHeight;
  const containerWidth = 500;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={containerWidth / 2}
    items={makeArray(6, 'item')}
    renderItem={() => <div />}
    footer={<h1>Yep</h1>}
  />, {
    width: containerWidth,
    height: 400,
  }, {
    getRowHeight,
  });
  const rowHeightFn = wrapper.prop('rowHeight');
  rowHeightFn({ index: 0 });
  rowHeightFn({ index: 1 });
  const actual = rowHeightFn({ index: 2 }); // multiple calls are cached

  t.is(actual, expected);
  t.true(getRowHeight.calledTwice);
});

test('precalculates footerRowHeight if dynamicRowHeight is falsy and there is a footer', t => {
  const footerRowHeight = 65;
  const rowCount = 3;
  const getRowHeight = sinon.stub();
  getRowHeight
    .withArgs({ index: rowCount })
    .returns(footerRowHeight);
  const containerWidth = 500;
  const expected = footerRowHeight;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={containerWidth / 2}
    items={makeArray(rowCount * 2, 'item')}
    renderItem={() => <div />}
    footer={<h1>Yep</h1>}
  />, {
    width: containerWidth,
    height: 400,
  }, {
    getRowHeight,
  });
  const rowHeightFn = wrapper.prop('rowHeight');
  rowHeightFn({ index: rowCount });
  rowHeightFn({ index: rowCount });
  rowHeightFn({ index: rowCount });
  rowHeightFn({ index: rowCount });
  const actual = rowHeightFn({ index: rowCount }); // multiple calls are cached

  t.is(actual, expected);
  t.true(getRowHeight.calledTwice);
});

test('precalculates headerRowHeight if dynamicRowHeight is falsy and there is a header and footer', t => {
  const footerRowHeight = 65;
  const rowCount = 3;
  const getRowHeight = sinon.stub();
  getRowHeight
    .withArgs({ index: 0 })
    .returns(footerRowHeight);
  const containerWidth = 500;
  const expected = footerRowHeight;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={containerWidth / 2}
    items={makeArray(rowCount * 2, 'item')}
    renderItem={() => <div />}
    header={<h1>Yep</h1>}
    footer={<h2>Nope</h2>}
  />, {
    width: containerWidth,
    height: 400,
  }, {
    getRowHeight,
  });
  const rowHeightFn = wrapper.prop('rowHeight');
  rowHeightFn({ index: 0 });
  rowHeightFn({ index: 0 });
  rowHeightFn({ index: 0 });
  rowHeightFn({ index: 0 });
  const actual = rowHeightFn({ index: 0 }); // multiple calls are cached

  t.is(actual, expected);
  t.true(getRowHeight.calledThrice);
});

test('precalculates rowHeight if dynamicRowHeight is falsy and there is a header and footer', t => {
  const rowHeight = 66;
  const getRowHeight = sinon.stub();
  getRowHeight
    .withArgs({ index: 1 })
    .returns(rowHeight);
  const expected = rowHeight;
  const containerWidth = 500;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={containerWidth / 2}
    items={makeArray(6, 'item')}
    renderItem={() => <div />}
    header={<h1>Yep</h1>}
    footer={<h2>Nope</h2>}
  />, {
    width: containerWidth,
    height: 400,
  }, {
    getRowHeight,
  });
  const rowHeightFn = wrapper.prop('rowHeight');
  rowHeightFn({ index: 1 });
  rowHeightFn({ index: 2 });
  const actual = rowHeightFn({ index: 3 }); // multiple calls are cached

  t.is(actual, expected);
  t.true(getRowHeight.calledThrice);
});

test('precalculates footerRowHeight if dynamicRowHeight is falsy and there is a header and footer', t => {
  const footerRowHeight = 65;
  const rowCount = 3;
  const getRowHeight = sinon.stub();
  getRowHeight
    .withArgs({ index: rowCount + 1 })
    .returns(footerRowHeight);
  const containerWidth = 500;
  const expected = footerRowHeight;

  const wrapper = shallowWithKnownSizeAndRowHeight(<VirtualizedItemGrid
    idealItemWidth={containerWidth / 2}
    items={makeArray(rowCount * 2, 'item')}
    renderItem={() => <div />}
    header={<h1>Yep</h1>}
    footer={<h2>Nope</h2>}
  />, {
    width: containerWidth,
    height: 400,
  }, {
    getRowHeight,
  });
  const rowHeightFn = wrapper.prop('rowHeight');
  rowHeightFn({ index: rowCount + 1 });
  rowHeightFn({ index: rowCount + 1 });
  rowHeightFn({ index: rowCount + 1 });
  rowHeightFn({ index: rowCount + 1 });
  const actual = rowHeightFn({ index: rowCount + 1 }); // multiple calls are cached

  t.is(actual, expected);
  t.true(getRowHeight.calledThrice);
});
