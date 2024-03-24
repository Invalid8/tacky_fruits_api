const { aiRoom } = require("../Utils/Rooms/Controller/CreateRoom");
const { ExtractData } = require("../Utils/Rooms/Functions");
const { userJoin, getRoomUsers } = require("../Utils/Users/users");
const { formatMessage } = require("../Utils/messages");
const BotInfo = require("../bot/info");
const { EventLogger, ErrorLogger } = require("../middleware/Logger");
const ForceExit = require("./func/ForceExit");

const AIRoom = async (socket, io, { player_data, mode }) => {
  socket.emit("ready", false);
  if (player_data && mode) {
    const {
      room,
      success,
      message,
      player: player0,
      computer: computer0,
    } = await aiRoom({ ...player_data, id: socket.id }, mode);

    if (success) {
      const player = userJoin(socket.id, player0, ExtractData(room, "ROOM"));
      const computer = userJoin(
        computer0.id,
        computer0,
        ExtractData(room, "ROOM")
      );

      socket.join(room.id);
      socket.emit("ready", success);

      socket.emit(
        "message",
        formatMessage(BotInfo.name, `Welcome to room ${room.name}`)
      );

      socket.broadcast
        .to(room.id)
        .emit(
          "message",
          formatMessage(BotInfo.name, `${player.name} has joined the lobby`)
        );

      socket.broadcast
        .to(room.id)
        .emit(
          "message",
          formatMessage(BotInfo.name, `${computer.name} has joined the lobby`)
        );

      io.to(room.id).emit("lobby", {
        room: ExtractData(room, "ROOM"),
        players: getRoomUsers(room.id),
      });

      const go = getRoomUsers(room.id)
        ? getRoomUsers(room.id).length === 2
        : false;

      io.to(room.id).emit("ready", {
        isReady: go,
      });

      EventLogger(`ready: ${go}`, "Game Ready", "./Connections/AllRooms.js");

      ForceExit(socket, io, { player_data, room });
    } else {
      socket.emit("errorMessage", formatMessage(BotInfo.name, message, true));
    }
  } else {
    ErrorLogger("missing parameters", "", "./Connections/AllRooms.js");
  }
};

module.exports = AIRoom;
