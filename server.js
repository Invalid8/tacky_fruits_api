const express = require("express");
const app = express();
const port = process.env.PORT || 7500;
const http = require("http");

const socketIo = require("socket.io");

const cors = require("cors");
const corsOptions = require("./config/corsOption");
const {
  createQuickRoom,
  playerLeavesRoom,

  createPrivateRoom,
  assignPlayer,
  deleteRoom,

  sendRooms,
  deleteRooms_Admin,
} = require("./Utils/Rooms/Controller");

const { formatMessage } = require("./Utils/messages");
const { randomUUID } = require("crypto");

app.use(cors(corsOptions));

app.use(express.static("public"));

const server = http.createServer(app);

const io = new socketIo.Server(server, {
  cors: corsOptions,
});

const bot = {
  name: "tackyFruit",
};

io.on("connection", async (socket) => {
  socket.emit("publicRooms", await sendRooms(true));
  socket.emit("privateRooms", await sendRooms(false));

  socket.on("createQuickRoom", async (host_data) => {
    if (host_data) {
      const room = await createQuickRoom({ ...host_data, id: socket.id });
      socket.join(room.id);

      socket.emit(
        "message",
        formatMessage(bot.name, `Welcome to room ${room.name}`)
      );

      socket.broadcast
        .to(room.id)
        .emit(
          "message",
          formatMessage(
            host_data.name,
            `${host_data.name} has joined the lobby`
          )
        );

      io.to(room.id).emit("roomPlayers", {
        room,
      });
    } else {
      socket.emit(
        "errorMessage",
        formatMessage(bot.name, `host data not found`, true)
      );
    }
  });

  socket.on("createPrivateRoom", async ({ host_data, room_data }) => {
    if (host_data && room_data) {
      const room_code = randomUUID().substring(0, 8);

      const { room, message, success } = await createPrivateRoom(
        { ...host_data, id: socket.id },
        { ...room_data, id: room_code }
      );

      if (success) {
        socket.join(room.id);

        socket.emit(
          "message",
          formatMessage(bot.name, `Welcome to room ${room.name}`)
        );

        socket.broadcast
          .to(room.id)
          .emit(
            "message",
            formatMessage(
              host_data.name,
              `${host_data.name} has joined the lobby`
            )
          );

        io.to(room.id).emit("roomPlayers", {
          room,
        });
      } else {
        socket.emit("errorMessage", formatMessage(bot.name, message, true));
      }
    } else {
      socket.emit(
        "errorMessage",
        formatMessage(bot.name, `host data not found`, true)
      );
    }
  });

  socket.on("joinQuickRoom", async ({ player_data, room_id }) => {
    if (room_id && player_data) {
      const { room, success, message } = await assignPlayer(
        room_id,
        player_data,
        true
      );

      if (success) {
        socket.join(room.id);

        socket
          .to(room.id)
          .emit(
            "message",
            formatMessage(bot.name, `Welcome to room ${room.name}`)
          );

        socket.broadcast
          .to(room.id)
          .emit(
            "message",
            formatMessage(
              player_data.name,
              `${player_data.name} has joined the lobby`
            )
          );
      } else {
        socket.emit("errorMessage", formatMessage(bot.name, message, true));
      }
    } else {
      console.error(message);
    }
  });

  socket.on("joinPrivateRoom", async ({ player_data, room_id }) => {
    if (room_id && player_data) {
      const { room, message, success } = await assignPlayer(
        room_id,
        player_data,
        false
      );

      if (success) {
        socket.join(room.id);

        socket.emit(
          "message",
          formatMessage(bot.name, `Welcome to room ${room.name}`)
        );

        socket.broadcast
          .to(room.id)
          .emit(
            "message",
            formatMessage(
              player_data.name,
              `${player_data.name} has joined the lobby`
            )
          );
      } else {
        socket.emit("errorMessage", formatMessage(bot.name, message, true));
      }
    } else {
      console.error(message);
    }
  });

  socket.on("leaveRoom", async ({ player_data, room_data }) => {
    if (room_data && player_data) {
      const room = await playerLeavesRoom(
        room_data.id,
        player_data.id,
        room_data.isPublic
      );

      if (room) {
        if (player.isAdmin) {
          deleteRoom(room.id, room_data.isPublic);
          socket.in(room.id).disconnectSockets();
        } else {
          socket.leave(room.id);
        }
      } else {
        socket.emit(
          "errorMessage",
          formatMessage(bot.name, `room not found`, true)
        );
      }
    } else {
      socket.emit(
        "errorMessage",
        formatMessage(bot.name, `players_id or room_id not found`, true)
      );
    }
  });

  socket.on("disconnect", async () => {
    const removed = await deleteRooms_Admin(socket.id);

    removed.map((re) => {
      socket.broadcast
        .to(re.room.id)
        .emit(
          "message",
          formatMessage(
            bot.user,
            `${re.user && re.user.name} has left the lobby`
          )
        );
    });

    console.log(`A user with id ${socket.id} just left`);
  });

  console.log(`A user with id ${socket.id} just joined`);
});

server.listen(port, () =>
  console.log(
    `Example app listening on port ${port}! --- http://localhost:${port}`
  )
);
