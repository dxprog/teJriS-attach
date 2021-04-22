import { NumDict, StringDict } from '../interfaces/common';
import { IGameObject } from '../interfaces/game';
import Canvas from '../graphics/canvas';

// The number of milliseconds between each frame
const FRAME_DELAY: number = Math.floor(1000 / 60);

// The size of the off-screen buffer
const BUFFER_WIDTH = 640;
const BUFFER_HEIGHT = 480;

// The size of the visible screen
const SCREEN_WIDTH = BUFFER_WIDTH;
const SCREEN_HEIGHT = BUFFER_HEIGHT;

// Keycode mappings
const KEY_CODES: NumDict<string> = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  65: 'action'
};

// Tracks the current keyboard state
const KEY_STATE: StringDict<boolean> = {
  left: false,
  right: false,
  up: false,
  down: false,
  action: false
};

/**
 * The game object
 *
 * @cosntructor
 * @param {window} window A reference to the window
 * @param {HTMLCanvasElement} canvasEl The canvas element to draw the game to
 */
class Game {
  private _win: Window;
  private _doc: Document;
  private _ctx: CanvasRenderingContext2D;
  private _buffer: HTMLCanvasElement;
  private _canvas: Canvas;
  private _gameObjects: StringDict<IGameObject>;

  constructor(window: Window, canvasEl: HTMLCanvasElement) {
    this._win = window;
    this._doc = window.document;
    this._ctx = canvasEl.getContext('2d');
    this._ctx.imageSmoothingEnabled = false;

    this._buffer = this._doc.createElement('canvas');
    this._buffer.width = BUFFER_WIDTH;
    this._buffer.height = BUFFER_HEIGHT;
    this._canvas = new Canvas(this._buffer);
    this._gameObjects = {};

    this._doc.addEventListener('keydown', this._handleKeydown.bind(this));
    this._doc.addEventListener('keyup', this._handleKeyup.bind(this));

    setInterval(this.loop.bind(this), FRAME_DELAY);
  }

  addGameObject(name: string, obj: IGameObject) {
    this._gameObjects[name] = obj;
  }

  removeGameObject(name: string) {
    delete this._gameObjects[name];
  }

  /**
   * The game loop
   */
  loop() {
    this._canvas.clear();

    this._canvas.beginRender();

    // this is gonna be slow; address it somewhere
    const gameObjects = Object.values(this._gameObjects);
    gameObjects.forEach(gameObject => {
      gameObject.update(0);
      gameObject.draw();
    });

    this._canvas.endRender();

    this._ctx.drawImage(this._buffer, 0, 0, BUFFER_WIDTH, BUFFER_HEIGHT,
      0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  getInputState() {
    return KEY_STATE;
  }

  /**
   * Returns the game's window reference
   *
   * @method getWindow
   * @return {window}
   */
  getWindow() {
    return this._win;
  }

  /**
   * Returns the game's canvas object
   *
   * @method getCanvas
   * @return {Object~Canvas}
   */
  getCanvas() {
    return this._canvas;
  }

  /**
   * Returns a named game object
   *
   * @method getGameObject
   * @param {String} name The name of the object to fetch
   * @return {Object}
   */
  getGameObject(name: any) {
    return this._gameObjects[name];
  }

  /**
   * Key down event handler
   *
   * @method _handleKeydown
   * @private
   * @param {Object} evt The event object
   */
  _handleKeydown(evt: KeyboardEvent) {
    if (KEY_CODES.hasOwnProperty(evt.keyCode)) {
      KEY_STATE[KEY_CODES[evt.keyCode]] = true;
      evt.preventDefault();
    }
  }

  /**
   * Key up event handler
   *
   * @method _handleKeyup
   * @private
   * @param {Object} evt The event object
   */
  _handleKeyup(evt: KeyboardEvent) {
    if (KEY_CODES.hasOwnProperty(evt.keyCode)) {
      KEY_STATE[KEY_CODES[evt.keyCode]] = false;
      evt.preventDefault();
    }
  }
}

export default Game;
