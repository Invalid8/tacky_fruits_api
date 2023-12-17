// 1 - player data PLAYER
// 2 - room info ROOM

const player_code = "PLAYER";
const opponent_code = "OPPONENT";
const room_code = "ROOM";

function ExtractData(data, type) {
  if (!data) {
    return null;
  }

  switch (type) {
    case room_code:
      const room = data;

      return {
        id: room.id,
        name: room.name,
        isPublic: room.isPublic,
        current_players: room.players.length,
      };

    case player_code:
      const player_data = data;

      return {
        id: player_data.id,
        name: player_data.name,
        character: player_data.character,
        role: player_data.role === 111 ? "ADMIN" : type,
      };

    case opponent_code:
      const opponent_data = data;

      return {
        id: opponent_data.id,
        name: opponent_data.name,
        character: opponent_data.character,
        role: opponent_data.role === 111 ? "ADMIN" : type,
      };

    default:
      console.log("place a type - //player data PLAYER // 2 - room info ROOM");
      return;
  }
}

module.exports = ExtractData;
