const Sprite = require('../graphics/sprite');

const MOVE_SPEED = 1;
const LINK_DATA = require('../data/link');
const KEY_DELAY = LINK_DATA.defaultDuration;

function Player(game) {
  this._game = game;
  this._sprite = Sprite.loadSheet(LINK_DATA, game.getWindow(), game.getCanvas());
  this._x = 0;
  this._y = 0;
  this._directionCounter = 0;
  this._animating = false;
}

Player.prototype = {
  update(keys) {
    var isKeyPressed = Object.keys(keys).filter(function(key) {
      return keys[key];
    }).length > 0;
    this._animating = isKeyPressed;

    if (this._directionCounter <= 0 && isKeyPressed) {
      var newX = this._x;
      var newY = this._y;
      var dungeon = this._game.getGameObject('dungeon');

      if (keys.down) {
        newY += MOVE_SPEED;
        this._sprite.setAnimation('down');
      } else if (keys.up) {
        newY -= MOVE_SPEED;
        this._sprite.setAnimation('up');
      } else if (keys.left) {
        newX -= MOVE_SPEED;
        this._sprite.setAnimation('left');
      } else if (keys.right) {
        newX += MOVE_SPEED;
        this._sprite.setAnimation('right');
      }

      if (dungeon.canPass(newX, newY + LINK_DATA.defaultHeight / 2, LINK_DATA.defaultWidth, LINK_DATA.defaultHeight / 2)) {
        this._x = newX;
        this._y = newY;
        this._sprite.move(this._x, this._y);
      }
    } else {
      this._directionCounter--;
    }
  },

  draw() {
    this._sprite.draw(!this._animating);
  }
};

module.exports = Player;