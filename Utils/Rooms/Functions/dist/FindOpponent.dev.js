"use strict";

var _require = require("../../../middleware/Logger"),
    EventLogger = _require.EventLogger,
    ErrorLogger = _require.ErrorLogger;

function FindOpponent(players, player_id) {
  if (!players || !player_id) {
    ErrorLogger("missing paraameters");
    return undefined;
  }

  var opponent = players.find(function (p) {
    return p.id !== player_id;
  });
  EventLogger(players, opponent);
  return opponent;
}

module.exports = FindOpponent;