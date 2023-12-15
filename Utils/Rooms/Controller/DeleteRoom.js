const findInArray = require("../../../functions/FindInArray");
const AllRooms = require("./AllRooms");
const UpadateRoom = require("./UpdateRooms");

async function deleteRooms_Admin(player_id) {
  const public_rooms = await AllRooms(true);
  const private_rooms = await AllRooms(false);

  const { newRooms: roomsPublic, removed: removedPublic } = removeRoomORPlayer(
    public_rooms,
    player_id
  );

  const { newRooms: roomsPrivate, removed: removedPrivate } =
    removeRoomORPlayer(private_rooms, player_id);

  UpadateRoom(roomsPublic, true);
  UpadateRoom(roomsPrivate, false);

  const removed = [...removedPublic, ...removedPrivate];
  console.log(removed);
  return removed;
}

async function deleteRoom(room_id, isPublic) {
  const rooms = await AllRooms(isPublic);
  const room = findInArray(room_id, rooms);

  if (room) {
    console.log(`room ${room.id} deleted successfully`);
    const removeRoom = rooms.splice(room, 1)[0];
    UpadateRoom(rooms, isPublic);
    return removeRoom;
  } else {
    console.log("room does not exist");
  }
}

function removeRoomORPlayer(rooms, player_id) {
  const removed = [];
  console.log(rooms);

  const newRooms = rooms.filter((r) => {
    const pD = r.players.find((player) => player.id === player_id);

    let sRoom;

    if (pD) {
      sRoom = r;
      if (pD.role === 111) {
        // remove room
        r = null;
        console.log("removed room");
      } else if (pD.role === 222) {
        // remove player fromm room
        r.players = r.players.filter((player) => player.id !== pD.id);
        console.log("removed player");
      } else {
        console.log("what kind of role is this?");
      }

      removed.push({ room: sRoom, user: pD });

      return r;
    }
  });

  return { newRooms, removed };
}

module.exports = { deleteRooms_Admin, deleteRoom };
