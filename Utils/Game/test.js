class box {
  constructor(vid) {
    if (this.vid) {
      console.log("oh no");
    }

    this.vid = vid;
  }

  get() {
    console.log(this.vid);
  }

  start(fill) {
    if (this.fill) {
      console.log("oh no");
    }

    this.fill = fill;
  }
}

const vad = new box("render");
vad.get();
vad.start("gin");
vad.start("gin");
