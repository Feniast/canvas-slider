l(e, [{
  key: "init",
  value: function() {
      h(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "init", this).call(this),
      this.slider = this.cont.querySelector("#full-slider"),
      this.listItems = this.cont.querySelectorAll(".home-slider__images li"),
      this.scrollLinkBtn = this.cont.querySelector(".home-slider__bottom-arrow"),
      this.sliderHammer = new y.default(this.slider),
      this.retina = window.devicePixelRatio > 1 && this.cont.offsetWidth <= 1024,
      this.activeWidth = this.retina ? 2 * this.cont.offsetWidth : this.cont.offsetWidth,
      this.activeHeight = this.retina ? 2 * d.w.height : d.w.height,
      this.isTouch = this.cont.offsetWidth <= 1024,
      this.isMobile = this.cont.offsetWidth < 768,
      this.loadMobile = this.isMobile,
      this.initialImagesLoaded = !1,
      this.activeItem = 0,
      this.halfXOffset = this.activeWidth / 2,
      this.halfYOffset = this.activeHeight / 2,
      this.horizontalSpacer = .6 * this.activeWidth,
      this.imageCount = this.listItems.length,
      this.minScale = this.isMobile ? .8 : .5,
      this.movingScale = this.isMobile ? .8 : .5,
      this.maxScale = 1,
      this.minClip = 0,
      this.maxClip = .15,
      this.minAlpha = 0,
      this.maxAlpha = 1,
      this.maxXOffset = this.horizontalSpacer * (this.imageCount - 1),
      this.minPan = -.05,
      this.maxPan = 1.05,
      this.maxMouseMove = this.retina ? this.activeWidth / 4 : this.activeWidth / 2,
      this.maxImageStretch = this.isMobile ? 200 : 500,
      this.imageUrls = [],
      this.imageUrlsMobile = [],
      this.activeLoadImage = 0,
      this.imageRatios = [],
      this.imageRatiosMobile = [],
      this.loadedImages = [],
      this.loadedImagesMobile = [],
      this.loadedImageCount = 0,
      this.naturalWidths = [],
      this.naturalHeights = [],
      this.naturalWidthsMobile = [],
      this.naturalHeightsMobile = [],
      this.stretchX = 0,
      this.stretchXOffset = 0,
      this.targetURLs = [];
      for (var t = 0; t < this.listItems.length; t++)
          this.imageUrls.push(m.getAttribute(this.listItems[t], "desktop-image")),
          this.imageUrlsMobile.push(m.getAttribute(this.listItems[t], "mobile-image")),
          this.targetURLs.push(m.getAttribute(this.listItems[t], "target"));
      this.c = null,
      this.ctx = null,
      this.animation = null,
      this.direction = 0,
      this.xPositions = [],
      this.yPositions = [],
      this.startingMouseOffset = 0,
      this.currentMouseOffset = 0,
      this.currentXOffset = this.horizontalSpacer * this.activeItem,
      this.actualXOffset = this.horizontalSpacer * this.activeItem,
      this.newDecimal = 0,
      this.trackingDecimal = 1 / (this.listItems.length - 1) * this.activeItem,
      this.endDecimal = this.trackingDecimal,
      this.xSizes = [],
      this.ySizes = [],
      this.scalesX = [],
      this.scalesY = [],
      this.targetScalesX = [],
      this.targetScalesY = [],
      this.scrollingScaleOffset = 1,
      this.clipsX = [],
      this.clipsY = [],
      this.targetClipsX = [],
      this.targetClipsY = [],
      this.alphas = [],
      this.targetAlphas = [],
      this.speed = 0,
      this.scaleSpeed = this.isMobile ? .2 : .1,
      this.clipSpeed = this.isMobile ? .2 : .05,
      this.alphaSpeed = .25,
      this.panSpeed = this.isMobile ? .15 : .07,
      this.dragSpeedFactor = this.isMobile ? .15 : .06,
      this.currentNavIndex = 0,
      this.newNavIndex = 0,
      this.introRect = {
          height: 1,
          targetHeight: 0
      },
      this.iterateTimer = null,
      this.titles = this.cont.querySelector(".home-slider__list"),
      this.link = this.cont.querySelector(".home-slider__content-btn"),
      this.linkTarget = this.link.querySelector("a"),
      this.linkSpan = this.link.querySelector("span"),
      this.nav = this.cont.querySelector(".home-slider__nav-wrapper"),
      this.resizeBound = this.resize.bind(this),
      this.createCanvasBound = this.createCanvas.bind(this),
      this.setCanvasSizeBound = this.setCanvasSize.bind(this),
      this.loadImagesInOrderBound = this.loadImagesInOrder.bind(this),
      this.setScrollOffsetBound = this.setScrollOffset.bind(this),
      this.setImageSizesBound = this.setImageSizes.bind(this),
      this.setImageScalesBound = this.setImageScales.bind(this),
      this.setImagePositionsBound = this.setImagePositions.bind(this),
      this.setImageClipsBound = this.setImageClips.bind(this),
      this.setImageAlphasBound = this.setImageAlphas.bind(this),
      this.drawImagesInitialBound = this.drawImagesInitial.bind(this),
      this.getInitialTargetsBound = this.getInitialTargets.bind(this),
      this.setSliderCursorBound = this.setSliderCursor.bind(this),
      this.unsetSliderCursorBound = this.unsetSliderCursor.bind(this),
      this.setInitialLinkTitleBound = this.setInitialLinkTitle.bind(this),
      this.setTitleItemBound = this.setTitleItem.bind(this),
      this.setLinkItemBound = this.setLinkItem.bind(this),
      this.initialSliderAnimationsBound = this.initialSliderAnimations.bind(this),
      this.secondarySliderAnimationsBound = this.secondarySliderAnimations.bind(this),
      this.setSliderBackBound = this.setSliderBack.bind(this),
      this.setSliderForwardBound = this.setSliderForward.bind(this),
      this.updateMousePositionBound = this.updateMousePosition.bind(this),
      this.startAnimBound = this.startAnim.bind(this),
      this.endAnimBound = this.endAnim.bind(this),
      this.renderBound = this.render.bind(this),
      this.reDrawImagesBound = this.reDrawImages.bind(this),
      this.reDrawActiveImageBound = this.reDrawActiveImage.bind(this),
      this.nextItemBound = this.nextItem.bind(this),
      this.previousItemBound = this.previousItem.bind(this),
      this.mobileTransitionBound = this.mobileTransition.bind(this),
      this.mobileTransitionEndBound = this.mobileTransitionEnd.bind(this),
      this.addEventsBound = this.addEvents.bind(this),
      this.removeEventsBound = this.removeEvents.bind(this),
      this.desktopAutoIterateBound = this.desktopAutoIterate.bind(this),
      this.autoIterationEndBound = this.autoIterationEnd.bind(this),
      this.resizeDebounced = (0,
      _.debounce)(this.resize.bind(this), 250),
      this.createCanvasBound(),
      this.setSliderCursorBound()
  }
}, {
  key: "initEvents",
  value: function() {
      h(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "initEvents", this).call(this),
      d.win.addEventListener("resize", this.resizeDebounced),
      this.isTouch || (this.c.addEventListener("mouseenter", this.setSliderCursorBound),
      this.c.addEventListener("mouseleave", this.unsetSliderCursorBound))
  }
}, {
  key: "destroyEvents",
  value: function() {
      h(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "destroyEvents", this).call(this),
      d.win.removeEventListener("resize", this.resizeDebounced),
      this.removeEventsBound(),
      this.endAnimBound(),
      this.iterateTimer && clearTimeout(this.iterateTimer)
  }
}, {
  key: "addEvents",
  value: function() {
      this.isTouch ? (this.sliderHammer.on("swipeleft", this.nextItemBound),
      this.sliderHammer.on("swiperight", this.previousItemBound)) : (this.c.addEventListener("mousedown", this.setSliderBackBound),
      this.c.addEventListener("mouseup", this.setSliderForwardBound))
  }
}, {
  key: "removeEvents",
  value: function() {
      this.iterateTimer && clearTimeout(this.iterateTimer),
      this.isTouch ? (this.c.removeEventListener("mouseenter", this.setSliderCursorBound),
      this.c.removeEventListener("mouseleave", this.unsetSliderCursorBound),
      this.c.removeEventListener("mousedown", this.setSliderBackBound),
      this.c.removeEventListener("mouseup", this.setSliderForwardBound)) : (this.sliderHammer.off("swipeleft", this.nextItemBound),
      this.sliderHammer.off("swiperight", this.previousItemBound))
  }
}, {
  key: "resize",
  value: function() {
      this.activeWidth = this.retina ? 2 * this.cont.offsetWidth : this.cont.offsetWidth,
      this.activeHeight = this.retina ? 2 * this.cont.offsetHeight : this.cont.offsetHeight,
      this.halfXOffset = this.activeWidth / 2,
      this.halfYOffset = this.activeHeight / 2,
      this.activeWidth <= 768 && !this.isMobile ? (this.isMobile = !0,
      this.horizontalSpacer = .9 * this.activeWidth,
      this.minScale = .8,
      this.movingScale = .8,
      this.panSpeed = .15,
      this.scaleSpeed = .4,
      this.clipSpeed = .4,
      this.dragSpeedFactor = .15,
      this.maxImageStretch = 200,
      this.removeEventsBound(),
      this.addEventsBound()) : this.activeWidth > 768 && this.isMobile ? (this.isMobile = !1,
      this.horizontalSpacer = .6 * this.activeWidth,
      this.minScale = .5,
      this.movingScale = .5,
      this.panSpeed = .07,
      this.scaleSpeed = .1,
      this.clipSpeed = .05,
      this.dragSpeedFactor = .06,
      this.maxImageStretch = 500,
      this.removeEventsBound(),
      this.addEventsBound()) : this.isMobile ? this.horizontalSpacer = .9 * this.activeWidth : this.horizontalSpacer = .6 * this.activeWidth,
      this.maxXOffset = this.horizontalSpacer * (this.listItems.length - 1),
      this.currentXOffset = this.maxXOffset * this.endDecimal,
      this.setCanvasSizeBound(),
      this.setImageSizesBound(),
      this.setImagePositionsBound()
  }
}, {
  key: "createCanvas",
  value: function() {
      this.c = d.doc.createElement("canvas"),
      this.ctx = this.c.getContext("2d"),
      this.retina && this.ctx.scale(2, 2),
      this.setCanvasSizeBound(),
      this.loadImagesInOrderBound(),
      this.setInitialLinkTitleBound(),
      this.slider.appendChild(this.c)
  }
}, {
  key: "setCanvasSize",
  value: function() {
      this.c.width = this.retina ? 2 * this.activeWidth : this.activeWidth,
      this.c.height = this.retina ? 2 * this.activeHeight : this.activeHeight,
      this.c.style.width = this.activeWidth + "px",
      this.c.style.height = this.activeHeight + "px"
  }
}, {
  key: "loadImagesInOrder",
  value: function() {
      var t = this
        , e = new Image;
      this.loadMobile ? (e.src = this.imageUrlsMobile[this.loadedImageCount],
      e.onload = function() {
          t.imageRatiosMobile.push(e.naturalWidth / e.naturalHeight),
          t.loadedImagesMobile.push(e),
          t.naturalWidthsMobile.push(e.naturalWidth),
          t.naturalHeightsMobile.push(e.naturalHeight),
          t.loadedImageCount++,
          t.drawImagesInitialBound()
      }
      ) : (e.src = this.imageUrls[this.loadedImageCount],
      e.onload = function() {
          t.imageRatios.push(e.naturalWidth / e.naturalHeight),
          t.loadedImages.push(e),
          t.naturalWidths.push(e.naturalWidth),
          t.naturalHeights.push(e.naturalHeight),
          t.loadedImageCount++,
          t.drawImagesInitialBound()
      }
      )
  }
}, {
  key: "setInitialLinkTitle",
  value: function() {
      "true" === this.listItems[this.activeItem].getAttribute("data-video") ? this.linkSpan.innerHTML = "Watch film" : this.linkSpan.innerHTML = "View shoot"
  }
}, {
  key: "setScrollOffset",
  value: function(t) {
      this.scrollingScaleOffset = t
  }
}, {
  key: "setImageSizes",
  value: function() {
      this.xSizes = [],
      this.ySizes = [];
      for (var t = this.isMobile ? this.loadedImagesMobile : this.loadedImages, e = 0; e < t.length; e++) {
          var i = this.isMobile ? this.activeWidth - this.naturalWidthsMobile[e] : this.activeWidth - this.naturalWidths[e]
            , n = this.isMobile ? this.activeHeight - this.naturalHeightsMobile[e] : this.activeHeight - this.naturalHeights[e]
            , s = this.isMobile ? this.imageRatiosMobile[e] : this.imageRatios[e]
            , r = this.retina ? 200 : 126;
          if (i < n) {
              var o = this.activeWidth - r;
              this.xSizes.push(o),
              this.ySizes.push(o / s)
          } else {
              var a = this.activeHeight - r;
              this.xSizes.push(a * s),
              this.ySizes.push(a)
          }
      }
  }
}, {
  key: "setImageScales",
  value: function() {
      this.scalesX = [],
      this.scalesY = [];
      for (var t = 0; t < this.listItems.length; t++) {
          var e = this.activeItem === t ? this.maxScale : this.minScale;
          this.scalesX.push(e),
          this.scalesY.push(e)
      }
  }
}, {
  key: "setImagePositions",
  value: function() {
      this.xPositions = [],
      this.yPositions = [];
      for (var t = 0; t < this.listItems.length; t++)
          this.xPositions.push(this.horizontalSpacer * t),
          this.yPositions.push(this.halfYOffset)
  }
}, {
  key: "setImageClips",
  value: function() {
      this.clipsX = [],
      this.clipsY = [];
      for (var t = 0; t < this.listItems.length; t++)
          this.clipsX.push(this.maxClip),
          this.clipsY.push(this.maxClip)
  }
}, {
  key: "setImageAlphas",
  value: function() {
      this.alphas = [];
      for (var t = 0; t < this.listItems.length; t++) {
          var e = this.activeItem === t ? this.maxAlpha : this.minAlpha;
          this.alphas.push(e)
      }
  }
}, {
  key: "getInitialTargets",
  value: function() {
      for (var t = 0; t < this.listItems.length; t++) {
          var e = this.activeItem === t ? this.maxScale : this.minScale;
          this.targetScalesX[t] = e,
          this.targetScalesY[t] = e;
          var i = this.activeItem === t ? this.minClip : this.maxClip;
          this.targetClipsX[t] = i,
          this.targetClipsY[t] = i;
          var n = this.activeItem === t ? this.maxAlpha : this.minAlpha;
          this.targetAlphas[t] = n
      }
  }
}, {
  key: "drawImagesInitial",
  value: function() {
      return this.loadedImageCount < this.listItems.length ? (this.loadImagesInOrderBound(),
      !1) : !this.initialImagesLoaded && (this.initialImagesLoaded = !0,
      this.loadedImageCount = 0,
      this.loadMobile = !this.loadMobile,
      this.loadImagesInOrderBound(),
      this.setImageSizesBound(),
      this.setImageScalesBound(),
      this.setImagePositionsBound(),
      this.setImageClipsBound(),
      this.setImageAlphasBound(),
      this.getInitialTargetsBound(),
      this.reDrawImagesBound(),
      this.startAnimBound(),
      void this.initialSliderAnimationsBound())
  }
}, {
  key: "setSliderCursor",
  value: function() {
      v.Cursor.sliderModeOnBound()
  }
}, {
  key: "unsetSliderCursor",
  value: function() {
      v.Cursor.sliderModeOffBound()
  }
}, {
  key: "setTitleItem",
  value: function(t) {
      m.setAttribute(this.titles, "current", t)
  }
}, {
  key: "setLinkItem",
  value: function(t, e) {
      var i = this;
      m.setAttribute(this.link, "visible", t),
      e && this.linkTarget.setAttribute("href", e),
      setTimeout(function() {
          "true" === i.listItems[i.activeItem].getAttribute("data-video") ? i.linkSpan.innerHTML = "Watch film" : i.linkSpan.innerHTML = "View shoot"
      }, 800)
  }
}, {
  key: "initialSliderAnimations",
  value: function() {
      m.setAttribute(this.nav, "active", this.activeItem + 1),
      this.scaleSpeed = this.isMobile ? .2 : .04,
      this.clipSpeed = this.isMobile ? .2 : .02,
      this.alphaSpeed = .08,
      TweenMax.to(this.introRect, 1.6, {
          height: this.introRect.targetHeight,
          ease: Power4.easeInOut,
          onComplete: this.addEventsBound
      });
      for (var t = 0; t < this.targetScalesX.length; t++) {
          var e = this.activeItem === t ? this.maxScale : this.minScale;
          this.targetScalesX[t] = e,
          this.targetScalesY[t] = e
      }
      for (var t = 0; t < this.targetClipsX.length; t++) {
          var i = this.activeItem === t ? this.minClip : this.maxClip;
          this.targetClipsX[t] = i,
          this.targetClipsY[t] = i
      }
      for (var t = 0; t < this.targetAlphas.length; t++) {
          var n = this.activeItem === t ? this.maxAlpha : this.minAlpha;
          this.targetAlphas[t] = n
      }
      setTimeout(this.secondarySliderAnimationsBound, 750),
      this.isMobile
  }
}, {
  key: "secondarySliderAnimations",
  value: function() {
      this.setLinkItemBound(!0, this.targetURLs[this.activeItem]),
      this.setTitleItemBound(this.activeItem + 1),
      m.setAttribute(this.nav, "visible", !0),
      m.setAttribute(this.scrollLinkBtn, "visible", !0)
  }
}, {
  key: "setSliderBack",
  value: function(t, e) {
      this.iterateTimer && clearTimeout(this.iterateTimer),
      this.scaleSpeed = this.isMobile ? .2 : .125,
      this.clipSpeed = this.isMobile ? .2 : .045,
      this.alphaSpeed = .05,
      this.setTitleItemBound(0),
      t && (m.setAttribute(this.nav, "moving", !0),
      this.setLinkItemBound(!1, null),
      this.c.addEventListener("mousemove", this.updateMousePositionBound)),
      this.startingMouseOffset = t ? t.clientX : 0;
      for (var i = 0; i < this.targetScalesX.length; i++)
          this.targetScalesX[i] = this.movingScale,
          this.targetScalesY[i] = this.movingScale;
      for (var i = 0; i < this.targetClipsX.length; i++)
          this.targetClipsX[i] = this.maxClip,
          this.targetClipsY[i] = this.maxClip;
      for (var i = 0; i < this.targetAlphas.length; i++)
          this.targetAlphas[i] = this.maxAlpha
  }
}, {
  key: "setSliderForward",
  value: function() {
      this.scaleSpeed = this.isMobile ? .2 : .1,
      this.clipSpeed = this.isMobile ? .2 : .05,
      this.alphaSpeed = .25,
      this.c.removeEventListener("mouseleave", this.setSliderForwardBound),
      this.c.removeEventListener("mousemove", this.updateMousePositionBound),
      this.endDecimal = this.trackingDecimal,
      m.setAttribute(this.nav, "moving", !1),
      this.direction = 0,
      v.Cursor.sliderDirectionBound("null"),
      this.activeItem = Math.round(this.endDecimal * (this.imageCount - 1)),
      this.endDecimal = this.activeItem / (this.imageCount - 1),
      this.setTitleItemBound(this.activeItem + 1),
      this.setLinkItemBound(!0, this.targetURLs[this.activeItem]),
      this.currentXOffset = this.maxXOffset * this.endDecimal;
      for (var t = 0; t < this.targetScalesX.length; t++) {
          var e = this.activeItem === t ? this.maxScale : this.minScale;
          this.targetScalesX[t] = e,
          this.targetScalesY[t] = e
      }
      for (var t = 0; t < this.targetClipsX.length; t++) {
          var i = this.activeItem === t ? this.minClip : this.maxClip;
          this.targetClipsX[t] = i,
          this.targetClipsY[t] = i
      }
      for (var t = 0; t < this.targetAlphas.length; t++) {
          var n = this.activeItem === t ? this.maxAlpha : this.minAlpha;
          this.targetAlphas[t] = n
      }
      d.currentSliderImage = this.activeItem
  }
}, {
  key: "updateMousePosition",
  value: function(t) {
      this.c.addEventListener("mouseleave", this.setSliderForwardBound),
      this.currentMouseOffset = t.clientX - this.startingMouseOffset,
      this.newDecimal = this.endDecimal - this.currentMouseOffset / this.maxMouseMove,
      this.newDecimal > this.trackingDecimal && -1 !== this.direction ? (v.Cursor.sliderDirectionBound("left"),
      this.direction = -1) : this.newDecimal < this.trackingDecimal && 1 !== this.direction && (v.Cursor.sliderDirectionBound("right"),
      this.direction = 1),
      this.trackingDecimal = this.newDecimal,
      this.trackingDecimal = this.trackingDecimal > this.maxPan ? this.maxPan : this.trackingDecimal,
      this.trackingDecimal = this.trackingDecimal < this.minPan ? this.minPan : this.trackingDecimal;
      var e = this.maxXOffset * this.trackingDecimal;
      this.currentXOffset = e,
      this.newNavIndex = Math.round(this.trackingDecimal * (this.imageCount - 1)),
      this.newNavIndex !== this.currentNavIndex && (m.setAttribute(this.nav, "active", this.newNavIndex + 1),
      this.currentNavIndex = this.newNavIndex)
  }
}, {
  key: "nextItem",
  value: function() {
      if (this.activeItem >= this.listItems.length - 1)
          return !1;
      this.activeItem++,
      this.mobileTransitionBound()
  }
}, {
  key: "previousItem",
  value: function() {
      if (this.activeItem <= 0)
          return !1;
      this.activeItem--,
      this.mobileTransitionBound()
  }
}, {
  key: "mobileTransition",
  value: function() {
      this.endDecimal = this.activeItem / (this.imageCount - 1),
      this.trackingDecimal = this.endDecimal,
      this.newNavIndex = this.activeItem,
      this.currentXOffset = this.maxXOffset * this.endDecimal,
      this.setTitleItemBound(0),
      this.setLinkItemBound(!1, null),
      m.setAttribute(this.nav, "moving", !0),
      m.setAttribute(this.nav, "active", this.newNavIndex + 1);
      for (var t = 0; t < this.targetScalesX.length; t++) {
          var e = this.activeItem === t ? this.maxScale : this.minScale;
          this.targetScalesX[t] = e,
          this.targetScalesY[t] = e
      }
      for (var t = 0; t < this.targetAlphas.length; t++) {
          var i = this.activeItem === t ? this.maxAlpha : this.minAlpha;
          this.targetAlphas[t] = i
      }
      setTimeout(this.mobileTransitionEndBound, 700)
  }
}, {
  key: "mobileTransitionEnd",
  value: function() {
      m.setAttribute(this.nav, "moving", !1),
      this.setTitleItemBound(this.activeItem + 1),
      this.setLinkItemBound(!0, this.targetURLs[this.activeItem]),
      d.currentSliderImage = this.activeItem
  }
}, {
  key: "desktopAutoIterate",
  value: function() {
      this.setSliderBackBound(null, 1),
      this.iterateTimer = setTimeout(this.autoIterationEndBound, 100),
      this.activeItem = this.activeItem >= this.listItems.length - 1 ? 0 : this.activeItem + 1,
      this.endDecimal = this.activeItem / (this.imageCount - 1),
      this.trackingDecimal = this.endDecimal,
      this.newNavIndex = this.activeItem,
      this.currentXOffset = this.maxXOffset * this.endDecimal,
      m.setAttribute(this.nav, "active", this.newNavIndex + 1)
  }
}, {
  key: "autoIterationEnd",
  value: function() {
      this.setSliderForwardBound(),
      m.setAttribute(this.nav, "moving", !1),
      this.setTitleItemBound(this.activeItem + 1),
      this.setLinkItemBound(!0, this.targetURLs[this.activeItem]),
      d.currentSliderImage = this.activeItem
  }
}, {
  key: "startAnim",
  value: function() {
      this.animation = d.win.requestAnimationFrame(this.renderBound)
  }
}, {
  key: "endAnim",
  value: function() {
      d.win.cancelAnimationFrame(this.animation)
  }
}, {
  key: "render",
  value: function() {
      for (var t = 0; t < this.loadedImages.length; t++)
          this.scalesX[t] += (this.targetScalesX[t] - this.scalesX[t]) * this.scaleSpeed,
          this.scalesY[t] += (this.targetScalesY[t] - this.scalesY[t]) * this.scaleSpeed,
          this.clipsX[t] += (this.targetClipsX[t] - this.clipsX[t]) * this.clipSpeed,
          this.clipsY[t] += (this.targetClipsY[t] - this.clipsY[t]) * this.clipSpeed,
          this.alphas[t] += (this.targetAlphas[t] - this.alphas[t]) * this.alphaSpeed;
      this.speed += ((~~this.currentXOffset - ~~this.actualXOffset) / this.maxXOffset - this.speed) * this.dragSpeedFactor,
      this.speed = Math.round(1e3 * this.speed) / 1e3,
      this.speedPositive = this.speed < 0 ? -this.speed : this.speed,
      this.stretchX = this.maxImageStretch * this.speedPositive,
      this.stretchXOffset = this.speed < 0 ? this.maxImageStretch * -this.speed * 2 : 0,
      this.actualXOffset += (this.currentXOffset - this.actualXOffset) * this.panSpeed,
      this.reDrawImagesBound(),
      this.animation = d.win.requestAnimationFrame(this.renderBound)
  }
}, {
  key: "reDrawImages",
  value: function() {
      var t = this.retina ? 2 * this.activeWidth : this.activeWidth
        , e = this.retina ? 2 * this.activeHeight : this.activeHeight;
      this.ctx.clearRect(0, 0, t, e);
      for (var i = 0; i < this.listItems.length; i++)
          if (this.activeItem !== i) {
              var n = this.isMobile ? this.naturalWidthsMobile[i] : this.naturalWidths[i]
                , s = this.isMobile ? this.naturalHeightsMobile[i] : this.naturalHeights[i]
                , r = (this.xSizes[i] * this.scalesX[i] + this.stretchX) * this.scrollingScaleOffset
                , o = this.ySizes[i] * this.scalesY[i] * this.scrollingScaleOffset
                , a = this.isMobile ? this.loadedImagesMobile[i] : this.loadedImages[i];
              this.ctx.globalAlpha = this.alphas[i],
              this.ctx.drawImage(a, n * this.clipsX[this.activeItem] / 2, s * this.clipsY[this.activeItem] / 2, n - n * this.clipsX[this.activeItem], s - s * this.clipsY[this.activeItem], this.xPositions[i] - (r / 2 + (this.actualXOffset + this.stretchXOffset)) + this.halfXOffset, this.yPositions[i] - o / 2, r, o),
              this.ctx.globalAlpha = 1
          }
      this.reDrawActiveImageBound()
  }
}, {
  key: "reDrawActiveImage",
  value: function() {
      var t = this.isMobile ? this.naturalWidthsMobile[this.activeItem] : this.naturalWidths[this.activeItem]
        , e = this.isMobile ? this.naturalHeightsMobile[this.activeItem] : this.naturalHeights[this.activeItem]
        , i = (this.xSizes[this.activeItem] * this.scalesX[this.activeItem] + this.stretchX) * this.scrollingScaleOffset
        , n = this.ySizes[this.activeItem] * this.scalesY[this.activeItem] * this.scrollingScaleOffset
        , s = this.isMobile ? this.loadedImagesMobile[this.activeItem] : this.loadedImages[this.activeItem];
      this.ctx.globalAlpha = this.alphas[this.activeItem],
      this.ctx.drawImage(s, t * this.clipsX[this.activeItem] / 2, e * this.clipsY[this.activeItem] / 2, t - t * this.clipsX[this.activeItem], e - e * this.clipsY[this.activeItem], this.xPositions[this.activeItem] - (i / 2 + (this.actualXOffset + this.stretchXOffset)) + this.halfXOffset, this.yPositions[this.activeItem] - n / 2, i, n),
      this.ctx.globalAlpha = 1;
      var r = this.activeHeight * this.introRect.height;
      this.ctx.beginPath(),
      this.ctx.rect(0, this.activeHeight - r, this.activeWidth, r),
      this.ctx.fillStyle = "#08151d",
      this.ctx.fill()
  }
}])