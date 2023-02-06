// ! VISUALIZER

function visualize(cube) {
  const state = [cube.uFace, cube.fFace, cube.rFace, cube.bFace, cube.lFace, cube.dFace];
  console.log(`       ${state[0][0]}${state[0][1]}${state[0][2]}`);
  console.log(`       ${state[0][3]}${state[0][4]}${state[0][5]}`);
  console.log(`       ${state[0][6]}${state[0][7]}${state[0][8]}`);

  console.log(
    `${state[4][0]}${state[4][1]}${state[4][2]} ${state[1][0]}${state[1][1]}${state[1][2]} ${state[2][0]}${state[2][1]}${state[2][2]} ${state[3][0]}${state[3][1]}${state[3][2]}`);

  console.log(
    `${state[4][3]}${state[4][4]}${state[4][5]} ${state[1][3]}${state[1][4]}${state[1][5]} ${state[2][3]}${state[2][4]}${state[2][5]} ${state[3][3]}${state[3][4]}${state[3][5]}`);

  console.log(
    `${state[4][6]}${state[4][7]}${state[4][8]} ${state[1][6]}${state[1][7]}${state[1][8]} ${state[2][6]}${state[2][7]}${state[2][8]} ${state[3][6]}${state[3][7]}${state[3][8]}`);

  console.log(`       ${state[5][0]}${state[5][1]}${state[5][2]}`);
  console.log(`       ${state[5][3]}${state[5][4]}${state[5][5]}`);
  console.log(`       ${state[5][6]}${state[5][7]}${state[5][8]}`);
}

function printLine(n=1) {
  for (let i = 0; i < n; i++) {
    console.log('__________________________');
  }
}

function printDepth(cube) {
  console.log(`Depth: ${cube.depth}`);
}

function printMoves(cube) {
  console.log(cube.movesApplied.join(' '));
}

function printSolutionsString(solutionsList) {
  for (let solution of solutionsList) {
    console.log(`a solution is: ${solution}`);
  }
}

module.exports = { visualize, printDepth, printLine, printMoves }