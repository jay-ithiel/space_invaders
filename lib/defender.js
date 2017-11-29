const Ship = require("./ship");
const Util = require("./util");

const Defender = function() {
  this.hasThreeGuns = false;
  this.hasFiveGuns = false;
  this.speedUp = false;
  this.speedUp2 = false;
};

Util.inherits(Defender, Ship);

Defender.prototype.draw = function(ctx) {
  let x = this.pos[0] - 16;
  let y = this.pos[1] - 16;
};
