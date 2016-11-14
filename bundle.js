/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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

	  gameView.start();
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
	  this.game = new Game(this.canvasSize);
	  this.defender = this.game.defender;
	};

	GameView.prototype.start = function() {
	  this.bindKeyHandlers();
	  setInterval(() => {
	    this.game.draw(this.ctx);
	    this.game.step();
	  }, 10);
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

	GameView.prototype.bindKeyHandlers = function() {
	  const defender = this.defender;

	  Object.keys(GameView.KEY_BINDS).forEach(k => {
	    let offset = GameView.KEY_BINDS[k];
	    key(k, function() { defender.power(offset); });
	  });

	  key('space', function() { defender.fireBullet(); })
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Ship = __webpack_require__(3);
	const Bullet = __webpack_require__(6);
	const Star = __webpack_require__(7);
	const Util = __webpack_require__(5);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const Bullet = __webpack_require__(6);

	const Ship = function(options = {}) {
	  this.name = options.name;
	  this.game = options.game;
	  this.canvasSize = options.canvasSize;
	  this.img = options.img;
	  this.pos = options.pos;
	  this.vel = options.vel;

	  MovingObject.call(this, options);
	};

	Util.inherits(Ship, MovingObject);

	Ship.prototype.draw = function(ctx) {
	  let x = this.pos[0];
	  let y = this.pos[1];
	  ctx.drawImage(this.img, x, y, 45, 35);
	};

	Ship.prototype.respawn = function() {
	  this.pos = [
	    (this.canvasSize[0] - 30) / 2,
	     this.canvasSize[1] - 40
	  ];
	  this.vel = [0,0];
	};

	Ship.prototype.death = function() {
	  if (this.name === 'defender') {
	    this.respawn();
	  } else {
	    // remove ship from game

	  }
	};

	Ship.prototype.collideWith = function(otherObject) {
	  if (otherObject instanceof Bullet) {
	    this.death();
	  }
	};

	Ship.prototype.fireBullet = function() {
	  console.log('you shot me!');

	  let bulletPosX = this.pos[0] + 22.5;
	  let bulletPosY = this.pos[1];
	  let bulletPos = [bulletPosX, bulletPosY];

	  let bullet = new Bullet({
	    vel: [0, -2],
	    pos: bulletPos,
	    color: "#FF0000",
	    game: this.game
	  });

	  this.game.bullets.push(bullet);
	};

	Ship.prototype.reverse = function() {
	  let newVel = Math.abs(this.vel[0]) + 0.1;
	  if (this.vel[0] > 0) {
	    newVel = 0 - newVel;
	    this.vel = [newVel, 0];
	    this.pos[0] -= 5;
	  } else {
	    this.vel = [newVel, 0];
	    this.pos[0] += 5;
	  }
	  this.pos[1] += 40;
	};

	Ship.prototype.move = function() {
	  if (this.pos[0] > this.canvasSize[0] - 60) {
	    this.game.reverseAllInvaders();
	    } else if (this.pos[0] < 20) {
	    this.game.reverseAllInvaders();
	  } else {
	    this.pos[0] += this.vel[0];
	    this.pos[1] += this.vel[1];
	  }
	};

	Ship.prototype.power = function(impulse) {

	  if (this.pos[0] > this.canvasSize[0] - 60) {
	    if (impulse[0] > 0) {
	      return;
	    }
	  } else if (this.pos[0] < 20) {
	    if (impulse[0] < 0) {
	      return;
	    }
	  }

	  let xOffset = impulse[0];
	  this.pos[0] += xOffset * 10;
	};

	module.exports = Ship;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const Ship = __webpack_require__(3);

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
	};

	MovingObject.prototype.collideWith = function(otherObject) {
	  this.game.remove(this);
	  this.game.remove(otherObject);
	};

	MovingObject.prototype.isCollidedWith = function(otherObject) {
	  if (this.id === otherObject.id) { return false; }
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
	  }
	};

	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const MovingObject = __webpack_require__(4);

	const Bullet = function(options = {}) {
	  this.vel = options.vel;
	  this.pos = options.pos;
	  this.color = options.color;

	  MovingObject.call(this, options);
	};

	Util.inherits(Bullet, MovingObject);

	Bullet.prototype.draw = function(ctx) {
	  ctx.strokeStyle = "#FF0000";
	  ctx.fillStyle = "#FF0000";

	  ctx.fillRect(
	    this.pos[0],
	    this.pos[1],
	    2,
	    7
	  );

	  // ctx.fillRect();

	  // ctx.beginPath();
	  // ctx.moveTo(this.pos[0], this.pos[1]);
	  // ctx.lineTo((this.pos[0] + 2), (this.pos[1] - 5));
	  //
	  // ctx.stroke();
	  // ctx.fill();
	};

	module.exports = Bullet;


/***/ },
/* 7 */
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