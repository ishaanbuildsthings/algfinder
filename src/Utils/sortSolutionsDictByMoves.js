// takes in an input of a map: { "solution 1" : [1, 2], "solution 2" : [3, 4] }
// outputs a list of the sorted solutions by STM: ["M U M2 U2 M'", "R2 U R U R' R' U F R U"]
export default function sortSolutionsDictByMoves(map, stmOrQtm) {
  let position;
  stmOrQtm === 'stm' ? position = 0 : position = 1;
  //todo statement vs value

  const mapValues = map.values(); // [[1, 4], [3, 6] ... ]
  const lengths = []; // [1, 3, ...]
  for (let value of mapValues) {
    lengths.push(value[position]);
  }

  let flag = true;
  // if the values aren't strictly equal to or increasing, don't sort
  for (let i = 0; i < lengths.length; i++) {
    if (i !== lengths.length - 1) {
      if (lengths[i + 1] >= lengths[i]) {

      } else {
        flag = false;
      }
    }
  }

  const solutions = Array.from(map.keys()); // we have solutions and lengths

  if (!flag) {
    solutions.sort((a, b) => {
      return lengths[solutions.indexOf(a)] - lengths[solutions.indexOf(b)];
    });
  }

  return solutions;
}