const Ship = require("./ship");
const Bullet = require('./bullet');
const Star = require("./star");
const Util = require("./util");

const Game = function(canvasSize) {
  this.canvasSize = canvasSize;
  this.defender = null;
  this.stars = [];
  this.bullets = [];
  this.invaderShips = [];
  this.shields = [];

  this.DIM_X = canvasSize[0];
  this.DIM_Y = canvasSize[1];

  this.addStars();
  this.addDefenderShip();
  this.addInvaderShips();
  this.allObjects = this.getAllObjects();
};

Game.BG_COLOR = "#000000";
Game.NUM_STARS = 40;

Game.prototype.randomPosition = function() {
  return [
    this.DIM_X * Math.random(),
    this.DIM_Y * Math.random()
  ];
};

Game.prototype.addStars = function() {
  for (let i = 0; i < Game.NUM_STARS; i++) {
    this.stars.push(new Star({
      id: i,
      color: "#ffffff",
      pos: this.randomPosition(),
      vel: Util.randomVec(10),
      game: this
    }));
  }
};

Game.prototype.addInvaderShips = function () {
  let invaderShipName;
  let invaderShipImage;
  let y = 80;

  for (let row = 0; row < 5; row++) {
    if (row < 1) {
      invaderShipName = 'invader';
      invaderShipImage = document.getElementById('invader-1');
    } else if (row < 3) {
      invaderShipName = 'soldier';
      invaderShipImage = document.getElementById('soldier-1');
    } else if (row > 2) {
      invaderShipName = 'grunt';
      invaderShipImage = document.getElementById('grunt-1');
    }

    for (let x = 1; x < 12; x++) {
      let invaderShip = new Ship ({
        name: invaderShipName,
        game: this,
        canvasSize: this.canvasSize,
        img: invaderShipImage,
        pos: [
          x * 50,
          y
        ],
        vel: [0.5, 0]
      });

      this.invaderShips.push(invaderShip);
    }

    y += 40;
  }

};

Game.prototype.wrap = function(pos) {
  let x = pos[0], y = pos[1];
  let maxX = this.DIM_X, maxY = this.DIM_Y;

  let wrappedX = Util.wrap(x, maxX);
  let wrappedY = Util.wrap(y, maxY);

  return [wrappedX, wrappedY];
};

Game.prototype.addDefenderShip = function() {
  const defender = new Ship ({
    name: 'defender',
    game: this,
    canvasSize: this.canvasSize,
    img: document.getElementById('defender'),
    pos: [
      (this.canvasSize[0] - 30) / 2,
      this.canvasSize[1] - 70
    ],
    vel: [0, 0]
  });

  this.defender = defender;
};

Game.prototype.getAllObjects = function() {
  return this.invaderShips.concat(
    this.shields.concat(
      this.stars
    ).concat(
      this.bullets
    )
  );
};

Game.prototype.moveObjects = function() {
  this.getAllObjects().forEach(object => {
    object.move();
  });
};

Game.prototype.reverseAllInvaders = function() {
  this.invaderShips.forEach(invader => {
    invader.reverse();
  });
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);

  this.defender.draw(ctx);

  this.getAllObjects().forEach(object => {
    object.draw(ctx);
  });

};

Game.prototype.checkCollisions = function() {


  for (var i = 0; i < this.getAllObjects().length; i++) {
    for (var j = 0; j < this.getAllObjects().length; j++) {
      let object1 = this.getAllObjects()[i];
      let object2 = this.getAllObjects()[j];
debugger;
      if (object1 instanceof Star || object2 instanceof Star) {
        return;
      }

      if (object1 instanceof Bullet || object2 instanceof Bullet) {
        console.log('bullet collided');
      }

      if (object1.isCollidedWith(object2)) {
        const collision = object1.collideWith(object2);
        if (collision) {
          alert('collide');
        }
      }
    }
  }
};

Game.prototype.remove = function(object) {
  let index = this.allObjects.indexOf(object);
  this.allObjects.splice(index, 1);
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
};

module.exports = Game;
