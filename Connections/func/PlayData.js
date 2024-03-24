function PlayData(io, socket, { room, lobby, RT }) {
  io.to(room.id).emit("lobby", {
    tablets: lobby.PVP.TackyBlocks.all(),
    room,
    players: lobby.PVP.players,
    winner: lobby.PVP.TackyBlocks.winner,
    roundsLeft: lobby.PVP.TackyBlocks.roundsLeft,
    settings: { rounds: RT },
    grandWinner: lobby.PVP.grandWinner,
    cId: lobby.currentPlayerId,
  });
}

module.exports = PlayData;
