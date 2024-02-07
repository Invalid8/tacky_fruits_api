const { createOrJoinQuickRoom } = require("../Utils/Rooms/Controller");
const { ExtractData } = require("../Utils/Rooms/Functions");
const { userJoin, getRoomUsers } = require("../Utils/Users/users");
const { formatMessage } = require("../Utils/messages");
const BotInfo = require("../bot/info");
const LeaveRoom = require("./LeaveRoom");

const CreateOrJoinQuickRoom = async (socket, io, player_data) => {
  socket.emit("ready", false);

  if (player_data) {
    const {
      room,
      success,
      message,
      player: player0,
    } = await createOrJoinQuickRoom({
      ...player_data,
      id: socket.id,
    });

    if (success) {
      const player = userJoin(socket.id, player0, ExtractData(room, "ROOM"));
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

      console.log("reday", go);

      setTimeout(() => {
        io.to(room.id).emit("disconnected", true);
        LeaveRoom(socket, io, { player_data, room });
      }, 1000 * 60 * 30);
    } else {
      socket.emit("errorMessage", formatMessage(BotInfo.name, message, true));
    }
  } else {
    console.log("missing parameters");
  }
};

module.exports = CreateOrJoinQuickRoom;
