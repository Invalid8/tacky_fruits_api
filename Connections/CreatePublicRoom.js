const { createRoom } = require("../Utils/Rooms/Controller");
const { ExtractData } = require("../Utils/Rooms/Functions");
const { userJoin, getRoomUsers } = require("../Utils/Users/users");
const { formatMessage } = require("../Utils/messages");
const BotInfo = require("../bot/info");

const CreatePublicRoom = async (socket, io, { host_data, room_data }) => {
  socket.emit("created", false);

  if (host_data) {
    const {
      room,
      success,
      message,
      player: player0,
    } = await createRoom({ ...host_data, id: socket.id }, room_data, true);

    if (success) {
      const player = userJoin(socket.id, player0, ExtractData(room, "ROOM"));
      socket.join(room.id);
      socket.emit("created", success);

      socket.emit(
        "message",
        formatMessage(BotInfo.name, `Welcome to room ${room.name}`)
      );

      socket.broadcast
        .to(room.id)
        .emit(
          "message",
          formatMessage(player.name, `${player.name} has joined the lobby`)
        );

      io.to(room.id).emit("lobby", {
        room: ExtractData(room, "ROOM"),
        players: getRoomUsers(room.id),
      });
    } else {
      socket.emit("errorMessage", formatMessage(BotInfo.name, message, true));
    }
  } else {
    socket.emit(
      "errorMessage",
      formatMessage(BotInfo.name, `host data not found`, true)
    );
  }
};

module.exports = CreatePublicRoom;
