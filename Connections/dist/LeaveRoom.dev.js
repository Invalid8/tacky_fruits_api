"use strict";

var _require = require("../Utils/Rooms/Controller"),
    playerLeavesRoom = _require.playerLeavesRoom,
    deleteRoom = _require.deleteRoom;

var _require2 = require("../Utils/Users/users"),
    userLeaves = _require2.userLeaves,
    getRoomUsers = _require2.getRoomUsers;

var _require3 = require("../Utils/messages"),
    formatMessage = _require3.formatMessage;

var _require4 = require("../Utils/Rooms/Functions"),
    ExtractData = _require4.ExtractData;

var BotInfo = require("../bot/info");

var _require5 = require("../middleware/Logger"),
    EventLogger = _require5.EventLogger,
    ErrorLogger = _require5.ErrorLogger;

var LeaveRoom = function LeaveRoom(socket, io, _ref) {
  var player_data, room_data, _ref2, room, success, message, deathray, player;

  return regeneratorRuntime.async(function LeaveRoom$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          player_data = _ref.player_data, room_data = _ref.room_data;

          if (!(room_data && player_data)) {
            _context.next = 13;
            break;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(playerLeavesRoom(room_data.id, socket.id, room_data.isPublic));

        case 4:
          _ref2 = _context.sent;
          room = _ref2.room;
          success = _ref2.success;
          message = _ref2.message;
          deathray = _ref2.deathray;
          EventLogger("room:", room, "success:", success);

          if (success) {
            player = userLeaves(socket.id);
            socket.broadcast.to(room_data.id).emit("message", formatMessage(BotInfo.name, "".concat(player && player.name, " has left the lobby")));

            if (deathray) {
              io.to(room_data.id).emit("disconnected", true);

              if (room_data.isPublic) {
                void deleteRoom(room_data.id, room_data.isPublic);
              }
            }

            socket.leave(room_data.id);
            io.to(room_data.id).emit("lobby", {
              room: ExtractData(room, "ROOM"),
              players: getRoomUsers(room.id)
            });
          } else {
            socket.emit("errorMessage", formatMessage(BotInfo.name, message, true));
            EventLogger("e", message, success);
          }

          _context.next = 14;
          break;

        case 13:
          ErrorLogger("missing parameters -e");

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = LeaveRoom;