// takes in an input of ["solution 1", "solution 2" ...]
// outputs a map: { "solution 1" : [1, 2], "solution 2" : [3, 4] }
export default function mapSolutionsListToDict(solutions) {
  const solutionsMap = new Map();
  for (let i = 0; i < solutions.length; i++) {
    const noSpacesPrimeOrDouble = solutions[i].replace(/ |'|2/g, '');
    const totalSliceMoves = (noSpacesPrimeOrDouble.match(/[ESM]/g) || []).length;
    // maps a solution to [A, B] where A is the STM and B is the QTM
    solutionsMap.set(solutions[i], [noSpacesPrimeOrDouble.length,
    noSpacesPrimeOrDouble.length + totalSliceMoves]);
  }
  return solutionsMap;
}