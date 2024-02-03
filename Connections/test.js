function addTac(tots, outs) {
  return tots.map((t) => {
    outs.map((o) => {
      if (o.id === t.id) t = o;
    });
    return t;
  });
}

let c = [
  { id: 1, k: null },
  { id: 2, k: null },
  { id: 3, k: null },
  { id: 5, k: null },
];

let p = [
  { id: 2, k: "green" },
  { id: 1, k: "yellow" },
  { id: 5, k: "black" },
];

console.log(addTac(c, p));
