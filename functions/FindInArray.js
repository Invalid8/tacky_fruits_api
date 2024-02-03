function findInArray(id, list, idToo = false) {
  const itemId = list.findIndex((rm) => rm.id === id);

  if (idToo) {
    if (itemId === -1) return { item: undefined, id: undefined };
    if (itemId !== -1) return { item: list[itemId], id: itemId };
  } else {
    if (itemId === -1) return undefined;
    else return list[itemId];
  }
}

module.exports = findInArray;
