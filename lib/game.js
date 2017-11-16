const Ship = require("./ship");
const Bullet = require('./bullet');
const Shield = require('./shield');
const ShieldPiece = require('./shield_piece');
const Star = require("./star");
const PowerUp = require('./power_up');
const Util = require("./util");

const Game = function(options) {
  this.canvasSize = options.canvasSize;
  this.ctx = options.ctx;
  this.stars = [];
  this.defender = null;
  this.defenderLives = 3;
  this.score = 0;
  this.level = 1;
  this.invaderShips = [];
  this.ufo = null;
  this.bullets = [];
  this.bulletId = 0;
  this.shields = [];
  this.shieldPieces = [];
  this.powerUps = [];
  this.gameView = options.gameView;

  this.DIM_X = this.canvasSize[0];
  this.DIM_Y = this.canvasSize[1];

  this.addStars();
  this.addDefenderShip();
  this.addInvaderShips();
  this.addShields();

  this.gameView.addKeyListeners();
};

Game.BG_COLOR = "#000000";
Game.NUM_STARS = 50;

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
      vel: Util.randomVec(.1),
      game: this
    }));
  }
};

Game.prototype.addUfo = function(ctx) {
  // Early return if a ufo is currently spawned
  if (this.ufo) { return; }

  let spawnUfoChance = Math.random() * 700;
  let spawnPosition = Math.round(Math.random() * 10);
  let vel, spawnIdx;

  if (spawnPosition > 5) {
    spawnIdx = 0;
    vel = [2, 0];
  } else {
    spawnIdx = 1;
    vel = [-2, 0];
  }

  let spawnPositions = [-30, 930];

  if (spawnUfoChance < 1) {
    let ufoImage = document.getElementById('ufo');
    let ufoShip = new Ship ({
      name: 'ufo',
      game: this,
      canvasSize: this.canvasSize,
      img: ufoImage,
      radius: 27,
      pos: [spawnPositions[spawnIdx], 45],
      vel: vel,
      side: 'invader'
    });

    this.ufo = ufoShip;
  }

};

Game.prototype.addInvaderShips = function(level = 1) {
  let invaderShipName, invaderShipImage;
  let y = 100;
  let invaderIdx = 0;
  let vel = [0.27, 0];
  vel[0] += 0.05 * level;

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

    for (let x = 1; x < 14; x++, invaderIdx++) {
      let invaderShip = new Ship ({
        id: invaderIdx,
        name: invaderShipName,
        game: this,
        canvasSize: this.canvasSize,
        img: invaderShipImage,
        radius: 12,
        pos: [
          x * 35,
          y
        ],
        vel: vel,
        side: 'invader'
      });
      this.invaderShips.push(invaderShip);
    }
    y += 40;
  }

};

Game.prototype.addShields = function() {
  for (let i = 0, x = .05; i < 5; i++, x += 0.2) {
    let shieldPosX = this.canvasSize[0] * x + 14;
    let shieldPosY = this.canvasSize[1] * .8;

    let shield = new Shield ({
      id: i,
      pos: [shieldPosX, shieldPosY],
      radius: 7,
      color: "#a0a09b",
      game: this
    });

    shield.draw(this.ctx);
  }
};

Game.prototype.refreshShields = function() {
  this.shieldPieces = [];
  this.shields = [];
  this.addShields();
};

Game.prototype.addDefenderShip = function() {
  const defender = new Ship ({
    name: 'defender',
    game: this,
    canvasSize: this.canvasSize,
    img: document.getElementById('defender'),
    radius: 16,
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
    this.ufo,
    this.shieldPieces,
    this.bullets,
    this.stars,
    this.powerUps
  );
};

Game.prototype.moveObjects = function() {
  this.getAllObjects().forEach(object => {
    if (object == null) { return; }
    object.move();
  });
};

Game.prototype.moveInvaders = function() {
  this.invaderShips.forEach(ship => {
    ship.move();
  });
};

Game.prototype.toggleInvaders = function() {
  this.invaderShips.forEach(ship => {
    ship.toggleImage();
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
    if (object == null) { return; }
    object.draw(ctx);
  });
};

Game.prototype.lose = function() {
  this.gameView.pause();
  this.gameView.addLivesText(this.ctx);
  this.gameView.gameOver();
};

Game.prototype.winRound = function() {
  if (this.invaderShips.length === 0) {
    setTimeout(() => {
      if (this.invaderShips.length === 0) {
        this.refreshShields();
        this.level++;
        this.defenderLives++;
        this.addInvaderShips(this.level);
      }
    }, 1000);
  }
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < -50) || (pos[1] < 0) ||
    (pos[0] > this.DIM_X + 50) || (pos[1] > this.DIM_Y);
};

Game.prototype.collisionObjects = function() {
  return [].concat(
    this.bullets,
    this.invaderShips,
    this.defender,
    this.shieldPieces,
    this.ufo,
    this.powerUps
  );
};

// This method makes enemy ships shoot bullets
Game.prototype.enemyFire = function() {
  // fireChance increases as the horde gets wiped out
  let fireChance, invaderCount = this.invaderShips.length;
  if (invaderCount < 10) {
    fireChance = 500;
  } else if (invaderCount < 25) {
    fireChance = 1500;
  } else if (invaderCount < 40) {
    fireChance = 3000;
  } else if (invaderCount < 50) {
    fireChance = 4000;
  } else {
    fireChance = 5000;
  }

  this.invaderShips.forEach(invader => {
    let fire = Math.random() * fireChance;
    if (fire < 1) {
      invader.fireBullet();
      invader.currentBullet = false;
    }
  });

  // Early return if ufo is not spawned
  if (this.ufo == null) { return; }

  let ufoFire = Math.random() * 1000;
  if (ufoFire < 15) {
    this.ufo.fireBullet();
  }
};

// This method makes enemy ships move faster with each one that dies
Game.prototype.increaseInvadersSpeed = function() {
  this.invaderShips.forEach(invader => {
    invader.increaseSpeed();
  });
};

Game.prototype.checkCollisions = function() {
  let collisionObjects = this.collisionObjects();
  for (var i = 0; i < collisionObjects.length; i++) {
    for (var j = 0; j < collisionObjects.length; j++) {

      let object1 = collisionObjects[i];
      let object2 = collisionObjects[j];

      let options = {
        ship: Ship,
        bullet: Bullet,
        shieldPiece: ShieldPiece,
        powerUp: PowerUp,
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

Game.prototype.currentDefenderBullet = function() {
  this.bullets.forEach(bullet => {
    if (bullet.ship.name === 'defender') return true;
  });
  return false;
};

Game.prototype.remove = function(object) {
  if (object instanceof Bullet) {
    object.removeBullet(object);
  } else if (object instanceof Ship) {
    if (object.name === 'ufo') {
      this.ufo = null;
      return;
    }

    object.removeShip(object);
  } else if (object instanceof ShieldPiece) {
    this.shieldPieces.splice(this.shieldPieces.indexOf(object), 1);
  } else if (object instanceof PowerUp) {
    this.powerUps.splice(this.powerUps.indexOf(object), 1);
  }
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
  this.enemyFire();
  this.winRound();
};

module.exports = Game;
