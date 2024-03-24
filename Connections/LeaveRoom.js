const { playerLeavesRoom, deleteRoom } = require("../Utils/Rooms/Controller");
const { userLeaves, getRoomUsers } = require("../Utils/Users/users");
const { formatMessage } = require("../Utils/messages");
const { ExtractData } = require("../Utils/Rooms/Functions");
const BotInfo = require("../bot/info");
const { EventLogger, ErrorLogger } = require("../middleware/Logger");

const LeaveRoom = async (socket, io, { player_data, room_data }) => {
  if (room_data && player_data) {
    const { room, success, message, deathray } = await playerLeavesRoom(
      room_data.id,
      socket.id,
      room_data.isPublic
    );

    EventLogger("room:", room, "success:", success);

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
        io.to(room_data.id).emit("disconnected", true);
        if (room_data.isPublic) {
          void deleteRoom(room_data.id, room_data.isPublic);
        }
      }
      socket.leave(room_data.id);

      io.to(room_data.id).emit("lobby", {
        room: ExtractData(room, "ROOM"),
        players: getRoomUsers(room.id),
      });
    } else {
      socket.emit("errorMessage", formatMessage(BotInfo.name, message, true));
      EventLogger("e", message, success);
    }
  } else {
    ErrorLogger("missing parameters -e");
  }
};

module.exports = LeaveRoom;
