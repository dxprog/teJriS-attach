var Sprite = require('../graphics/sprite');

const SWORD_DATA = require('../data/sword');
const SPEED = 2;
const EXTENSION_AMOUNT = 12 / SPEED;
const DURATION = EXTENSION_AMOUNT * 2;

const DIRECTION = {
  left: {
    x: -SPEED,
    y: 0
  },
  right: {
    x: SPEED,
    y: 0
  },
  up: {
    x: 0,
    y: -SPEED
  },
  down: {
    x: 0,
    y: SPEED
  }
};

function Sword(game) {
  this._game = game;
  this._sword = Sprite.loadSheet(SWORD_DATA, game.getWindow(), game.getCanvas());
}

Sword.prototype = {
  swing(x, y, direction) {
    this._counter = 0;
    this._animating = true;
    this._x = x;
    this._y = y;
    this._velocity = DIRECTION[direction];
    this._sword.setAnimation(direction);
  },

  update() {
    if (this._animating) {
      this._x += this._velocity.x;
      this._y += this._velocity.y;
      this._sword.move(this._x, this._y);

      this._counter++;
      if (this._counter === EXTENSION_AMOUNT) {
        this._x = -this._x;
        this._y = -this._y;
      } else if (this._counter >= DURATION) {
        this._animating = false;
      }
    }
  },

  draw() {
    if (this._animating) {
      this._sword.draw();
    }
  },

  isSwinging() {
    return this._animating;
  }
};

module.exports = Sword;