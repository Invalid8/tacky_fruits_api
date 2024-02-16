const { formatMessage } = require("../../Utils/messages");
const BotInfo = require("../../bot/info");
const LeaveRoom = require("../LeaveRoom");

function ForceExit(socket, io, { player_data, room }) {
  setTimeout(() => {
    io.to(room.id).emit(
      "disconnected",
      formatMessage(
        BotInfo.name,
        "You have exceeded the limit in this room \nyou will be exited in a few minute",
        true
      )
    );
    setTimeout(() => {
      io.to(room.id).emit("disconnected", true);
      LeaveRoom(socket, io, { player_data, room });
    }, 2000);
  }, 1000 * 60 * 30);
}

module.exports = ForceExit;
