function findInArray(id, list, idToo = false) {
  const itemId = list.findIndex((rm) => rm.id === id);

  if (idToo) {
    if (itemId === -1) return { item: null, id: null };
    if (itemId !== -1) return { item: list[itemId], id: itemId };
  } else {
    if (itemId === -1) return null;
    else return list[itemId];
  }
}

module.exports = findInArray;

const { item: room, id } = findInArray(
  23,
  [
    { id: 11, r: "res" },
    { id: 23, r: "eres" },
    { id: 1, r: "yes" },
  ],
  true
);

console.log(room, id);
