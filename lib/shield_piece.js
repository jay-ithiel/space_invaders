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
