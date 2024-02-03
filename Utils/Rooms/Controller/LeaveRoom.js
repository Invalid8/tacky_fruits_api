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
      if (room.bot) {
        if (room.players.length < 2) {
          return clearAll({ player, room_id, isPublic });
        } else {
          return clearOnce({ rooms, room, id, player, isPublic, player_id });
        }
      } else {
        if (player.role === 111) {
          console.log("deleted quick room", room.id, "since 1 player is left");
          return clearAll({ player, room_id, isPublic });
        } else if (player.role === 222) {
          return clearOnce({ rooms, room, id, player, isPublic, player_id });
        } else {
          console.log("Issue of the unknown");
        }
      }
    }
  }
}

module.exports = playerLeavesRoom;

async function clearAll({ player, room_id, isPublic }) {
  console.log("all");
  const { room, message, success } = await deleteRoom(room_id, isPublic);

  return {
    room,
    message,
    success,
    player,
    deathray: true,
  };
}

async function clearOnce({ rooms, isPublic, id, player, room, player_id }) {
  console.log("once");
  const players = rooms[id].players.filter((player) => player.id !== player_id);

  if (players.length < 2) rooms[id].opened = true;

  rooms[id].players = players;
  console.log(rooms);

  void UpadateRoom(rooms, isPublic);

  console.log("player", player.id, "left", room.id);
  return {
    room,
    player,
    success: true,
    message: "succesfull",
    deathray: false,
  };
}
