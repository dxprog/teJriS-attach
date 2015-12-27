function Room(data, tileWidth, tileHeight, tileset) {
  this._data = data;
  this._tileset = tileset;
  this._tileWidth = tileWidth;
  this._tileHeight = tileHeight;
}

Room.prototype = {
  draw() {
    var x, y, row, tile;
    var tileset = this._tileset;
    for (var i = 0, height = this._data.length; i < height; i++) {
      row = this._data[i];
      y = i * this._tileHeight;
      for (var j = 0, width = row.length; j < width; j++) {
        x = j * this._tileWidth;
        tileset.move(x, y);
        tileset.setAnimation(row[j].tile);
        tileset.draw();
      }
    }
  },

  canPass(x, y, width, height) {
    var i = y;
    var data = this._data;
    var j, tileX, tileY;

    // TODO - make better
    for (; i < y + height; i++) {
      for (j = x; j < x + width; j++) {
        tileX = Math.floor(j / this._tileWidth);
        tileY = Math.floor(i / this._tileHeight);
        if (tileY >= 0 && data.length > tileY && tileX >= 0 && data[tileY].length > tileX) {
          if (!data[tileY][tileX].passable) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  }
};

module.exports = Room;