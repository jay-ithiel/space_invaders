const Ship = require("./ship");
const Bullet = require('./bullet');
const Shield = require('./shield');
const Star = require("./star");
const Util = require("./util");

const Game = function(canvasSize, ctx) {
  this.canvasSize = canvasSize;
  this.ctx = ctx;
  this.defender = null;
  this.defenderLives = 3;
  this.stars = [];
  this.bullets = [];
  this.invaderShips = [];
  this.shields = [];

  this.DIM_X = canvasSize[0];
  this.DIM_Y = canvasSize[1];

  this.addStars();
  this.addDefenderShip();
  this.addInvaderShips();
  this.addShields();
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
      vel: Util.randomVec(8),
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
        vel: [0.3, 0],
        side: 'invader'
      });
      this.invaderShips.push(invaderShip);
    }
    y += 40;
  }

};

Game.prototype.addShields = function() {
  for (let i = 0, x = .07; i < 5; i++, x += 0.2) {
    let shieldPosX = this.canvasSize[0] * x;
    let shieldPosY = this.canvasSize[1] * .8;

    let shield = new Shield ({
      id: i,
      pos: [shieldPosX, shieldPosY],
      radius: 15,
      color: "#00ff00"
    });

    this.shields.push(shield);
  }
};

Game.prototype.addDefenderShip = function() {
  const defender = new Ship ({
    name: 'defender',
    game: this,
    canvasSize: this.canvasSize,
    img: document.getElementById('defender'),
    pos: [
      (this.canvasSize[0] - 30) * .52,
      this.canvasSize[1] - 70
    ],
    vel: [0, 0],
    side: 'defender'
  });
  this.defender = defender;
};

Game.prototype.getAllObjects = function() {
  return [].concat(
    this.shields,
    this.bullets,
    this.invaderShips,
    this.stars
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

Game.prototype.wrap = function(pos) {
  let x = pos[0], y = pos[1];
  let maxX = this.DIM_X, maxY = this.DIM_Y;

  let wrappedX = Util.wrap(x, maxX);
  let wrappedY = Util.wrap(y, maxY);

  return [wrappedX, wrappedY];
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

Game.prototype.lose = function() {
  this.ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.ctx.fillStyle = 'red';
  this.ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);
};

Game.prototype.winRound = function() {
  if (this.invaderShips.length === 0) {
    this.addInvaderShips();
    this.defenderLives += 1;
  }
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > this.DIM_X) || (pos[1] > this.DIM_Y);
};

Game.prototype.collisionObjects = function() {
  return [].concat(
    this.bullets,
    this.invaderShips,
    this.defender,
    this.shields
  );
};

// This method makes enemy ships shoot bullets
Game.prototype.enemyFire = function() {
  this.invaderShips.forEach(invader => {
    let fire = Math.random() * 4000;
    if (fire < 1) {
      invader.fireBullet();
    }
  });
};

Game.prototype.checkCollisions = function() {
  for (var i = 0; i < this.collisionObjects().length; i++) {
    for (var j = 0; j < this.collisionObjects().length; j++) {
      let object1 = this.collisionObjects()[i];
      let object2 = this.collisionObjects()[j];

      let options = {
        ship: Ship,
        bullet: Bullet,
        shield: Shield,
        object1: object1,
        object2: object2
      };

      if (Util.validCollision(options)) {
        if (object1.isCollidedWith(object2)) {
          // collideWith handles logic for removing objects off of canvas
          object1.collideWith(object2);
        }
      }

    }
  }
};

Game.prototype.remove = function(object) {
  if (object instanceof Bullet) {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object instanceof Ship) {
    this.invaderShips.splice(this.invaderShips.indexOf(object), 1);
  }
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
  this.enemyFire();
  this.winRound();
};

module.exports = Game;
