const { randomUUID } = require("crypto");
const findInArray = require("../../functions/FindInArray");
const { ErrorLogger } = require("../../middleware/Logger");

class Scores {
  constructor(players) {
    if (!players) {
      ErrorLogger("Missing player parameters");
      return;
    }

    this.players = players;
    this.score = this.setup();
    this.scores = this.score.value;
  }

  all() {
    return this.score.value;
  }

  setup() {
    const ps = this.players.map((p) => {
      let x = p;
      x.score = 0;

      return x;
    });

    const mod = {
      id: randomUUID().substring(0, 10),
      value: ps,
    };

    return mod;
  }

  clear() {
    this.score = null;
  }

  reset() {
    this.score = this.setup();
  }

  add(Players) {
    if (!Players) {
      console.error("missing parameters");
      return;
    }

    Players.forEach((Player) => {
      const { id: ID } = findInArray(Player.player.id, this.score?.value, true);

      if (ID === -1) {
        ErrorLogger("player not found");
        return;
      }

      this.score.value[ID].score = Player.player?.score;
    });

    return Players;
  }

  pScore(id) {
    if (!id) {
      console.error("undefined parameter");
      return;
    }

    const player = findInArray(id, this.score.value);

    if (!player) {
      console.error("Such player does not exist");
      return;
    }

    return player.score;
  }
}

module.exports = Scores;
