const Ship = require("./ship");
const Bullet = require('./bullet');
const Star = require("./star");

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
Game.NUM_STARS = 4;

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
        ]
      });

      this.invaderShips.push(invaderShip);
    }

    y += 40;
  }

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
    ]
  });

  this.defender = defender;
};

Game.prototype.getAllObjects = function() {
  return this.invaderShips.concat(
    this.shields.concat(
      this.defender
    ).concat(
      this.bullets
    ).concat(
      this.stars
    )
  );
};

Game.prototype.moveObjects = function() {
  this.getAllObjects().forEach(object => {
    object.move();
  });
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);

  this.allObjects.forEach(object => {
    object.draw(ctx);
  });
};

Game.prototype.checkCollisions = function() {
  for (var i = 0; i < this.allObjects.length; i++) {
    for (var j = 0; j < this.allObjects.length; j++) {
      let object1 = this.allObjects[i];
      let object2 = this.allObjects[j];

      if (object1.isCollidedWith(object2)) {
        const collision = object1.collideWith(object2);
        if (collision) { return; }
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
