const AllRooms = require("./AllRooms");
const assignPlayer = require("./AssignPlayer");
const { createPrivateRoom, createQuickRoom } = require("./CreateRoom");
const { deleteRoom, deleteRooms_Admin } = require("./DeleteRoom");
const findRoom = require("./FindRoom");
const GenerateRandomName = require("./GenerateRoomName");
const playerLeavesRoom = require("./LeaveRoom");
const sendRooms = require("./SendRooms");
const UpadateRoom = require("./UpdateRooms");

module.exports = {
  findRoom,
  assignPlayer,
  createPrivateRoom,
  createQuickRoom,
  deleteRoom,
  deleteRooms_Admin,
  playerLeavesRoom,
  sendRooms,
  UpadateRoom,
  GenerateRandomName,
  AllRooms,
};
