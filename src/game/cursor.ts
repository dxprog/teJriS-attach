import Sprite from '../graphics/sprite';
import { IGameObject } from '../interfaces/game';

import * as CURSOR_SPRITE from '../data/cursor.json';
import Game from './game';

export default class Cursor implements IGameObject {
  private _sprite: Sprite;

  constructor(game: Game) {
    this._sprite = Sprite.loadSheet(
      CURSOR_SPRITE,
      game.getWindow(),
      game.getCanvas()
    );
    this._sprite.move(3 * 32 - 4, 8 * 32 - 4);
  }

  update(dt: number) {

  }

  draw() {
    this._sprite.draw();
  }
}
