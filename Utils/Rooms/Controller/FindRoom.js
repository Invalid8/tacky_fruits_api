const findInArray = require("../../../functions/FindInArray");
const AllRooms = require("./AllRooms");
// create room for player vs player

async function findRoom(room_id, isPublic) {
  const rooms = await AllRooms(isPublic);
  const room = findInArray(room_id, rooms);

  return room;
}

module.exports = findRoom;
