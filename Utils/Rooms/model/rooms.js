const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const PUBLIC_ROOMS = path.join(__dirname, "..", "data", "public_rooms.json");
const PRIVATE_ROOMS = path.join(__dirname, "..", "data", "private_rooms.json");

const ROOM = {
  public_rooms: function () {
    return readData(PUBLIC_ROOMS);
  },
  private_rooms: function () {
    return readData(PRIVATE_ROOMS);
  },
  updatePublicRooms: function (nRooms) {
    updateData(PUBLIC_ROOMS, nRooms);
  },
  updatePrivateRooms: function (nRooms) {
    updateData(PRIVATE_ROOMS, nRooms);
  },
};

const readData = async (filepath) => {
  try {
    if (!fs.existsSync(filepath)) {
      const dir = filepath.split(path.basename(filepath)).join("");
      if (!fs.existsSync(dir)) fsPromises.mkdir(dir);
      fsPromises.writeFile(filepath, "[]");
    }

    const data = await fsPromises.readFile(filepath, "utf-8");
    if (!data) return [];

    return data;
  } catch (error) {
    console.error(error);
  }
};

const updateData = async (filepath, newData) => {
  try {
    if (!fs.existsSync(filepath)) {
      const dir = filepath.split(path.basename(filepath)).join("");
      if (!fs.existsSync(dir)) fsPromises.mkdir(dir);
      fsPromises.writeFile(filepath, "[]");
    }

    fsPromises.writeFile(filepath, JSON.stringify(newData), "utf-8");
  } catch (error) {
    console.error(error);
  }
};

module.exports = ROOM;
