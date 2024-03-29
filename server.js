const express = require("express");
const http = require("http");
const cors = require("cors");
const corsOptions = require("./config/corsOption");
// ----sokect connection

const { sendRooms, deleteRooms_Admin } = require("./Utils/Rooms/Controller");
const { formatMessage } = require("./Utils/messages");
const {
  CreatePrivateRoom,
  LeaveRoom,
  JoinPrivateRoom,
  JoinPublicRoom,
  CreatePublicRoom,
  CreateOrJoinQuickRoom,
  GamePlay,
} = require("./Connections");
const BotInfo = require("./bot/info");
const socketIo = require("socket.io");
const { getCurrentUser, userLeaves } = require("./Utils/Users/users");
const { EventLogger } = require("./middleware/Logger");
const AIRoom = require("./Connections/AIRoom");

const app = express();
const server = http.createServer(app);
app.use(cors(corsOptions));
app.use(express.static("public"));

const io = new socketIo.Server(server, {
  cors: corsOptions,
});

io.on("connection", async (socket) => {
  socket.emit("publicRooms", await sendRooms(true));
  socket.emit("privateRooms", await sendRooms(false));

  socket.on("createPublicRoom", async ({ host_data, room_data }) => {
    CreatePublicRoom(socket, io, { host_data, room_data });
  });

  socket.on("createPrivateRoom", async ({ host_data, room_data }) => {
    CreatePrivateRoom(socket, io, { host_data, room_data });
  });

  socket.on("QuickRoom", async (player_data) => {
    CreateOrJoinQuickRoom(socket, io, player_data);
  });

  socket.on("Computer", async ({ player_data, mode }) => {
    AIRoom(socket, io, { player_data, mode });
  });

  socket.on("joinPublicRoom", async ({ player_data, room_id }) => {
    JoinPublicRoom(socket, io, { player_data, room_id });
  });

  socket.on("joinPrivateRoom", async ({ player_data, room_id }) => {
    JoinPrivateRoom(socket, io, { player_data, room_id });
  });

  socket.on("GamePlay", async ({ players, room_data }) => {
    GamePlay(socket, io, { players, room_data });
  });

  socket.on("chatMessage", ({ room_id, chat }) => {
    const user = getCurrentUser(socket.id);
    if (user) {
      io.to(room_id).emit("message", formatMessage(user.name, chat));
      socket.broadcast.to(room_id).emit("msg", formatMessage(user.name, chat));
    }
  });

  socket.on("leaveRoom", async ({ player_data, room_data }) => {
    LeaveRoom(socket, io, { player_data, room_data });
  });

  socket.on("disconnect", async () => {
    const removed = await deleteRooms_Admin(socket.id);

    removed.map((re) => {
      socket.broadcast
        .to(re.room.id)
        .emit(
          "message",
          formatMessage(
            BotInfo.name,
            `${re.user && re.user.name} has left the lobby`
          )
        );

      if (re.room.bot && re.room.players.length === 1) {
        io.to(re.room.id).emit("disconnected");
      }
    });

    const player = userLeaves(socket.id);
    if (player) {
      io.to(player.room.id).emit("disconnected");
    }

    EventLogger(
      `A user with id ${socket.id} just left`,
      "socket connection",
      "./server.js"
    );
  });

  EventLogger(
    `A user with id ${socket.id} just joined`,
    "socket connection",
    "./server.js"
  );
});

module.exports = server;
