/*
 * GridGallery is a plugin that will generate a grid depending on
 * the elements width and height. it is not required to have the same height
 * also you can enable/disable show lightbox effect to load content
 *
 * license: under MIT
 *          https://github.com/pencilpix/grid-gallery/blob/master/LICENSE
 * Author: Mohamed Hassan
 * Author Url: mohamedhassan@me
 */
(function($doc, $win){
  'use strict';

  /*=========================
   * @private helper functions
   *=========================*/

   /*
    * _extend Private method that extends an object using
    * properties of another object.
    * @param { Object } obj1 The object that will be extended
    * @param { Object } obj2 The object that will be used to extend another.
    *
    * @return { Object } obj1 The first object after being extended.
    */
  function _extend(obj1, obj2) {
    for ( var prop in obj2 ) {
      if ( obj2.hasOwnProperty(prop) ) {
        obj1[prop] = obj2[prop];
      }
    }

    return obj1;
  }


  /*
   * _checkItems Private method that check if GridGallery enabled on items
   * @param { Array-like } items The grid elements.
   * @return { Array } notEnabled The grid items that not set yet.
   */
  function _checkItems(items) {
    var notEnabled = Array.prototype.map.call(items, function(item) {
      if(!item.dataset.grid && item.className === 'grid-gallery__item'){
        return item;
      }
    });

    if (notEnabled.length){
      return notEnabled;
    }
  }

  /*
   * class constructor of GridGallery component
   * @param { HTMLElement } element The element that will be the container.
   * @param { Object } options The options to initialize the component.
   */
  function GridGallery(element, options) {
    var _defaultOptions = { lightBox: false };

    this.element = element;

    this.options = _extend({}, _defaultOptions); // extend options to default
    this.options = _extend(this.options, options); // extend default to custom

    this.init();
  }


  /*
   * init this method that do the rest of initialization
   * work and updates the dom.
   */
  GridGallery.prototype.init = function() {

  };

  $win.GridGallery = GridGallery; // makes the component globally exist.
})(document, window);

