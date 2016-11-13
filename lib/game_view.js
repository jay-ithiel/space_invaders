// Responsible for keeping track of canvas context, the game and the ships
// Will be in charge of setting an interval timer to animate the game.
// Will bind key listeners to the ship so that user may move it around.

const Game = require('./game');

const GameView = function(ctx) {
  this.game = new Game();
  this.ctx = ctx;
  this.ship = this.game.ship;
};

GameView.prototype.start = function() {
  setInterval(() => {
    this.game.prototype.draw(this.ctx);
    this.game.step();
  }, 20);
};

module.exports = GameView;
