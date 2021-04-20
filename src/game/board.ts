import Sprite from '../graphics/sprite';
import { IGameObject } from '../interfaces/game';
import Game from './game';

import * as PANEL_SPRITE from '../data/panels.json';

const BOARD_WIDTH = 6;
const BOARD_HEIGHT = 12;
const BOARD_AREA = BOARD_WIDTH * BOARD_HEIGHT;

class Board implements IGameObject {
  private _game: Game;
  private _board: Array<any>;

  constructor(game: Game) {
    this._game = game;
    this.resetBoard();
  }

  private resetBoard() {
    // create a dummy board
    const board: Array<boolean> = Array.apply(null, new Array(BOARD_AREA))
      .map(() => false);

    // fill half the board with randomly placed placeholders
    for (let i = 0, count = BOARD_AREA / 2; i < count; i++) {
      let position = Math.floor(Math.random() * BOARD_AREA);
      while (board[position]) {
        position = Math.floor(Math.random() * BOARD_AREA);
      }
      board[position] = true;
    }

    // apply gravity to the random placeholders
    // note: this is hella lazy,taking multiple passes
    // of the whole board to let the gravity settle out,
    // but fewer LoC and not _really_ a concern for performance
    let dirty = true;
    while (dirty) {
      dirty = false;
      for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = BOARD_HEIGHT - 2; y >= 0; y--) {
          const index = y * BOARD_WIDTH + x;
          if (board[index] && !board[index + BOARD_WIDTH]) {
            board[index] = false;
            board[index + BOARD_WIDTH] = true;
            dirty = true;
          }
        }
      }
    }

    let boardString = '';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const index = y * BOARD_WIDTH + x;
        boardString += board[index] ? 'X' : ' ';
      }
      boardString += '\n';
    }

    console.log(boardString);
  }

  update(td: number) {

  }

  draw() {

  }
}

export default Board;
