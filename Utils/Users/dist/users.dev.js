"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("../../middleware/Logger"),
    EventLogger = _require.EventLogger;

var _require2 = require("../Rooms/Functions"),
    ExtractData = _require2.ExtractData;

var users = []; // Join user to chat

function userJoin(id, player_data, room) {
  var user = _objectSpread({
    id: id
  }, player_data, {
    room: room
  });

  users.push(user);
  EventLogger("updated users");
  return user;
}

function getCurrentUser(id) {
  var user = users.find(function (user) {
    return user.id === id;
  });
  return user;
}

function getOpponent(room_id, id) {
  var fm = users.filter(function (f) {
    return f.room === room_id;
  });
  return fm.find(function (user) {
    return user.id !== id;
  });
}

function userLeaves(id) {
  var index = users.findIndex(function (user) {
    return user.id === id;
  });

  if (index !== -1) {
    var user = users[index];
    users = users.filter(function (u) {
      return u.id !== id;
    });
    EventLogger("removed user");
    return user;
  }

  return undefined;
} // Get room users


function getRoomUsers(room_id) {
  var fUsers = users.filter(function (user) {
    return user.room.id === room_id;
  });
  if (!fUsers) return undefined;

  if (fUsers) {
    var cut = fUsers.map(function (x) {
      return ExtractData(x, "PLAYER");
    });
    EventLogger(cut);
    return cut;
  }
}

module.exports = {
  userJoin: userJoin,
  getCurrentUser: getCurrentUser,
  userLeaves: userLeaves,
  getRoomUsers: getRoomUsers,
  getOpponent: getOpponent
};