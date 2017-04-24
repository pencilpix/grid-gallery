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
((name, definition) => {
  let theModule  = definition(),
      hasDefine  = typeof define === 'function' && define.amd,
      hasExports = typeof module !== 'undefined' && module.exports;

  if(hasDefine)
    define(theModule);
  else if(hasExports)
    module.exports = theModule;
  else
    window[name] = theModule;

})('GridGallery', () => {
  const VERSION = '1.0.1';

  /**
   * default options
   *
   * @type {Object}
   */
  const DEFAULTS = {
    direction: 'left',
    watch: false
  };



  /**
   * GridGallery generates a grid that its
   * item it's not required to be in the same height
   *
   * @param {HTMLElement}  element  grid container element
   * @param {Object}       options  custom options
   */
  class GridGallery {
    constructor( element, options ) {
      this.element = element;
      this.options = Object.assign({}, GridGallery.DEFAULTS, options);
      this.rows = [];

      this._timeout = null;
      this._delay = 300;
      this._boundResizeHandler = this._resizeHandler.bind(this);
      this._watcher = null;

      this.init();
    }



    init() {
      this._updateGridRows();
      this._updatePositions();


      window.addEventListener('resize', this._boundResizeHandler);

      if(this.options.watch) {
        this._watch(this.update);
      }
    }



    update() {
      this.rows = [];
      this._updateGridRows();
      this._updatePositions();
    }



    /**
     * get rows of the grid depending on current
     * container children and it's order
     */
    _updateGridRows() {

      [...this.element.children].forEach((item, i) => {
        let index = i % this.maxItemsPerRow;
        let position;
        if ( index === 0){
          this.rows.push([]);
        }

        position = this.getItemPosition(index);
        this.rows[this.lastIndex].push({item: item, position: position});
      });
    }


    /**
     * calculate the position of an element depending on it's
     * position on the grid.
     *
     * @param {Number}  index  the number reperesent index in current row
     * @return {Object}
     */
    getItemPosition(index) {
      let direction = this.options.direction;
      let lastIndex = this.lastIndex;
      let rowIs     = lastIndex === 0 ? 'first_row' : 'any_row';
      let itemIs    = index === 0 ? 'first_item' : 'any_item';

      let position  = {};
      let prevItem, prevRowItem;


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



    /**
     * update the position of each item
     * depending on position iformation
     * stored in item object of in rows property
     */
    _updatePositions() {
      let direction = this.options.direction;
      if(this.lastIndex === -1)
        return;

      this.rows.forEach(row => {
        row.forEach(rowItem => {
          let itemBottom = rowItem.position.top + rowItem.item.offsetHeight;
          rowItem.item.style.top = rowItem.position.top + 'px';
          rowItem.item.style[direction] = rowItem.position[direction] + 'px';
          if(this.element.offsetHeight < itemBottom)
              this.element.style.height = itemBottom + 'px';
        });
      });
    }



    _resizeHandler() {
      let start = Date.now();
      clearTimeout(this._timeout);

      this._timeout = setTimeout(() => {
        if(this.itemWidth)
          this.update();
      }, this._delay);
    }


    _watch(callback) {
      let _this = this;
      let MutationObserver = window.MutationObserver ||
                             window.WebkitMutationObserver;

      function watchUsingObserver() {
        let observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            callback.call(_this);
          });
        });

        let config = {childList: true};

        observer.observe(_this.element, config);
        return {type: 'event', handler: observer};
      }


      function watchUsingEvents() {
        let boundCallback = callback.bind(_this);

        document.body.addEventListener('DOMNodeInserted', boundCallback);
        document.body.addEventListener('DOMNodeRemoved', boundCallback);

        return {type: 'event', handler: boundCallback}
      }


      if(MutationObserver)
        this._watcher = watchUsingObserver();
      else
        this._watcher = watchUsingEvents();
    }



    /**
     * Getter: calculate first item width.
     *
     * @return {Number}
     */
    get itemWidth() {
      return this.element.children[0].offsetWidth;
    }


    /**
     * Getter: calculate the maximum number
     * of elements can be positioned in one row.
     *
     * @return {Number}
     */
    get maxItemsPerRow() {
      let containerWidth = this.element.offsetWidth;
      let count = Math.floor(containerWidth / this.itemWidth);

      if(count > 0)
        return count;
      else
        return 1;
    }



    /**
     * Getter: calculate the remaining space after adding items in rows
     * and return its half to be used as margin 'centering the items'
     *
     * @return {Number}
     */
    get remainSpace() {
      let containerWidth = this.element.offsetWidth;
      let itemsWidth = this.maxItemsPerRow * this.itemWidth

      return Math.floor((containerWidth - itemsWidth) / 2);
    }


    /**
     * Getter: calculate last row index in grid
     *
     * @return {Number}
     */
    get lastIndex() {
      return this.rows.length - 1;
    }



    /**
     * Getter: check for current direction of document
     * and update and return default options.
     *
     * @return {Object}
     */
    static get DEFAULTS () {
      if(document.documentElement.dir === 'rtl')
        DEFAULTS.direction = 'right';
      else
        DEFAULTS.direction = 'left';

      return DEFAULTS;
    }
  }

  return GridGallery;
});

