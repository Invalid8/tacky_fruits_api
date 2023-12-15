const AllRooms = require("./AllRooms");

async function sendRooms(isPublic) {
  const rooms = await AllRooms(isPublic);
  let newRooms;

  if (rooms) {
    newRooms = rooms.map((room) => {
      const nRoom = {
        id: room.id,
        max_players_no: room.max_players_no,
        name: room.name,
        players_no: room.players.length,
        isPublic,
      };

      return nRoom;
    });
  }

  return newRooms;
}

module.exports = sendRooms;
