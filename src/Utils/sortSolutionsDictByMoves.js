// takes in an input of { "solution 1" : [1, 2], "solution 2" : [3, 4] }
// outputs a list of the sorted solutions by STM: ["M U M2 U2 M'", "R2 U R U R' R' U F R U"]
export default function sortSolutionsDictByMoves(obj, stmOrQtm) {
  const strings = Object.keys(obj);
  strings.sort((a, b) => {
    const listA = obj[a];
    const listB = obj[b];
    if (stmOrQtm === 'stm') {
      return listA[0] - listB[0];
    } else {
      return listA[1] - listB[1];
    }
  });
  return strings;
}

// TODO: fix