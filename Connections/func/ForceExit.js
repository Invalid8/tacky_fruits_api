const { formatMessage } = require("../../Utils/messages");
const BotInfo = require("../../bot/info");
const LeaveRoom = require("../LeaveRoom");

function ForceExit(socket, io, { player_data, room }, time) {
  if (!time) time = 1000 * 60 * 30; // 30 mins
  setTimeout(() => {
    LeaveRoom(socket, io, { player_data, room });
    io.to(room.id).emit(
      "disconnected",
      formatMessage(
        BotInfo.name,
        "You have exceeded the limit in this room \nyou will be exited in a few minute",
        true
      )
    );
  }, time);
}

module.exports = ForceExit;
