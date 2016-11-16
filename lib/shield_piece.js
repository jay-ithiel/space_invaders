const ShieldPiece = function(options) {
  this.id = options.id;
  this.pos = options.pos;
  this.radius = options.radius;
  this.color = options.color;
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

ShieldPiece.prototype.collideWith = function() {

};

module.exports = ShieldPiece;
