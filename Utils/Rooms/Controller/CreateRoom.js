const { randomUUID } = require("crypto");
const AllRooms = require("./AllRooms");
const UpadateRoom = require("./UpdateRooms");
const assignPlayer = require("./AssignPlayer");
const GenerateRandomName = require("./GenerateRoomName");
const BotInfo = require("../../../bot/info");
const FRUITY = require("../../Props/Fruity");
const { ErrorLogger, EventLogger } = require("../../../middleware/Logger");

const roomSchema = (id, name, expire = 60, max_players_no = 2) => {
  return {
    id,
    name,
    players: [],
    expire: 1000 * 60 * expire,
    max_players_no,
  };
};

async function aiRoom(player_data, mode) {
  if (!player_data || !mode) {
    ErrorLogger("missing parameters");
    return;
  }

  const rooms = await AllRooms(true);

  const room = roomSchema(
    randomUUID().substring(0, 8),
    GenerateRandomName(),
    0.5
  );

  room.isPublic = true;
  room.bot = true;
  room.opened = true;
  room.vsAI = mode;

  EventLogger(`bot room ${room.id} created successfully`);

  let C_ID = Math.floor(Math.random() * FRUITY.length);
  let char = FRUITY[C_ID];

  if (char.key === player_data.character.key) {
    while (char.key !== player_data.character.key) {
      C_ID = Math.floor(Math.random() * FRUITY.length);
      char = FRUITY[C_ID];
    }
  }

  const computer_data = {
    id: randomUUID().substring(0, 10),
    name: BotInfo.name,
    role: 222,
    character: char,
  };

  room.players = [{ ...player_data, role: 222 }, computer_data];
  await UpadateRoom([...rooms, room], true);

  return {
    room,
    player: { ...player_data, role: 222 },
    message: "successfull",
    success: true,
    computer: computer_data,
  };
}

async function createOrJoinQuickRoom(player_data) {
  if (!player_data) {
    ErrorLogger("missing parameters");
    return;
  }

  const rooms = await AllRooms(true);

  // find avialable rooms

  const openedRoom = rooms.find(
    (x) =>
      x.bot &&
      x.opened &&
      x.players.length < x.max_players_no &&
      !x.players.find((p) => p.character.key === player_data.character.key)
  );

  EventLogger("open room exist", openedRoom ? "true" : "false");

  if (openedRoom) {
    // join
    EventLogger("ran this level");
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
    EventLogger(`bot room ${room.id} created successfully`);
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
    EventLogger("Add a name and key to room");
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

  EventLogger(
    `${isPublic ? "public" : "private"} room ${room.id} created successfully`
  );
  return {
    room,
    player: room.players[0],
    message: "successfull",
    success: true,
  };
}

module.exports = { createRoom, createOrJoinQuickRoom, aiRoom };
