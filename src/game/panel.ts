import { IGameObject } from '../interfaces/game';
import Sprite from '../graphics/sprite';

export const PANEL_WIDTH = 32;
export const PANEL_HEIGHT = 32;

const PANEL_TYPES = [
  'heart',
  'diamond',
  'star',
  'circle',
  'triangle',
  'dark-triangle'
];

class Panel implements IGameObject {
  private _boardX: number;
  private _boardY: number;
  private _type: string;
  private _sprite: Sprite;

  constructor(x: number, y: number, type: number, sprite: Sprite) {
    this._boardX = x;
    this._boardY = y;
    this._type = PANEL_TYPES[type];
    this._sprite = new Sprite(sprite);
    this._sprite.move(x * PANEL_WIDTH, y * PANEL_HEIGHT);
    this._sprite.setAnimation(this._type);
  }

  update(dt: number) {

  }

  draw() {
    this._sprite.draw();
  }
}

export default Panel;
