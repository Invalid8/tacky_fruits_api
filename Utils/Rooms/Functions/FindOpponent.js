function FindOpponent(players, player_id) {
  if (!players || !player_id) {
    console.log("missing paraameters");
    return undefined;
  }

  const opponent = players.find((p) => p.id !== player_id);

  console.log(players, opponent);

  return opponent;
}

module.exports = FindOpponent;
