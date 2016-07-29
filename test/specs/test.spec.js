/*
 * General specifications GridGallery
 * 1- creates a grid using elements that will be in different heights and widths
 * 2- will enable gallery view on click to an element of the grid (dialog)
 * 3- the dialog will trigger custom events to control data in dialog
 * 4- nav of items in grid (disable/enable) depending on initialization
 */

describe('GridGallery', function(){
  describe('GridGallery initialization', function(){
    var x, options = { lightBox: true };

    before(function() {
      var container = document.createElement('div');
      var element = document.createElement('div');

      container.className = 'grid-gallery';
      element.className = 'grid-gallery__item';

      for (var i = 0; i < 5; i++) {
        container.appendChild(element);
      }

      x = new GridGallery(document.createElement('div'), options);
    });

    it('Global must have the GridGallery as a property', function() {
     expect(window.GridGallery).to.not.equal(undefined);
    });

    it('should manipulate the default options to the created instance', function() {
      var y = new GridGallery();
      expect(y.options).to.have.property('lightBox', false);
    });

    it('should extend the default options and icludes the new one', function() {
      expect(x.options).to.have.property('lightBox', true);
    });
  });
});
