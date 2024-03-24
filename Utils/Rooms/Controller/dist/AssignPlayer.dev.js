"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var findInArray = require("../../../functions/FindInArray");

var _require = require("../../../middleware/Logger"),
    EventLogger = _require.EventLogger,
    ErrorLogger = _require.ErrorLogger;

var AllRooms = require("./AllRooms");

var UpadateRoom = require("./UpdateRooms");

function assignPlayer(room_id, player_data, isPublic) {
  var isBot,
      rooms,
      _findInArray,
      room,
      id,
      _args = arguments;

  return regeneratorRuntime.async(function assignPlayer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          isBot = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;

          if (!(!room_id || !player_data)) {
            _context.next = 4;
            break;
          }

          ErrorLogger("Missing parameters. roomId | playerData");
          return _context.abrupt("return", {
            room: undefined,
            success: false,
            message: "Missing parameters. roomId | playerData"
          });

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(AllRooms(isPublic));

        case 6:
          rooms = _context.sent;
          _findInArray = findInArray(room_id, rooms, true), room = _findInArray.item, id = _findInArray.id;

          if (room) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", {
            room: room,
            success: false,
            player: null,
            message: "room does not exist"
          });

        case 10:
          if (!(room.players.length === room.max_players_no)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", {
            room: room,
            success: false,
            player: null,
            message: "room is already full"
          });

        case 12:
          if (!room.players.find(function (x) {
            return x.id === player_data.id;
          })) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", {
            room: room,
            success: false,
            player: null,
            message: "Already in the room"
          });

        case 14:
          if (!room) {
            _context.next = 21;
            break;
          }

          room.players.push(_objectSpread({}, player_data, {
            role: 222
          }));
          if (room.bot) if (room.players.length == 2) {
            room.opened = false;
          }
          rooms[id] = room;
          UpadateRoom(rooms, isPublic);
          EventLogger("player ".concat(player_data.id, " added to room ").concat(room.id, " successfully!"));
          return _context.abrupt("return", {
            room: room,
            success: true,
            player: _objectSpread({}, player_data, {
              role: 222
            }),
            message: "successful"
          });

        case 21:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = assignPlayer;