const findInArray = require("../../../functions/FindInArray");
const { EventLogger } = require("../../../middleware/Logger");
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
  EventLogger(removed);
  return removed;
}

async function deleteRoom(room_id, isPublic) {
  let rooms = await AllRooms(isPublic);
  const room = findInArray(room_id, rooms);

  if (!room) {
    EventLogger("room does not exist");
    return {
      room: null,
      success: false,
      message: "room does not exist",
    };
  }

  if (room) {
    rooms = rooms.filter((rm) => rm.id !== room_id);
    UpadateRoom(rooms, isPublic);
    EventLogger(`room ${room.id} deleted successfully`);
    return { room, success: true, message: "successful" };
  }
}

function removeRoomORPlayer(rooms, player_id) {
  const removed = [];

  const newRooms = rooms.filter((r) => {
    const pD = r.players.find((player) => player.id === player_id);

    let sRoom;

    if (pD) {
      sRoom = r;
      if (pD.role === 111) {
        // remove room
        r = null;
        EventLogger("removed room");
      } else if (pD.role === 222) {
        if (r.bot) {
          r = null;
          EventLogger("removed bot room");
        } else {
          // remove player fromm room
          r.players = r.players.filter((player) => player.id !== pD.id);
          EventLogger("removed player");
        }
      } else {
        EventLogger("what kind of role is this?");
      }

      removed.push({ room: sRoom, user: pD });
    } else {
      // EventLogger("i neva see this user b for");
    }
    return r;
  });

  return { newRooms, removed };
}

module.exports = { deleteRooms_Admin, deleteRoom };
