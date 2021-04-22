import Game from './game/game';
import Board from './game/board';
import Cursor from './game/cursor';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game(
    window,
    <HTMLCanvasElement>document.getElementById('game')
  );

  const board = new Board(game);
  const cursor = new Cursor(game);
  game.addGameObject('board', board);

});
