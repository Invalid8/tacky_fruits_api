const { assignPlayer } = require("../Utils/Rooms/Controller");
const { ExtractData } = require("../Utils/Rooms/Functions");
const { getRoomUsers, userJoin } = require("../Utils/Users/users");
const { formatMessage } = require("../Utils/messages");
const BotInfo = require("../bot/info");

const JoinPrivateRoom = async (socket, io, { player_data, room_id }) => {
  socket.emit("joined", false);
  if (room_id && player_data) {
    const {
      room,
      success,
      message,
      player: player0,
    } = await assignPlayer(
      room_id,
      {
        ...player_data,
        id: socket.id,
      },
      false
    );

    if (success) {
      const player = userJoin(socket.id, player0, ExtractData(room, "ROOM"));
      socket.join(room.id);
      socket.emit("joined", success);
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

      io.to(room.id).emit("lobby", {
        room: ExtractData(room, "ROOM"),
        players: getRoomUsers(room.id),
      });
    } else {
      socket.emit("errorMessage", formatMessage(BotInfo.name, message, true));
    }
  } else {
    console.error("missing parameters");
  }
};

module.exports = JoinPrivateRoom;
