const Sprite = require('../graphics/sprite');
const Sword = require('./sword');

// The speed at which Link moves in pixels
const MOVE_SPEED = 1;

// Link's sprite data
const LINK_DATA = require('../data/link');

// How long to delay key presses before allowing them to register again
const KEY_DELAY = LINK_DATA.defaultDuration;

// Directional constants
const LEFT = 'left';
const RIGHT = 'right';
const DOWN = 'down';
const UP = 'up';

// Sword singing animation name prefix
const SWINGING = 'sword-';

/**
 * Handles operations pertaining to the controllable player (aka Link)
 *
 * @constructor
 * @param {Object~Game} game A reference to the game object
 */
function Player(game) {
  this._game = game;
  this._sprite = Sprite.loadSheet(LINK_DATA, game.getWindow(), game.getCanvas());
  this._sprite.setZOrder(1);
  this._sword = new Sword(game);
  this._x = 0;
  this._y = 0;
  this._directionCounter = 0;
  this._direction = 'down';
  this._animating = false;
  this._swinging = false;
}

Player.prototype = {

  /**
   * Game-tick update
   *
   * @method update
   * @param {Object} keys Current keyboard state
   */
  update(keys) {
    var dungeon = this._game.getGameObject('dungeon');
    var isKeyPressed = Object.keys(keys).filter(function(key) {
      return keys[key];
    }).length > 0;
    this._animating = isKeyPressed;

    if (dungeon.isTransitioning()) {
      this._updateForDungeonTransition(dungeon);
    } else if (this._swinging) {
      this._sword.update();
      this._swinging = this._sword.isSwinging();
      if (!this._swinging) {
        this._sprite.setAnimation(this._direction);
      }
    } else if (keys.action && !this._swinging) {
      this._sprite.setAnimation(SWINGING + this._direction);
      this._sword.swing(this._x, this._y, this._direction);
      this._swinging = true;
    } else if (this._directionCounter <= 0 && isKeyPressed && !this._swinging) {
      this._handleKeyPress(keys, dungeon);
    } else {
      this._directionCounter--;
    }
  },

  /**
   * Draw's Link
   *
   * @method draw
   */
  draw() {
    if (this._swinging) {
      this._sword.draw();
    }
    this._sprite.draw(!this._animating);
  },

  /**
   * Handles keyboard state for the player
   *
   * @method _handleKeyPress
   * @private
   * @param {Object} keys The keyboard state
   * @param {Object~Dungeon} dungeon A reference to the current dungeon
   */
  _handleKeyPress(keys, dungeon) {
    var newX = this._x;
    var newY = this._y;

    if (keys.down) {
      newY += MOVE_SPEED;
      this._direction = DOWN;
    } else if (keys.up) {
      newY -= MOVE_SPEED;
      this._direction = UP;
    } else if (keys.left) {
      newX -= MOVE_SPEED;
      this._direction = LEFT;
    } else if (keys.right) {
      newX += MOVE_SPEED;
      this._direction = RIGHT;
    }

    this._sprite.setAnimation(this._direction);

    if (dungeon.canPass(newX, newY + LINK_DATA.defaultHeight / 2, LINK_DATA.defaultWidth, LINK_DATA.defaultHeight / 2)) {
      this._x = newX;
      this._y = newY;
      this._sprite.move(this._x, this._y);
    }
  },

  /**
   * Updates the player as the dungeon transitions to a new screen
   *
   * @method _updateForDungeonTransition
   * @private
   * @param {Object~Dungeon} dungeon Reference to the dungeon
   */
  _updateForDungeonTransition(dungeon) {
    var transitionSpeed = dungeon.getTransitionSpeeds();
    var currentRoomWidth = dungeon.getCurrentRoomWidth();
    this._x += transitionSpeed.x;
    this._y += transitionSpeed.y;

    // Bounds checks
    this._x = this._x < 0 ? 0 : this._x;
    this._y = this._y < 0 ? 0 : this._y;
    this._x = this._x + LINK_DATA.defaultWidth > currentRoomWidth ? currentRoomWidth - LINK_DATA.defaultWidth : this._x;

    this._sprite.move(this._x, this._y);
  }
};

module.exports = Player;