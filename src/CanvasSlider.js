import React from 'react';
import Hammer from 'hammerjs';
import ElementResizeDetector from 'element-resize-detector';
import { loadImage, isMobile } from 'utils';

const resizeDetector = ElementResizeDetector({
  strategy: 'scroll'
});

class CanvasSlider {
  static defaultPreset = {
    minScale: 0.5,
    maxScale = 1,
    movingScale: 0.5,
    minClip = 0,
    maxClip = .15,
    minAlpha = 0,
    maxAlpha = 1,
    minPan = -.05,
    maxPan = 1.05,
    maxImageStretch: 500,
    alphaSpeed: 0.25,
    scaleSpeed: 0.1,
    clipSpeed: 0.05,
    panSpeed: 0.07,
    dragSpeedFactor: 0.06,
    horizontalSpacerFactor: 0.6,
    scrollingScaleOffset: 1
  }

  static presets = [
    {
      predicate: ({ width, height }) => {
        return width < 768;
      },
      settings: {
        minScale: 0.8,
        movingScale: 0.8,
        maxImageStretch: 200,
        scaleSpeed: 0.2,
        clipSpeed: 0.2,
        panSpeed: 0.15,
        dragSpeedFactor: 0.15
      }
    },
    {
      predicate: ({ width, height }) => {
        return width >= 768;
      },
      settings: {
        minScale: 0.5,
        movingScale: 0.5,
        maxImageStretch: 500,
        scaleSpeed: 0.1,
        clipSpeed: 0.05,
        panSpeed: 0.07,
        dragSpeedFactor: 0.06
      }
    }
  ]

  constructor(opts) {
    if (!opts.el) throw new Error('the root element must be provided');
    this.el = opts.el;
    this.images = opts.images || [];
    this.imagesLoaded = false;
    this.dpr = window.devicePixelRatio || 1;
    this.isRetina = this.dpr > 1;
    this.isMobile = isMobile();
    this.activeItem = 0;
    this.isMouseDown = false;
    this.frameId = null;
    this.onEnterCanvas = opts.onEnterCanvas || null;
    this.onLeaveCanvas = opts.onLeaveCanvas || null;
    this.onResize = this.onResize.bind(this);
    this.previousItem = this.previousItem.bind(this);
    this.nextItem = this.nextItem.bind(this);
    this.moveImageBackward = this.moveImageBackward.bind(this);
    this.moveImageForward = this.moveImageForward.bind(this);
    this.render = this.render.bind(this);
    this.init();
  }

  async init() {
    this.createCanvas();
    this.onResize(); // set initial size
    this.bindEvents();
    await this.loadImages();
  }

  bindEvents() {
    resizeDetector.listenTo(this.el, this.onResize);
    if (!this.isMobile) {
      this.onEnterCanvas && this.canvas.addEventListener('mouseenter', this.onEnterCanvas);
      this.onLeaveCanvas && this.canvas.addEventListener('mouseleave', this.onLeaveCanvas);
      this.canvas.addEventListener('mousedown', this.moveImageBackward);
      this.canvas.addEventListener('mouseup', this.moveImageForward);
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
      this.canvas.removeEventListener('mousedown', this.moveImageBackward);
      this.canvas.removeEventListener('mouseup', this.moveImageForward);
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
    this.loadedImages = loadedImages;
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

  setImageSizes() {
    const remainingSpacing = this.isRetina ? 200 : 126;
    this.loadedImages.forEach(image => {
      const xGap = this.width - image.width;
      const yGap = this.height - image.height;
      const ratio = image.ratio;
      if (xGap < yGap) {
        const w = this.width - remainingSpacing;
        image.xSize = w;
        image.ySize = w / ratio;
      } else {
        const h = this.height - remainingSpacing;
        image.xSize = h * ratio;
        image.ySize = h;
      }
    });
  }

  setImageScales() {
    this.loadedImages.forEach((image, idx) => {
      if (this.activeItem === idx) {
        image.xScale = 
      }
    })
  }

  nextItem() {

  }

  previousItem() {

  }

  moveImageForward() {
    this.isMouseDown = false;
  }

  moveImageBackward() {
    this.isMouseDown = true;
  }

  startDraw() {
    this.frameId = requestAnimationFrame(this.render);
  }

  stopDraw() {
    if (this.frameId != null) cancelAnimationFrame(this.frameId);
  }

  render() {
    
    this.frameId = requestAnimationFrame(this.render);
  }

}

class CanvasSliderComp extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.slider = new CanvasSlider({
      el: this.root,
      images: [
        { url: '', key: '' },

      ]
    });
  }

  render() {
    return (
      <div ref={e => { this.root = e; }}>
        
      </div>
    )
  }
}