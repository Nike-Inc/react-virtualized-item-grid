import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import VirtualizedItemGrid from '../src/index';

function hex(value) {
  const str = value.toString(16);
  if (str.length === 1) {
    return `0${str}`;
  }
  return str;
}

function makeColor(index) {
  const red = (index * 40) % 256;
  const green = ((index + 100) * 50) % 256;
  const blue = ((index + 200) * 60) % 256;
  return `#${hex(red)}${hex(green)}${hex(blue)}`;
}

function makeItems(itemCount) {
  const items = typeof Int32Array === 'function' ? new Int32Array(itemCount) : new Array(itemCount);
  for (let index = 0; index < itemCount; ++index) {
    items[index] = index;
  }
  return items;
}

const lorempixelCategories = [
  'abstract',
  'animals',
  'business',
  'cats',
  'city',
  'food',
  'nightlife',
  'fashion',
  'people',
  'nature',
  'sports',
  'technics',
  'transport',
];

function getLoremPixelUrl(index, columnWidth) {
  const category = lorempixelCategories[index % lorempixelCategories.length];
  const width = Math.ceil(columnWidth);
  const height = Math.ceil(columnWidth / 1.616);
  const pictureNumber = index % 10;

  return `http://lorempixel.com/${width}/${height}/${category}/${pictureNumber}`;
}

class Demo extends PureComponent {
  constructor(props) {
    super(props);
    this.handleItemCount = this.handleInputValue.bind(this, 'itemCount');
    this.handleIdealItemWidth = this.handleInputValue.bind(this, 'idealItemWidth');
    this.handleOverscanRowCount = this.handleInputValue.bind(this, 'overscanRowCount');
    this.handleItemRenderer = this.handleInputValue.bind(this, 'itemRenderer');
    this.handleDynamicRowHeight = this.handleCheckboxValue.bind(this, 'dynamicRowHeight');
    this.handleHeader = this.handleCheckboxValue.bind(this, 'header');
    this.handleFooter = this.handleCheckboxValue.bind(this, 'footer');
  }

  state = {
    overscanRowCount: 2,
    itemCount: 1000,
    idealItemWidth: 300,
    dynamicRowHeight: false,
    header: false,
    footer: false,
    itemRenderer: 'cardWithShadow',
  };

  handleInputValue(name, event) {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleCheckboxValue(name, event) {
    this.setState({
      [name]: event.target.checked,
    });
  }

  static itemRenderers = {
    simpleIndex: ({ index }) => <div>{String(index)}</div>,
    colorSquare: ({ index, columnWidth }) => (<div
      className="colorSquare"
      style={{ backgroundColor: makeColor(index), height: columnWidth }}
    />),
    cardWithShadow: ({ index }) => (<div
      className="cardWithShadow"
    >
      <div className="cardWithShadow-inner">
        <span>{String(index)}</span>
      </div>
    </div>),
    imageCard: ({ index, columnWidth }) => (<div
      className="imageCard"
    >
      <img role="presentation" src={getLoremPixelUrl(index, columnWidth)} style={{ height: columnWidth / 1.616 }} />
    </div>),
  };

  getItemRenderer() {
    const { itemRenderer } = this.state;
    return this.constructor.itemRenderers[itemRenderer];
  }

  renderHeader() {
    return <h2>Header</h2>;
  }

  renderFooter() {
    return <h2>Footer</h2>;
  }

  items = [];
  getItems() {
    const { itemCount } = this.state;
    let { items } = this;
    if (items.length !== itemCount) {
      items = this.items = makeItems(Math.max(0, itemCount || 0));
    }
    return items;
  }

  render() {
    return (
      <div className="root">
        <header className="header">
          <h1 className="title">React VirtualizedItemGrid</h1>
          <nav className="nav">
            <a href="https://github.com/Nike-Inc/react-virtualized-item-grid/blob/master/README.md">Docs</a>
            <a href="https://github.com/Nike-Inc/react-virtualized-item-grid">Git</a>
          </nav>
        </header>
        <section className="controls">
          <label>
            Item count:{' '}
            <input
              type="number"
              defaultValue={this.state.itemCount}
              onChange={this.handleItemCount}
            />
          </label>
          <label>
            Ideal item width:{' '}
            <input
              type="number"
              defaultValue={this.state.idealItemWidth}
              onChange={this.handleIdealItemWidth}
            />
          </label>
          <label>
            Item Renderer:{' '}
            <select defaultValue={this.state.itemRenderer} onChange={this.handleItemRenderer}>
              <option value="simpleIndex">Index (Fast)</option>
              <option value="colorSquare">Color Square</option>
              <option value="cardWithShadow">Card with shadows</option>
              <option value="imageCard">Image card</option>
            </select>
          </label>
          <label>
            Overscan Row Count:{' '}
            <input
              type="number"
              defaultValue={this.state.overscanRowCount}
              onChange={this.handleOverscanRowCount}
            />
          </label>
          <label>
            <input
              type="checkbox"
              defaultChecked={this.state.dynamicRowHeight}
              onChange={this.handleDynamicRowHeight}
            /> Dynamic Row Height
          </label>
          <label>
            <input
              type="checkbox"
              defaultChecked={this.state.header}
              onChange={this.handleHeader}
            /> Header
          </label>
          <label>
            <input
              type="checkbox"
              defaultChecked={this.state.footer}
              onChange={this.handleFooter}
            /> Footer
          </label>
        </section>
        <section className="vig">
          <VirtualizedItemGrid
            key={this.state.itemRenderer}
            items={this.getItems()}
            renderItem={this.getItemRenderer()}
            idealItemWidth={this.state.idealItemWidth}
            dynamicRowHeight={this.state.dynamicRowHeight}
            overscanRowCount={this.state.overscanRowCount}
            header={this.state.header ? this.renderHeader() : null}
            footer={this.state.footer ? this.renderFooter() : null}
          />
        </section>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('demo'));
