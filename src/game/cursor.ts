import Sprite from '../graphics/sprite';
import { IGameObject } from '../interfaces/game';
import * as CURSOR_SPRITE from '../data/cursor.json';
import Game from './game';
import { IPoint2d } from '../interfaces/sprites';
import { PANEL_WIDTH, PANEL_HEIGHT } from './panel';

const CURSOR_OFFSET_X = -6;
const CURSOR_OFFSET_Y = -6;

export enum Direction {
  Up = 'up',
  Right = 'right',
  Left = 'left',
  Down = 'down'
}

export default class Cursor implements IGameObject {
  private _sprite: Sprite;

  public x: number;
  public y: number;

  constructor(game: Game) {
    this._sprite = Sprite.loadSheet(
      CURSOR_SPRITE,
      game.getWindow(),
      game.getCanvas()
    );
  }

  setPosition(position: IPoint2d) {
    this.x = position.x;
    this.y = position.y;
    this._updateSpritePosition();
  }

  move(direction: Direction) {
    if (direction === Direction.Up) {
      this.y--;
    } else if (direction === Direction.Down) {
      this.y++;
    } else if (direction === Direction.Left) {
      this.x--;
    } else if (direction === Direction.Right) {
      this.x++;
    }
    this._updateSpritePosition();
  }

  private _updateSpritePosition() {
    this._sprite.move(
      this.x * PANEL_WIDTH + CURSOR_OFFSET_X,
      this.y * PANEL_HEIGHT + CURSOR_OFFSET_Y
    );
    this._sprite.setZOrder(1);
  }

  update(dt: number) {

  }

  draw() {
    this._sprite.draw();
  }
}
