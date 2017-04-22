
describe('GridGallery', () => {
  let container, items, gridInstance;

  /**
   * create and insert element as a last child
   * applying to it a class name.
   * @param {HTMLElement}  wrap       wrapper to insert new element in
   * @param {String}       elem       type of element div/section ...etc
   * @param {String}       className  custom class to give to new element
   * @return {HTMLElement}
   */
  function insertElement(wrap, elem, className, styles) {
    let element = document.createElement(elem);

    if(className)
      element.className = className;

    if(styles) {
      for(let prop in styles) {
        element.style[prop] = styles[prop];
      }
    }

    wrap.appendChild(element);

    return element;
  }

  beforeEach(() => {
    container = insertElement(document.body, 'div', 'grid-gallery');

    for(let i = 0; i <= 10; i++) {
      insertElement(container, 'div', 'grid-gallery__item');
    }

    items = document.querySelectorAll('.grid-gallery__item');
    [...items].forEach((item, i) => {
      let height;
      let width = '200px';

      if(i === 0)
        height = '230px';
      else if(i === 7)
        height = '250px';
      else if(i % 2 === 0)
        height = '200px';
      else
        height = '190px';

      insertElement(item, 'div', 'demo-element', {height:  height, width: width});
    })
  });


  afterEach(() => {
    document.body.removeChild(container);
  });


  describe('General Initialize', () => {
    it('should have property direction to left', () => {
      gridInstance = new GridGallery(container, {direction: 'left'});

      expect(gridInstance.options.direction).toEqual('left');
    });

    it('should have property direction to right', () => {
      gridInstance = new GridGallery(container, {direction: 'right'});
      expect(gridInstance.options.direction).toEqual('right');
    });

    it(`should have property direction to right/left by default
        as document direction`, () => {
      document.documentElement.dir = 'rtl';
      gridInstance = new GridGallery(container);
      expect(gridInstance.options.direction).toEqual('right', 'should be right');

      document.documentElement.dir = 'ltr';
      gridInstance = new GridGallery(container);
      expect(gridInstance.options.direction).toEqual('left', 'should be left');
    });

    it('should have a getter itemWidth', () => {
      gridInstance = new GridGallery(container);

      expect(gridInstance.itemWidth).toEqual(200);

      [...container.querySelectorAll('.grid-gallery__item')].forEach((item) => {
        item.style.width = '300px';
      });

      expect(gridInstance.itemWidth).toEqual(300);
    })
  });

});

