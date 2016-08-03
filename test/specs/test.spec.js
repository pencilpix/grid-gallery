/*
 * General specifications GridGallery
 * 1- creates a grid using elements that will be in different heights and widths
 * 2- will enable gallery view on click to an element of the grid (dialog)
 * 3- the dialog will trigger custom events to control data in dialog
 * 4- nav of items in grid (disable/enable) depending on initialization
 */

describe('GridGallery', function(){
  var x, options = { lightBox: true };
  var container;
  document.body.className = 'grid-gallery__example';

  beforeAll(function() {
    var wrapper = document.createElement('div');
    wrapper.className = 'container';


    container = document.createElement('div');
    container.className = 'grid-gallery';

    for (var i = 0; i < 5; i++) {
      var element = document.createElement('div');
      var p = document.createElement('p');
      p.textContent = 'lorem nav of items in grid (disable/enable) depending on initialization';
      element.className = 'grid-gallery__item grid-gallery__dummy';
      element.appendChild(p);
      container.appendChild(element);
    }

    wrapper.appendChild(container);
    document.body.appendChild(wrapper);

    x = new GridGallery(container, options);
  });

  describe('GridGallery initialization', function(){

    it('Global must have the GridGallery as a property', function() {
     expect(GridGallery).not.toBeUndefined();
    });

    it('should manipulate the default options to the created instance', function() {
      var div = document.createElement('div');
      var childs = document.createElement('div');
      childs.className = 'grid-gallery__item';
      div.appendChild(childs);
      var y = new GridGallery( div, {});
      expect(y.options).toEqual({'lightBox': false});
    });

    it('should extend the default options and icludes the new one', function() {
      expect(x.options).toEqual({'lightBox': true});
    });

    it('should store the container as a property', function() {
      expect(x.element).toEqual(container);
    });

    it('should have method init', function() {
      expect(x.init).toBeDefined();
      expect(typeof x.init).toBe('function');
    });
  });
});
