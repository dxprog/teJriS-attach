import { IGameObject } from '../interfaces/game';
import Sprite from '../graphics/sprite';
import { StringDict } from '../interfaces/common';

export const PANEL_WIDTH = 32;
export const PANEL_HEIGHT = 32;

export type PanelStateModifier = (panel: Panel, td: number) => StringDict<any>;

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
  private _state: StringDict<any>;
  private _stateModifier: PanelStateModifier;

  get state(): StringDict<any> {
    return this._state;
  }

  constructor(x: number, y: number, type: number, sprite: Sprite) {
    this._boardX = x;
    this._boardY = y;
    this._type = PANEL_TYPES[type];
    this._sprite = new Sprite(sprite);
    this._sprite.move(x * PANEL_WIDTH, y * PANEL_HEIGHT);
    this._sprite.setAnimation(this._type);
    this._stateModifier = null;
  }

  update(td: number) {
    if (this._stateModifier) {
      this._state = this._stateModifier(this, td);
      if (!this._state) {
        this._stateModifier = null;
      }
    }

    const offsetX = this._state?.offsetX || 0;
    const offsetY = this._state?.offsetY || 0;
    this._sprite.move(
      this._boardX * PANEL_WIDTH + offsetX,
      this._boardY * PANEL_HEIGHT + offsetY
    );
  }

  draw() {
    this._sprite.draw();
  }

  setStateModifier(modifier: PanelStateModifier) {
    // only one state at a time, pls
    if (!this._stateModifier) {
      this._stateModifier = modifier;
    }
  }
}

export default Panel;
