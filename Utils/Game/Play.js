const Player = require("./Player");
const Scores = require("./Score");
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

    const GameScore = new Scores(Players);
    const TackyBlocks = new TicTac(Players, GameScore);

    this.settings = settings;
    this.Players = Players;
    this.currentID = players[0].id;
    this.GameScore = GameScore;
    this.TackyBlocks = TackyBlocks;
  }

  start() {
    this.players = this.Players.map((p) => {
      const x = p.stat();
      x.score = this.GameScore.pScore(x.id);
      return x;
    });

    this.tablets = this.TackyBlocks.all();
    this.scores = this.GameScore.all();
    this.room = this.settings.room;
  }

  reset() {
    this.TackyBlocks.reset();
  }

  pStat(id) {
    if (!id) {
      console.error("missing parameters");
      return;
    }

    return this.GameScore?.pScore(id);
  }

  changeCurrentID(id) {
    this.currentID = id;
  }
}

module.exports = Play;
