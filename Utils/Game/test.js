const test = [
  {
    id: "GogqE33-0psbPDeLAAAJ",
    name: "ola",
    character: {
      id: 17,
      key: "pear",
      value_e: "🍐",
      value: "/pear111.1de0b8a5.svg",
      color: "#ff0000d8",
    },
    role: "PLAYER",
    score: 80,
  },
  {
    id: "gPurBcUU65vCQLx1AAAH",
    name: "jack",
    character: {
      id: 4,
      key: "watermelon",
      value_e: "🍉",
      value: "/watermelon111.3175d870.svg",
      color: "#32cd32d8",
    },
    role: "PLAYER",
    score: 100,
  },
  {
    score: 30,
  },
  {
    score: 50,
  },
];

console.log(test.sort((a, b) => b.score - a.score)[0]);
