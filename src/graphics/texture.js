const NOOP = function(){};

function Texture(imagePath, window, callback) {
    this._img = new window.Image;
    this._img.onload = this._imageLoaded.bind(this);
    this._loadedCallback = callback || NOOP;
    this._img.src = imagePath;
    this._loaded = false;
}

Texture.prototype = {
    _imageLoaded() {
        this._loaded = true;
        this._loadedCallback(this);
    },
    
    _imageFailed() {
        throw 'Image failed to load!';
    },
    
    getTexture() {
        return this._img;
    }
};

module.exports = Texture;