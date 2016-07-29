/*
 * General specifications GridGallery
 * 1- creates a grid using elements that will be in different heights and widths
 * 2- will enable gallery view on click to an element of the grid (dialog)
 * 3- the dialog will trigger custom events to control data in dialog
 * 4- nav of items in grid (disable/enable) depending on initialization
 */

describe('GridGallery', function(){
  describe('GridGallery initialization', function(){
    it('Global must have the GridGallery as a property', function() {
     expect(window.GridGallery).to.not.equal(undefined);
    });

    it('should manipulate the default options to the created instance', function() {
      var x = new GridGallery();
      expect(x).to.have.property('options');
    });
  });
});
