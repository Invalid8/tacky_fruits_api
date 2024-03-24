"use strict";

var findInArray = require("../../../functions/FindInArray");

var _require = require("../../../middleware/Logger"),
    ErrorLogger = _require.ErrorLogger,
    EventLogger = _require.EventLogger;

var AllRooms = require("./AllRooms");

var _require2 = require("./DeleteRoom"),
    deleteRoom = _require2.deleteRoom;

var UpadateRoom = require("./UpdateRooms");

function playerLeavesRoom(room_id, player_id, isPublic) {
  var rooms, _findInArray, room, id, player;

  return regeneratorRuntime.async(function playerLeavesRoom$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(!player_id || !room_id)) {
            _context.next = 3;
            break;
          }

          ErrorLogger("missing parameters -t");
          return _context.abrupt("return", {
            room: null,
            player: null,
            success: false,
            message: "missing parameters",
            deathray: false
          });

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(AllRooms(isPublic));

        case 5:
          rooms = _context.sent;
          _findInArray = findInArray(room_id, rooms, true), room = _findInArray.item, id = _findInArray.id;

          if (room) {
            _context.next = 10;
            break;
          }

          EventLogger("room does not exist");
          return _context.abrupt("return", {
            room: null,
            player: null,
            success: false,
            message: "room does not exist",
            deathray: false
          });

        case 10:
          if (!room) {
            _context.next = 34;
            break;
          }

          player = findInArray(player_id, room.players);

          if (player) {
            _context.next = 15;
            break;
          }

          EventLogger("player is not in room");
          return _context.abrupt("return", {
            room: null,
            success: false,
            player: null,
            message: "player is not in room",
            deathray: false
          });

        case 15:
          if (!player) {
            _context.next = 34;
            break;
          }

          if (!room.bot) {
            _context.next = 24;
            break;
          }

          if (!(room.players.length < 2)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", clearAll({
            player: player,
            room_id: room_id,
            isPublic: isPublic
          }));

        case 21:
          return _context.abrupt("return", clearOnce({
            rooms: rooms,
            room: room,
            id: id,
            player: player,
            isPublic: isPublic,
            player_id: player_id
          }));

        case 22:
          _context.next = 34;
          break;

        case 24:
          if (!(player.role === 111)) {
            _context.next = 29;
            break;
          }

          EventLogger("deleted quick room", room.id, "since 1 player is left");
          return _context.abrupt("return", clearAll({
            player: player,
            room_id: room_id,
            isPublic: isPublic
          }));

        case 29:
          if (!(player.role === 222)) {
            _context.next = 33;
            break;
          }

          return _context.abrupt("return", clearOnce({
            rooms: rooms,
            room: room,
            id: id,
            player: player,
            isPublic: isPublic,
            player_id: player_id
          }));

        case 33:
          EventLogger("Issue of the unknown");

        case 34:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = playerLeavesRoom;

function clearAll(_ref) {
  var player, room_id, isPublic, _ref2, room, message, success;

  return regeneratorRuntime.async(function clearAll$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          player = _ref.player, room_id = _ref.room_id, isPublic = _ref.isPublic;
          EventLogger("all");
          _context2.next = 4;
          return regeneratorRuntime.awrap(deleteRoom(room_id, isPublic));

        case 4:
          _ref2 = _context2.sent;
          room = _ref2.room;
          message = _ref2.message;
          success = _ref2.success;
          return _context2.abrupt("return", {
            room: room,
            message: message,
            success: success,
            player: player,
            deathray: true
          });

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function clearOnce(_ref3) {
  var rooms, isPublic, id, player, room, player_id, players;
  return regeneratorRuntime.async(function clearOnce$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          rooms = _ref3.rooms, isPublic = _ref3.isPublic, id = _ref3.id, player = _ref3.player, room = _ref3.room, player_id = _ref3.player_id;
          EventLogger("once");
          players = rooms[id].players.filter(function (player) {
            return player.id !== player_id;
          });
          if (players.length < 2) rooms[id].opened = true;
          rooms[id].players = players;
          EventLogger(rooms);
          void UpadateRoom(rooms, isPublic);
          EventLogger("player", player.id, "left", room.id);
          return _context3.abrupt("return", {
            room: room,
            player: player,
            success: true,
            message: "succesfull",
            deathray: false
          });

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
}