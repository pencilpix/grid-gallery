# grid-gallery
JavaScript grid gallery to produce un-equal cols grid

[![Build Status](https://travis-ci.org/pencilpix/grid-gallery.svg?branch=develop)](https://travis-ci.org/pencilpix/grid-gallery)
[![Coverage Status](https://coveralls.io/repos/github/pencilpix/grid-gallery/badge.svg?branch=develop)](https://coveralls.io/github/pencilpix/grid-gallery?branch=develop)
<a href="https://david-dm.org/pencilpix/grid-gallery"><img src="https://david-dm.org/pencilpix/grid-gallery.svg" alt="Dependency Status"></a>
<a href="https://david-dm.org/pencilpix/grid-gallery/?type=dev"><img src="https://david-dm.org/pencilpix/grid-gallery/dev-status.svg" alt="devDependency Status"></a>


## Installation:

1. via npm
    grid gallery can be used via CommonJS or AMD after installation via npm.
    ```
    $ npm install --save grid-gallery
    ```

2. bower
    ```
    $ bower install --save grid-gallery
    ```

## usage:

the container must have `grid-gallery` class and the grid items `grid-gallery__item`

```html
  <!-- grid container -->
  <div id="container" class="grid-gallery">
    <!-- grid item -->
    <div class="grid-gallery__item">
      <div>
        <!-- some content -->
      </div>
    </div>

    <!-- grid item -->
    <div class="grid-gallery__item">
      <div>
        <!-- some content -->
      </div>
    </div>

    ....

  </div>
```


```js
var options = {
  direction: 'right', // left is default for ltr and right for rtl.

  watch: true         // false by default, and if set to true
                      // it will watch DOM changes
                      // and update positions if grid item inserted/removed
}
```




