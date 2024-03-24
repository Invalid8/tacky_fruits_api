"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require("../Utils/Game"),
    Play = _require.Play;

var _require2 = require("../Utils/Rooms/Controller"),
    playerLeavesRoom = _require2.playerLeavesRoom,
    deleteRoom = _require2.deleteRoom;

var _require3 = require("../Utils/messages"),
    formatMessage = _require3.formatMessage;

var _require4 = require("../Utils/Users/users"),
    userLeaves = _require4.userLeaves;

var BotInfo = require("../bot/info");

var PlayData = require("./func/PlayData");

var _require5 = require("../middleware/Logger"),
    EventLogger = _require5.EventLogger,
    ErrorLogger = _require5.ErrorLogger;

function GamePlay(socket, io, _ref) {
  var players, room_data, RT, lobby, PVP, PVC, room;
  return regeneratorRuntime.async(function GamePlay$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          players = _ref.players, room_data = _ref.room_data;

          if (players && room_data) {
            RT = 6;
            lobby = LOBBY.lobbies.find(function (c) {
              return c.id === room_data.id;
            });

            if (!lobby) {
              if (!room_data.vsAI) {
                PVP = new Play({
                  room: room_data,
                  rounds: RT,
                  isComputer: false
                }, players);
                lobby = LOBBY.addLobby({
                  id: room_data.id,
                  currentPlayerId: players[0].id,
                  PVP: PVP
                });
                lobby.PVP.start();
              } else {
                PVC = new Play({
                  room: room_data,
                  rounds: RT,
                  isComputer: true
                }, players);
                lobby = LOBBY.addLobby({
                  id: room_data.id,
                  currentPlayerId: players[0].id,
                  PVC: PVC
                });
                lobby.PVC.start();
              }
            }

            room = room_data.vsAI ? lobby.PVC.room : lobby.PVP.room;
            PlayData(io, socket, {
              room: room,
              lobby: lobby,
              RT: RT
            });
            socket.on("clear", function () {
              room_data.vsAI ? lobby.PVC.reset() : lobby.PVP.reset();
              PlayData(io, socket, {
                room: room,
                lobby: lobby,
                RT: RT
              });
            });
            socket.on("replay", function () {
              room_data.vsAI ? lobby.PVC.replay() : lobby.PVP.replay();
              PlayData(io, socket, {
                room: room,
                lobby: lobby,
                RT: RT
              });
            });
            socket.on("click", function _callee(_ref2) {
              var player_data, tab_id, NewTabs;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      player_data = _ref2.player_data, tab_id = _ref2.tab_id;

                      if (player_data && tab_id) {
                        if (lobby.currentPlayerId !== player_data.id) {
                          NewTabs = room_data.vsAI ? lobby.PVC.TackyBlocks.playSpot(player_data, tab_id) : lobby.PVP.TackyBlocks.playSpot(player_data, tab_id);

                          if (NewTabs) {
                            PlayData(io, socket, {
                              room: room,
                              lobby: lobby,
                              RT: RT
                            });
                            LOBBY.updateLobbyX(room.id, "currentPlayerId", players[0].id);
                            room_data.vsAI ? lobby.PVC.click() : lobby.PVP.click();
                          }
                        } else {
                          EventLogger("Not your turn");
                        }
                      } else {
                        ErrorLogger("missing parameters");
                      }

                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });
            socket.on("end", function _callee2() {
              var _ref3, success;

              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return regeneratorRuntime.awrap(playerLeavesRoom(room_data.id, socket.id, room_data.isPublic));

                    case 2:
                      _ref3 = _context2.sent;
                      success = _ref3.success;

                      if (success) {
                        io.to(room_data.id).emit("GameEnd");
                        void deleteRoom(room_data.id, room_data.isPublic);
                        void userLeaves(socket.id);
                        socket.leave(room_data.id);
                      }

                    case 5:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            });
          } else {
            console.error("missing parameters");
            socket.emit("errorMessage", formatMessage(BotInfo.name, "player data not found", true));
          }

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}

var LOBBY = {
  lobbies: [],
  addLobby: function addLobby(newLobby) {
    var tts = this.lobbies;
    this.lobbies = [].concat(_toConsumableArray(tts), [newLobby]);
    return newLobby;
  },
  updateLobby: function updateLobby(id, data) {
    var lob = this.lobbies.findIndex(function (t) {
      return t.id === id;
    });

    if (lob === -1) {
      console.error("This lobby does not exist");
      return;
    }

    this.lobbies[lob] = data;
    return this.lobbies;
  },
  updateLobbyX: function updateLobbyX(id, key, data) {
    var lob = this.lobbies.findIndex(function (t) {
      return t.id === id;
    });

    if (lob === -1) {
      console.error("This lobby does not exist");
      return;
    }

    this.lobbies[lob][key] = data;
    return this.lobbies;
  }
};
module.exports = GamePlay;