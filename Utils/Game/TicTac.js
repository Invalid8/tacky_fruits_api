const findInArray = require("../../functions/FindInArray");
const GenerateRandomName = require("../Rooms/Controller/GenerateRoomName");
const { gameWins } = require("./data");

class TicTac {
  constructor(Players, Scores) {
    if (!Players || !Scores) {
      console.error("missing players or scores parameters");
      return;
    }

    this.Players = Players;
    this.Scores = Scores;
    this.list = this.setTacs();
    this.winner = undefined;
    this.isTie = false;
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
      this.Scores.add(this.Players);
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
          }
          if (b0.slot.player.id === this.Players[0].stat().id) {
            this.Players[0].stat().score += 10;
            this.winner = this.Players[0].stat();
          } else if (
            boxes[each[0]].slot.player.id === this.Players[1].stat().id
          ) {
            this.Players[1].stat().score += 10;
            this.winner = this.Players[1].stat();
          }
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = TicTac;
