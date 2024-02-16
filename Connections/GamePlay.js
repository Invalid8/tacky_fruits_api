const { Play } = require("../Utils/Game");
const { playerLeavesRoom, deleteRoom } = require("../Utils/Rooms/Controller");
const { formatMessage } = require("../Utils/messages");
const { userLeaves } = require("../Utils/Users/users");
const BotInfo = require("../bot/info");

async function GamePlay(socket, io, { players, room_data }) {
  if (players && room_data) {
    const RT = 6;

    let lobby = LOBBY.lobbies.find((c) => c.id === room_data.id);

    if (!lobby) {
      const PVP = new Play({ room: room_data, rounds: RT }, players);
      lobby = LOBBY.addLobby({
        id: room_data.id,
        currentPlayerId: players[0].id,
        PVP,
      });
    }

    lobby.PVP.start();

    const room = lobby.PVP.room;
    const xplayers = lobby.PVP.players;

    io.to(room.id).emit("lobby", {
      tablets: lobby.PVP.tablets,
      room,
      players: xplayers,
      winner: lobby.PVP.TackyBlocks.winner,
      roundsLeft: lobby.PVP.TackyBlocks.roundsLeft,
      settings: { rounds: RT },
      grandWinner: lobby.PVP.grandWinner,
      cId: lobby.currentPlayerId,
    });

    socket.on("clear", () => {
      lobby.PVP.reset();

      io.to(room.id).emit("lobby", {
        tablets: lobby.PVP.TackyBlocks.all(),
        room,
        players: xplayers,
        winner: lobby.PVP.TackyBlocks.winner,
        roundsLeft: lobby.PVP.TackyBlocks.roundsLeft,
        settings: { rounds: RT },
        grandWinner: lobby.PVP.grandWinner,
        cId: lobby.currentPlayerId,
      });
    });

    socket.on("replay", () => {
      lobby.PVP.replay();

      io.to(room.id).emit("lobby", {
        tablets: lobby.PVP.TackyBlocks.all(),
        room,
        players: xplayers,
        winner: lobby.PVP.TackyBlocks.winner,
        roundsLeft: lobby.PVP.TackyBlocks.roundsLeft,
        settings: { rounds: RT },
        grandWinner: lobby.PVP.grandWinner,
        cId: lobby.currentPlayerId,
      });
    });

    socket.on("click", async ({ player_data, tab_id }) => {
      if (player_data && tab_id) {
        if (lobby.currentPlayerId !== player_data.id) {
          const NewTabs = lobby.PVP.TackyBlocks.playSpot(player_data, tab_id);

          if (NewTabs) {
            io.to(room.id).emit("lobby", {
              tablets: NewTabs,
              room,
              players: xplayers,
              winner: lobby.PVP.TackyBlocks.winner,
              roundsLeft: lobby.PVP.TackyBlocks.roundsLeft,
              settings: { rounds: RT },
              grandWinner: lobby.PVP.grandWinner,
              cId: lobby.currentPlayerId,
            });

            LOBBY.updateLobbyX(room.id, "currentPlayerId", players[0].id);
            lobby.PVP.click();
          }
        } else {
          console.log("Not your turn");
        }
      } else {
        console.error("missing parameters");
      }
    });

    socket.on("end", async () => {
      const { success } = await playerLeavesRoom(
        room_data.id,
        socket.id,
        room_data.isPublic
      );

      if (success) {
        io.to(room_data.id).emit("GameEnd");
        void deleteRoom(room_data.id, room_data.isPublic);
        void userLeaves(socket.id);
        socket.leave(room_data.id);
      }
    });
  } else {
    console.error("missing parameters");
    socket.emit(
      "errorMessage",
      formatMessage(BotInfo.name, `player data not found`, true)
    );
  }
}

const LOBBY = {
  lobbies: [],

  addLobby: function (newLobby) {
    const tts = this.lobbies;

    this.lobbies = [...tts, newLobby];

    return newLobby;
  },

  updateLobby: function (id, data) {
    const lob = this.lobbies.findIndex((t) => t.id === id);

    if (lob === -1) {
      console.error("This lobby does not exist");
      return;
    }

    this.lobbies[lob] = data;

    return this.lobbies;
  },

  updateLobbyX: function (id, key, data) {
    const lob = this.lobbies.findIndex((t) => t.id === id);

    if (lob === -1) {
      console.error("This lobby does not exist");
      return;
    }

    this.lobbies[lob][key] = data;

    return this.lobbies;
  },
};

module.exports = GamePlay;
