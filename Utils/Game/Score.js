const { randomUUID } = require("crypto");
const findInArray = require("../../functions/FindInArray");

class Scores {
  constructor(Players) {
    if (!Players) {
      console.log("Missing player parameters");
      return;
    }

    this.Players = Players;
    this.score = this.setup();
  }

  all() {
    return this.score.value;
  }

  setup() {
    const mod = {
      id: randomUUID().substring(0, 10),
      value: [
        {
          ...this.Players[0].stat(),
          score: 0,
        },
        {
          ...this.Players[1].stat(),
          score: 0,
        },
      ],
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

      if (ID) {
        console.log("player not found");
        return;
      }

      this.score.value[ID].score += Player.player?.score;
    });

    return this.score.value;
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
