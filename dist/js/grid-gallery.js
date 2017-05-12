(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.GridGallery = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /**
   * @Description: GridGallery is a tiny package that will generate a grid depending on
   *               the elements height. It is not required to have the same height
   *
   * @Author:      Mohamed Hassan
   * @Author Url:  http://mohamedhassan.me
   *
   * @License:     under MIT
   *               https://github.com/pencilpix/grid-gallery/blob/master/LICENSE
   */

  var VERSION = '2.0.1';

  /**
   * default options
   *
   * @type {Object}
   */
  var DEFAULTS = {
    direction: 'left',
    watch: false,
    watchDelay: 100,

    // callbacks
    onInitialize: null,
    onInitialized: null,
    onUpdate: null,
    onUpdated: null,
    onPosition: null,
    onPositioned: null
  };

  /**
   * GridGallery generates a grid that its
   * item it's not required to be in the same height
   *
   * @param {HTMLElement}  element  grid container element
   * @param {Object}       options  custom options
   */

  var GridGallery = function () {
    function GridGallery(element, options) {
      _classCallCheck(this, GridGallery);

      this.element = element;
      this.options = Object.assign({}, GridGallery.DEFAULTS, options);
      this.rows = [];

      this._timeout = null;
      this._delay = 300;
      this._boundResizeHandler = this._resizeHandler.bind(this);
      this._watcher = null;
      this._watchTimeout = null;

      this.init();
    }

    _createClass(GridGallery, [{
      key: 'init',
      value: function init() {
        if (this.options.onInitialize && typeof this.options.onInitialize === 'function') this.options.onInitialize.call();

        this._updateGridRows();
        this._updatePositions();

        window.addEventListener('resize', this._boundResizeHandler);

        if (this.options.watch) {
          this._watch(this.update);
        }

        if (this.options.onInitialized && typeof this.options.onInitialized === 'function') this.options.onInitialized.call();
      }
    }, {
      key: 'update',
      value: function update() {
        if (this.options.onUpdate && typeof this.options.onUpdate === 'function') this.options.onUpdate.call();

        this.rows = [];
        this._updateGridRows();
        this._updatePositions();

        if (this.options.onUpdated && typeof this.options.onUpdated === 'function') this.options.onUpdated.call();
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        var _this2 = this;

        window.removeEventListener('resize', this._boundResizeHandler);

        if (this._watcher && this._watcher.type === 'event') {
          document.body.removeEventListener('DOMNodeInserted', this._watcher.handler);
          document.body.removeEventListener('DOMNodeRemoved', this._watcher.handler);
        } else if (this._watcher && this._watcher.type === 'observer') {
          this._watcher.handler.disconnect();
        }

        this.rows = [];

        [].concat(_toConsumableArray(this.element.children)).forEach(function (child) {
          child.style.top = '';
          child.style[_this2.options.direction] = '';
        });

        this.options = null;
        this.element.style.height = '';
        this.element = null;
      }
    }, {
      key: '_updateGridRows',
      value: function _updateGridRows() {
        var _this3 = this;

        [].concat(_toConsumableArray(this.element.children)).forEach(function (item, i) {
          var index = i % _this3.maxItemsPerRow;
          var position = void 0;
          if (index === 0) {
            _this3.rows.push([]);
          }

          position = _this3._getItemPosition(index);
          _this3.rows[_this3.lastIndex].push({ item: item, position: position });
        });
      }
    }, {
      key: '_getItemPosition',
      value: function _getItemPosition(index) {
        var direction = this.options.direction;
        var lastIndex = this.lastIndex;
        var rowIs = lastIndex === 0 ? 'first_row' : 'any_row';
        var itemIs = index === 0 ? 'first_item' : 'any_item';

        var position = {};
        var prevItem = void 0,
            prevRowItem = void 0;

        switch (rowIs + '_and_' + itemIs) {
          case 'first_row_and_first_item':
            position.top = 0;
            position[direction] = this.remainSpace;
            break;

          case 'first_row_and_any_item':
            prevItem = this.rows[lastIndex][index - 1];
            position.top = 0;
            position[direction] = prevItem.position[direction] + prevItem.item.offsetWidth;
            break;

          case 'any_row_and_first_item':
            prevRowItem = this.rows[lastIndex - 1][index];
            position.top = prevRowItem.position.top + prevRowItem.item.offsetHeight;
            position[direction] = this.remainSpace;
            break;

          case 'any_row_and_any_item':
            prevItem = this.rows[lastIndex][index - 1];
            prevRowItem = this.rows[lastIndex - 1][index];
            position.top = prevRowItem.position.top + prevRowItem.item.offsetHeight;
            position[direction] = prevItem.position[direction] + prevItem.item.offsetWidth;
            break;
        }

        return position;
      }
    }, {
      key: '_updatePositions',
      value: function _updatePositions() {
        var direction = this.options.direction;
        var largestHeight = 0;
        if (this.lastIndex === -1) return;

        if (this.options.onPosition && typeof this.options.onPosition === 'function') this.options.onPosition.call();

        this.rows.forEach(function (row) {
          row.forEach(function (rowItem) {
            var itemBottom = rowItem.position.top + rowItem.item.offsetHeight;
            rowItem.item.style.top = rowItem.position.top + 'px';
            rowItem.item.style[direction] = rowItem.position[direction] + 'px';
            if (largestHeight < itemBottom) largestHeight = itemBottom;
          });
        });

        this.element.style.height = largestHeight + 'px';

        if (this.options.onPositioned && typeof this.options.onPositioned === 'function') this.options.onPositioned.call();
      }
    }, {
      key: '_resizeHandler',
      value: function _resizeHandler() {
        var _this4 = this;

        clearTimeout(this._timeout);

        this._timeout = setTimeout(function () {
          if (_this4.itemWidth) _this4.update();
        }, this._delay);
      }
    }, {
      key: '_watch',
      value: function _watch(callback) {
        var _this = this;
        var MutationObserver = window.MutationObserver || window.WebkitMutationObserver;

        function watchUsingObserver() {
          var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              clearTimeout(_this._watchTimeout);

              _this._watchTimeout = setTimeout(function () {
                callback.call(_this);
              }, _this.options.watchDelay);
            });
          });

          var config = { childList: true };

          observer.observe(_this.element, config);
          return { type: 'observer', handler: observer };
        }

        function watchUsingEvents() {
          var boundCallback = void 0;

          function handler() {
            var _this5 = this;

            clearTimeout(this._watchTimeout);

            this._watchTimeout = setTimeout(function () {
              callback.call(_this5);
            }, this.options.watchDelay);
          }

          boundCallback = handler.bind(_this);
          document.body.addEventListener('DOMNodeInserted', boundCallback);
          document.body.addEventListener('DOMNodeRemoved', boundCallback);

          return { type: 'event', handler: boundCallback };
        }

        if (MutationObserver) this._watcher = watchUsingObserver();else this._watcher = watchUsingEvents();
      }
    }, {
      key: 'itemWidth',
      get: function get() {
        return this.element.children[0].offsetWidth;
      }
    }, {
      key: 'maxItemsPerRow',
      get: function get() {
        var containerWidth = this.element.offsetWidth;
        var count = Math.floor(containerWidth / this.itemWidth);

        if (count > 0) return count;else return 1;
      }
    }, {
      key: 'remainSpace',
      get: function get() {
        var containerWidth = this.element.offsetWidth;
        var itemsWidth = this.maxItemsPerRow * this.itemWidth;

        return Math.floor((containerWidth - itemsWidth) / 2);
      }
    }, {
      key: 'lastIndex',
      get: function get() {
        return this.rows.length - 1;
      }
    }], [{
      key: 'DEFAULTS',
      get: function get() {
        if (document.documentElement.dir === 'rtl') DEFAULTS.direction = 'right';else DEFAULTS.direction = 'left';

        return DEFAULTS;
      }
    }]);

    return GridGallery;
  }();

  exports.default = GridGallery;
  module.exports = exports['default'];
});
//# sourceMappingURL=grid-gallery.js.map
