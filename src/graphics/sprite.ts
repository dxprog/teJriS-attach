import { StringDict } from '../interfaces/common';
import { ISpriteSheet } from '../interfaces/sprites';
import Texture from './texture';
import Canvas from './canvas';

/**
 * Handles complex sprites with multiple animations and frames
 *
 * @constructor
 * @param {String} imagePath Path to the sprite's image file
 * @param {window} window The window object
 * @param {Object~Canvas} canvas The canvas object that will be drawn to
 */
class Sprite {
  private _img: Texture;
  private _canvas: Canvas;
  private _canvasWidth: number;
  private _canvasHeight: number;
  private _currentAnimation: string;
  private _animations: StringDict<any>;
  private _frame: number;
  private _frameCounter: number;
  private _drawable: boolean;
  public x: number;
  public y: number;
  public z: number;

  /**
   * Loads sprite's image and multiple animations
   *
   * @method loadSheet
   * @static
   * @param {Object} data The sprite data
   * @param {window} window A reference to the window
   * @param {Object~Canvas} canvas The canvas that the sprite will draw to
   * @return {Sprite} The created sprite object
   */
  static loadSheet(data: ISpriteSheet, window: Window, canvas: Canvas): Sprite {
    var out = new Sprite(data.imagePath, window, canvas);
    Object.keys(data.animations).forEach(function(name) {
      var animation = data.animations[name];
      animation.forEach(function(frame: any) {
        frame.width = frame.width || data.defaultWidth;
        frame.height = frame.height || data.defaultHeight;
        frame.duration = frame.duration || data.defaultDuration;
      });
      out.registerAnimation(name, animation);
    });

    if (data.defaultAnimation) {
      out.setAnimation(data.defaultAnimation);
    }

    return out;
  }

  constructor(imagePath: string, window: Window, canvas: Canvas) {
    this._img = new Texture(imagePath, window, this._imageLoaded.bind(this));
    this._drawable = false;
    this._canvas = canvas;
    this._canvasWidth = this._canvas.getWidth();
    this._canvasHeight = this._canvas.getHeight();
    this._currentAnimation;
    this._animations = {};
    this._frame = 0;
    this._frameCounter = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  /**
   * Whether the image has been successfully loaded
   *
   * @method _imageLoaded
   * @private
   * @return {Boolean}
   */
  _imageLoaded() {
    this._drawable = true;
  }

  /**
   * Registers an animation to a name
   *
   * @method registerAnimation
   * @param {String} name The name of the animation
   * @param {Array} frames Animation frames data
   */
  registerAnimation(name: string, frames: Array<any>) {
    this._animations[name] = Array.isArray(frames) ? frames : [ frames ];
  }

  /**
   * Moves the sprite
   *
   * @method move
   * @param {Number} x X coordinate of the sprite
   * @param {Number} y Y coordinate of the sprite
   */
  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Sets the current animation
   *
   * @method setAnimation
   * @param {String} name The name of the animation to play
   */
  setAnimation(name: string) {
    if (name !== this._currentAnimation) {
      this._currentAnimation = name;
      this._frame = 0;
      this._frameCounter = this._animations[name][0].duration || -1;
    }
  }

  /**
   * Sets the Z order of the sprite
   *
   * @method setZOrder
   * @param {Number} z The Z order
   */
  setZOrder(z: number) {
    this.z = z;
  }

  /**
   * Draws the sprite to canvas and updates the animation (when applicable)
   *
   * @method draw
   * @param {Boolean} pauseAnimation Whether to play the animation or not
   */
  draw(pauseAnimation: boolean = false) {
    if (this._drawable) {
      var currentAnimation = this._currentAnimation;
      var animation = this._animations[currentAnimation][this._frame];

      // Verify that the sprite is within bounds of the canvas
      if (
        this.x + animation.width  <= 0 ||
        this.y + animation.height <= 0 ||
        this.x >= this._canvasWidth ||
        this.y >= this._canvasHeight
      ) {
        return;
      }

      this._canvas.drawWithZ(this._img, this.x, this.y, this.z, animation.width, animation.height, animation.x, animation.y);
      if (!pauseAnimation && this._animations[currentAnimation].length) {
        this._frameCounter--;
        if (this._frameCounter === 0) {
          this._frame++;
          if (this._frame >= this._animations[currentAnimation].length) {
            this._frame = 0;
          }
          this._frameCounter = this._animations[currentAnimation][this._frame].duration || 0;
        }
      }
    }
  }

};

export default Sprite;
