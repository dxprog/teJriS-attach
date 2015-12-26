const Texture = require('./texture');

function Canvas(el) {
    if (!el.getContext) {
        throw 'The provided element must be a canvas element';
    }
    this._el = el;
    this._ctx = this._el.getContext('2d');
}

Canvas.prototype = {
    getContext() {
        return this._ctx;
    },
    draw(texture, x, y, width, height, srcX, srcY) {
        if (!(texture instanceof Texture)) {
            throw 'Invalid texture';
        }
        this._ctx.drawImage(texture.getTexture(), srcX, srcY, width, height, x, y, width, height);
    },
    clear() {
        this._ctx.clearRect(0, 0, this._el.width, this._el.height);
    }
};

module.exports = Canvas;