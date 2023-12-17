const findInArray = require("../../../functions/FindInArray");
const AllRooms = require("./AllRooms");
const { deleteRoom } = require("./DeleteRoom");
const UpadateRoom = require("./UpdateRooms");

async function playerLeavesRoom(room_id, player_id, isPublic) {
  if (!player_id || !room_id) {
    console.log("missing parameters -t");
    return {
      room: null,
      player: null,
      success: false,
      message: "missing parameters",
      deathray: false,
    };
  }

  let rooms = await AllRooms(isPublic);
  const { item: room, id } = findInArray(room_id, rooms, true);

  if (!room) {
    console.log("room does not exist");
    return {
      room: null,
      player: null,
      success: false,
      message: "room does not exist",
      deathray: false,
    };
  }

  if (room) {
    const player = findInArray(player_id, room.players);

    if (!player) {
      console.log("player is not in room");
      return {
        room: null,
        success: false,
        player: null,
        message: "player is not in room",
        deathray: false,
      };
    }

    if (player) {
      if (room.bot && room.players.length === 1) {
        console.log("deleted quick room", room.id, "since 1 players is left");
        const {
          rooom: room0,
          message: message0,
          success: success0,
        } = await deleteRoom(room_id, isPublic);
        return {
          room: room0,
          message: message0,
          success: success0,
          player,
          deathray: true,
        };
      }
      if (player.role === 111) {
        console.log("deleted room", room.id);
        const {
          rooom: room0,
          message: message0,
          success: success0,
        } = await deleteRoom(room_id, isPublic);
        return {
          room: room0,
          message: message0,
          success: success0,
          player,
          deathray: true,
        };
      } else if (player.role === 222) {
        rooms[id].players = rooms[id].players.filter(
          (player) => player.id !== player_id
        );

        UpadateRoom(rooms, isPublic);

        console.log("player", player.id, "left", room.id);
        return {
          room,
          player,
          success: true,
          message: "succesfull",
          deathray: false,
        };
      } else {
        console.log("Issue of the unknown");
      }
    }
  }
}

module.exports = playerLeavesRoom;
