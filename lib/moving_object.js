const MovingObject = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
};

MovingObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  
};
