import Game from './game/game';
import Board from './game/board';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game(
    window,
    <HTMLCanvasElement>document.getElementById('game')
  );

  const board = new Board(game);
  game.addGameObject('board', board);

});
