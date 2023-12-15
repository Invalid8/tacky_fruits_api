const findInArray = require("../../../functions/FindInArray");
const AllRooms = require("./AllRooms");
const UpadateRoom = require("./UpdateRooms");

async function playerLeavesRoom(room_id, player_id, isPublic) {
  const rooms = await AllRooms(isPublic);
  const room = findInArray(room_id, rooms);

  if (room) {
    const player = findInArray(player_id, room.players);

    if (player)
      if (player.role === 111) {
        console.log("deleted room", room.id);
        return deleteRoom(room_id, isPublic);
      } else {
        console.log("player", player.id, "left", room.id);
        const removedRoom = rooms.splice(player, 1)[0];
        UpadateRoom(rooms, isPublic);
        return removedRoom;
      }
    else {
      console.log("player is not in room");
    }
  } else {
    console.log("room does not exist");
  }
}

module.exports = playerLeavesRoom;
