import { StringDict } from './common';
import { IPoint2d } from './sprites';

export interface IRoom {
  dataset: string;
  exits: StringDict<string>;
}

export interface IDungeon {
  tileset: string;
  tileWidth: number;
  tileHeight: number;
  startRoom: string;
  rooms: StringDict<IRoom>,
  tiles: StringDict<IPoint2d>
}

export interface ITile {
  tile: string;
  passable: boolean;
}
export type RoomMap = Array<Array<ITile>>;
