const { randomUUID } = require("crypto");
const AllRooms = require("./AllRooms");
const UpadateRoom = require("./UpdateRooms");

const roomSchema = (id, name, expire = 60, max_players_no = 2) => {
  return {
    id,
    name,
    players: [],
    expire: 1000 * 60 * expire,
    max_players_no,
  };
};

async function createQuickRoom(host_player_data) {
  const public_rooms = await AllRooms(true);

  if (!host_player_data) {
    console.log("No host player data");
    return;
  }

  const room = roomSchema(randomUUID().substring(0, 8), "quick play", 0.5);
  room.players[0] = { ...host_player_data, role: 111 };
  UpadateRoom([...public_rooms, room], true);

  console.log(`public room ${room.id} created successfully`);
  return room;
}

async function createPrivateRoom(host_player_data, room_data) {
  if (!room_data || !host_player_data) {
    console.log("Add a name and key to room");
    return;
  }

  const private_rooms = await AllRooms(false);

  const roomWithPlayer = private_rooms.find((x) =>
    x.players.find((y) => y.id === host_player_data.id)
  );

  if (roomWithPlayer)
    return {
      room: null,
      message: "already in a room",
      success: false,
    };

  const room = roomSchema(room_data.id, room_data.name, 0.5, 2);
  room.key = room_data.code;
  room.players[0] = { ...host_player_data, role: 111 };

  UpadateRoom([...private_rooms, room], false);

  console.log(`private room ${room.id} created successfully`);
  return { room, message: "successfull", success: true };
}

module.exports = { createPrivateRoom, createQuickRoom };
