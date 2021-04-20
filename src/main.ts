import Game from './game/game';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game(
    window,
    <HTMLCanvasElement>document.getElementById('game')
  );
});
