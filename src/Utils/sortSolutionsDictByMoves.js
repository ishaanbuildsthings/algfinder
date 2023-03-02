// this function sorts moves by their 'quarter turn move' or 'slice turn move' metrics
// takes in an input of a map: { "solution 1" : [1, 2], "solution 2" : [3, 4] }
// outputs a list of the sorted solutions by STM: ["M U M2 U2 M'", "R2 U R U R' R' U F R U"]
export default function sortSolutionsDictByMoves(map, stmOrQtm) {
  let position;
  stmOrQtm === 'stm' ? (position = 0) : (position = 1);
  const mapValues = map.values(); // [[1, 4], [3, 6] ... ]
  const lengths = []; // [1, 3, ...]
  for (const value of mapValues) {
    lengths.push(value[position]);
  }
  let flag = true;
  // if the values aren't strictly equal to or increasing, don't sort
  for (let i = 0; i < lengths.length; i += 1) {
    if (i !== lengths.length - 1) {
      if (lengths[i + 1] < lengths[i]) {
        flag = false;
      }
    }
  }
  const solutions = Array.from(map.keys()); // we have solutions and lengths
  if (!flag) {
    solutions.sort(
      (a, b) => lengths[solutions.indexOf(a)] - lengths[solutions.indexOf(b)]
    );
  }
  return solutions;
}
