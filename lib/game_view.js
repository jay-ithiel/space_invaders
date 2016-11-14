// Responsible for keeping track of canvas context, the game and the ships
// Will be in charge of setting an interval timer to animate the game.
// Will bind key listeners to the ship so that user may move it around.

const Game = require('./game');

const GameView = function(ctx, canvasSize) {
  this.ctx = ctx;
  this.canvasSize = canvasSize;
  this.game = new Game(this.canvasSize);
  this.defender = this.game.defender;
};

GameView.prototype.start = function() {
  this.bindKeyHandlers();
  setInterval(() => {
    this.game.draw(this.ctx);
    this.game.step();
  }, 20);
};

GameView.KEY_BINDS = {
  'w': [0, -1],
  ',': [0, -1],
  'a': [-1, 0],
  's': [0, 1],
  'o': [0, 1],
  'd': [1, 0],
  'e': [1, 0],
  'up': [0, -1],
  'down': [0, 1],
  'left': [-1, 0],
  'right': [1, 0]
};

GameView.prototype.bindKeyHandlers = function() {
  const defender = this.defender;

  Object.keys(GameView.KEY_BINDS).forEach(k => {
    let offset = GameView.KEY_BINDS[k];
    key(k, function() { defender.power(offset); });
  });

  key('space', function() { defender.fireBullet(); })
};

module.exports = GameView;
