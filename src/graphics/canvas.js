const Texture = require('./texture');

function Canvas(el) {
  if (!el.getContext) {
    throw 'The provided element must be a canvas element';
  }
  this._el = el;
  this._ctx = this._el.getContext('2d');
}

Canvas.prototype = {
  beginRender() {
    this._drawStack = [];
  },
  endRender() {
    this._drawStack.sort(function(a, b) {
      return a[0] < b[0] ? -1 : 1;
    });

    for (var i = 0, count = this._drawStack.length; i < count; i++) {
      // Shift off the z-index
      this._drawStack[i].shift();
      this._ctx.drawImage.apply(this._ctx, this._drawStack[i]);
    }

  },
  getContext() {
    return this._ctx;
  },
  drawWithZ(texture, x, y, z, width, height, srcX, srcY) {
    if (!(texture instanceof Texture)) {
      throw 'Invalid texture';
    }
    this._drawStack.push([ z, texture.getTexture(), srcX, srcY, width, height, x, y, width, height ]);
  },
  draw(texture, x, y, width, height, srcX, srcY) {
    this.drawWithZ(texture, x, y, 0, width, height, srcX, srcY);
  },
  clear() {
    this._ctx.clearRect(0, 0, this._el.width, this._el.height);
  }
};

module.exports = Canvas;