// @flow

import React, { Component } from 'react';
import type { Element } from 'react';
import { Grid, CellMeasurer, AutoSizer } from 'react-virtualized';
import generateStaticRowHeight from './generateStaticRowHeight';
import defaultRenderCellWrapper from './defaultRenderCellWrapper';

type IdealItemWidthInput = {|
  containerWidth: number,
  containerHeight: number,
|};

type RenderItemInput<TItem> = {
  isVisible: boolean,
  isScrolling: boolean,
  columnIndex: number,
  columnCount: number,
  columnWidth: number,
  rowIndex: number,
  rowCount: number,
  item: TItem,
  index: number,
};

type RenderHeaderInput = {
  isVisible: boolean,
  isScrolling: boolean,
};

type RenderFooterInput = {
  isVisible: boolean,
  isScrolling: boolean,
};

type Style = {};

type RenderCellWrapperInput = {
  style: Style,
  children: Element<*>,
  isHeader: boolean,
  isFooter: boolean,
  isItem: boolean,
}

type GridCellData = {|
  key?: string,
  style: Style,
  isVisible?: boolean,
  isScrolling?: boolean,
  columnIndex: number,
  rowIndex: number,
|};

// NOTE: Component is intentionally used instead of PureComponent,
// as renderItem's internals may adjust independent of props provided to
// this component
export default class VirtualizedItemGrid<TItem: any> extends Component {
  static defaultProps = {
    dynamicRowHeight: false,
    overscanRowCount: 2,
    header: (null: Element<*> | null),
    footer: (null: Element<*> | null),
    renderCellWrapper: defaultRenderCellWrapper,
  }

  props: {
    className: ?string,
    idealItemWidth: number | (input: IdealItemWidthInput) => number,
    dynamicRowHeight: boolean,
    items: Array<TItem>,
    renderItem: (input: RenderItemInput<TItem>) => Element<*>,
    overscanRowCount: number,
    header: Element<*> | ((input: RenderHeaderInput) => Element<*>) | null,
    footer: Element<*> | ((input: RenderFooterInput) => Element<*>) | null,
    renderCellWrapper: (input: RenderCellWrapperInput) => Element<*>,
  }

  getIdealItemWidth(containerWidth: number, containerHeight: number) {
    const { idealItemWidth } = this.props;
    if (typeof idealItemWidth === 'function') {
      return idealItemWidth({ containerWidth, containerHeight });
    }
    return idealItemWidth;
  }

  renderHeader(style: Style, header: Element<*> | ((input: RenderHeaderInput) => Element<*>), isVisible: boolean, isScrolling: boolean) {
    const { renderCellWrapper: CellWrapper } = this.props;
    let element;
    if (typeof header === 'function') {
      const Header = header;
      element = <Header isVisible={isVisible} isScrolling={isScrolling} />;
    } else {
      element = header;
    }
    return (
      <CellWrapper
        key="header"
        style={style}
        isHeader
        isFooter={false}
        isItem={false}
        children={element}
      />
    );
  }

  renderFooter(style: Style, footer: Element<*> | ((input: RenderFooterInput) => Element<*>), isVisible: boolean, isScrolling: boolean) {
    const { renderCellWrapper: CellWrapper } = this.props;
    let element;
    if (typeof footer === 'function') {
      const Footer = footer;
      element = <Footer isVisible={isVisible} isScrolling={isScrolling} />;
    } else {
      element = footer;
    }
    return (
      <CellWrapper
        key="footer"
        style={style}
        isHeader={false}
        isFooter
        isItem={false}
        children={element}
      />
    );
  }

  renderItem(style: Style, element: Element<*>, key: ?string) {
    const { renderCellWrapper: CellWrapper } = this.props;
    return (
      <CellWrapper
        key={key || 'item'}
        style={style}
        isHeader={false}
        isFooter={false}
        isItem
        children={element}
      />
    );
  }

  renderCell(cellData: GridCellData, columnCount: number, rowCount: number, columnWidth: number, containerWidth: number) {
    const { key, style, isVisible, isScrolling, columnIndex, rowIndex } = cellData;
    const visible = isVisible || false;
    const scrolling = isScrolling || false;
    const { items, renderItem: ItemComponent, header, footer } = this.props;
    let normalizedRowIndex = rowIndex;
    if (header) {
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return this.renderHeader({ ...style, width: containerWidth }, header, visible, scrolling);
        }
        return null;
      }
      normalizedRowIndex -= 1;
    }
    if (footer && normalizedRowIndex === rowCount) {
      if (columnIndex === 0) {
        return this.renderFooter({ ...style, width: containerWidth }, footer, visible, scrolling);
      }
      return null;
    }
    const index = (normalizedRowIndex * columnCount) + columnIndex;
    if (index >= items.length) {
      return null;
    }
    const item = items[index];
    if (item === undefined) {
      return null;
    }
    const element = (
      <ItemComponent
        isVisible={visible}
        isScrolling={scrolling}
        columnIndex={columnIndex}
        columnCount={columnCount}
        columnWidth={columnWidth}
        rowIndex={normalizedRowIndex}
        rowCount={rowCount}
        item={items[index]}
        index={index}
      />
    );
    return this.renderItem(style, element, key);
  }

  generateRowHeight(getRowHeight: (input: { index: number }) => number, rowCount: number) {
    const { dynamicRowHeight, header, footer } = this.props;
    if (dynamicRowHeight) {
      return getRowHeight;
    }

    return generateStaticRowHeight(getRowHeight, rowCount, !!header, !!footer);
  }

  renderWithKnownSize(containerWidth: number, containerHeight: number) {
    if (!containerWidth) {
      return null;
    }
    const { className, items, overscanRowCount, header, footer } = this.props;
    const itemCount = items.length;

    const idealItemWidth = Math.max(1, this.getIdealItemWidth(containerWidth, containerHeight));

    const columnCountEstimate = Math.max(1, Math.floor(containerWidth / idealItemWidth));
    const rowCount = Math.ceil(itemCount / columnCountEstimate);
    // We can now recalculate the columnCount knowing how many rows we must
    // display. In the typical case, this is going to be equivalent to
    // `columnCountEstimate`, but if in the case of 5 items and 4 columns, we
    // can fill out to display a a 3x2 with 1 hole instead of a 4x2 with 3
    // holes.
    const columnCount = Math.max(1, itemCount && Math.ceil(itemCount / rowCount));

    const columnWidth = containerWidth / columnCount;
    const extraRowCount = (header ? 1 : 0) + (footer ? 1 : 0);

    const cellRenderer = data => this.renderCell(data, columnCount, rowCount, columnWidth, containerWidth);

    return (
      <CellMeasurer
        key={`${containerWidth}:${containerHeight}:${header ? 1 : 0}:${footer ? 1 : 0}`}
        cellRenderer={data => cellRenderer(data) || <span />}
        columnCount={columnCount}
        rowCount={rowCount + extraRowCount}
        width={columnWidth}
      >
        {({ getRowHeight }) => <Grid
          cellRenderer={cellRenderer}
          className={className}
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={containerHeight}
          rowCount={rowCount + extraRowCount}
          rowHeight={this.generateRowHeight(getRowHeight, rowCount)}
          width={containerWidth}
          overscanRowCount={overscanRowCount}
        />}
      </CellMeasurer>
    );
  }

  render() {
    return (
      <AutoSizer>
        {({ width, height }) => this.renderWithKnownSize(width, height)}
      </AutoSizer>
    );
  }
}
