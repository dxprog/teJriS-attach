const Texture = require('./texture');

function Sprite(imagePath, window, canvas) {
  this._img = new Texture(imagePath, window, this._imageLoaded.bind(this));
  this._canvas = canvas;
  this._currentAnimation;
  this._animations = {};
  this._frame = 0;
  this._frameCounter = 0;
  this.x = 0;
  this.y = 0;
}

Sprite.prototype = {
  _imageLoaded() {
    this._drawable = true;
  },

  registerAnimation(name, frames) {
    this._animations[name] = Array.isArray(frames) ? frames : [ frames ];
  },

  move(x, y) {
    this.x = x;
    this.y = y;
  },

  setAnimation(name) {
    if (name !== this._currentAnimation) {
      this._currentAnimation = name;
      this._frame = 0;
      this._frameCounter = this._animations[name][0].duration || -1;
    }
  },

  draw(pauseAnimation) {
    if (this._drawable) {
      var currentAnimation = this._currentAnimation;
      var animation = this._animations[currentAnimation][this._frame];

      this._canvas.draw(this._img, this.x, this.y, animation.width, animation.height, animation.x, animation.y);
      if (!pauseAnimation) {
        this._frameCounter--;
        if (this._frameCounter === 0) {
          this._frame++;
          if (this._frame >= this._animations[currentAnimation].length) {
            this._frame = 0;
          }
          this._frameCounter = this._animations[currentAnimation][this._frame].duration || 0;
        }
      }
    }
  }

};

Sprite.loadSheet = function(data, window, canvas) {
  var out = new Sprite(data.imagePath, window, canvas);
  Object.keys(data.animations).forEach(function(name) {
    var animation = data.animations[name];
    animation.forEach(function(frame) {
      frame.width = frame.width || data.defaultWidth;
      frame.height = frame.height || data.defaultHeight;
      frame.duration = frame.duration || data.defaultDuration;
    });
    out.registerAnimation(name, animation);
  });

  if (data.defaultAnimation) {
    out.setAnimation(data.defaultAnimation);
  }

  return out;
};

module.exports = Sprite;