const { EventLogger, ErrorLogger } = require("../../../middleware/Logger");

function FindOpponent(players, player_id) {
  if (!players || !player_id) {
    ErrorLogger("missing paraameters");
    return undefined;
  }

  const opponent = players.find((p) => p.id !== player_id);

  EventLogger(players, opponent);

  return opponent;
}

module.exports = FindOpponent;
