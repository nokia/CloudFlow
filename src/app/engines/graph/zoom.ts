/*!
 Copyright (c) The Cytoscape Consortium

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do
 so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 https://github.com/cytoscape/cytoscape.js-panzoom
 */

import * as $ from "jquery";

const defaults = {
    zoomFactor: 0.05, // zoom factor per zoom tick
    zoomDelay: 45, // how many ms between zoom ticks
    minZoom: 0.3, // min zoom level
    maxZoom: 2.5, // max zoom level
    fitPadding: 50, // padding when fitting
    panSpeed: 10, // how many ms in between pan ticks
    panDistance: 10, // max pan distance per tick
    panDragAreaSize: 75, /* the length of the pan drag box in which the vector for panning is calculated
                            (bigger = finer control of pan speed and direction) */
    panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
    panInactiveArea: 8, // radius of inactive area in pan drag box
    panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
    zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)

    // icon class names
    sliderHandleIcon: 'fa fa-minus',
    zoomInIcon: 'fa fa-plus',
    zoomOutIcon: 'fa fa-minus',
    resetIcon: 'fa fa-expand'
};

export default class Zoom {
    private options: typeof defaults;
    private $container: any;
    private $window = $(window);
    private winbdgs = [];

    private $panzoom = $('<div class="cf-panzoom"></div>');
    private $panner;
    private $pIndicator;
    private $reset;
    private $slider;
    private $sliderHandle;
    private $zoomIn;
    private $zoomOut;
    private $noZoomTick;

    private zoom = 1;
    private zooming = false;
    private readonly sliderPadding = 2;

    constructor(container: any, options = {}, private callback: (zoomValue: number) => void) {
        // TODO: sliding and panning were removed from this code
        this.$container = $(container);
        this.options = {...defaults, ...options};
        this.init();
    }

    resetZoom(e: any = {}) {
        this.zoom = 1;
        this.doZoom(1);
        // TODO: reset zoom and pan

        return false;
    }

    private startZooming() {
        this.zooming = true;
    }

    private endZooming() {
        this.zooming = false;
    }

    private zoomTo(level) {
        this.zoom = level;

        // invoke zoom on real graph
        this.callback(level);
    }

    private windowBind(evt, fn: Function) {
        this.winbdgs.push({
            evt: evt,
            fn: fn
        });

        this.$window.on(evt, fn);
    }

    private doZoom(factor: number) {
        const lvl = this.zoom * factor;

        if (lvl < this.options.minZoom || lvl > this.options.maxZoom) {
            return;
        }

        this.zoomTo(lvl);

        // todo: call set slider in a smart way (when a jsplumb event is received??)
        // this.positionSliderFromZoom();
    }

    private bindZoomButtons($button, factor: number) {
        let zoomInterval;

        $button.on("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.button !== 0) {
                return;
            }

            this.startZooming();
            this.doZoom(factor);
            zoomInterval = setInterval(() => this.doZoom(factor), this.options.zoomDelay);

            return false;
        });

        this.windowBind("mouseup blur", () => {
            clearInterval(zoomInterval);
            this.endZooming();
        });
}

    private resetZoomTick() {
        const z = 1;
        const zmin = this.options.minZoom,
            zmax = this.options.maxZoom;

        // assume (zoom = zmax ^ p) where p ranges on (x, 1) with x negative
        const x = Math.log(zmin) / Math.log(zmax);
        const p = Math.log(z) / Math.log(zmax);
        const percent = 1 - (p - x) / (1 - x); // the 1- bit at the front b/c up is in the -ve y direction

        if (percent > 1 || percent < 0) {
            this.$noZoomTick.hide();
            return;
        }

        const min = this.sliderPadding;
        const max = this.$slider.height() - this.$sliderHandle.height() - 2 * this.sliderPadding;
        let top = percent * (max - min);

        // constrain to slider bounds
        if (top < min) {
            top = min
        }
        if (top > max) {
            top = max
        }

        this.$noZoomTick.css('top', top);
    }

    private drawControls() {
        const $zoomIn = $(`<div class="cf-panzoom-zoom-in cf-panzoom-zoom-button">
                            <span class="icon ${this.options.zoomInIcon}"></span></div>`);
        this.$panzoom.append($zoomIn);

        const $zoomOut = $(`<div class="cf-panzoom-zoom-out cf-panzoom-zoom-button">
                            <span class="icon ${this.options.zoomOutIcon}"></span></div>`);
        this.$panzoom.append($zoomOut);

        const $reset = $(`<div class="cf-panzoom-reset cf-panzoom-zoom-button">
                            <span class="icon ${this.options.resetIcon}"></span></div>`);
        this.$panzoom.append($reset);

        const $slider = $(`<div class="cf-panzoom-slider"></div>`);
        this.$panzoom.append($slider);

        $slider.append(`<div class="cf-panzoom-slider-background"></div>`);

        const $sliderHandle = $(`<div class="cf-panzoom-slider-handle">
                                 <span class="icon ${this.options.sliderHandleIcon}"></span></div>`);
        $slider.append($sliderHandle);

        const $noZoomTick = $(`<div class="cf-panzoom-no-zoom-tick"></div>`);
        $slider.append($noZoomTick);

        const $panner = $(`<div class="cf-panzoom-panner"></div>`);
        this.$panzoom.append($panner);

        const $pHandle = $(`<div class="cf-panzoom-panner-handle"></div>`);
        $panner.append($pHandle);

        const $pUp = $('<div class="cf-panzoom-pan-up cf-panzoom-pan-button"></div>'),
            $pDown = $('<div class="cf-panzoom-pan-down cf-panzoom-pan-button"></div>'),
            $pLeft = $('<div class="cf-panzoom-pan-left cf-panzoom-pan-button"></div>'),
            $pRight = $('<div class="cf-panzoom-pan-right cf-panzoom-pan-button"></div>');
        $panner.append($pUp).append($pDown).append($pLeft).append($pRight);

        const $pIndicator = $('<div class="cf-panzoom-pan-indicator"></div>');
        $panner.append($pIndicator);

        this.$panner = $panner;
        this.$pIndicator = $pIndicator;
        this.$slider = $slider;
        this.$sliderHandle = $sliderHandle;
        this.$reset = $reset;
        this.$noZoomTick = $noZoomTick;
        this.$zoomIn = $zoomIn;
        this.$zoomOut = $zoomOut;
    }

    destroy() {
        this.winbdgs.forEach(l => this.$window.off(l.evt, l.fn));
        this.$panzoom.remove();
    }

    init() {
        this.$container.prepend(this.$panzoom);
        this.$panzoom.css('position', 'absolute'); // must be absolute regardless of stylesheet

        if (this.options.zoomOnly) {
            this.$panzoom.addClass("cf-panzoom-zoom-only");
        }

        // add base html elements
        this.drawControls();

        // set the position of the zoom=1 tick
        this.resetZoomTick();

        // set up zoom in/out buttons
        this.bindZoomButtons(this.$zoomIn, (1 + this.options.zoomFactor));
        this.bindZoomButtons(this.$zoomOut, (1 - this.options.zoomFactor));

        // set reset zoom button (note: should also restore panning)
        this.$reset.on("mousedown", (e) => this.resetZoom(e));
    }
}
