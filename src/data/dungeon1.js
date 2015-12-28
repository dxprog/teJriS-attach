module.exports = {
  tileset: 'dungeon-sprites.png',
  tileWidth: 16,
  tileHeight: 16,
  startRoom: 'room1',
  rooms: {
    room1: {
      dataset: 'room1',
      exits: {
        east: 'room2'
      }
    },
    room2: {
      dataset: 'room2',
      exits: {
        west: 'room1'
      }
    }
  },
  tiles: {
    floor: {
      x: 0,
      y: 0
    },
    block: {
      x: 1,
      y: 0
    }
  }
};