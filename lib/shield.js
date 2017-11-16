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

  for (let i = 1; i < 21; i++) {
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

    if (i < 10) { posX += 7; }
    else if (i === 10) { posY -= 7; }
    else if (i < 20) { posX -= 7; }
    else if (i === 20) { posY -= 7; }
  }

  // for (let i = 1; i < 29; i++) {
  //   let shieldPiece = new ShieldPiece ({
  //     id: i,
  //     pos: [posX, posY],
  //     radius: this.radius,
  //     color: this.color,
  //     util: Util,
  //     game: this.game
  //   });
  //
  //   shieldPiece.draw(ctx);
  //   this.game.shieldPieces.push(shieldPiece);
  //
  //   if (i < 14) { posX += 7; }
  //   else if (i === 14) { posY -= 7; }
  //   else if (i < 28) { posX -= 7; }
  //   else if (i === 28) { posY -= 7; }
  // }
};

module.exports = Shield;
