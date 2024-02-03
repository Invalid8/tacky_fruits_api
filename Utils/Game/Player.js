class Player {
  constructor(player) {
    if (!player) {
      console.error("missing parameter");
      return;
    }

    this.player = player;
  }

  stat() {
    return this.player;
  }
}

module.exports = Player;
