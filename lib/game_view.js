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

  this.rightPressed = false;
  this.leftPressed = false;
  this.spacePressed = false;

  this.isMuted = false;

  this.addKeyListeners();
};

GameView.prototype.toggleAudio = function() {
  this.isMuted = this.isMuted ? false : true;
};

GameView.prototype.start = function() {
  this.interval = setInterval(() => {
    if (!this.isPaused) {
      this.game.draw(this.ctx);
      this.addLivesText(this.ctx);
      this.addScoreText(this.ctx);
      this.addLevelText(this.ctx);
      this.moveDefender();
      this.game.moveInvaders();
      this.game.addUfo();
      this.game.step();
    }
  }, 10);

  // Animate enemy sprites
  this.toggle = setInterval(() => {
    if (!this.isPaused) this.game.toggleInvaders();
  }, 500);
};

GameView.prototype.stop = function() {
  clearInterval(this.interval);
  clearInterval(this.toggle);

  this.interval     = null;
  this.toggle       = null;
  this.rightPressed = false;
  this.leftPressed  = false;
  this.spacePressed = false;
  this.isPaused     = false;
  this.defender     = this.game.defender;

  this.game = new Game({
    canvasSize: this.canvasSize,
    gameView:   this,
    ctx:        this.ctx
  });
};

GameView.prototype.restart = function() {
  this.stop();
  this.start();
};

GameView.prototype.welcome = function() {
  this.ctx.fillStyle = '#000';
  this.ctx.fillRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
};

GameView.prototype.pause = function() {
  this.isPaused = true;
};

GameView.prototype.resume = function() {
  this.isPaused = false;
};

GameView.prototype.gameOver = function() {
  this.stop();

  document.getElementById('menu-container').className='hide';

  setTimeout(() => {
    this.ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
    let gameOverImage  = document.getElementById('game-over'),
        playGameButton = document.getElementById('play-game');
    playGameButton.className = '';
    gameOverImage.className = '';
  }, 600);

};

GameView.KEY_BINDS = {
  'left': [-2, 0],
  'right': [2, 0]
};

GameView.prototype.addLivesText = function(ctx) {
  let x = this.game.DIM_X * .87, y = this.game.DIM_Y * .05;

  ctx.font = "23px Bungee Inline";
  ctx.fillText(`LIVES: ${this.game.defenderLives}`, x, y);
};

GameView.prototype.addMenu = function(ctx) {
  let x = this.game.DIM_X * .5, y = this.game.DIM_Y * .1;
};

GameView.prototype.addScoreText = function(ctx) {
  let x = this.game.DIM_X * .01, y = this.game.DIM_Y * .05;
  // ctx.find = "20px Georgia";
  ctx.fillText(`SCORE: ${this.game.score}`, x, y);
};

GameView.prototype.addLevelText = function(ctx) {
  let x = this.game.DIM_X * .01, y = this.game.DIM_Y * .95;
  ctx.fillText(`LEVEL: ${this.game.level}`, x, y);
}

GameView.prototype.bindKeyHandlers = function() {
  const defender = this.defender;

  Object.keys(GameView.KEY_BINDS).forEach(k => {
    let offset = GameView.KEY_BINDS[k];
    key(k, function() { defender.power(offset); });
  });

  key('space', function() { defender.fireBullet(); });
};

GameView.prototype.addKeyListeners = function() {
  document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
  document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
};

GameView.prototype.handleKeyDown = function(e) {
  if (e.keyCode === 37) {
    this.leftPressed = true;
  } else if (e.keyCode === 39) {
    this.rightPressed = true;
  }

  if (e.keyCode === 32) {
    this.spacePressed = true;
  }
};

GameView.prototype.handleKeyUp = function(e) {
  if (e.keyCode === 37) {
    this.leftPressed = false;
  } else if (e.keyCode === 39) {
    this.rightPressed = false;
  }

  if (e.keyCode === 32) {
    this.spacePressed = false;
  }
};

GameView.prototype.moveDefender = function() {

  if (this.leftPressed) {
    this.defender.power([-3,0]);
  } else if (this.rightPressed) {
    this.defender.power([3,0]);
  }

  if (this.spacePressed) {
    this.defender.fireBullet();
  }
};

module.exports = GameView;
