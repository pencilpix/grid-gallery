
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
    window.removeEventListener('resize', gridInstance._boundResizeHandler);
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
    });

    it(`should have a getter max number of items per row and space`, () => {
      container.style.width = '700px';
      gridInstance = new GridGallery(container);

      expect(gridInstance.maxItemsPerRow).toBe(3);
      expect(gridInstance.remainSpace).toBe(50);
    });

    it('should set the rows number', () => {
      container.style.width = '700px';
      gridInstance = new GridGallery(container);

      expect(gridInstance.lastIndex).toEqual(3);
      expect(gridInstance.rows.length).toEqual(4);
    });

    it(`should set rows property and set the first item in first row
        position to top 0 and left empty value`, () => {

      let item = document.querySelector('.grid-gallery__item');
      let itemsNo = Math.floor(container.offsetWidth / item.offsetWidth);
      let space = Math.floor((container.offsetWidth - (item.offsetWidth * itemsNo))/2);
      gridInstance = new GridGallery(container);

      expect(gridInstance.rows[0][0].position.top).toEqual(0);
      expect(gridInstance.rows[0][0].position.left).toEqual(space);
    });

    it(`should set rows property and set the first item in second row
        position to top first item height and left empty value`, () => {

      let item = document.querySelector('.grid-gallery__item');
      let itemsNo = Math.floor(container.offsetWidth / item.offsetWidth);
      let space = Math.floor((container.offsetWidth - (item.offsetWidth * itemsNo))/2);
      gridInstance = new GridGallery(container);

      expect(gridInstance.rows[1][0].position.top).toEqual(item.offsetHeight);
      expect(gridInstance.rows[1][0].position.left).toEqual(space);
    });

    it(`should set rows property and set the second item in second row
        position to top first item height and left empty value`, () => {

      container.style.width = '700px';
      let item = document.querySelector('.grid-gallery__item');
      let itemsNo = Math.floor(container.offsetWidth / item.offsetWidth);
      let space = Math.floor((container.offsetWidth - (item.offsetWidth * itemsNo))/2);
      gridInstance = new GridGallery(container);
      let prevItem = container.querySelectorAll('.grid-gallery__item')[1];


      expect(gridInstance.rows[1][1].position.top).toEqual(prevItem.offsetHeight, 'height is not as expected');
      expect(gridInstance.rows[1][1].position.left).toEqual(space + item.offsetWidth);
    });

    it('should call update update on resize', (done) => {
      let event = new CustomEvent('Event');
      event.initEvent('resize', true, true);
      gridInstance = new GridGallery(container);

      spyOn(gridInstance, 'update');

      window.dispatchEvent(event);

      setTimeout(() => {
        expect(gridInstance.update).toHaveBeenCalled();
        done();
      }, gridInstance._delay + 100);
    });

    it('should set container height to the biggest position item + it\'s height', () => {
      container.style.width = '700px';
      gridInstance = new GridGallery(container);

      // height calculated manually
      expect(container.offsetHeight).toEqual(840);
    });

    it('should watch the container if any item inserted after plugin initialized', (done) => {
      container.style.width = '700px';
      gridInstance = new GridGallery(container, {watch: true});

      let div = insertElement(container, 'div', 'grid-gallery__item',{
          height: '220px',
          width: '200px'
        });

      setTimeout(() => {
        expect(div.style.top).toEqual('590px');
        expect(div.style.left).toEqual('450px');
        done();
      }, 50);
    });

    it('should not watch the container if any item inserted after plugin initialized', (done) => {
      container.style.width = '700px';
      gridInstance = new GridGallery(container, {watch: false});

      let div = insertElement(container, 'div', 'grid-gallery__item',{
          height: '220px',
          width: '200px'
        });

      setTimeout(() => {
        expect(div.style.top).toEqual('');
        expect(div.style.left).toEqual('');
        done();
      }, 50);
    });
  });
});

