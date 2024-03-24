"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("crypto"),
    randomUUID = _require.randomUUID;

var AllRooms = require("./AllRooms");

var UpadateRoom = require("./UpdateRooms");

var assignPlayer = require("./AssignPlayer");

var GenerateRandomName = require("./GenerateRoomName");

var BotInfo = require("../../../bot/info");

var FRUITY = require("../../Props/Fruity");

var _require2 = require("../../../middleware/Logger"),
    ErrorLogger = _require2.ErrorLogger,
    EventLogger = _require2.EventLogger;

var roomSchema = function roomSchema(id, name) {
  var expire = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
  var max_players_no = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
  return {
    id: id,
    name: name,
    players: [],
    expire: 1000 * 60 * expire,
    max_players_no: max_players_no
  };
};

function aiRoom(player_data, mode) {
  var rooms, room, C_ID, _char, computer_data;

  return regeneratorRuntime.async(function aiRoom$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(!player_data || !mode)) {
            _context.next = 3;
            break;
          }

          ErrorLogger("missing parameters");
          return _context.abrupt("return");

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(AllRooms(true));

        case 5:
          rooms = _context.sent;
          room = roomSchema(randomUUID().substring(0, 8), GenerateRandomName(), 0.5);
          room.isPublic = true;
          room.bot = true;
          room.opened = true;
          room.vsAI = mode;
          EventLogger("bot room ".concat(room.id, " created successfully"));
          C_ID = Math.floor(Math.random() * FRUITY.length);
          _char = FRUITY[C_ID];

          if (_char.key === player_data.character.key) {
            while (_char.key !== player_data.character.key) {
              C_ID = Math.floor(Math.random() * FRUITY.length);
              _char = FRUITY[C_ID];
            }
          }

          computer_data = {
            id: randomUUID().substring(0, 10),
            name: BotInfo.name,
            role: 222,
            character: _char
          };
          room.players = [_objectSpread({}, player_data, {
            role: 222
          }), computer_data];
          _context.next = 19;
          return regeneratorRuntime.awrap(UpadateRoom([].concat(_toConsumableArray(rooms), [room]), true));

        case 19:
          return _context.abrupt("return", {
            room: room,
            player: _objectSpread({}, player_data, {
              role: 222
            }),
            message: "successfull",
            success: true,
            computer: computer_data
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
}

function createOrJoinQuickRoom(player_data) {
  var rooms, openedRoom, room;
  return regeneratorRuntime.async(function createOrJoinQuickRoom$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (player_data) {
            _context2.next = 3;
            break;
          }

          ErrorLogger("missing parameters");
          return _context2.abrupt("return");

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(AllRooms(true));

        case 5:
          rooms = _context2.sent;
          // find avialable rooms
          openedRoom = rooms.find(function (x) {
            return x.bot && x.opened && x.players.length < x.max_players_no && !x.players.find(function (p) {
              return p.character.key === player_data.character.key;
            });
          });
          EventLogger("open room exist", openedRoom ? "true" : "false");

          if (!openedRoom) {
            _context2.next = 13;
            break;
          }

          // join
          EventLogger("ran this level");
          return _context2.abrupt("return", assignPlayer(openedRoom.id, player_data, true, true));

        case 13:
          // create
          room = roomSchema(randomUUID().substring(0, 8), GenerateRandomName(), 0.5);
          room.isPublic = true;
          room.bot = true;
          room.opened = true;
          room.players[0] = _objectSpread({}, player_data, {
            role: 222
          });
          UpadateRoom([].concat(_toConsumableArray(rooms), [room]), true);
          EventLogger("bot room ".concat(room.id, " created successfully"));
          return _context2.abrupt("return", {
            room: room,
            player: _objectSpread({}, player_data, {
              role: 222
            }),
            message: "successfull",
            success: true
          });

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function createRoom(host_player_data, room_data, isPublic) {
  var rooms, roomWithPlayer, room;
  return regeneratorRuntime.async(function createRoom$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(!room_data || !host_player_data)) {
            _context3.next = 3;
            break;
          }

          EventLogger("Add a name and key to room");
          return _context3.abrupt("return");

        case 3:
          if (!isPublic) {
            _context3.next = 9;
            break;
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(AllRooms(true));

        case 6:
          _context3.t0 = _context3.sent;
          _context3.next = 12;
          break;

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(AllRooms(false));

        case 11:
          _context3.t0 = _context3.sent;

        case 12:
          rooms = _context3.t0;
          roomWithPlayer = rooms.find(function (x) {
            return x.players.find(function (y) {
              return y.id === host_player_data.id;
            });
          });

          if (!roomWithPlayer) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", {
            room: null,
            message: "already in a room",
            success: false,
            player: null
          });

        case 16:
          room = roomSchema(randomUUID().substring(0, 8), room_data.name, 0.5);
          room.players[0] = _objectSpread({}, host_player_data, {
            role: 111
          });
          room.isPublic = isPublic;
          if (!isPublic) room.key = room_data.code;
          UpadateRoom([].concat(_toConsumableArray(rooms), [room]), isPublic);
          EventLogger("".concat(isPublic ? "public" : "private", " room ").concat(room.id, " created successfully"));
          return _context3.abrupt("return", {
            room: room,
            player: room.players[0],
            message: "successfull",
            success: true
          });

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  });
}

module.exports = {
  createRoom: createRoom,
  createOrJoinQuickRoom: createOrJoinQuickRoom,
  aiRoom: aiRoom
};