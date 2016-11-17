/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	
	document.addEventListener('DOMContentLoaded', () => {
	  const canvas = document.getElementById('game-canvas');
	  canvas.height = 600;
	  canvas.width = 900;
	
	  const canvasSize = [canvas.width, canvas.height];
	  const ctx = canvas.getContext('2d');
	  const gameView = new GameView(ctx, canvasSize);
	
	  gameView.welcome();
	
	  let playGameButton = document.getElementById('play-game');
	  playGameButton.addEventListener("click", () => {
	    playGameButton.className = 'sprite';
	    gameView.start();
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// Responsible for keeping track of canvas context, the game and the ships
	// Will be in charge of setting an interval timer to animate the game.
	// Will bind key listeners to the ship so that user may move it around.
	
	const Game = __webpack_require__(2);
	
	const GameView = function(ctx, canvasSize) {
	  this.ctx = ctx;
	  this.canvasSize = canvasSize;
	  this.game = new Game({
	    canvasSize: this.canvasSize,
	    ctx: this.ctx,
	    gameView: this
	  });
	  this.defender = this.game.defender;
	};
	
	GameView.prototype.start = function() {
	  this.bindKeyHandlers();
	
	  this.interval = setInterval(() => {
	    this.game.draw(this.ctx);
	    this.addLivesText(this.ctx);
	    this.addScoreText(this.ctx);
	    this.game.moveInvaders();
	    this.game.step();
	  }, 10);
	
	  setInterval(() => {
	    this.game.toggleInvaders();
	  }, 500);
	};
	
	GameView.prototype.stop = function() {
	  clearInterval(this.interval);
	};
	
	GameView.prototype.welcome = function() {
	  this.ctx.clearRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
	  this.ctx.fillStyle = '#000';
	  this.ctx.fillRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
	  this.addMainLogo(this.ctx);
	};
	
	GameView.prototype.pause = function() {
	
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
	
	GameView.prototype.addMainLogo = function(ctx) {
	  let x = this.game.DIM_X * .15;
	  let y = this.game.DIM_Y * .01;
	  let logoImage = document.getElementById('main-logo');
	  ctx.drawImage(logoImage, x, y, 600, 250);
	};
	
	GameView.prototype.addPlayButton = function(ctx) {
	  let x = this.game.DIM_X * .35;
	  let y = this.game.DIM_Y * .8;
	  let playImage = document.getElementById('play-game');
	  ctx.drawImage(playImage, x, y, 250, 35);
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Ship = __webpack_require__(3);
	const Bullet = __webpack_require__(6);
	const Shield = __webpack_require__(8);
	const ShieldPiece = __webpack_require__(7);
	const Star = __webpack_require__(9);
	const Util = __webpack_require__(5);
	
	const Game = function(options) {
	  this.canvasSize = options.canvasSize;
	  this.ctx = options.ctx;
	  this.stars = [];
	  this.defender = null;
	  this.defenderLives = 2;
	  this.score = 0;
	  this.invaderShips = [];
	  this.bullets = [];
	  this.shields = [];
	  this.shieldPieces = [];
	  this.gameView = options.gameView;
	
	  this.DIM_X = this.canvasSize[0];
	  this.DIM_Y = this.canvasSize[1];
	
	  this.addStars();
	  this.addDefenderShip();
	  this.addInvaderShips();
	  this.addShields();
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
	          x * 45,
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
	      color: "#00ff00",
	      game: this
	    });
	
	    shield.draw(this.ctx);
	  }
	};
	
	Game.prototype.refreshShields = function() {
	  this.shieldPieces = [];
	  this.addShields();
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
	    this.shieldPieces,
	    this.bullets,
	    this.stars
	  );
	};
	
	Game.prototype.moveObjects = function() {
	  this.getAllObjects().forEach(object => {
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
	    object.draw(ctx);
	  });
	};
	
	Game.prototype.lose = function() {
	  this.ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	  this.ctx.fillStyle = 'red';
	  this.ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);
	  this.gameView.stop();
	};
	
	Game.prototype.winRound = function() {
	  setTimeout(() => {
	    if (this.invaderShips.length === 0) {
	      this.refreshShields();
	      this.addInvaderShips();
	      this.defenderLives += 1;
	    }
	  }, 1000);
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
	    this.shieldPieces
	  );
	};
	
	// This method makes enemy ships shoot bullets
	Game.prototype.enemyFire = function() {
	  // fireChance increases as the horde gets wiped out
	  let fireChance, invaderCount = this.invaderShips.length;
	  if (invaderCount < 10) {
	    fireChance = 1000;
	  } else if (invaderCount < 20) {
	    fireChance = 2000;
	  } else if (invaderCount < 30) {
	    fireChance = 4000;
	  } else if (invaderCount < 40) {
	    fireChance = 6000;
	  } else if (invaderCount < 50) {
	    fireChance = 8000;
	  } else {
	    fireChance = 10000;
	  }
	
	  this.invaderShips.forEach(invader => {
	    let fire = Math.random() * fireChance;
	    if (fire < 1) {
	      invader.fireBullet();
	      invader.currentBullet = false;
	    }
	  });
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
	  } else if (object instanceof ShieldPiece) {
	    this.shieldPieces.splice(this.shieldPieces.indexOf(object), 1);
	  }
	};
	
	Game.prototype.step = function() {
	  this.moveObjects();
	  this.checkCollisions();
	  this.enemyFire();
	  this.winRound();
	};
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const Bullet = __webpack_require__(6);
	
	const Ship = function(options = { radius: 13 }) {
	  this.name = options.name;
	  this.game = options.game;
	  this.canvasSize = options.canvasSize;
	  this.img = options.img;
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = 17 || options.radius;
	  this.side = options.side;
	  this.currentBullet = false;
	
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Ship, MovingObject);
	
	Ship.prototype.draw = function(ctx) {
	  // Will use images later, but for dev purposes, use circles
	  // ctx.fillStyle = "#ffffff";
	  // ctx.beginPath();
	  // ctx.arc(
	  //   this.pos[0],
	  //   this.pos[1],
	  //   this.radius,
	  //   0,
	  //   2 * Math.PI
	  // );
	  // ctx.fill();
	
	  // subtract from pos to align the image with the radius
	  let x = this.pos[0] - 18;
	  let y = this.pos[1] - 18;
	  ctx.drawImage(this.img, x, y, 35, 35);
	};
	
	Ship.prototype.respawn = function() {
	  if (this.game.defenderLives === 0) {
	    this.game.lose();
	  }
	
	  this.pos = [
	    (this.canvasSize[0] - 30) * .52,
	     this.canvasSize[1] - 70
	  ];
	  this.vel = [0,0];
	  this.game.defenderLives -= 1;
	};
	
	Ship.prototype.death = function() {
	  if (this.name === 'defender') {
	    this.respawn();
	  } else {
	    this.game.score += this.killScore();
	    this.game.increaseInvadersSpeed();
	    this.currentBullet = false;
	    this.deathImage();
	
	    setTimeout(() => {
	      this.game.remove(this);
	    }, 200);
	  }
	};
	
	Ship.prototype.deathImage = function() {
	  this.img = document.getElementById('ship-death');
	  this.draw(this.game.ctx);
	};
	
	Ship.prototype.toggleImage = function() {
	  if (this.name === 'grunt') {
	    let grunt1 = document.getElementById('grunt-1');
	    let grunt2 = document.getElementById('grunt-2');
	    this.img.id === 'grunt-1' ? this.img = grunt2 : this.img = grunt1;
	  } else if (this.name === 'soldier') {
	    let soldier1 = document.getElementById('soldier-1');
	    let soldier2 = document.getElementById('soldier-2');
	    this.img.id === 'soldier-1' ? this.img = soldier2 : this.img = soldier1;
	  } else if (this.name === 'invader') {
	    let invader1 = document.getElementById('invader-1');
	    let invader2 = document.getElementById('invader-2');
	    this.img.id === 'invader-1' ? this.img = invader2 : this.img = invader1;
	  }
	  // setTimeout(this.toggleImage.bind(this), 200);
	  // setTimeout(() => {
	    // this.draw(this.game.ctx);
	  // }, 200);
	};
	
	Ship.prototype.killScore = function() {
	  if (this.name === 'grunt') {
	    return 10;
	  } else if (this.name === 'soldier') {
	    return 20;
	  } else if (this.name === 'invader') {
	    return 40;
	  }
	};
	
	Ship.prototype.collideWith = function(bullet) {
	  if (this.side === bullet.shipSide) {
	    return;
	  }
	  this.currentBullet = false;
	};
	
	Ship.prototype.fireBullet = function() {
	  // Early return prevents player from spamming bullets, limiting
	  // the player to one bullet at a time
	  // if (this.currentBullet) { return; }
	
	  let bulletPosX = this.pos[0] - 2;
	  let bulletPosY = this.pos[1];
	  let bulletPos = [bulletPosX, bulletPosY];
	
	  let bulletVel;
	  if (this.name === 'defender') {
	    bulletVel = [0, -5];
	    bulletPosY -= 40;
	  } else {
	    bulletVel = [0, 5];
	    bulletPosX += 20;
	  }
	
	  let bullet = new Bullet({
	    vel: bulletVel,
	    pos: bulletPos,
	    color: "#FF0000",
	    game: this.game,
	    radius: 2,
	    shipName: this.name,
	    shipSide: this.side,
	    ship: this
	  });
	
	  this.currentBullet = true;
	  this.game.bullets.push(bullet);
	};
	
	Ship.prototype.reverse = function() {
	  let newVel = Math.abs(this.vel[0]) + 0.02;
	  if (this.vel[0] > 0) {
	    newVel = 0 - newVel;
	    this.vel = [newVel, 0];
	    this.pos[0] -= 5;
	  } else {
	    this.vel = [newVel, 0];
	    this.pos[0] += 5;
	  }
	  this.pos[1] += 20;
	};
	
	Ship.prototype.increaseSpeed = function() {
	  let newVel = Math.abs(this.vel[0]) + 0.001;
	  if (this.vel[0] < 0) {
	    newVel = 0 - newVel;
	    this.vel = [newVel, 0];
	  } else {
	    this.vel = [newVel, 0];
	  }
	};
	
	Ship.prototype.move = function() {
	  this.draw(this.game.ctx);
	
	  if (this.pos[1] > this.canvasSize[1] - 60) {
	    this.game.lose();
	  }
	
	  if (this.pos[0] > this.canvasSize[0] - 20) {
	    this.game.reverseAllInvaders();
	    } else if (this.pos[0] < 20) {
	    this.game.reverseAllInvaders();
	  } else {
	    this.pos[0] += this.vel[0];
	    this.pos[1] += this.vel[1];
	  }
	};
	
	Ship.prototype.power = function(impulse) {
	  if (this.pos[0] > this.canvasSize[0] - 20) {
	    if (impulse[0] > 0) {
	      return;
	    }
	  } else if (this.pos[0] < 20) {
	    if (impulse[0] < 0) {
	      return;
	    }
	  }
	
	  let xOffset = impulse[0];
	  this.pos[0] += xOffset * 5;
	};
	
	module.exports = Ship;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	
	const MovingObject = function(options) {
	  this.color = options.color;
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.img = options.img;
	  this.game = options.game;
	  this.canvasSize = options.canvasSize;
	};
	
	MovingObject.prototype.draw = function(ctx) {
	  let x = this.pos[0];
	  let y = this.pos[1];
	
	  ctx.drawImage(this.img, x, y, 50, 30);
	};
	
	MovingObject.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	
	  if (this.game.isOutOfBounds(this.pos)) {
	    if (this.ship.name === 'defender') {
	      this.ship.currentBullet = false;
	    }
	    this.game.remove(this);
	  }
	};
	
	MovingObject.prototype.collideWith = function(otherObject) {
	  // default do nothing
	};
	
	MovingObject.prototype.isCollidedWith = function(otherObject) {
	  let radiusSum = this.radius + otherObject.radius;
	  const centerDiff = Util.dist(this.pos, otherObject.pos);
	  return centerDiff < radiusSum;
	};
	
	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports) {

	const Util = {
	  inherits(child, parent) {
	    function Surrogate() {}
	    Surrogate.prototype = parent.prototype;
	    child.prototype = new Surrogate();
	    child.prototype.constructor = child;
	  },
	
	  randomVec(length) {
	    let deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	
	  scale(vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	
	  dist(pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  wrap(coord, max) {
	    if (coord < 0) {
	      return max - (coord % max);
	    } else if (coord > max) {
	      return coord % max;
	    } else {
	      return coord;
	    }
	  },
	
	  validCollision(options) {
	    const Ship = options.ship;
	    const Bullet = options.bullet;
	    const ShieldPiece = options.shieldPiece;
	
	    const object1 = options.object1;
	    const object2 = options.object2;
	
	    if (
	      (object1 instanceof Bullet && object2 instanceof Ship) ||
	      (object1 instanceof Ship && object2 instanceof Bullet) ||
	      (object1 instanceof Bullet && object2 instanceof ShieldPiece) ||
	      (object1 instanceof ShieldPiece && object2 instanceof Bullet)
	    ) { return true; }
	  }
	};
	
	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const ShieldPiece = __webpack_require__(7);
	
	const Bullet = function(options = {}) {
	  this.vel = options.vel;
	  this.pos = options.pos;
	  this.color = options.color;
	  this.radius = options.radius;
	  this.shipSide = options.shipSide;
	  this.ship = options.ship;
	
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Bullet, MovingObject);
	
	Bullet.prototype.draw = function(ctx) {
	  ctx.fillStyle = "#FF0000";
	
	  ctx.fillRect(
	    this.pos[0],
	    this.pos[1],
	    4,
	    14
	  );
	};
	
	Bullet.prototype.collideWith = function(otherObject) {
	  // prevents friendly fire
	  if (this.shipSide === otherObject.side) {
	    return;
	  }
	
	  if (otherObject instanceof ShieldPiece) {
	    this.game.remove(otherObject);
	    this.ship.currentBullet = false;
	  } else {
	    let otherShip = otherObject;
	    otherShip.death();
	    this.ship.currentBullet = false;
	  }
	
	  this.game.remove(this);
	};
	
	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports) {

	const ShieldPiece = function(options) {
	  this.id = options.id;
	  this.pos = options.pos;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.util = options.util;
	  this.game = options.game;
	};
	
	ShieldPiece.prototype.move = function() {
	  // default do nothing
	};
	
	ShieldPiece.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	
	  ctx.fillRect(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    this.radius
	  );
	};
	
	ShieldPiece.prototype.isCollidedWith = function(otherObject) {
	  let radiusSum = this.radius + otherObject.radius;
	  const centerDiff = this.util.dist(this.pos, otherObject.pos);
	  return centerDiff < radiusSum;
	};
	
	ShieldPiece.prototype.collideWith = function(otherObject) {
	  // default do nothing
	};
	
	module.exports = ShieldPiece;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const ShieldPiece = __webpack_require__(7);
	const Util = __webpack_require__(5);
	
	const Shield = function(options) {
	  this.id = options.id;
	  this.pos = options.pos;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	};
	
	Shield.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  let posX = this.pos[0];
	  let posY = this.pos[1];
	
	  for (let i = 0; i < 8; i++) {
	
	    let shieldPiece = new ShieldPiece ({
	      id: i,
	      pos: [posX, posY],
	      radius: this.radius,
	      color: this.color,
	      util: Util,
	      game: this.game
	    });
	
	    shieldPiece.draw(ctx);
	    this.game.shieldPieces.push(shieldPiece);
	
	    // places shield pieces in an arc shape
	    if (i < 2) { posY -= 15; }
	    else if (i < 5) { posX += 15; }
	    else { posY += 15; }
	  }
	};
	
	module.exports = Shield;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const MovingObject = __webpack_require__(4);
	
	const Star = function(options = {}) {
	  this.id = options.id;
	  this.color = "#ffffff";
	  this.radius = Math.random() * 1.5;
	  this.pos = options.pos || options.game.randomPosition();
	  this.vel = options.vel || Util.randomVec(50);
	  this.game = options.game;
	
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Star, MovingObject);
	
	Star.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	
	  this.pos = this.game.wrap(this.pos);
	};
	
	Star.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    true
	  );
	  ctx.fill();
	};
	
	module.exports = Star;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map