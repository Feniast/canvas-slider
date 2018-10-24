import React from 'react';
import { loadImage } from 'utils';

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
    this.dpr = window.devicePixelRatio || 1;
    this.width = opts.width || window.innerWidth;
    this.height = opts.height || window.innerHeight;
    this.isRetina = this.dpr > 1;
    this.activeItem = 0;
  }

  async init() {
    this.createCanvas();
    this.setCanvasSize();
    
  }

  setDimensions(width, height) {
    // TODO: resize
  }

  setImages(images) {
    // TODO: reset
  }

  async loadImages() {
    const promises = this.images.map((image, index) => {
      return loadImage(image.url).then(img => ({ image: img, index})).catch(() => null);
    });
    const result = await Promise.all(promises);
    const loadedImages = result.filter(item => !!item);
    
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