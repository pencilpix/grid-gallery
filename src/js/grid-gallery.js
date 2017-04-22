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

  const DEFAULTS = {
    direction: 'left',
  };



  class GridGallery {
    constructor( element, options ) {
      this.element = element;
      this.options = Object.assign({}, GridGallery.DEFAULTS, options);
      this.rows = [];

      this.init();
    }



    init() {
      this.updateGridRows();
      this.updatePositions();
    }



    /**
     * get rows of the grid depending on current
     * container children and it's order
     */
    updateGridRows() {
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
    updatePositions() {
      let direction = this.options.direction;
      if(this.lastIndex === -1)
        return;

      this.rows.forEach(row => {
        row.forEach(rowItem => {
          rowItem.item.style.top = rowItem.position.top + 'px';
          rowItem.item.style[direction] = rowItem.position[direction] + 'px';
        });
      });
    }



    get itemWidth() {
      return this.element.children[0].offsetWidth;
    }


    get maxItemsPerRow() {
      let containerWidth = this.element.offsetWidth;
      return Math.floor(containerWidth / this.itemWidth);
    }


    get remainSpace() {
      let containerWidth = this.element.offsetWidth;
      let itemsWidth = this.maxItemsPerRow * this.itemWidth

      return Math.floor((containerWidth - itemsWidth) / 2);
    }


    /**
     * get last row index in grid
     */
    get lastIndex() {
      return this.rows.length - 1;
    }



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

