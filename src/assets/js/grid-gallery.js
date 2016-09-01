/*
 * GridGallery is a plugin that will generate a grid depending on
 * the elements width and height. it is not required to have the same height
 * also you can enable/disable show lightbox effect to load content
 *
 * license:     under MIT
 *              https: //github.com/pencilpix/grid-gallery/blob/master/LICENSE
 * Author:      Mohamed Hassan
 * Author Url:  http://mohamedhassan.me
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
    var notEnabled = Array.prototype.filter.call(items, function(item) {
      var pattern = new RegExp('grid-gallery__item');
      if(!item.dataset.grid && pattern.test(item.className)){
        return item;
      }
    });

    if (notEnabled.length){
      return notEnabled;
    }
  }

  /**
   * disables all items via data-grid
   * @param  { Array-like } items grid items
   * @return { Array }       array of items after clearing data-grid.
   */
  function _disableAll(items) {
    return Array.prototype.map.call(items, function(item){
      item.dataset.grid = '';
      return item;
    });
  }

  /**
   * method that return the whitespace after get the available number of
   * items will be distributed through the parent width
   * @param  { Number } parentWidth width of the container
   * @param  { Number } itemWidth the item width
   * @return { Number } whiteSpace.
   */
  function _calWhiteSpace (parentWidth, itemWidth) {
    var itemsNo = Math.floor(parentWidth / itemWidth);
    return parentWidth - itemWidth * itemsNo;
  }

  /*
   * _enableItems Private method to handle un-enabled grid items
   * and give each element position and data-grid attribute.
   * @param { Array } items un-enabled elements.
   * @retrun { Array } enabled elements after update position
   * and data-grid.
   */
  function _enableItems(items) {
    var parentPos = items[0].parentNode.getBoundingClientRect();
    var rowItemsNo = Math.floor(parentPos.width / items[0].offsetWidth);
    var nextPos = [];
    var prevItem, parentHeight;
    var whiteSpace = _calWhiteSpace(parentPos.width, items[0].offsetWidth);

    // enable elements and set each item position
    var enabled = items.map(function(item, index, ar) {
     if(index === 0) {
       item.style.top = 0;
       item.style.left = whiteSpace / 2 + 'px';

       nextPos[0] = {
         top: item.offsetHeight,
         left: 0
       }
     } else if(index < rowItemsNo) {
       prevItem = ar[index - 1];

       item.style.top = 0;
       item.style.left = prevItem.offsetLeft + prevItem.offsetWidth + 'px';

       nextPos[index] = {
         top: item.offsetHeight,
         left: item.offsetLeft
       };
     } else if(index % rowItemsNo <= nextPos.length){
       var posIndex = index % rowItemsNo;

       item.style.top = nextPos[posIndex].top + 'px';
       item.style.left = (posIndex) ? nextPos[posIndex].left + 'px' : (whiteSpace / 2) + 'px';

       nextPos[posIndex] = {
         top: item.offsetTop + item.offsetHeight,
         left: item.offsetLeft
       };
     }

     item.dataset.grid = true;
    });

    // set container height
    parentHeight = nextPos.reduce(function(prevPos, pos) {
      if(prevPos > pos.top) {
        return prevPos;
      } else {
        prevPos = pos.top;
        return prevPos;
      }
    }, nextPos[0].top);

    items[0].parentNode.style.height = parentHeight + 'px';
    return enabled;
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
    var _self = this,
        resizeTimeout;

    _enableItems(_checkItems(this.element.children));

    window.addEventListener('resize', resizeHandler);

    function resizeHandler() {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(function(){
        _self.update();
      }, 250);
    }
  };


  GridGallery.prototype.update = function() {
  };

  /* test-code */
  GridGallery.prototype.__test__ = {
    extend:        _extend,
    checkItems:    _checkItems,
    calWhiteSpace: _calWhiteSpace,
    enableItems:   _enableItems,
    disableAll: _disableAll
  }
  /* end-test-code */

  $win.GridGallery = GridGallery; // makes the component globally exist.

})(document, window);

