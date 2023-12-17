const AllRooms = require("./AllRooms");
const assignPlayer = require("./AssignPlayer");
const { createRoom, createOrJoinQuickRoom } = require("./CreateRoom");
const { deleteRoom, deleteRooms_Admin } = require("./DeleteRoom");
const findRoom = require("./FindRoom");
const GenerateRandomName = require("./GenerateRoomName");
const playerLeavesRoom = require("./LeaveRoom");
const sendRooms = require("./SendRooms");
const UpadateRoom = require("./UpdateRooms");

module.exports = {
  findRoom,
  assignPlayer,
  createRoom,
  createOrJoinQuickRoom,
  deleteRoom,
  deleteRooms_Admin,
  playerLeavesRoom,
  sendRooms,
  UpadateRoom,
  GenerateRandomName,
  AllRooms,
};
