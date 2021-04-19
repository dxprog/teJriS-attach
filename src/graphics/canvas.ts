import Texture from './texture';

/**
 * Wrapper for making nice canvas APIs
 *
 * @constructor
 * @param {HTMLCanvasElement} el The canvas element
 */
class Canvas {
  private _el: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _drawStack: Array<any>;

  constructor(el: HTMLCanvasElement) {
    this._el = el;
    this._ctx = this._el.getContext('2d');
  }

  /**
   * Sets up the canvas for a new render
   *
   * @method beginRender
   */
  beginRender() {
    this._drawStack = [];
  }

  /**
   * Ends the current render and flushes to the canvas
   *
   * @method endRender
   */
  endRender() {
    this._drawStack.sort(function(a: any, b: any) {
      return a[0] < b[0] ? -1 : 1;
    });

    for (var i = 0, count = this._drawStack.length; i < count; i++) {
      // Shift off the z-index
      this._drawStack[i].shift();
      this._ctx.drawImage.apply(this._ctx, this._drawStack[i]);
    }

  }

  /**
   * Returns the context of the canvas
   *
   * @method getContext
   * @return {CanvasRenderingContext2D}
   */
  getContext(): CanvasRenderingContext2D {
    return this._ctx;
  }

  /**
   * Draws a texture to the canvas with a Z order
   *
   * @method drawWithZ
   * @param {Object~Texture} texture The texture to draw
   * @param {Number} x The X coordinate
   * @param {Number} y The Z coordinate
   * @param {Number} z The Z order
   * @param {Number} width The width of the area to draw
   * @param {Number} height The height of the area to draw
   * @param {Number} srcX The X position to draw from
   * @param {Number} srcY The Y position to draw from
   */
  drawWithZ(
    texture: Texture,
    x: Number,
    y: Number,
    z: Number,
    width: Number,
    height: Number,
    srcX: Number,
    srcY: Number
  ) {
    if (!(texture instanceof Texture)) {
      throw 'Invalid texture';
    }
    this._drawStack.push([ z, texture.getTexture(), srcX, srcY, width, height, x, y, width, height ]);
  }

  /**
   * Draws a texture to the canvas
   *
   * @method draw
   * @param {Object~Texture} texture The texture to draw
   * @param {Number} x The X coordinate
   * @param {Number} y The Z coordinate
   * @param {Number} width The width of the area to draw
   * @param {Number} height The height of the area to draw
   * @param {Number} srcX The X position to draw from
   * @param {Number} srcY The Y position to draw from
   */
  draw(
    texture: Texture,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    srcX: Number,
    srcY: Number
  ) {
    this.drawWithZ(texture, x, y, 0, width, height, srcX, srcY);
  }

  /**
   * Clears the drawing area
   *
   * @method clear
   */
  clear() {
    this._ctx.clearRect(0, 0, this._el.width, this._el.height);
  }

  /**
   * Returns the width of the canvas
   *
   * @method getWidth
   * @return {Number}
   */
  getWidth() {
    return this._el.width;
  }

  /**
   * Returns the height of the canvas
   *
   * @method getHeight
   * @return {Number}
   */
  getHeight() {
    return this._el.height;
  }
};

export default Canvas;
