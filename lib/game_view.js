// Responsible for keeping track of canvas context, the game and the ships
// Will be in charge of setting an interval timer to animate the game.
// Will bind key listeners to the ship so that user may move it around.

const Game = require('./game');

const GameView = function(ctx, canvasSize) {
  this.ctx = ctx;
  this.canvasSize = canvasSize;
  this.game = new Game({
    canvasSize: this.canvasSize,
    ctx: this.ctx,
    gameView: this
  });
  this.defender = this.game.defender;
  this.isPaused = false;
};

GameView.prototype.start = function() {
  this.bindKeyHandlers();

  this.interval = setInterval(() => {
    if (!this.isPaused) {
      this.game.draw(this.ctx);
      this.addLivesText(this.ctx);
      this.addScoreText(this.ctx);
      this.game.moveInvaders();
      this.game.step();
    }
  }, 10);

  this.toggle = setInterval(() => {
    this.game.toggleInvaders();
  }, 500);
};

GameView.prototype.stop = function() {
  clearInterval(this.interval);
  clearInterval(this.toggle);
  this.interval = null;
  this.toggle = null;
  this.game = new Game({
    canvasSize: this.canvasSize,
    ctx: this.ctx,
    gameView: this
  });
};

GameView.prototype.restart = function() {
  this.stop();

  this.isPaused = false;
  this.start();
};

GameView.prototype.welcome = function() {
  this.ctx.fillStyle = '#000';
  this.ctx.fillRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
  this.addPointInfo(this.ctx);
};

GameView.prototype.pause = function() {
  this.isPaused = true;
};

GameView.prototype.resume = function() {
  this.isPaused = false;
};

GameView.prototype.gameOver = function() {

};

GameView.KEY_BINDS = {
  'w': [0, -3],
  ',': [0, -3],
  'a': [-3, 0],
  's': [0, 3],
  'o': [0, 3],
  'd': [3, 0],
  'e': [3, 0],
  'up': [0, -3],
  'down': [0, 3],
  'left': [-3, 0],
  'right': [3, 0]
};

GameView.prototype.addLivesText = function(ctx) {
  let x = this.game.DIM_X * .9;
  let y = this.game.DIM_Y * .05;
  // let img = document.getElementById('lives');
  // ctx.drawImage(img, x, y, 80, 15);

  ctx.font = "20px Georgia";
  ctx.fillText(`LIVES: ${this.game.defenderLives + 1}`, x, y);
};

GameView.prototype.addMenu = function(ctx) {
  let x = this.game.DIM_X * .5;
  let y = this.game.DIM_Y * .1;
};

GameView.prototype.addScoreText = function(ctx) {
  let x = this.game.DIM_X * .01;
  let y = this.game.DIM_Y * .05;
  ctx.find = "20px Georgia";
  ctx.fillText(`SCORE: ${this.game.score}`, x, y);
};

GameView.prototype.bindKeyHandlers = function() {
  const defender = this.defender;

  Object.keys(GameView.KEY_BINDS).forEach(k => {
    let offset = GameView.KEY_BINDS[k];
    key(k, function() { defender.power(offset); });
  });

  key('space', function() { defender.fireBullet(); })
};

GameView.prototype.addPointInfo = function(ctx) {
  const grunt = document.getElementById('grunt-1');
  const soldier = document.getElementById('soldier-1');
  const invader = document.getElementById('invader-1');
  const ufo = document.getElementById('ufo');

  ctx.drawImage(grunt, 350, 300, 40, 40);
  ctx.drawImage(soldier, 350, 340, 40, 40);
  ctx.drawImage(invader, 350, 380, 40, 40);
  ctx.drawImage(ufo, 350, 420, 40, 40);
};

module.exports = GameView;
