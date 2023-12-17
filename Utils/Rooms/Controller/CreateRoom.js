const { randomUUID } = require("crypto");
const AllRooms = require("./AllRooms");
const UpadateRoom = require("./UpdateRooms");
const assignPlayer = require("./AssignPlayer");
const GenerateRandomName = require("./GenerateRoomName");

const roomSchema = (id, name, expire = 60, max_players_no = 2) => {
  return {
    id,
    name,
    players: [],
    expire: 1000 * 60 * expire,
    max_players_no,
  };
};

async function createOrJoinQuickRoom(player_data) {
  if (!player_data) {
    console.log("missing parameters");
    return;
  }

  const rooms = await AllRooms(true);

  // find avialable rooms

  const openedRoom = rooms.find(
    (x) => x.bot && x.opened && x.players.length < x.max_players_no
  );

  console.log("open room exist", openedRoom ? "true" : "false");

  if (openedRoom) {
    // join
    console.log("ran this level");
    return assignPlayer(openedRoom.id, player_data, true, true);
  } else {
    // create
    const room = roomSchema(
      randomUUID().substring(0, 8),
      GenerateRandomName(),
      0.5
    );
    room.isPublic = true;
    room.bot = true;
    room.opened = true;
    room.players[0] = { ...player_data, role: 222 };
    UpadateRoom([...rooms, room], true);
    console.log(`bot room ${room.id} created successfully`);
    return {
      room,
      player: { ...player_data, role: 222 },
      message: "successfull",
      success: true,
    };
  }
}

async function createRoom(host_player_data, room_data, isPublic) {
  if (!room_data || !host_player_data) {
    console.log("Add a name and key to room");
    return;
  }

  const rooms = isPublic ? await AllRooms(true) : await AllRooms(false);

  const roomWithPlayer = rooms.find((x) =>
    x.players.find((y) => y.id === host_player_data.id)
  );

  if (roomWithPlayer)
    return {
      room: null,
      message: "already in a room",
      success: false,
      player: null,
    };

  const room = roomSchema(randomUUID().substring(0, 8), room_data.name, 0.5);
  room.players[0] = { ...host_player_data, role: 111 };
  room.isPublic = isPublic;
  if (!isPublic) room.key = room_data.code;

  UpadateRoom([...rooms, room], isPublic);

  console.log(
    `${isPublic ? "public" : "private"} room ${room.id} created successfully`
  );
  return {
    room,
    player: room.players[0],
    message: "successfull",
    success: true,
  };
}

module.exports = { createRoom, createOrJoinQuickRoom };
