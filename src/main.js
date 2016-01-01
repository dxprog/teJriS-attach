const Canvas = require('./graphics/canvas');
const Sprite = require('./graphics/sprite');
const Player = require('./game/player');
const Dungeon = require('./game/dungeon');

// The number of milliseconds between each frame
const FRAME_DELAY = parseInt(1000 / 60);

// The size of the off-screen buffer
const BUFFER_WIDTH = 256;
const BUFFER_HEIGHT = 224;

// The size of the visible screen
const SCREEN_WIDTH = BUFFER_WIDTH * 2;
const SCREEN_HEIGHT = BUFFER_HEIGHT * 2;

// Keycode mappings
const KEY_CODES = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  65: 'action'
};

// Tracks the current keyboard state
const KEY_STATE = {
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
function Game(window, canvasEl) {
  this._win = window;
  this._doc = window.document;
  this._canvasEl = canvasEl;
  this._ctx = canvasEl.getContext('2d');
  this._ctx.imageSmoothingEnabled = false;

  this._buffer = this._doc.createElement('canvas');
  this._buffer.width = BUFFER_WIDTH;
  this._buffer.height = BUFFER_HEIGHT;
  this._canvas = new Canvas(this._buffer);

  this._gameObjects = {
    player: new Player(this),
    dungeon: new Dungeon(require('./data/dungeon1'), this)
  };

  this._doc.addEventListener('keydown', this._handleKeydown.bind(this));
  this._doc.addEventListener('keyup', this._handleKeyup.bind(this));

  setInterval(this.loop.bind(this), FRAME_DELAY);
};

Game.prototype = {

  /**
   * The game loop
   */
  loop() {
    this._canvas.clear();

    this._canvas.beginRender();
    this._gameObjects.dungeon.update();
    this._gameObjects.player.update(KEY_STATE);
    this._gameObjects.dungeon.draw();
    this._gameObjects.player.draw();
    this._canvas.endRender();

    this._ctx.drawImage(this._buffer, 0, 0, BUFFER_WIDTH, BUFFER_HEIGHT,
      0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  },

  /**
   * Returns the game's window reference
   *
   * @method getWindow
   * @return {window}
   */
  getWindow() {
    return this._win;
  },

  /**
   * Returns the game's canvas object
   *
   * @method getCanvas
   * @return {Object~Canvas}
   */
  getCanvas() {
    return this._canvas;
  },

  /**
   * Returns a named game object
   *
   * @method getGameObject
   * @param {String} name The name of the object to fetch
   * @return {Object}
   */
  getGameObject(name) {
    return this._gameObjects[name];
  },

  /**
   * Key down event handler
   *
   * @method _handleKeydown
   * @private
   * @param {Object} evt The event object
   */
  _handleKeydown(evt) {
    if (KEY_CODES.hasOwnProperty(evt.keyCode)) {
      KEY_STATE[KEY_CODES[evt.keyCode]] = true;
      evt.preventDefault();
    }
  },

  /**
   * Key up event handler
   *
   * @method _handleKeyup
   * @private
   * @param {Object} evt The event object
   */
  _handleKeyup(evt) {
    if (KEY_CODES.hasOwnProperty(evt.keyCode)) {
      KEY_STATE[KEY_CODES[evt.keyCode]] = false;
      evt.preventDefault();
    }
  }
};

module.exports = Game;