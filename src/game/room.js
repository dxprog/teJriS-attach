function Room(tileData, exitData, tileWidth, tileHeight, tileset) {
  this._data = tileData;
  this._exits = exitData;
  this._tileset = tileset;
  this._tileWidth = tileWidth;
  this._tileHeight = tileHeight;
}

// Class constants
Room.EAST = 'east';
Room.BOTTOM = 'south';
Room.WEST = 'west';
Room.NORTH = 'north';

Room.prototype = {
  draw(offsetX, offsetY) {
    var x, y, row;
    var tileset = this._tileset;
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    for (var i = 0, height = this._data.length; i < height; i++) {
      row = this._data[i];
      y = i * this._tileHeight;
      for (var j = 0, width = row.length; j < width; j++) {
        x = j * this._tileWidth;
        tileset.move(x + offsetX, y + offsetY);
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

          // Make note of what edge was hit to pass on to the dungeon later
          if (tileY < 0) {
            this._edgeHit = Room.NORTH;
          } else if (tileY >= data.length) {
            this._edgeHit = Room.SOUTH;
          } else if (tileX < 0) {
            this._edgeHit = Room.WEST;
          } else {
            this._edgeHit = Room.EAST;
          }

          return false;
        }
      }
    }

    this._edgeHit = false;

    return true;
  },

  roomTransition() {
    return this._edgeHit;
  },

  getRoomWidthInPixels() {
    return this._data[0].length * this._tileWidth;
  },

  getRoomHeightInPixels() {
    return this._data.length * this._tileHeight;
  },

  getExitForDirection(direction) {
    return !!this._exits[direction] ? this._exits[direction] : false;
  }

};

module.exports = Room;