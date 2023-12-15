const ROOM = require("../model/rooms");

async function AllRooms(isPublic = true) {
  const rooms = isPublic
    ? await ROOM.public_rooms()
    : await ROOM.private_rooms();

  return JSON.parse(rooms);
}

module.exports = AllRooms;
