const findInArray = require("../../../functions/FindInArray");
const AllRooms = require("./AllRooms");
const UpadateRoom = require("./UpdateRooms");

async function assignPlayer(room_id, player_data, isPublic, isBot = false) {
  if (!room_id || !player_data) {
    console.log("Missing parameters. roomId | playerData");
    return {
      room: undefined,
      success: false,
      message: "Missing parameters. roomId | playerData",
    };
  }

  const rooms = await AllRooms(isPublic);
  const { item: room, id } = findInArray(room_id, rooms, true);

  if (!room)
    return {
      room,
      success: false,
      player: null,
      message: "room does not exist",
    };

  if (room.players.length === room.max_players_no)
    return {
      room,
      success: false,
      player: null,
      message: "room is already full",
    };

  if (room.players.find((x) => x.id === player_data.id))
    return {
      room,
      success: false,
      player: null,
      message: "Already in the room",
    };

  if (room) {
    room.players.push({ ...player_data, role: 222 });

    if (room.bot) room.opened = false;

    rooms[id] = room;
    UpadateRoom(rooms, isPublic);
    console.log(
      `player ${player_data.id} added to room ${room.id} successfully!`
    );

    return {
      room,
      success: true,
      player: { ...player_data, role: 222 },
      message: "successful",
    };
  }
}

module.exports = assignPlayer;
