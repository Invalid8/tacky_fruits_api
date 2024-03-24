"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var findInArray = require("../../../functions/FindInArray");

var _require = require("../../../middleware/Logger"),
    EventLogger = _require.EventLogger;

var AllRooms = require("./AllRooms");

var UpadateRoom = require("./UpdateRooms");

function deleteRooms_Admin(player_id) {
  var public_rooms, private_rooms, _removeRoomORPlayer, roomsPublic, removedPublic, _removeRoomORPlayer2, roomsPrivate, removedPrivate, removed;

  return regeneratorRuntime.async(function deleteRooms_Admin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(AllRooms(true));

        case 2:
          public_rooms = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(AllRooms(false));

        case 5:
          private_rooms = _context.sent;
          _removeRoomORPlayer = removeRoomORPlayer(public_rooms, player_id), roomsPublic = _removeRoomORPlayer.newRooms, removedPublic = _removeRoomORPlayer.removed;
          _removeRoomORPlayer2 = removeRoomORPlayer(private_rooms, player_id), roomsPrivate = _removeRoomORPlayer2.newRooms, removedPrivate = _removeRoomORPlayer2.removed;
          UpadateRoom(roomsPublic, true);
          UpadateRoom(roomsPrivate, false);
          removed = [].concat(_toConsumableArray(removedPublic), _toConsumableArray(removedPrivate));
          EventLogger(removed);
          return _context.abrupt("return", removed);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
}

function deleteRoom(room_id, isPublic) {
  var rooms, room;
  return regeneratorRuntime.async(function deleteRoom$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(AllRooms(isPublic));

        case 2:
          rooms = _context2.sent;
          room = findInArray(room_id, rooms);

          if (room) {
            _context2.next = 7;
            break;
          }

          EventLogger("room does not exist");
          return _context2.abrupt("return", {
            room: null,
            success: false,
            message: "room does not exist"
          });

        case 7:
          if (!room) {
            _context2.next = 12;
            break;
          }

          rooms = rooms.filter(function (rm) {
            return rm.id !== room_id;
          });
          UpadateRoom(rooms, isPublic);
          EventLogger("room ".concat(room.id, " deleted successfully"));
          return _context2.abrupt("return", {
            room: room,
            success: true,
            message: "successful"
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function removeRoomORPlayer(rooms, player_id) {
  var removed = [];
  var newRooms = rooms.filter(function (r) {
    var pD = r.players.find(function (player) {
      return player.id === player_id;
    });
    var sRoom;

    if (pD) {
      sRoom = r;

      if (pD.role === 111) {
        // remove room
        r = null;
        EventLogger("removed room");
      } else if (pD.role === 222) {
        if (r.bot) {
          r = null;
          EventLogger("removed bot room");
        } else {
          // remove player fromm room
          r.players = r.players.filter(function (player) {
            return player.id !== pD.id;
          });
          EventLogger("removed player");
        }
      } else {
        EventLogger("what kind of role is this?");
      }

      removed.push({
        room: sRoom,
        user: pD
      });
    } else {
      EventLogger("i neva see this user b for");
    }

    return r;
  });
  return {
    newRooms: newRooms,
    removed: removed
  };
}

module.exports = {
  deleteRooms_Admin: deleteRooms_Admin,
  deleteRoom: deleteRoom
};