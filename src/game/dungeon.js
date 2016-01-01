const Sprite = require('../graphics/sprite');
const Room = require('./room');

// Duration to transition to a new room
const TRANSITION_DURATION = 60;

// Speed map for transition of each direction
const TRANSITION_SPEEDS = {
  east: { x: -1, y: 0 },
  west: { x: 1, y: 0 },
  north: { x: 0, y: 1 },
  south: { x: 0, y: -1 }
};

/**
 * Handles the state for a collection of rooms
 *
 * @constructor
 * @param {Object} data The dungeon data
 * @param {Object~Game} game A reference to the game object
 */
function Dungeon(data, game) {
  this._data = data;
  this._loadTiles(game.getWindow(), game.getCanvas());
  this._loadRooms();
}

Dungeon.prototype = {

  /**
   * Loads and instantiates all the rooms for this dungeon
   *
   * @method _loadRooms
   * @private
   */
  _loadRooms() {
    var self = this;
    var rooms = this._rooms = {};
    var tileset = this._tileset;
    var tileWidth = this._data.tileWidth;
    var tileHeight = this._data.tileHeight;
    Object.keys(self._data.rooms).forEach(function(roomName) {
      var data = require('../data/' + roomName);
      rooms[roomName] = new Room(data, self._data.rooms[roomName].exits, tileWidth, tileHeight, tileset);
    });
    this._currentRoom = rooms[self._data.startRoom];
  },

  /**
   * Loads the tileset for the dungeon
   *
   * @method _loadTiles
   * @private
   * @param {window} window A reference to the window
   * @param {Object~Canvas} canvas A reference to the game canvas
   */
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

  /**
   * Game-tick update
   *
   * @method update
   */
  update() {
    if (!this._transitioning) {
      var transitionEdge = this._currentRoom.roomTransition();
      if (transitionEdge) {
        var nextRoom = this._currentRoom.getExitForDirection(transitionEdge);
        if (nextRoom) {
          var transitionSpeed = TRANSITION_SPEEDS[transitionEdge];
          var currentWidth = this._currentRoom.getRoomWidthInPixels();
          var currentHeight = this._currentRoom.getRoomHeightInPixels();
          this._transitioning = true;
          this._nextRoom = this._rooms[nextRoom];
          this._transitionX = this._transitionY = this._transitionCounter = 0;
          this._transitionSpeedX = currentWidth / TRANSITION_DURATION * transitionSpeed.x;
          this._transitionSpeedY = currentHeight / TRANSITION_DURATION * transitionSpeed.y;
          this._nextRoomOffsetX =
            (transitionSpeed.x > 0 ? this._nextRoom.getRoomWidthInPixels() : currentWidth) * transitionSpeed.x * -1;
          this._nextRoomOffsetY =
            (transitionSpeed.y > 0 ? this._nextRoom.getRoomHeightInPixels() : currentHeight) * transitionSpeed.y * -1;
        }
      }
    } else {
      this._transitionX += this._transitionSpeedX;
      this._transitionY += this._transitionSpeedY;
      this._transitionCounter++;
      if (this._transitionCounter >= TRANSITION_DURATION) {
        this._currentRoom.reset();
        this._nextRoom.reset();
        this._currentRoom = this._nextRoom;
        this._nextRoom = null;
        this._transitioning = false;
        this._transitionCounter = this._transitionX = this._transitionY = 0;
      }
    }
  },

  /**
   * Whether the X/Y position is passable in the current room
   *
   * @method canPass
   * @param {Number} x X position of the area to check
   * @param {Number} y Y position of the area to check
   * @param {Number} width Width of the area to check
   * @param {Number} height Height of the area to check
   * @return {Boolean} Whether the area is passable
   */
  canPass(x, y, width, height) {
    return this._currentRoom.canPass(x, y, width, height);
  },

  /**
   * Draws the current visible areas of the dungeon
   *
   * @method draw
   */
  draw() {
    this._currentRoom.draw(this._transitionX, this._transitionY);
    if (this._nextRoom) {
      this._nextRoom.draw(this._transitionX + this._nextRoomOffsetX, this._transitionY + this._nextRoomOffsetY);
    }
  },

  /**
   * Whether we're currently transitioning to a new room
   *
   * @method isTransitioning
   * @return {Boolean}
   */
  isTransitioning() {
    return this._transitioning;
  },

  /**
   * Returns the current X/Y room transition speeds
   *
   * @method getTransitionSpeeds
   * @return {Object} x/y speeds of the transition
   */
  getTransitionSpeeds() {
    return {
      x: this._transitionSpeedX,
      y: this._transitionSpeedY
    };
  },

  /**
   * Returns the current room width in pixels
   *
   * @method getCurrentRoomWidth
   * @return {Number}
   */
  getCurrentRoomWidth() {
    return this._currentRoom.getRoomWidthInPixels();
  }

};

module.exports = Dungeon;