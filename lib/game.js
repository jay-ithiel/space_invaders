const Ship = require("./ship");

const Game = function() {
  this.invaderShips = [];
  this.shields = [];
  this.ship = new Ship({ game: this });
  this.allObjects = this.getAllObjects();

};

Game.DIM_X = 600;
Game.DIM_Y = 600;
Game.BG_COLOR = "#000000";

Game.prototype.addInvaderShips = function () {
  // this function will push instances of invader ships into 'this.invaderShips'
};

Game.prototype.addDefenderShip = function() {
  // may not need this function
};

Game.prototype.getAllObjects = function() {
  return this.invaderShips.concat(this.shields.concat(this.ship));
};

Game.prototype.moveObjects = function() {
  this.allObjects.forEach(object => {
    object.move();
  });
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects.forEach(object => {
    object.draw();
  });
};

Game.prototype.step = function() {
  this.moveObjects();
};

module.exports = Game;
