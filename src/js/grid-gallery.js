/*
 * @Description: GridGallery is a plugin that will generate a grid depending on
 *               the elements width and height. it is not required to have the same height
 *               also you can enable/disable show lightbox effect to load content
 *
 * @license:      under MIT
 *                https://github.com/pencilpix/grid-gallery/blob/master/LICENSE
 * @Author:       Mohamed Hassan
 * @Author Url:   http://mohamedhassan.me
 */
(function($doc, $win){
  'use strict';

  const DEFAULTS = { direction: 'left' };
  const VERSION = '1.0.1-alpha';


  /*
   * class constructor of GridGallery component
   * @param { HTMLElement } element The element that will be the container.
   * @param { Object } options The options to initialize the component.
   */
  class GridGallery {
    constructor(element, options) {

      this.element = element;

      this.options = Object.assign({}, DEFAULTS, options); // extend options to default
      this.init();
    }

    /**
     * PUBLIC
     * ===================================*/

    /*
     * init this method that do the rest of initialization
     * work and updates the dom.
     */
    init() {
      var _self = this,
          resizeTimeout;

      this._enableItems(this._checkItems(this.element.children));

      window.addEventListener('resize', resizeHandler);

      function resizeHandler() {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function(){
          _self.update();
        }, 250);
      }

      // enable dom observer
      this._createObserver(this, this.element, this.update);
    }


    update() {
      this._disableAll(this.element.querySelectorAll('.grid-gallery__item'));
      this._enableItems(this._checkItems(this.element.children));
    }



    /**
     * Private
     * =========================================*/

    /**
     * create an observer for dom element and invoke callback it the change is
     * a node list.
     * @param  { Object }      context   the Object that will be used in explicit call
     * @param  { HTMLElement } target    the element that it should be observed
     * @param  { Function }    callback  function that will run when DOM changed
     * @return { Object }                observer
     */
    _createObserver(context, target, callback) {
      // MutationObserver compatability.
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
          eventListenerSupported = window.addEventListener;

      // handler if MutationObserver is not supported
      function _handler() {
        callback.call(context);
      }

      if(MutationObserver) {
        // create observer.
        var observer = new MutationObserver(function(mutations) {
          if(mutations[0].addedNodes.length || mutations[0].removedNodes.length){
            callback.call(context);
          }
        });

        // configuration of the observer:
        var config = {childList: true};

        // pass in the target node, as well as the observer options
        observer.observe(target, config);
      } else if(eventListenerSupported) {
        target.addEventListener('DOMNodeInserted', _handler, false);
        target.addEventListener('DOMNodeRemoved', _handler, false);
      }
    }



    /*
     * _checkItems Private method that check if GridGallery enabled on items
     * @param { Array-like } items The grid elements.
     * @return { Array } notEnabled The grid items that not set yet.
     */
    _checkItems(items) {
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
    _disableAll(items) {
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
    _calWhiteSpace (parentWidth, itemWidth) {
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
    _enableItems(items) {
      var parentPos = items[0].parentNode.getBoundingClientRect();
      var rowItemsNo = Math.floor(parentPos.width / items[0].offsetWidth);
      var nextPos = [];
      var prevItem, parentHeight;
      var whiteSpace = this._calWhiteSpace(parentPos.width, items[0].offsetWidth);

      // enable elements and set each item position
      var enabled = items.map(function(item, index, ar) {
       if(index === 0) {
         item.dataset.top = 0;
         item.dataset.left = whiteSpace / 2;

         item.style.top = 0;
         item.style.left = whiteSpace / 2 + 'px';

         nextPos[0] = {
           top: item.offsetHeight,
           left: 0
         }
       } else if(index < rowItemsNo) {
         prevItem = ar[index - 1];

         item.dataset.top = 0;
         item.dataset.left = parseInt(prevItem.dataset.left) + prevItem.offsetWidth;

         item.style.top = 0;
         item.style.left = parseInt(prevItem.dataset.left) + prevItem.offsetWidth + 'px';

         nextPos[index] = {
           top: item.offsetHeight,
           left: parseInt(item.dataset.left)
         };
       } else if(index % rowItemsNo <= nextPos.length){
         var posIndex = index % rowItemsNo;

         item.dataset.top = nextPos[posIndex].top;
         item.dataset.left = (posIndex) ? nextPos[posIndex].left : (whiteSpace / 2);

         item.style.top = nextPos[posIndex].top + 'px';
         item.style.left = (posIndex) ? nextPos[posIndex].left + 'px' : (whiteSpace / 2) + 'px';

         nextPos[posIndex] = {
           top: parseInt(item.dataset.top) + item.offsetHeight,
           left: parseInt(item.dataset.left)
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

  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GridGallery;
  } else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return GridGallery;
      });
    } else {
      $win.GridGallery = GridGallery;
    }
  }

})(document, window);
