// * this module is for testing the webworker file within node

const Cube = require('./webworkerPlaygroundCube.js');
const {
  printDepth,
  printLine,
  printMoves,
  visualize,
} = require('./webworkerPgVisualizer.js');
const {
  applyAlg,
  cleanUpIntersection,
  reverseAndInvertMoveList,
} = require('./webworkerPgAlgHandler');

// ! SOLVER

// let { scramble, moveset, depth } = { scramble: "R2 U2 R2 U2 R2 U2", moveset: ["R", "U"], depth: 6 };
let { scramble, moveset, depth } = {
  scramble: 'U2',
  moveset: ['R', 'U', 'x'],
  depth: 4,
};

const oddStatus = Boolean(depth % 2);
scramble = scramble.split(' ');
depth = parseInt(Math.ceil(parseInt(depth) / 2));

// create the cubes
const solvedCube = new Cube();
solvedCube.allowedMoves = moveset;
const scrambledCube = new Cube();
applyAlg(scramble, scrambledCube);
scrambledCube.movesApplied = [];
scrambledCube.allowedMoves = moveset;

// setup for search algorithm
// the hashes are initialized with the starting states as a precaution for behavior with rotations,
// since we may not allow solutions to end in rotations
// for instance the scramble x U, when we do a U' it results in an x, but this
// interesection might not be found, so we initialize it
// also, if the scramble is just R2 with depth 1, the scrambled end gets pruned out so we should hash its state to begin with
const solvedHash = { [solvedCube.getReorderedState()]: [''] };
const solvedQueue = [solvedCube]; // holds a queue of cubes
const scrambledHash = { [scrambledCube.getReorderedState()]: [''] };
const scrambledQueue = [scrambledCube];

let depthOfNextQueuedCube = 0;
const finalSolutions = new Set();

while (depthOfNextQueuedCube < depth) {
  // grab the next cube from the list and create its adjacency list
  const parentSolvedCube = solvedQueue.shift();

  let solvedAdjacencyList;
  // if our cube is the very first initial solved cube, don't allow rotations to start
  if (parentSolvedCube === solvedCube) {
    solvedAdjacencyList = parentSolvedCube.createAdjListForSolvedCubeAtStart();
  } else {
    solvedAdjacencyList = parentSolvedCube.createAdjList();
  }

  // for every cube in the adjacency list, assign properties
  for (const adjacentCube of solvedAdjacencyList) {
    adjacentCube.parentCube = parentSolvedCube;
    adjacentCube.depth = parentSolvedCube.depth + 1;
    adjacentCube.allowedMoves = moveset;

    console.log('Started from solved cube');
    visualize(adjacentCube);
    printDepth(adjacentCube);
    printMoves(adjacentCube);

    // if this state hasnt been reached, initialize the ways to reach that state
    if (!(adjacentCube.getReorderedState() in solvedHash)) {
      console.log(
        "This cube state hasn't been reached from the solved end before, hashing now..."
      );
      solvedHash[adjacentCube.getReorderedState()] = [
        adjacentCube.movesApplied.join(' '),
      ];
    } else {
      console.log(
        'This cube state has already been reached from the solved end before via different moves, adding another sequence to hash now...'
      );
      solvedHash[adjacentCube.getReorderedState()].push(
        adjacentCube.movesApplied.join(' ')
      );
    }
    if (adjacentCube.getReorderedState() in scrambledHash) {
      console.log(
        'This cube state has been reached from the scrambled end before! Intersection found.'
      );
      console.log(
        'Here are the ways we reached this state from the scrambled end:'
      );
      for (let scrambledHalfway of scrambledHash[
        adjacentCube.getReorderedState()
      ]) {
        console.log(scrambledHalfway);
        scrambledHalfway = scrambledHalfway.split(' ');
        const stage1 = reverseAndInvertMoveList(scrambledHalfway);
        const stage2 = cleanUpIntersection(adjacentCube.movesApplied, stage1);
        const stage3 = reverseAndInvertMoveList(stage2);
        const stage3s = stage3.join(' ').trim();
        if (!finalSolutions.has(stage3s)) {
          finalSolutions.add(stage3s);
        }
      }
    }
    printLine();
    solvedQueue.push(adjacentCube);
  }
  // update the depth for the next cube
  depthOfNextQueuedCube = solvedQueue[0].depth;

  // update the state with the current found solutions, it is done before entering the scrambled side in case that is pruned

  // SCRAMBLED END

  const parentScrambledCube = scrambledQueue.shift();

  if (oddStatus && parentScrambledCube.depth === depth - 1) {
    // eslint-disable-next-line no-continue
    continue;
  }

  const scrambledAdjacencyList = parentScrambledCube.createAdjList();

  for (const scrambledAdjacentCube of scrambledAdjacencyList) {
    scrambledAdjacentCube.parentCube = parentScrambledCube;
    scrambledAdjacentCube.depth = parentScrambledCube.depth + 1;
    scrambledAdjacentCube.allowedMoves = moveset;

    console.log('Started from scrambled cube');
    visualize(scrambledAdjacentCube);
    printDepth(scrambledAdjacentCube);
    printMoves(scrambledAdjacentCube);

    // if scrabmled state hasn't been seen from scrambled end before, intiialize
    if (!(scrambledAdjacentCube.getReorderedState() in scrambledHash)) {
      console.log(
        "This cube hasn't been reached from the scrambled end before, hashing now..."
      );
      scrambledHash[scrambledAdjacentCube.getReorderedState()] = [
        scrambledAdjacentCube.movesApplied.join(' '),
      ];
    } else {
      // if scrambled state has been seen from scrambled end, just add it
      console.log(
        'This cube state has already been reached from the solved end before, adding another sequence to hash now'
      );
      scrambledHash[scrambledAdjacentCube.getReorderedState()].push(
        scrambledAdjacentCube.movesApplied.join(' ')
      );
    }

    // if scrambled state has been seen from solved side, there is a collision
    if (scrambledAdjacentCube.getReorderedState() in solvedHash) {
      console.log(
        'This cube state has been reached from the solved end before! Intersection found.'
      );
      console.log(
        'Here are the ways we reached this state from the solved end:'
      );
      for (let solvedHalfway of solvedHash[
        scrambledAdjacentCube.getReorderedState()
      ]) {
        console.log(solvedHalfway);
        solvedHalfway = solvedHalfway.split(' ');
        const stage1 = reverseAndInvertMoveList(solvedHalfway);
        const stage2 = cleanUpIntersection(
          scrambledAdjacentCube.movesApplied,
          stage1
        );
        const stage2s = stage2.join(' ').trim();
        if (!finalSolutions.has(stage2s)) {
          finalSolutions.add(stage2s);
        }
      }
    }
    printLine();
    scrambledQueue.push(scrambledAdjacentCube);
  }
}
if (finalSolutions.size === 0) {
  // AND CUBE IS SOLVED
  console.log(
    'no solutions found, this should post an empty solution if cube is solved'
  );
} else {
  console.log(finalSolutions);
}

// for (let key in solvedHash) {
//   console.log(key);
// }
// console.log('____')
// for (let key in scrambledHash) {
//   console.log(key);
// }
// console.log('____')
// console.log(`solved hash: ${JSON.stringify(solvedHash)}`);
// console.log(`scrambled hash: ${JSON.stringify(scrambledHash)}`);

const cube = new Cube();
cube.move('R');
cube.move('x');

console.log(cube.getReorderedState());

const cube2 = new Cube();
cube2.move('R');

console.log(cube2.getReorderedState());
