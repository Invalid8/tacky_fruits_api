const ROOM = require("../model/rooms");

function UpadateRoom(nRooms, isPublic) {
  isPublic ? ROOM.updatePublicRooms(nRooms) : ROOM.updatePrivateRooms(nRooms);

  return nRooms;
}

module.exports = UpadateRoom;
