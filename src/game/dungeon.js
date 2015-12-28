const Sprite = require('../graphics/sprite');
const Room = require('./room');

function Dungeon(data, game) {
  this._data = data;
  this._loadTiles(game.getWindow(), game.getCanvas());
  this._loadRooms();
}

Dungeon.prototype = {
  _loadRooms() {
    var rooms = this._rooms = [];
    var tileset = this._tileset;
    var tileWidth = this._data.tileWidth;
    var tileHeight = this._data.tileHeight;
    this._data.rooms.forEach(function(roomName) {
      var data = require('../data/' + roomName);
      rooms.push(new Room(data, tileWidth, tileHeight, tileset));
    });
    this._currentRoom = rooms[this._data.startRoom];
  },

  _loadTiles(window, canvas) {
    var data = this._data;
    var tileset = this._tileset = new Sprite('./images/' + data.tileset, window, canvas);
    Object.keys(data.tiles).forEach(function(tileName) {
      var tile = data.tiles[tileName];
      tileset.registerAnimation(tileName, [{
        width: data.tileWidth,
        height: data.tileHeight,
        x: tile.x * data.tileWidth,
        y: tile.y * data.tileHeight
      }]);
    });
  },

  update() {

  },

  canPass(x, y, width, height) {
    return this._currentRoom.canPass(x, y, width, height);
  },

  draw() {
    this._currentRoom.draw();
  }
};

module.exports = Dungeon;