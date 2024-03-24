const { EventLogger } = require("../../middleware/Logger");
const { ExtractData } = require("../Rooms/Functions");

let users = [];

// Join user to chat

function userJoin(id, player_data, room) {
  const user = { id, ...player_data, room };
  users.push(user);
  EventLogger("updated users");

  return user;
}

function getCurrentUser(id) {
  const user = users.find((user) => user.id === id);
  return user;
}

function getOpponent(room_id, id) {
  const fm = users.filter((f) => f.room === room_id);
  return fm.find((user) => user.id !== id);
}

function userLeaves(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    const user = users[index];
    users = users.filter((u) => u.id !== id);
    EventLogger("removed user");
    return user;
  }
  return undefined;
}

// Get room users
function getRoomUsers(room_id) {
  const fUsers = users.filter((user) => user.room.id === room_id);

  if (!fUsers) return undefined;

  if (fUsers) {
    const cut = fUsers.map((x) => {
      return ExtractData(x, "PLAYER");
    });
    EventLogger(cut);
    return cut;
  }
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
  getOpponent,
};
