import React from 'react';
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
    this.width = opts.width || window.innerWidth;
    this.height = opts.height || window.innerHeight;
    this.isRetina = this.dpr > 1;
    this.isMobile = isMobile();
    this.activeItem = 0;
    this.onEnterCanvas = opts.onEnterCanvas || null;
    this.onLeaveCanvas = opts.onLeaveCanvas || null;
    this.onResize = this.onResize.bind(this);
  }

  async init() {
    this.createCanvas();
    this.setCanvasSize();
    
  }

  bindEvents() {
    resizeDetector.listenTo(this.el, this.onResize);
    if (!this.isMobile) {
      this.onEnterCanvas && this.canvas.addEventListener('mouseenter', this.onEnterCanvas);
      this.onLeaveCanvas && this.canvas.addEventListener('mouseleave', this.onLeaveCanvas);
    }
  }

  unbindEvents() {
    resizeDetector.removeListener(this.el, this.onResize);
    if(!this.isMobile) {
      this.onEnterCanvas && this.canvas.removeEventListener('mouseenter', this.onEnterCanvas);
      this.onLeaveCanvas && this.canvas.removeEventListener('mouseleave', this.onLeaveCanvas);
    }
  }

  setDimensions(width, height) {
    // TODO: resize
  }

  setImages(images) {
    // TODO: reset
  }

  onResize(el) {

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