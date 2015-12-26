const Canvas = require('./graphics/canvas');
const Sprite = require('./graphics/sprite');
const Player = require('./game/player');

const LINK_DATA = require('./data/link.js');

const FRAME_DELAY = parseInt(1000 / 60);

const KEY_CODES = {
    37: 'left',
    39: 'right',
    38: 'up',
    40: 'down'
};

const KEY_STATE = {
    left: false,
    right: false,
    up: false,
    down: false,
    action: false
};

var Game = function(window, canvasEl) {
    this._win = window;
    this._doc = window.document;
    this._canvasEl = canvasEl;
    this._canvas = new Canvas(canvasEl);
    
    this._link = new Player(this._win, this._canvas);
    
    this._doc.addEventListener('keydown', this._handleKeydown.bind(this));
    this._doc.addEventListener('keyup', this._handleKeyup.bind(this));
    
    setInterval(this.loop.bind(this), FRAME_DELAY);
};

Game.prototype = {
    loop() {
        this._canvas.clear();
        this._link.update(KEY_STATE);
        this._link.draw();
    },
    
    _handleKeydown(evt) {
        if (KEY_CODES.hasOwnProperty(evt.keyCode)) {
            KEY_STATE[KEY_CODES[evt.keyCode]] = true;
            evt.preventDefault();
        }
    },
    
    _handleKeyup(evt) {
        if (KEY_CODES.hasOwnProperty(evt.keyCode)) {
            KEY_STATE[KEY_CODES[evt.keyCode]] = false;
            evt.preventDefault();
        }
    }
};

module.exports = Game;