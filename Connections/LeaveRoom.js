const { playerLeavesRoom } = require("../Utils/Rooms/Controller");
const { userLeaves } = require("../Utils/Users/users");
const { formatMessage } = require("../Utils/messages");
const BotInfo = require("../bot/info");

const LeaveRoom = async (socket, io, { player_data, room_data }) => {
  if (room_data && player_data) {
    const { room, success, message, deathray } = await playerLeavesRoom(
      room_data.id,
      socket.id,
      room_data.isPublic
    );

    console.log("room:", room, "success:", success);

    if (success) {
      const player = userLeaves(socket.id);

      socket.broadcast
        .to(room_data.id)
        .emit(
          "message",
          formatMessage(
            BotInfo.name,
            `${player && player.name} has left the lobby`
          )
        );

      if (deathray) {
        console.log("make user disconnect");
        io.to(room_data.id).emit("disconnected", true);
      }

      socket.leave(room_data.id);
    } else {
      socket.emit("errorMessage", formatMessage(BotInfo.name, message, true));
      console.log("e", message, success);
    }
  } else {
    console.log("missing parameters -e");
  }
};

module.exports = LeaveRoom;
