const ShieldPiece = require('./shield_piece');
const Util = require('./util');

const Shield = function(options) {
  this.id = options.id;
  this.pos = options.pos;
  this.radius = options.radius;
  this.color = options.color;
};

Shield.prototype.move = function() {
  // default do nothing
};

Shield.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  let posX = this.pos[0];
  let posY = this.pos[1];

  for (let i = 0; i < 8; i++) {

    new ShieldPiece ({
      id: i,
      pos: [posX, posY],
      radius: this.radius,
      color: this.color
    }).draw(ctx);

    // places shield pieces in an arc shape
    if (i < 2) { posY -= 15; }
    else if (i < 5) { posX += 15; }
    else { posY += 15; }
  }
};

Shield.prototype.isCollidedWith = function(otherObject) {
  let radiusSum = this.radius + otherObject.radius;
  const centerDiff = Util.dist(this.pos, otherObject.pos);
  return centerDiff < radiusSum;
};

Shield.prototype.collideWith = function(otherObject) {
  debugger;
};

module.exports = Shield;
