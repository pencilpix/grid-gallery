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

  beforeEach(function() {
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

  });

  afterEach(function(){
    var oldContainer = document.querySelector('.container');
    oldContainer.parentNode.removeChild(oldContainer);
  });

  describe('GridGallery initialization', function(){

    it('Global must have the GridGallery as a property', function() {
      x = new GridGallery(container, options);
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
      x = new GridGallery(container, options);
      expect(x.options).toEqual({'lightBox': true});
    });

    it('should store the container as a property', function() {
      x = new GridGallery(container, options);
      expect(x.element).toEqual(container);
    });

    it('should have method init', function() {
      x = new GridGallery(container, options);
      expect(x.init).toBeDefined();
      expect(typeof x.init).toBe('function');
    });
  })

  describe('init() method', function() {
    it('should update the element and its childrens', function(){
      x = new GridGallery(container, options)
      expect(document.querySelector('.grid-gallery').offsetHeight).not.toBeLessThan(200);
      expect(document.querySelector('.grid-gallery__item').dataset.grid).toBe('true');
    });

    it('should update children positions', function() {
      var items;
      x = new GridGallery(container, options);

      items = document.body.querySelectorAll('.grid-gallery__item');
      for(var i = 0; i < items.length; i++) {
        expect(items[i].style.left).not.toBe('');
      }
    });
  });

  describe('Private Methods', function() {
    it('Private _extend: should be defined', function(){
      x = new GridGallery(container, options);
      expect(x.__test__.extend).toBeDefined();
    });

    it('Private _extend: should return an object after adding another one\'s properties' , function(){
      x = new GridGallery(container, options);
      var obj1 = {}, obj2 = {x: true};
      expect(x.__test__.extend({}, obj2)).toEqual(obj2);
      obj2.y = 'hello';
      expect(x.__test__.extend({}, obj2)).toEqual(obj2);
    });

    it('Private _extend: should extend object from other object\'s own properties' , function(){
      x = new GridGallery(container, options);
      var obj1 = {z: 4}, obj3 = Object.create(obj1);
      obj3.w = true;

      expect(x.__test__.extend({}, obj3).z).toBeUndefined();
      expect(x.__test__.extend({}, obj3).w).toBe(true);
    });

    it('Private _checkItems: should be defined', function() {
      x = new GridGallery(container, options);
      expect(x.__test__.checkItems).toBeDefined();
    });

    it('Private _checkItems: should return Array of not Enabled items', function() {
      var items;
      x = new GridGallery(container, options);
      for(var i = 0; i < 5; i++) {
        var div = document.createElement('div');
        div.className = 'grid-gallery__item';
        document.body.appendChild(div);
      }
      items = document.querySelectorAll('.grid-gallery__item');

      expect(x.__test__.checkItems(items).length).toBe(5);
      expect(x.__test__.checkItems(items)[0].className).toBe('grid-gallery__item');
      expect(x.__test__.checkItems(items)[0].dataset.grid).toBeUndefined();
    });
  });
});
