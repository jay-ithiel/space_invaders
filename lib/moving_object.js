const MovingObject = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.img = options.img;
};

MovingObject.prototype.draw = function(ctx) {
  window.onload = () => {
    let c = document.getElementById('game-canvas');
    let img = document.getElementById('defender');
    ctx.drawImage(img, 10, 10);
  };
};

MovingObject.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};

module.exports = MovingObject;
