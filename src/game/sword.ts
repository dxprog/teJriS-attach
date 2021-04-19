import Sprite from '../graphics/sprite';

// Sprite data
import * as SWORD_DATA from '../data/sword.json';
import { StringDict } from '../interfaces/common';
import { IPoint2d } from '../interfaces/sprites';

// Speed at which the sword moves
const SPEED = 2;

// How far the sword moves before retracting
const EXTENSION_AMOUNT = 12 / SPEED;

// How long before the entire animation is done
const DURATION = EXTENSION_AMOUNT * 2;

// X/Y speeds for each direction
const DIRECTION: StringDict<IPoint2d> = {
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

/**
 * A sword object for a player/AI
 *
 * @constructor
 * @param {Object~Game} game Reference to the game object
 */
class Sword {
  private _game: any;
  private _sword: Sprite;
  private _counter: number;
  private _animating: boolean;
  private _x: number;
  private _y: number;
  private _velocity: IPoint2d;

  constructor(game: any) {
    this._game = game;
    this._sword = Sprite.loadSheet(SWORD_DATA, game.getWindow(), game.getCanvas());
  }

  /**
   * Swings the sword
   *
   * @method swing
   * @param {Number} x X position of the player
   * @param {Number} y Y position of the player
   * @param {String} direction The direction the player is facing
   */
  swing(x: number, y: number, direction: string) {
    this._counter = 0;
    this._animating = true;
    this._x = x;
    this._y = y;
    this._velocity = DIRECTION[direction];
    this._sword.setAnimation(direction);
  }

  /**
   * Game-tick sword updates
   *
   * @method update
   */
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
  }

  /**
   * Draws the sword
   *
   * @method draw
   */
  draw() {
    if (this._animating) {
      this._sword.draw();
    }
  }

  /**
   * Returns if the sword is swinging
   *
   * @method isSwinging
   * @return {Boolean}
   */
  isSwinging() {
    return this._animating;
  }
};

export default Sword;
