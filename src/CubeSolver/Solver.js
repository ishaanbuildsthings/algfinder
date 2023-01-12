import Cube from './Cube.js';
// ? import { visualize, printLine, printDepth, printMoves, printSolutionsString } from './Visualizer.js';
import { applyAlg, cleanUpIntersection, reverseAndInvertMoveList } from './AlgHandler.js';
import sleep from '../Utils/sleep.js';

async function solve(scramble, allowedMoves, maxDepth, setSolutionsList, setNoSolutionsModal, allowedToRun) {
  // if exactly one end is odd, such as 7+8 or 8+9
  let oddStatus = Boolean(maxDepth % 2);
  scramble = scramble.split(' ');
  allowedMoves = allowedMoves.split(' ');
  // if input is 13, this will become 7, odd status is true
  // if input is 14, this will become 7, odd status is false
  // if input is 15, this will become 8, odd status is true
  // if input is 16, this will become 8, odd status is false
  maxDepth = parseInt(Math.ceil((parseInt(maxDepth) / 2)));

  // create the cubes
  const solvedCube = new Cube();
  solvedCube.allowedMoves = allowedMoves;
  const scrambledCube = new Cube();
  applyAlg(scramble, scrambledCube);
  scrambledCube.movesApplied = [];
  scrambledCube.allowedMoves = allowedMoves;

  // ? printLine();
  // ? console.log(`Here are your cubes:`);
  // ? console.log('Solved Cube');
  // ? visualize(solvedCube);
  // ? console.log('Scrambled Cube');
  // ? visualize(scrambledCube);
  // ? printLine(3);

  // setup for search algorithm
  const solvedHash = {}; // holds a mapping of cube states to lists of solutions, { "R2 U R" : ["R' U' R2, "x R F U2"] }
  const solvedQueue = [solvedCube]; // holds a queue of cubes
  const scrambledHash = {};
  const scrambledQueue = [scrambledCube];

  // ? let numCubes = 0;
  let depthOfNextQueuedCube = 0;
  const finalSolutions = new Set();

  // if our user-defined max depth is 5 or 6 (making maxDepth to be searched from one end = 3), and the next cube in the queue has a max depth of 2 or less, process it
  while (depthOfNextQueuedCube < maxDepth && allowedToRun[0]) {

    // grab the next cube from the list and create its adjacency list
    const parentSolvedCube = solvedQueue.shift();
    const solvedAdjacencyList = parentSolvedCube.createAdjList();

    // for every cube in the adjacency list, assign properties
    for (let adjacentCube of solvedAdjacencyList) {
      // ? numCubes += 1;
      adjacentCube.parentCube = parentSolvedCube;
      adjacentCube.depth = parentSolvedCube.depth + 1;
      adjacentCube.allowedMoves = allowedMoves;

      // ? console.log('Started from solved cube');
      // ? visualize(adjacentCube);
      // ? console.log(`Count: ${numCubes}`);
      // ? printDepth(adjacentCube);
      // ? printMoves(adjacentCube);

      // if this state hasnt been reached, initialize the ways to reach that state
      if (!(adjacentCube.getState() in solvedHash)) {
        // ? console.log("This cube state hasn't been reached from the solved end before, hashing now...");
        solvedHash[adjacentCube.getState()] = [adjacentCube.movesApplied.join(' ')];
      } else { // if it has been reached, just add another state
        // ? console.log('This cube state has already been reached from the solved end before via different moves, adding another sequence to hash now...');
        solvedHash[adjacentCube.getState()].push(adjacentCube.movesApplied.join(' '));
      }

      // if this cube state has been seen in the scrambled hash, create all solutions
      if (adjacentCube.getState() in scrambledHash) {
        // iterate over all the scrambled halfways to reach the solved state
        // ? console.log('This cube state has been reached from the scrambled end before! Intersection found.');
        // ? console.log('Here are the ways we reached this state from the scrambled end:');
        for (let scrambledHalfway of scrambledHash[adjacentCube.getState()]) {
          // ? console.log(scrambledHalfway);
          scrambledHalfway = scrambledHalfway.split(' ');
          const stage1 = reverseAndInvertMoveList(scrambledHalfway);
          const stage2 = cleanUpIntersection(adjacentCube.movesApplied, stage1);
          const stage3 = reverseAndInvertMoveList(stage2);
          const stage3s = stage3.join(' ');

          // add solutions only if they haven't been found
          if (!finalSolutions.has(stage3s)) {
            finalSolutions.add(stage3s);
          }
        }
      }
      // ? printLine();
      // add the adjacenytcube to the queue for BFS
      solvedQueue.push(adjacentCube);
    }
    // update the depth for the next cube
    depthOfNextQueuedCube = solvedQueue[0].depth;

    // update the state with the current found solutions, it is done before entering the scrambled side in case that is pruned
    const currentFoundSolutions = [];
    for (let solution of finalSolutions) {
      currentFoundSolutions.push(solution);
    }
    setSolutionsList(currentFoundSolutions); // update the state with the current compute chunk
    await sleep(0);

    // SCRAMBLED END

    const parentScrambledCube = scrambledQueue.shift();

    // assume the depth is 15
    // odd status is true, the max depth is 8
    // if we reach a scrambled cube of depth 7, meaning we are processing neighbors of depth 8
    // then skip that, we don't need to check the scrambled size of depth 8, we will just check the solved size of depth 8
    // the top part will run again, if the next solved cube has depth 7, meaning we are processing depth 8 neighbors, the while condition is valid
    // repeat the pruning skip, the top will stop running when we hit a solved cube with depth 8, since we don't need to search depth 9 neighbors
    //  assume the depth is 17
    // odd status is true, the max depth is 9

    if (oddStatus && parentScrambledCube.depth === maxDepth - 1) {
      continue;
    }

    // grab the next cube from the list and create its adjacency list
    const scrambledAdjacencyList = parentScrambledCube.createAdjList();

    // for every cube in the adjacency list, assign properties
    for (let scrambledAdjacentCube of scrambledAdjacencyList) {
      // ? numCubes += 1;
      scrambledAdjacentCube.parentCube = parentScrambledCube;
      scrambledAdjacentCube.depth = parentScrambledCube.depth + 1;
      scrambledAdjacentCube.allowedMoves = allowedMoves;
      // ? console.log('Started from scrambled cube');
      // ? visualize(scrambledAdjacentCube);
      // ? console.log(`Count: ${numCubes}`);
      // ? printDepth(scrambledAdjacentCube);
      // ? printMoves(scrambledAdjacentCube);
      // ? if this state hasnt been reached, initialize the ways to reach that state
      if (!(scrambledAdjacentCube.getState() in scrambledHash)) {
        // ? console.log("This cube hasn't been reached from the scrambled end before, hashing now...");
        scrambledHash[scrambledAdjacentCube.getState()] = [scrambledAdjacentCube.movesApplied.join(' ')];
      } else { // if it has been reached, just add another state
        // ? console.log('This cube state has already been reached from the solved end before, adding another sequence to hash now');
        scrambledHash[scrambledAdjacentCube.getState()].push(scrambledAdjacentCube.movesApplied.join(' '));
      }

      // if the cube state has been seen in the solved hash, create all solutions
      if (scrambledAdjacentCube.getState() in solvedHash) {
        // ? console.log('This cube state has been reached from the scrambled end before! Intersection found.');
        // ? console.log('Here are the ways we reached this state from the scrambled end:');
        // iterate over all the solved halfways to reach the scrambled state
        // if we can reached the scrambled state from two different ways, the comparison would happen for each time
        for (let solvedHalfway of solvedHash[scrambledAdjacentCube.getState()]) {
          // ? console.log(solvedHalfway);
          solvedHalfway = solvedHalfway.split(' ');
          const stage1 = reverseAndInvertMoveList(solvedHalfway);
          const stage2 = cleanUpIntersection(scrambledAdjacentCube.movesApplied, stage1);
          const stage2s = stage2.join(' ');
          if (!finalSolutions.has(stage2s)) {
            finalSolutions.add(stage2s);
          }
        }
      }
      // ? printLine();
      scrambledQueue.push(scrambledAdjacentCube);
    }
  }
  // update the state one more time at the end, in case final solutions are found in the last scrambled chunk which would otherwise be missed
  const currentFoundSolutions = [];
    for (let solution of finalSolutions) {
      currentFoundSolutions.push(solution);
    }
  setSolutionsList(currentFoundSolutions);

  if (finalSolutions.size === 0) {
    setNoSolutionsModal(true);
  }
  // ? printSolutionsString(finalSolutions);
}

export { solve };


