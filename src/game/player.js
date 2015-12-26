const Sprite = require('../graphics/sprite');

const MOVE_SPEED = 1;
const LINK_DATA = require('../data/link');
const KEY_DELAY = LINK_DATA.defaultDuration;

function Player(window, canvas) {
    this._sprite = Sprite.loadSheet(LINK_DATA, window, canvas);
    this._x = 0;
    this._y = 0;
    this._directionCounter = 0;
    this._animating = false;
}

Player.prototype = {
    update(keys) {
        var isKeyPressed = Object.keys(keys).filter(function(key) {
            return keys[key];
        }).length > 0;
        this._animating = isKeyPressed;
        
        if (this._directionCounter <= 0 && isKeyPressed) {
            if (keys.down) {
                this._y += MOVE_SPEED;
                this._sprite.setAnimation('down');
            } else if (keys.up) {
                this._y -= MOVE_SPEED;
                this._sprite.setAnimation('up');
            } else if (keys.left) {
                this._x -= MOVE_SPEED;
                this._sprite.setAnimation('left');
            } else if (keys.right) {
                this._x += MOVE_SPEED;
                this._sprite.setAnimation('right');
            }
            this._sprite.move(this._x, this._y);
        } else {
            this._directionCounter--;
        }
    },
    
    draw() {
        this._sprite.draw(!this._animating);
    }
};

module.exports = Player;