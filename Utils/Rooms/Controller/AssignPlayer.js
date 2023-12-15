const findInArray = require("../../../functions/FindInArray");
const AllRooms = require("./AllRooms");
const UpadateRoom = require("./UpdateRooms");

async function assignPlayer(room_id, player_data, isPublic) {
  if (!room_id || !player_data) {
    console.log("Missing parameters. roomId | playerData | isPublic");
    return {
      room: undefined,
      success: false,
      message: "Missing parameters. roomId | playerData | isPublic",
    };
  }

  const rooms = await AllRooms(isPublic);
  const { item: room, id } = findInArray(room_id, rooms, true);

  if (!room)
    return {
      room,
      success: false,
      message: "room does not exist",
    };

  if (room.players.length === room.max_players_no)
    return {
      room,
      success: false,
      message: "room is already full",
    };

  if (room.players.find((x) => x.id === player_data.id))
    return {
      room,
      success: false,
      message: "Already in the room",
    };

  if (room) {
    room.players.push({ ...player_data, role: 222 });
    rooms[id] = room;
    UpadateRoom(rooms, isPublic);
    console.log(
      `player ${player_data.id} added to room ${room.id} created successfully`
    );
    return {
      room,
      success: true,
      message: "successful",
    };
  }
}

module.exports = assignPlayer;
