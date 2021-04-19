import { StringDict } from './common';

export interface IPoint2d {
  x: number;
  y: number;
}

export interface ISpriteFrame {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface ISpriteSheet {
  imagePath: string;
  defaultDuration: number;
  defaultWidth: number;
  defaultHeight: number;
  defaultAnimation: string;
  animations: StringDict<Array<ISpriteFrame>>;
}
