const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  canvas.height = 600;
  canvas.width = 900;

  const canvasSize = [canvas.width, canvas.height];
  const ctx = canvas.getContext('2d');
  const gameView = new GameView(ctx, canvasSize);

  gameView.welcome();

  let mainLogo = document.getElementById('main-logo');
  let playGameButton = document.getElementById('play-game');
  playGameButton.addEventListener("click", () => {
    playGameButton.className = 'sprite';
    mainLogo.className = 'sprite';
    debugger;
    gameView.start();
  });
});
