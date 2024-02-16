const ROOM = require("../model/rooms");

async function UpadateRoom(nRooms, isPublic) {
  (await isPublic)
    ? ROOM.updatePublicRooms(nRooms)
    : ROOM.updatePrivateRooms(nRooms);

  return nRooms;
}

module.exports = UpadateRoom;
