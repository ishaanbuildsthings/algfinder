// takes in an input of ["solution 1", "solution 2" ...]
// outputs { "solution 1" : [1, 2], "solution 2" : [3, 4] }
export default function mapSolutionsListToDict(solutions) {
  let solutionsDictWithMovecounts = {};
  for (let i = 0; i < solutions.length; i++) {
    const noSpacesPrimeOrDouble = solutions[i].replace(/ '2/g, '');
    const totalSliceMoves = (noSpacesPrimeOrDouble.match(/ESM/g));
    // maps a solution to [A, B] where A is the STM and B is the QTM
    solutionsDictWithMovecounts[solutions[i]] = [
      noSpacesPrimeOrDouble.length,
      noSpacesPrimeOrDouble.length + totalSliceMoves,
    ];
  }
  return solutionsDictWithMovecounts;
}