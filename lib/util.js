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
  },

  validCollision(options) {
    const Ship = options.ship;
    const Bullet = options.bullet;
    const ShieldPiece = options.shieldPiece;
    const PowerUp = options.powerUp;

    const object1 = options.object1;
    const object2 = options.object2;

    if (
      (object1 instanceof Bullet && object2 instanceof Ship) ||
      (object1 instanceof Ship && object2 instanceof Bullet) ||
      (object1 instanceof Bullet && object2 instanceof ShieldPiece) ||
      (object1 instanceof ShieldPiece && object2 instanceof Bullet)
    ) { return true; }

    if (object1 instanceof Ship && object2 instanceof PowerUp) {
      if (object1.name === 'defender') { return true; }
    } else if (object2 instanceof Ship && object1 instanceof PowerUp) {
      if (object2.name === 'defender') { return true; }
    }

  }
};

module.exports = Util;
