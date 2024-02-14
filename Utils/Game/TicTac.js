const findInArray = require("../../functions/FindInArray");
const GenerateRandomName = require("../Rooms/Controller/GenerateRoomName");
const { gameWins } = require("./data");
const { randomUUID } = require("crypto");

class TicTac {
  constructor(Players, settings) {
    if (!Players || !settings) {
      console.error("missing players parameters");
      return;
    }

    this.Players = Players;
    this.score = this.setup();
    this.list = this.setTacs();
    this.winner = undefined;
    this.isTie = false;
    this.settings = settings;
    this.roundsLeft = this.settings.rounds;
    this.gameEnd = false;
  }

  setup() {
    const ps = this.Players.map((p) => {
      let x = p.stat();
      x.score = 0;

      return x;
    });

    const mod = {
      id: randomUUID().substring(0, 10),
      value: ps,
    };

    return mod;
  }

  setTacs() {
    const list = [];
    const val = GenerateRandomName();

    for (let i = 0; i < 9; i++) {
      const item = {
        id: `${val}${i}`,
        slot: undefined,
      };

      list.push(item);
    }

    return list;
  }

  reset() {
    this.list = this.setTacs();
    this.winner = undefined;
    this.isTie = false;
  }

  playSpot(player, index) {
    if (!player || !index) {
      console.error("missing parameters");
      return;
    }

    const { item: tac, id } = findInArray(index, this.list, true);

    if (!tac) {
      console.error("id does not exist");
      return;
    }

    if (tac.slot) {
      console.error("box is filled");
      return;
    }

    this.list[id].slot = {
      player,
    };

    if (this.judge()) {
      this.roundsLeft = this.roundsLeft - 1;
      this.addScore(this.winner.id);

      if (this.roundsLeft < 1) {
        this.gameEnd = true;
      }
    }

    this.calculateTie();

    if (this.isTie) {
      this.reset();
    }

    return this.list;
  }

  all() {
    return this.list;
  }

  Filled() {
    const done = this.list.find((x) => !x.slot);

    return done ? true : false;
  }

  calculateTie() {
    for (const box of this.list) {
      if (!box.slot) {
        return;
      }
    }
    this.isTie = true;
  }

  addScore(PlayerId) {
    if (!PlayerId) {
      console.error("missing player id");
      return;
    }

    const { id: ID } = findInArray(PlayerId, this.score?.value, true);

    if (ID === -1) {
      console.log("player not found");
      return;
    }

    this.score.value[ID].score += 10;

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

  judge() {
    const boxes = this.list;

    for (const item of gameWins) {
      const each = item.map((value) => {
        return value;
      });

      const b0 = boxes[each[0]];
      const b1 = boxes[each[1]];
      const b2 = boxes[each[2]];

      if (b0.slot && b1.slot && b2.slot) {
        if (
          b0.slot.player.id === b1.slot.player.id &&
          b0.slot.player.id === b2.slot.player.id
        ) {
          if (
            b0.slot.player.id === this.Players[0].stat().id ||
            b0.slot.player.id === this.Players[1].stat().id
          ) {
            this.list[each[0]].slot.filled = true;
            this.list[each[1]].slot.filled = true;
            this.list[each[2]].slot.filled = true;
            for (let i = 0; i < this.Players.length; i++) {
              const player = this.Players[i];
              if (b0.slot.player.id === player.stat().id) {
                this.winner = this.Players[i].stat();
              }
            }
          }

          return true;
        }
      }
    }

    return false;
  }
}

module.exports = TicTac;
