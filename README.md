# React VirtualizedItemGrid

[![Build Status](https://api.travis-ci.com/Nike-Inc/react-virtualized-item-grid.svg?token=3igpLkgvhcpaMroxAyKd&branch=master)](https://travis-ci.com/Nike-Inc/react-virtualized-item-grid)

VirtualizedItemGrid is a React component for efficiently rendering a large, scrollable list of items in a series of wrapping rows.

It does this by leveraging `react-virtualized` to render a virtualized grid of an arbitrary number of rows and a set of columns based on the provided `idealItemWidth` and the space available to render said grid.

One could render 1,000,000 items using VirtualizedItemGrid, but only the ones visibly on-screen will be rendered, leading to increased performance.

## Demo

http://engineering.nike.com/react-virtualized-item-grid/

## Installation

```
npm install https://github.com/Nike-Inc/react-virtualized-item-grid
```

## Usage

Functional stateless component:

```js
import React from 'react';
import VirtualizedItemGrid from 'react-virtualized-item-grid';

function MyCard({ item }) {
  return <div>{item.name}</div>;
}

function MyList({ items }) {
  return (<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={MyCard}
  />);
}
```

Class-based component:

```js
import React from 'react';
import VirtualizedItemGrid from 'react-virtualized-item-grid';

class MyList extends React.Component {
  renderItem = ({ item }) => {
    return <div>{item.name}</div>;
  }

  render() {
    return (<VirtualizedItemGrid
      idealItemWidth={300}
      items={this.props.items}
      renderItem={this.renderItem}
    />);
  }
}
```

Classes with efficient callbacks:

```js
import React from 'react';
import VirtualizedItemGrid from 'react-virtualized-item-grid';

class MyCard extends React.Component {
  handleClick = (event) => {
    event.preventDefault();
    this.props.onClick(this.props.id);
  }

  render() {
    return <button onClick={this.handleClick}>{this.props.name}</button>;
  }
}

class MyList extends React.Component {
  handleCardClick = (id) => {
    console.log(`clicked on card ${id}`);
  }

  renderItem = ({ item }) => {
    return <MyCard id={item.id} name={item.name} onClick={this.handleCardClick} />;
  }

  render() {
    return (<VirtualizedItemGrid
      idealItemWidth={300}
      items={this.props.items}
      renderItem={this.renderItem}
    />);
  }
}
```

## Props

### `className`

If `className` is provided, it will be attached to the outermost Grid `div`.

```js
function MyList({ items }) {
  return (<VirtualizedItemGrid
    className="my-grid-class"
    idealItemWidth={300}
    items={items}
    renderItem={MyCard}
  />);
}
```

### `idealItemWidth`

`idealItemWidth` is required and must be either a number or a function which returns a number.

It represents what an ideal width would for each item would be rather than a fixed value.

When using as a function:

```js
function getIdealItemWidth({ containerWidth, containerHeight }) {
  if (containerWidth > 768) {
    return containerWidth / 3;
  }
  return containerWidth / 2;
}

function MyList({ items }) {
  return (<VirtualizedItemGrid
    idealItemWidth={getIdealItemWidth}
    items={items}
    renderItem={MyCard}
  />);
}
```

### `dynamicRowHeight`

If `dynamicRowHeight` is `true`, which by default it is not, each row will calculate its own height independently. This can lead to performance implications and jagged scrolling for large lists, but if each item has distinct heights, it may be neessary.

### `items`

`items` must be an array and should not contain `undefined`. Any other value is acceptable, including duplicates, and will be passed along with `renderItem`.

### `renderItem`

`renderItem` can be a function which returns a React element or a component which renders a React element.

When called as a function, it will receive a single object which contains information about the item. When called as a component, it will receive that information as props.

* `isVisible`: Whether the item is visible on-screen.
* `isScrolling`: Whether the list is actively being scrolled by the user.
* `columnIndex`: Which 0-based index of the column where the item is located.
* `columnCount`: The total amount of columns of the list. At least 1.
* `columnWidth`: The actual width of each column of the list in pixels.
* `rowIndex`: Which 0-based index of the row where the item is located.
* `rowCount`: The total amount of rows of the list. At least 1.
* `item`: A value of the `items` array.
* `index`: The index of the value within the `items` array.

```js

function MyCard({ isVisible, isScrolling, columnIndex, columnCount, rowIndex, rowCount, item, index }) {
  return (<div>
    Visible: {isVisible ? 'yes': 'no'}
    Scrolling: {isScrolling ? 'yes': 'no'}
    Column Index: {String(columnIndex)}
    Column Count: {columnCount}
    Row Index: {String(rowIndex)}
    Row Count: {rowCount}
    Item: {JSON.stringify(item)}
    Index: {String(index)}
  </div>);
}

function MyList({ items }) {
  return (<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={MyCard}
  />);
}
```

### `overscanRowCount`

`overscanRowCount` represents the number of rows above and below what is visible on the screen that should be rendered.

If a user were to scroll quickly up or down, they might notice some items being actively rendered. Raising `overscanRowCount` prevents this from happening, but uses more resources.

Defaults to `2`.

```js
function MyList({ items }) {
  return (<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={MyCard}
    overscanRowCount={4}
  />);
}
```

### `header`

If `header` is provided, a virtual row is placed at the top of the grid which does not affect the items aside from moving them down to make room for the header.

It can be either a React element, a function which returns a React element, or a React Component.

```js
function MyList({ items }) {
  return (<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={MyCard}
    header={<h1>My cool list</h1>}
  />);
}
```

```js
function MyHeader({ isHeader, isFooter }) {
  return <h1>My cool list</h1>;
}

function MyList({ items }) {
  return (<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={MyCard}
    header={MyHeader}
  />);
}
```

### `footer`

If `footer` is provided, a virtual row is placed at the bottom of the grid which does not affect the items.

It can be either a React element, a function which returns a React element, or a React Component.

```js
function MyList({ items }) {
  return (<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={MyCard}
    footer={<h2>Hope you enjoyed</h2>}
  />);
}
```

```js
function MyFooter({ isHeader, isFooter }) {
  return <h2>Hope you enjoyed</h2>;
}

function MyList({ items }) {
  return (<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={MyCard}
    footer={MyFooter}
  />);
}
```

### `renderCellWrapper`
It is not recommended to override `renderCellWrapper`, but is possible.

`renderCellWrapper` defines the layout placement of each item, header, and footer.

It receives the following properties:

* `style`: A CSSStyleDeclaration which is intended to be attached to an HTML element
* `children`: The rendered item, header, or footer
* `isHeader`: `true` if wrapping a header, `false` otherwise
* `isFooter`: `true` if wrapping a footer, `false` otherwise
* `isItem`: `true` if wrapping a item, `false` otherwise

Only one of `isHeader`, `isFooter`, or `isItem` is true at any given time.

```js
function MyCellWrapper({ style, children, isHeader, isFooter, isItem }) {
  return <div style={style}>{children}</div>;
}

function MyList({ items }) {
  return (<VirtualizedItemGrid
    idealItemWidth={300}
    items={items}
    renderItem={MyCard}
    renderCellWrapper={MyCellWrapper}
  />);
}
```

## TODO

* Publish to npm
* Continuous integration
