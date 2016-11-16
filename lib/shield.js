const ShieldPiece = require('./shield_piece');
const Util = require('./util');

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
