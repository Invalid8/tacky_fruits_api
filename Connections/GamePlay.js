const { Play } = require("../Utils/Game");
const { playerLeavesRoom, deleteRoom } = require("../Utils/Rooms/Controller");
const { formatMessage } = require("../Utils/messages");
const { userLeaves } = require("../Utils/Users/users");
const BotInfo = require("../bot/info");
const PlayData = require("./func/PlayData");
const { EventLogger, ErrorLogger } = require("../middleware/Logger");

async function GamePlay(socket, io, { players, room_data }) {
  if (players && room_data) {
    const RT = 6;

    let lobby = LOBBY.lobbies.find((c) => c.id === room_data.id);

    if (!lobby) {
      if (!room_data.vsAI) {
        const PVP = new Play(
          { room: room_data, rounds: RT, isComputer: false },
          players
        );

        lobby = LOBBY.addLobby({
          id: room_data.id,
          currentPlayerId: players[0].id,
          PVP,
        });

        lobby.PVP.start();
      } else {
        const PVC = new Play(
          { room: room_data, rounds: RT, isComputer: true },
          players
        );
        lobby = LOBBY.addLobby({
          id: room_data.id,
          currentPlayerId: players[0].id,
          PVC,
        });
        lobby.PVC.start();
      }
    }

    const room = room_data.vsAI ? lobby.PVC.room : lobby.PVP.room;

    PlayData(io, socket, { room, lobby, RT });

    socket.on("clear", () => {
      room_data.vsAI ? lobby.PVC.reset() : lobby.PVP.reset();
      PlayData(io, socket, { room, lobby, RT });
    });

    socket.on("replay", () => {
      room_data.vsAI ? lobby.PVC.replay() : lobby.PVP.replay();

      PlayData(io, socket, { room, lobby, RT });
    });

    socket.on("click", async ({ player_data, tab_id }) => {
      if (player_data && tab_id) {
        if (lobby.currentPlayerId !== player_data.id) {
          const NewTabs = room_data.vsAI
            ? lobby.PVC.TackyBlocks.playSpot(player_data, tab_id)
            : lobby.PVP.TackyBlocks.playSpot(player_data, tab_id);

          if (NewTabs) {
            PlayData(io, socket, { room, lobby, RT });

            LOBBY.updateLobbyX(room.id, "currentPlayerId", players[0].id);
            room_data.vsAI ? lobby.PVC.click() : lobby.PVP.click();
          }
        } else {
          EventLogger("Not your turn");
        }
      } else {
        ErrorLogger("missing parameters");
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
