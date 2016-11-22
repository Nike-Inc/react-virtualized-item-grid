module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("react");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactVirtualized = __webpack_require__(4);

var _generateStaticRowHeight = __webpack_require__(3);

var _generateStaticRowHeight2 = _interopRequireDefault(_generateStaticRowHeight);

var _defaultRenderCellWrapper = __webpack_require__(2);

var _defaultRenderCellWrapper2 = _interopRequireDefault(_defaultRenderCellWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*:: import type { Element } from 'react';*/
/*:: type IdealItemWidthInput = {|
  containerWidth: number,
  containerHeight: number,
|};*/
/*:: type RenderItemInput<TItem> = {
  isVisible: boolean,
  isScrolling: boolean,
  columnIndex: number,
  columnCount: number,
  columnWidth: number,
  rowIndex: number,
  rowCount: number,
  item: TItem,
  index: number,
};*/
/*:: type RenderHeaderInput = {
  isVisible: boolean,
  isScrolling: boolean,
};*/
/*:: type RenderFooterInput = {
  isVisible: boolean,
  isScrolling: boolean,
};*/
/*:: type Style = {};*/
/*:: type RenderCellWrapperInput = {
  style: Style,
  children: Element<*>,
  isHeader: boolean,
  isFooter: boolean,
  isItem: boolean,
}*/


// NOTE: Component is intentionally used instead of PureComponent,
// as renderItem's internals may adjust independent of props provided to
// this component
/*:: type GridCellData = {|
  key?: string,
  style: Style,
  isVisible?: boolean,
  isScrolling?: boolean,
  columnIndex: number,
  rowIndex: number,
|};*/

var VirtualizedItemGrid = function (_Component) {
  _inherits(VirtualizedItemGrid, _Component);

  function VirtualizedItemGrid /*:: <TItem: any>*/() {
    _classCallCheck(this, VirtualizedItemGrid);

    return _possibleConstructorReturn(this, (VirtualizedItemGrid.__proto__ || Object.getPrototypeOf(VirtualizedItemGrid)).apply(this, arguments));
  }

  _createClass(VirtualizedItemGrid, [{
    key: 'getIdealItemWidth',
    value: function getIdealItemWidth(containerWidth /*: number*/, containerHeight /*: number*/) {
      var idealItemWidth = this.props.idealItemWidth;

      if (typeof idealItemWidth === 'function') {
        return idealItemWidth({ containerWidth: containerWidth, containerHeight: containerHeight });
      }
      return idealItemWidth;
    }
  }, {
    key: 'renderHeader',
    value: function renderHeader(style /*: Style*/, header /*: Element<*> | ((input: RenderHeaderInput) => Element<*>)*/, isVisible /*: boolean*/, isScrolling /*: boolean*/) {
      var CellWrapper = this.props.renderCellWrapper;

      var element = void 0;
      if (typeof header === 'function') {
        var Header = header;
        element = _react2.default.createElement(Header, { isVisible: isVisible, isScrolling: isScrolling });
      } else {
        element = header;
      }
      return _react2.default.createElement(CellWrapper, {
        key: 'header',
        style: style,
        isHeader: true,
        isFooter: false,
        isItem: false,
        children: element
      });
    }
  }, {
    key: 'renderFooter',
    value: function renderFooter(style /*: Style*/, footer /*: Element<*> | ((input: RenderFooterInput) => Element<*>)*/, isVisible /*: boolean*/, isScrolling /*: boolean*/) {
      var CellWrapper = this.props.renderCellWrapper;

      var element = void 0;
      if (typeof footer === 'function') {
        var Footer = footer;
        element = _react2.default.createElement(Footer, { isVisible: isVisible, isScrolling: isScrolling });
      } else {
        element = footer;
      }
      return _react2.default.createElement(CellWrapper, {
        key: 'footer',
        style: style,
        isHeader: false,
        isFooter: true,
        isItem: false,
        children: element
      });
    }
  }, {
    key: 'renderItem',
    value: function renderItem(style /*: Style*/, element /*: Element<*>*/, key /*: ?string*/) {
      var CellWrapper = this.props.renderCellWrapper;

      return _react2.default.createElement(CellWrapper, {
        key: key || 'item',
        style: style,
        isHeader: false,
        isFooter: false,
        isItem: true,
        children: element
      });
    }
  }, {
    key: 'renderCell',
    value: function renderCell(cellData /*: GridCellData*/, columnCount /*: number*/, rowCount /*: number*/, columnWidth /*: number*/, containerWidth /*: number*/) {
      var key = cellData.key,
          style = cellData.style,
          isVisible = cellData.isVisible,
          isScrolling = cellData.isScrolling,
          columnIndex = cellData.columnIndex,
          rowIndex = cellData.rowIndex;

      var visible = isVisible || false;
      var scrolling = isScrolling || false;
      var _props = this.props,
          items = _props.items,
          ItemComponent = _props.renderItem,
          header = _props.header,
          footer = _props.footer;

      var normalizedRowIndex = rowIndex;
      if (header) {
        if (rowIndex === 0) {
          if (columnIndex === 0) {
            return this.renderHeader(_extends({}, style, { width: containerWidth }), header, visible, scrolling);
          }
          return null;
        }
        normalizedRowIndex -= 1;
      }
      if (footer && normalizedRowIndex === rowCount) {
        if (columnIndex === 0) {
          return this.renderFooter(_extends({}, style, { width: containerWidth }), footer, visible, scrolling);
        }
        return null;
      }
      var index = normalizedRowIndex * columnCount + columnIndex;
      if (index >= items.length) {
        return null;
      }
      var item = items[index];
      if (item === undefined) {
        return null;
      }
      var element = _react2.default.createElement(ItemComponent, {
        isVisible: visible,
        isScrolling: scrolling,
        columnIndex: columnIndex,
        columnCount: columnCount,
        columnWidth: columnWidth,
        rowIndex: normalizedRowIndex,
        rowCount: rowCount,
        item: items[index],
        index: index
      });
      return this.renderItem(style, element, key);
    }
  }, {
    key: 'generateRowHeight',
    value: function generateRowHeight(getRowHeight /*: (input: { index: number }) => number*/, rowCount /*: number*/) {
      var _props2 = this.props,
          dynamicRowHeight = _props2.dynamicRowHeight,
          header = _props2.header,
          footer = _props2.footer;

      if (dynamicRowHeight) {
        return getRowHeight;
      }

      return (0, _generateStaticRowHeight2.default)(getRowHeight, rowCount, !!header, !!footer);
    }
  }, {
    key: 'renderWithKnownSize',
    value: function renderWithKnownSize(containerWidth /*: number*/, containerHeight /*: number*/) {
      var _this2 = this;

      if (!containerWidth) {
        return null;
      }
      var _props3 = this.props,
          className = _props3.className,
          items = _props3.items,
          overscanRowCount = _props3.overscanRowCount,
          header = _props3.header,
          footer = _props3.footer;

      var itemCount = items.length;

      var idealItemWidth = Math.max(1, this.getIdealItemWidth(containerWidth, containerHeight));

      var columnCountEstimate = Math.max(1, Math.floor(containerWidth / idealItemWidth));
      var rowCount = Math.ceil(itemCount / columnCountEstimate);
      // We can now recalculate the columnCount knowing how many rows we must
      // display. In the typical case, this is going to be equivalent to
      // `columnCountEstimate`, but if in the case of 5 items and 4 columns, we
      // can fill out to display a a 3x2 with 1 hole instead of a 4x2 with 3
      // holes.
      var columnCount = Math.max(1, itemCount && Math.ceil(itemCount / rowCount));

      var columnWidth = containerWidth / columnCount;
      var extraRowCount = (header ? 1 : 0) + (footer ? 1 : 0);

      var _cellRenderer = function _cellRenderer(data) {
        return _this2.renderCell(data, columnCount, rowCount, columnWidth, containerWidth);
      };

      return _react2.default.createElement(
        _reactVirtualized.CellMeasurer,
        {
          key: containerWidth + ':' + containerHeight + ':' + (header ? 1 : 0) + ':' + (footer ? 1 : 0),
          cellRenderer: function cellRenderer(data) {
            return _cellRenderer(data) || _react2.default.createElement('span', null);
          },
          columnCount: columnCount,
          rowCount: rowCount + extraRowCount,
          width: columnWidth
        },
        function (_ref) {
          var getRowHeight = _ref.getRowHeight;
          return _react2.default.createElement(_reactVirtualized.Grid, {
            cellRenderer: _cellRenderer,
            className: className,
            columnCount: columnCount,
            columnWidth: columnWidth,
            height: containerHeight,
            rowCount: rowCount + extraRowCount,
            rowHeight: _this2.generateRowHeight(getRowHeight, rowCount),
            width: containerWidth,
            overscanRowCount: overscanRowCount
          });
        }
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        _reactVirtualized.AutoSizer,
        null,
        function (_ref2) {
          var width = _ref2.width,
              height = _ref2.height;
          return _this3.renderWithKnownSize(width, height);
        }
      );
    }
  }]);

  return VirtualizedItemGrid;
}(_react.Component);

VirtualizedItemGrid.defaultProps = {
  dynamicRowHeight: false,
  overscanRowCount: 2,
  header: (null /*: Element<*> | null*/),
  footer: (null /*: Element<*> | null*/),
  renderCellWrapper: _defaultRenderCellWrapper2.default
};
exports.default = VirtualizedItemGrid;
module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*:: import type { Element } from 'react';*/

var CellWrapper = function (_PureComponent) {
  _inherits(CellWrapper, _PureComponent);

  function CellWrapper() {
    _classCallCheck(this, CellWrapper);

    return _possibleConstructorReturn(this, (CellWrapper.__proto__ || Object.getPrototypeOf(CellWrapper)).apply(this, arguments));
  }

  _createClass(CellWrapper, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          children = _props.children;

      return _react2.default.createElement(
        'div',
        { style: style },
        children
      );
    }
  }]);

  return CellWrapper;
}(_react.PureComponent);

exports.default = CellWrapper;
module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateStaticRowHeight;
function generateRowHeightWithoutHeaderOrFooter(getRowHeight /*: (input: { index: number }) => number*/) {
  return getRowHeight({ index: 0 });
}

function generateRowHeightWithHeader(getRowHeight /*: (input: { index: number }) => number*/) {
  var headerHeight = getRowHeight({ index: 0 });
  var staticRowHeight = getRowHeight({ index: 1 });
  return function (_ref) {
    var index = _ref.index;
    // eslint-disable-line
    if (index === 0) {
      return headerHeight;
    }
    return staticRowHeight;
  };
}

function generateRowHeightWithFooter(getRowHeight /*: (input: { index: number }) => number*/, rowCount /*: number*/) {
  var staticRowHeight = getRowHeight({ index: 0 });
  var footerHeight = getRowHeight({ index: rowCount });
  return function (_ref2) {
    var index = _ref2.index;
    // eslint-disable-line
    if (index === rowCount) {
      return footerHeight;
    }
    return staticRowHeight;
  };
}

function generateRowHeightWithHeaderAndFooter(getRowHeight /*: (input: { index: number }) => number*/, rowCount /*: number*/) {
  var headerHeight = getRowHeight({ index: 0 });
  var staticRowHeight = getRowHeight({ index: 1 });
  var footerRowIndex = rowCount + 1;
  var footerHeight = getRowHeight({ index: footerRowIndex });
  return function (_ref3) {
    var index = _ref3.index;
    // eslint-disable-line
    if (index === 0) {
      return headerHeight;
    }
    if (index === footerRowIndex) {
      return footerHeight;
    }
    return staticRowHeight;
  };
}

function generateStaticRowHeight(getRowHeight /*: (input: { index: number }) => number*/, rowCount /*: number*/, hasHeader /*: boolean*/, hasFooter /*: boolean*/) {
  if (hasHeader) {
    if (hasFooter) {
      return generateRowHeightWithHeaderAndFooter(getRowHeight, rowCount);
    }
    return generateRowHeightWithHeader(getRowHeight);
  }
  if (hasFooter) {
    return generateRowHeightWithFooter(getRowHeight, rowCount);
  }
  return generateRowHeightWithoutHeaderOrFooter(getRowHeight);
}
module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = require("react-virtualized");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VirtualizedItemGrid = __webpack_require__(1);

var _VirtualizedItemGrid2 = _interopRequireDefault(_VirtualizedItemGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _VirtualizedItemGrid2.default;
module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=react-virtualized-item-grid.js.map