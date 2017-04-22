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
    }



    get itemWidth() {
      return this.element.querySelector('.grid-gallery__item').offsetWidth;
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

