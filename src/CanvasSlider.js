import React from 'react';
import Hammer from 'hammerjs';
import ElementResizeDetector from 'element-resize-detector';
import { loadImage, isMobile } from './utils';

const resizeDetector = ElementResizeDetector({
  strategy: 'scroll'
});

const track = (origin, target, speed) => {
  return origin + (target - origin) * speed;
}

class CanvasSlider {
  static defaultPreset = {
    minScale: 0.5,
    maxScale: 1,
    movingScale: 0.5,
    minClip: 0,
    maxClip: .15,
    minAlpha: 0,
    maxAlpha: 1,
    minPan: -.05,
    maxPan: 1.05,
    maxImageStretch: 500,
    alphaSpeed: 0.25,
    scaleSpeed: 0.1,
    clipSpeed: 0.05,
    panSpeed: 0.07,
    dragSpeedFactor: 0.06,
    horizontalSpacerFactor: 0.6
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
    this.onEnterCanvas = opts.onEnterCanvas || null;
    this.onLeaveCanvas = opts.onLeaveCanvas || null;
    this.onResize = this.onResize.bind(this);
    this.previousItem = this.previousItem.bind(this);
    this.nextItem = this.nextItem.bind(this);
    this.moveImageBackward = this.moveImageBackward.bind(this);
    this.moveImageForward = this.moveImageForward.bind(this);
    this.render = this.render.bind(this);
    this.setImageSize = this.setImageSize.bind(this);
    this.setImagePosition = this.setImagePosition.bind(this);
    this.init();
  }

  async init() {
    const offsetWidth = this.el.offsetWidth;
    const offsetHeight = this.el.offsetHeight;
    this.setDimensions(offsetWidth, offsetHeight);
    this.initPresets();
    this.createCanvas();
    this.setCanvasSize();
    this.bindEvents();
    await this.loadImages();
    this.initVariables(); // do this after image load because some variables depend on item count
  }

  get horizontalSpacer() {
    return this.width * this.horizontalSpacerFactor;
  }

  get maxXOffset() {
    return (this.itemCount - 1) * this.horizontalSpacer;
  }

  get itemCount() {
    return this.loadedImages.length;
  }

  initPresets() {
    const width = this.width;
    const height = this.height;
    const defaultPreset = CanvasSlider.defaultPreset;
    const presets = CanvasSlider.presets;
    const usedPresets = presets.filter((preset) => {
      return preset.predicate({
        width,
        height
      });
    }).map(preset => preset.settings);
    const currentPreset = Object.assign({}, defaultPreset, ...usedPresets);
    const presetKeys = Object.keys(currentPreset);
    for (let key of presetKeys) {
      this[key] = currentPreset[key];
    }
  }

  initVariables() {
    this.frameId = null;
    this.activeItem = 0;
    this.isMouseDown = false;
    this.mouseStart = [0, 0];
    this.mouseCurrent = this.mouseStart;
    this.direction = 0;
    this.stretchX = 0;
    this.stretchXOffset = 0;
    this.speed = 0;
    this.currentXOffset = this.horizontalSpacer * this.activeItem;
    this.actualXOffset = this.currentXOffset;
    this.newDecimal = 0;
    this.trackingDecimal = 1 / (this.itemCount - 1) * this.activeItem;
    this.endDecimal = this.trackingDecimal;
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
    this.initPresets();
    this.setCanvasSize();
    this.iterateImage(this.setImageSize, this.setImagePosition);
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

  iterateImage(operations = []) {
    if (this.loadedImages && this.loadedImages.length > 0 && operations && operations.length > 0) {
      this.loadedImages.forEach((image, idx) => {
        operations.forEach(image, idx);
      });
    }
  }

  setImageSize(image) {
    const remainingSpacing = this.isRetina ? 200 : 126;
    const xGap = this.width - image.width;
    const yGap = this.height - image.height;
    const ratio = image.ratio;
    if (xGap < yGap) {
      const w = this.width - remainingSpacing;
      image.sizeX = w;
      image.sizeY = w / ratio;
    } else {
      const h = this.height - remainingSpacing;
      image.sizeX = h * ratio;
      image.sizeY = h;
    }
  }

  setImagePosition(image, idx) {
    image.posX = this.horizontalSpacer * idx;
    image.posY = this.height / 2;
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

  initDraw() {
    const initImageProps = (image, idx) => {
      const scale = idx === this.activeItem ? this.maxScale : this.minScale;
      image.scaleX = scale;
      image.scaleY = scale;
      image.clipX = this.maxClip;
      image.clipY = this.maxClip;
      image.alpha = idx === this.activeItem ? this.maxAlpha : this.minAlpha;
    }

    const initImageTargetProps = (image, idx) => {
      const scale = this.activeItem === idx ? this.maxScale : this.minScale;
      const clip = this.activeItem === idx ? this.minClip : this.maxClip;
      const alpha = this.activeItem === idx ? this.maxAlpha : this.minAlpha;
      image.targetScaleX = scale;
      image.targetScaleY = scale;
      image.targetClipX = clip;
      image.targetClipY = clip;
      image.targetAlpha = alpha;
    }

    this.iterateImage(
      this.setImageSize,
      this.setImagePosition,
      initImageProps,
      initImageTargetProps
    );

    this.drawImages();
    this.startDraw();
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

  drawImages() {
    const canvas = this.canvas;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const halfWidth = this.width / 2;
    this.loadedImages.forEach((img, idx) => {
      const { width, height, sizeX, sizeY, clipX, clipY, scaleX, scaleY, posX, posY, alpha, image: imageEl } = img;
      const sx = width * clipX / 2;
      const sy = height * clipY / 2;
      const sWidth = width - width * clipX;
      const sHeight = height - height * clipY;
      const dWidth = sizeX * scaleX + this.stretchX;
      const dHeight = sizeY * scaleY;
      const dx = posX + halfWidth - (dWidth / 2 + (this.actualXOffset + this.stretchXOffset));
      const dy = posY - dHeight / 2;
      ctx.globalAlpha = alpha;
      ctx.drawImage(imageEl, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      ctx.globalAlpha = 1;
    });
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