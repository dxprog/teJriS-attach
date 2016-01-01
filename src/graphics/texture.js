const NOOP = function(){};

/**
 * A simple object for handling image loading life cycles
 *
 * @constructor
 * @param {String} imagePath The path to the texture's image
 * @param {window} window A reference to the window
 * @param {Function} callback A callback that's fired when the image loads
 */
function Texture(imagePath, window, callback) {
  this._img = new window.Image;
  this._img.onload = this._imageLoaded.bind(this);
  this._loadedCallback = callback || NOOP;
  this._img.src = imagePath;
  this._loaded = false;
}

Texture.prototype = {

    /**
     * Handler for Image onload
     *
     * @method _imageLoaded
     * @private
     */
    _imageLoaded() {
      this._loaded = true;
      this._loadedCallback(this);
    },

    /**
     * Handler for Image onerror
     *
     * @method _imageFailed
     * @private
     */
    _imageFailed() {
      throw 'Image failed to load!';
    },

    /**
     * Returns the texture's image
     *
     * @method getTexture
     * @return {HTMLImageElement}
     */
    getTexture() {
      return this._img;
    }
};

module.exports = Texture;