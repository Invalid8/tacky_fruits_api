const Player = require("./Player");
const TicTac = require("./TicTac");

class Play {
  constructor(settings, players) {
    if (!settings || !players) {
      console.error("missing parameters");
      return;
    }

    const Players = players.map((p) => {
      const x = new Player(p);
      return x;
    });

    const TackyBlocks = new TicTac(Players, settings);

    this.settings = settings;
    this.Players = Players;
    this.TackyBlocks = TackyBlocks;
    this.grandWinner = undefined;
  }

  start() {
    this.players = this.Players.map((p) => {
      const x = p.stat();
      x.score = this.TackyBlocks.pScore(x.id);
      return x;
    });

    this.tablets = this.TackyBlocks.all();
    this.room = this.settings.room;
  }

  reset() {
    this.TackyBlocks.reset();
  }

  replay() {
    this.grandWinner = undefined;
    this.TackyBlocks.replay();

    this.players = this.Players.map((p) => {
      const x = p.stat();
      x.score = this.TackyBlocks.pScore(x.id);
      return x;
    });

    this.tablets = this.TackyBlocks.all();
    this.room = this.settings.room;
  }

  pStat(id) {
    if (!id) {
      console.error("missing parameters");
      return;
    }

    return this.TackyBlocks?.pScore(id);
  }

  click() {
    this.players = this.Players.map((p) => {
      const x = p.stat();
      x.score = this.TackyBlocks.pScore(x.id);
      return x;
    });

    if (this.TackyBlocks.gameEnd) {
      const p0 = this.players[0];
      const p1 = this.players[1];
      let winner;

      const tie = this.players[0].score == this.players[0].score;

      // if (tie) {
      //   winner = undefined;
      // } else {
      //   winner = p0.score > p1.score ? (winner = p0) : (winner = p1);
      // }
      if (p0.score > p1.score) {
        winner = p0;
      } else if (p0.score < p1.score) {
        winner = p1;
      } else if (p0.score == p1.score) {
        winner = undefined;
      }

      console.log(winner);

      this.grandWinner = {
        isTie: tie,
        winner,
      };
    }
  }
}

module.exports = Play;
