const { Play } = require("../Utils/Game");
const { lobbies, addLobby } = require("../Utils/Game/data");
const { playerLeavesRoom } = require("../Utils/Rooms/Controller");
const { formatMessage } = require("../Utils/messages");
const BotInfo = require("../bot/info");

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

async function GamePlay(socket, io, { players, room_data }) {
  if (players && room_data) {
    const PVP = new Play({ room: room_data }, players);
    PVP.start();

    let lobby = LOBBY.lobbies.find((c) => c.id === room_data.id);
    if (!lobby)
      lobby = LOBBY.addLobby({
        id: room_data.id,
        currentPlayerId: players[0].id,
        PVP,
      });

    const room = lobby.PVP.room;
    const xplayers = lobby.PVP.players;

    io.to(room.id).emit("lobby", {
      tablets: lobby.PVP.tablets,
      room,
      players: xplayers,
      winner: lobby.PVP.TackyBlocks.winner,
      cId: lobby.currentPlayerId,
    });

    socket.on("clear", () => {
      lobby.PVP.reset();

      LOBBY.updateLobbyX(room.id, "PVP", PVP);

      io.to(room.id).emit("lobby", {
        tablets: lobby.PVP.TackyBlocks.all(),
        room,
        players: xplayers,
        winner: lobby.PVP.TackyBlocks.winner,
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
              cId: lobby.currentPlayerId,
            });

            LOBBY.updateLobbyX(room.id, "currentPlayerId", players[0].id);
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

module.exports = GamePlay;
