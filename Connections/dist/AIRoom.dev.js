"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("../Utils/Rooms/Controller/CreateRoom"),
    aiRoom = _require.aiRoom;

var _require2 = require("../Utils/Rooms/Functions"),
    ExtractData = _require2.ExtractData;

var _require3 = require("../Utils/Users/users"),
    userJoin = _require3.userJoin,
    getRoomUsers = _require3.getRoomUsers;

var _require4 = require("../Utils/messages"),
    formatMessage = _require4.formatMessage;

var BotInfo = require("../bot/info");

var _require5 = require("../middleware/Logger"),
    EventLogger = _require5.EventLogger,
    ErrorLogger = _require5.ErrorLogger;

var ForceExit = require("./func/ForceExit");

var AIRoom = function AIRoom(socket, io, _ref) {
  var player_data, mode, _ref2, room, success, message, player0, computer0, player, computer, go;

  return regeneratorRuntime.async(function AIRoom$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          player_data = _ref.player_data, mode = _ref.mode;
          socket.emit("ready", false);

          if (!(player_data && mode)) {
            _context.next = 14;
            break;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(aiRoom(_objectSpread({}, player_data, {
            id: socket.id
          }), mode));

        case 5:
          _ref2 = _context.sent;
          room = _ref2.room;
          success = _ref2.success;
          message = _ref2.message;
          player0 = _ref2.player;
          computer0 = _ref2.computer;

          if (success) {
            player = userJoin(socket.id, player0, ExtractData(room, "ROOM"));
            computer = userJoin(computer0.id, computer0, ExtractData(room, "ROOM"));
            socket.join(room.id);
            socket.emit("ready", success);
            socket.emit("message", formatMessage(BotInfo.name, "Welcome to room ".concat(room.name)));
            socket.broadcast.to(room.id).emit("message", formatMessage(BotInfo.name, "".concat(player.name, " has joined the lobby")));
            socket.broadcast.to(room.id).emit("message", formatMessage(BotInfo.name, "".concat(computer.name, " has joined the lobby")));
            io.to(room.id).emit("lobby", {
              room: ExtractData(room, "ROOM"),
              players: getRoomUsers(room.id)
            });
            go = getRoomUsers(room.id) ? getRoomUsers(room.id).length === 2 : false;
            io.to(room.id).emit("ready", {
              isReady: go
            });
            EventLogger("ready: ".concat(go), "Game Ready", "./Connections/AllRooms.js");
            ForceExit(socket, io, {
              player_data: player_data,
              room: room
            });
          } else {
            socket.emit("errorMessage", formatMessage(BotInfo.name, message, true));
          }

          _context.next = 15;
          break;

        case 14:
          ErrorLogger("missing parameters", "", "./Connections/AllRooms.js");

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = AIRoom;