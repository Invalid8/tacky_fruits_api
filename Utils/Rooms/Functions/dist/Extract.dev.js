"use strict";

// 1 - player data PLAYER
// 2 - room info ROOM
var _require = require("../../../middleware/Logger"),
    ErrorLogger = _require.ErrorLogger;

var player_code = "PLAYER";
var opponent_code = "OPPONENT";
var room_code = "ROOM";

function ExtractData(data, type) {
  if (!data) {
    return null;
  }

  switch (type) {
    case room_code:
      var room = data;
      return {
        id: room.id,
        name: room.name,
        isPublic: room.isPublic,
        current_players: room.players.length,
        vsAI: room.vsAI
      };

    case player_code:
      var player_data = data;
      return {
        id: player_data.id,
        name: player_data.name,
        character: player_data.character,
        role: player_data.role === 111 ? "ADMIN" : type
      };

    case opponent_code:
      var opponent_data = data;
      return {
        id: opponent_data.id,
        name: opponent_data.name,
        character: opponent_data.character,
        role: opponent_data.role === 111 ? "ADMIN" : type
      };

    default:
      ErrorLogger("place a type - //player data PLAYER // 2 - room info ROOM");
      return;
  }
}

module.exports = ExtractData;