import React from 'react';
import Hammer from 'hammerjs';
import ElementResizeDetector from 'element-resize-detector';
import { loadImage, isMobile } from 'utils';

const resizeDetector = ElementResizeDetector({
  strategy: 'scroll'
});

/**
 * image item structure
```
{ 
  url: '', 
  key: '' 
}
```
 */
class CanvasSlider {
  constructor(opts) {
    if (!opts.el) throw new Error('the root element must be provided');
    this.el = opts.el;
    this.images = opts.images || [];
    this.imagesLoaded = false;
    this.dpr = window.devicePixelRatio || 1;
    this.isRetina = this.dpr > 1;
    this.isMobile = isMobile();
    this.activeItem = 0;
    this.onEnterCanvas = opts.onEnterCanvas || null;
    this.onLeaveCanvas = opts.onLeaveCanvas || null;
    this.onResize = this.onResize.bind(this);
    this.init();
  }

  async init() {
    this.createCanvas();
    this.onResize(); // set initial size
    this.bindEvents();
  }

  bindEvents() {
    resizeDetector.listenTo(this.el, this.onResize);
    if (!this.isMobile) {
      this.onEnterCanvas && this.canvas.addEventListener('mouseenter', this.onEnterCanvas);
      this.onLeaveCanvas && this.canvas.addEventListener('mouseleave', this.onLeaveCanvas);
      this.canvas.addEventListener('mousedown', null);
      this.canvas.addEventListener('mouseup', null);
    } else {
      this.sliderHammer = new Hammer(this.el);
      this.sliderHammer.on("swiperight", this.previousItem);
      this.sliderHammer.on("swipeleft", this.nextItem);
    }
  }

  unbindEvents() {
    resizeDetector.removeListener(this.el, this.onResize);
    if(!this.isMobile) {
      this.onEnterCanvas && this.canvas.removeEventListener('mouseenter', this.onEnterCanvas);
      this.onLeaveCanvas && this.canvas.removeEventListener('mouseleave', this.onLeaveCanvas);
      this.canvas.removeEventListener('mousedown');
      this.canvas.removeEventListener('mouseup');
    } else {
      this.sliderHammer.off('swiperight', this.previousItem);
      this.sliderHammer.off('swipeleft', this.nextItem);
    }
  }

  setDimensions(width, height) {
    // TODO: resize
    this.width = width;
    this.height = height;
  }

  setImages(images) {
    // TODO: reset
  }

  onResize() {
    const offsetWidth = this.el.offsetWidth;
    const offsetHeight = this.el.offsetHeight;
    this.setDimensions(offsetWidth, offsetHeight);
    this.setCanvasSize();
  }

  async loadImages() {
    const promises = this.images.map((image, index) => {
      return loadImage(image.url).then(img => ({ image: img, index})).catch(() => null);
    });
    const result = await Promise.all(promises);
    const loadedImages = result.filter(item => !!item).map(item => {
      const { image, index } = item;
      const srcItem = this.images[index];
      return {
        ...srcItem,
        ratio: image.naturalWidth / image.naturalHeight,
        width: image.naturalWidth,
        height: image.naturalHeight,
        image
      };
    });
    this.loadImages = loadedImages;
    this.imagesLoaded = true;
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx;
    this.ctx.scale(this.dpr, this.dpr);
    this.el.appendChild(canvas);
  }

  setCanvasSize() {
    const scale = this.dpr;
    const canvas = this.canvas;
    // canvas size
    canvas.width = this.width * scale;
    canvas.height = this.height * scale;
    // display size
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
  }

  nextItem() {

  }

  previousItem() {

  }
}

class CanvasSliderComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      loadedImages: [],
    };
  }

  render() {
    return (
      <div>
        <canvas ref={e => { this.canvas = e; }}></canvas>
      </div>
    )
  }
}