/* eslint-disable class-methods-use-this */
// this represents the state of a solved cube returned by getState() on a new cube
// also used to initialize the state of a cube
const SOLVED_CUBE = [
  ['⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜'],
  ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩'],
  ['🟥', '🟥', '🟥', '🟥', '🟥', '🟥', '🟥', '🟥', '🟥'],
  ['🟨', '🟨', '🟨', '🟨', '🟨', '🟨', '🟨', '🟨', '🟨'],
  ['🟧', '🟧', '🟧', '🟧', '🟧', '🟧', '🟧', '🟧', '🟧'],
  ['🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦'],
];

const SOLVED_CUBE_STATE =
  '⬜⬜⬜⬜⬜⬜⬜⬜⬜🟩🟩🟩🟩🟩🟩🟩🟩🟩🟥🟥🟥🟥🟥🟥🟥🟥🟥🟨🟨🟨🟨🟨🟨🟨🟨🟨🟧🟧🟧🟧🟧🟧🟧🟧🟧🟦🟦🟦🟦🟦🟦🟦🟦🟦';

// when the worker receives a message from the main thread
// e.data = the params we send in via postMessage
onmessage = function (e) {
  let { processedScramble, moveset, depth } = e.data;
  const finalSolutions = new Set(); // this is to track if repeat solutions are found
  const oddStatus = Boolean(depth % 2);
  const scramble = processedScramble.split(' ');

  // if the scramble starts with rotations, remove them, this way for x R' U' R' we get the solution R U R
  while (
    scramble[0][0] === 'x' ||
    scramble[0][0] === 'y' ||
    scramble[0][0] === 'z'
  ) {
    scramble.shift();
  }

  // create the cubes
  const solvedCube = new Cube();
  solvedCube.allowedMoves = moveset;
  const scrambledCube = new Cube();
  applyAlg(scramble, scrambledCube);
  scrambledCube.movesApplied = [];
  scrambledCube.allowedMoves = moveset;

  // if our scrambled cube is actually just a solved cube (along with any rotation), post a blank solution
  if (
    JSON.stringify(scrambledCube.getReorderedState()) ===
    JSON.stringify(SOLVED_CUBE_STATE)
  ) {
    this.postMessage('');
    finalSolutions.add(''); // if a scrambled cube finds a state via R, and a solved cube finds a state via R', the intersection is '', so we need to add this to final solutions to prevent duplicates
  }

  // if the depth is 0, or there isn't a moveset, finish
  if (depth === 0 || moveset.length === 0) {
    this.postMessage('done');
    return;
  }

  depth = parseInt(Math.ceil(parseInt(depth) / 2));

  // hande second edge case of only one moveset type
  if (moveset.length === 1) {
    // eslint-disable-next-line no-shadow
    const scrambledCube = new Cube();
    applyAlg(scramble, scrambledCube);

    // the test cubes are the one move variants based on the single variant, if any of those single moves solve the cube, those are solutions
    const testCube1 = new Cube();
    testCube1.move(moveset[0]);
    const testCube2 = testCube1._clone();
    testCube2.move(moveset[0]);
    const testCube3 = testCube2._clone();
    testCube3.move(moveset[0]);

    if (
      JSON.stringify(testCube1.getState()) ===
      JSON.stringify(scrambledCube.getState())
    ) {
      this.postMessage(invertMove(moveset[0]));
    } else if (
      JSON.stringify(testCube2.getState()) ===
      JSON.stringify(scrambledCube.getState())
    ) {
      this.postMessage(normalToDouble(moveset[0]));
    } else if (
      JSON.stringify(testCube3.getState()) ===
      JSON.stringify(scrambledCube.getState())
    ) {
      this.postMessage(moveset[0]);
    }
    this.postMessage('done');
  }

  // setup for search algorithm
  const solvedHash = { [solvedCube.getState()]: [''] };
  const solvedQueue = [solvedCube]; // holds a queue of cubes
  const scrambledHash = { [scrambledCube.getState()]: [''] };
  const scrambledQueue = [scrambledCube];

  let depthOfNextQueuedCube = 0;

  // ! ################################### SOLVER ###################################

  while (depthOfNextQueuedCube < depth) {
    // grab the next cube from the list and create its adjacency list
    const parentSolvedCube = solvedQueue.shift();

    let solvedAdjacencyList;
    // if our cube is the very first initial solved cube, don't allow rotations to start
    if (parentSolvedCube === solvedCube) {
      solvedAdjacencyList =
        parentSolvedCube.createAdjListForSolvedCubeAtStart();
    } else {
      solvedAdjacencyList = parentSolvedCube.createAdjList();
    }

    // for every cube in the adjacency list, assign properties
    for (const adjacentCube of solvedAdjacencyList) {
      adjacentCube.parentCube = parentSolvedCube;
      adjacentCube.depth = parentSolvedCube.depth + 1;
      adjacentCube.allowedMoves = moveset;

      const adjacentReorderedState = adjacentCube.getState();

      // if this state hasnt been reached, initialize the ways to reach that state
      if (!(adjacentReorderedState in solvedHash)) {
        solvedHash[adjacentReorderedState] = [
          adjacentCube.movesApplied.join(' '),
        ];
      } else {
        solvedHash[adjacentReorderedState].push(
          adjacentCube.movesApplied.join(' ')
        );
      }
      if (adjacentReorderedState in scrambledHash) {
        for (let scrambledHalfway of scrambledHash[adjacentReorderedState]) {
          scrambledHalfway = scrambledHalfway.split(' ');
          const stage1 = reverseAndInvertMoveList(scrambledHalfway);
          const stage2 = cleanUpIntersection(adjacentCube.movesApplied, stage1);
          const stage3 = reverseAndInvertMoveList(stage2);
          const stage3s = stage3.join(' ').trim();
          if (!finalSolutions.has(stage3s)) {
            if (finalSolutions.size > 98) {
              this.postMessage('too many solutions');
              return;
            }
            this.postMessage(stage3s);
            finalSolutions.add(stage3s);
          }
        }
      }
      solvedQueue.push(adjacentCube);
    }
    // update the depth for the next cube
    depthOfNextQueuedCube = solvedQueue[0].depth;

    // SCRAMBLED END

    const parentScrambledCube = scrambledQueue.shift();

    // pruning
    if (oddStatus && parentScrambledCube.depth === depth - 1) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const scrambledAdjacencyList = parentScrambledCube.createAdjList();

    for (const scrambledAdjacentCube of scrambledAdjacencyList) {
      scrambledAdjacentCube.parentCube = parentScrambledCube;
      scrambledAdjacentCube.depth = parentScrambledCube.depth + 1;
      scrambledAdjacentCube.allowedMoves = moveset;

      const scrambledAdjacentReorderedState = scrambledAdjacentCube.getState();

      if (!(scrambledAdjacentReorderedState in scrambledHash)) {
        scrambledHash[scrambledAdjacentReorderedState] = [
          scrambledAdjacentCube.movesApplied.join(' '),
        ];
      } else {
        // if it has been reached, just add another state
        scrambledHash[scrambledAdjacentReorderedState].push(
          scrambledAdjacentCube.movesApplied.join(' ')
        );
      }

      if (scrambledAdjacentReorderedState in solvedHash) {
        for (let solvedHalfway of solvedHash[scrambledAdjacentReorderedState]) {
          solvedHalfway = solvedHalfway.split(' ');
          const stage1 = reverseAndInvertMoveList(solvedHalfway);
          const stage2 = cleanUpIntersection(
            scrambledAdjacentCube.movesApplied,
            stage1
          );
          const stage2s = stage2.join(' ').trim();
          if (!finalSolutions.has(stage2s)) {
            if (finalSolutions.size > 98) {
              this.postMessage('too many solutions');
              return;
            }
            this.postMessage(stage2s);
            finalSolutions.add(stage2s);
          }
        }
      }
      scrambledQueue.push(scrambledAdjacentCube);
    }
  }
  // this.postMessage(`~final set: ${finalSolutions.size}`); // for debugging
  this.postMessage('done');
};

// ! ################################### CUBE ###################################

class Cube {
  constructor() {
    this.movesApplied = [];
    this.parentCube = null;
    this.depth = 0;
    this.allowedMoves = [];

    this.uFace = SOLVED_CUBE[0].slice();
    this.fFace = SOLVED_CUBE[1].slice();
    this.rFace = SOLVED_CUBE[2].slice();
    this.dFace = SOLVED_CUBE[3].slice();
    this.lFace = SOLVED_CUBE[4].slice();
    this.bFace = SOLVED_CUBE[5].slice();

    // to allow rotating the correct faces based on the letter passed to move function, and to get the updated state
    this.faceMapping = {
      U: this.uFace,
      F: this.fFace,
      R: this.rFace,
      D: this.dFace,
      L: this.lFace,
      B: this.bFace,
    };
  }

  _clone() {
    const clone = new Cube();
    clone.movesApplied = [...this.movesApplied];
    clone.uFace = [...this.uFace];
    clone.fFace = [...this.fFace];
    clone.rFace = [...this.rFace];
    clone.bFace = [...this.bFace];
    clone.lFace = [...this.lFace];
    clone.dFace = [...this.dFace];

    clone.faceMapping = {
      U: clone.uFace,
      F: clone.fFace,
      R: clone.rFace,
      D: clone.dFace,
      L: clone.lFace,
      B: clone.bFace,
    };
    return clone;
  }

  // returns string representation of state
  getState() {
    return (
      this.uFace.join('') +
      this.fFace.join('') +
      this.rFace.join('') +
      this.dFace.join('') +
      this.lFace.join('') +
      this.bFace.join('')
    );
  }

  // returns string representation of reordered faces so that white is always on top and green is on the front, used for some base case checking
  getReorderedState() {
    const hashableCubeState = this._createHashableCubeState([
      [...this.uFace],
      [...this.fFace],
      [...this.rFace],
      [...this.dFace],
      [...this.lFace],
      [...this.bFace],
    ]);

    return (
      hashableCubeState[0].join('') +
      hashableCubeState[1].join('') +
      hashableCubeState[2].join('') +
      hashableCubeState[3].join('') +
      hashableCubeState[4].join('') +
      hashableCubeState[5].join('')
    );
  }

  _createHashableCubeState(cubeState) {
    // grab the green and white sides from the matrix
    let greenSide;
    let whiteSide;
    for (let i = 0; i < cubeState.length; i += 1) {
      if (cubeState[i][4] === '🟩') {
        greenSide = i;
      } else if (cubeState[i][4] === '⬜') {
        whiteSide = i;
      }
    }

    // grab the sides from the matrix
    const [u, f, r, d, l, b] = cubeState;

    // rotates a supplied face by a certain number of degrees
    const rotateFace = (face, degrees) => {
      const [temp0, temp1, temp2, temp3, temp5, temp6, temp7, temp8] = [
        face[0],
        face[1],
        face[2],
        face[3],
        face[5],
        face[6],
        face[7],
        face[8],
      ];
      if (degrees === 90) {
        [
          face[0],
          face[1],
          face[2],
          face[3],
          face[5],
          face[6],
          face[7],
          face[8],
        ] = [temp6, temp3, temp0, temp7, temp1, temp8, temp5, temp2];
      } else if (degrees === -90) {
        [
          face[0],
          face[1],
          face[2],
          face[3],
          face[5],
          face[6],
          face[7],
          face[8],
        ] = [temp2, temp5, temp8, temp1, temp7, temp0, temp3, temp6];
      } else {
        [
          face[0],
          face[1],
          face[2],
          face[3],
          face[5],
          face[6],
          face[7],
          face[8],
        ] = [temp8, temp7, temp6, temp5, temp3, temp2, temp1, temp0];
      }
    };

    // execute an X move
    const handleX = (move) => {
      const tempu = u.slice();
      const tempb = b.slice();
      const tempd = d.slice();
      const tempf = f.slice();

      if (move === 'x') {
        u.splice(0, 9, ...tempf);
        b.splice(0, 9, ...tempu.reverse());
        d.splice(0, 9, ...tempb.reverse());
        f.splice(0, 9, ...tempd);
        rotateFace(l, -90);
        rotateFace(r, 90);
      } else if (move === 'x2') {
        u.splice(0, 9, ...tempd);
        b.splice(0, 9, ...tempf.reverse());
        d.splice(0, 9, ...tempu);
        f.splice(0, 9, ...tempb.reverse());
        rotateFace(l, 180);
        rotateFace(r, 180);
      } else if (move === "x'") {
        u.splice(0, 9, ...tempb.reverse());
        f.splice(0, 9, ...tempu);
        d.splice(0, 9, ...tempf);
        b.splice(0, 9, ...tempd.reverse());
        rotateFace(l, 90);
        rotateFace(r, -90);
      }
    };

    // execute a Y move
    const handleY = (move) => {
      const tempf = f.slice();
      const templ = l.slice();
      const tempb = b.slice();
      const tempr = r.slice();

      if (move === 'y') {
        f.splice(0, 9, ...tempr);
        r.splice(0, 9, ...tempb);
        b.splice(0, 9, ...templ);
        l.splice(0, 9, ...tempf);
        rotateFace(u, 90);
        rotateFace(d, -90);
      } else if (move === 'y2') {
        f.splice(0, 9, ...tempb);
        r.splice(0, 9, ...templ);
        b.splice(0, 9, ...tempf);
        l.splice(0, 9, ...tempr);
        rotateFace(u, 180);
        rotateFace(d, -180);
      } else if (move === "y'") {
        f.splice(0, 9, ...templ);
        r.splice(0, 9, ...tempf);
        b.splice(0, 9, ...tempr);
        l.splice(0, 9, ...tempb);
        rotateFace(u, -90);
        rotateFace(d, 90);
      }
    };

    // execute a Z move
    const handleZ = (move) => {
      const tempu = u.slice();
      const tempr = r.slice();
      const tempd = d.slice();
      const templ = l.slice();

      const helpZ = (faceToChange, old) => {
        faceToChange.splice(
          0,
          9,
          old[6],
          old[3],
          old[0],
          old[7],
          old[4],
          old[1],
          old[8],
          old[5],
          old[2]
        );
      };

      const helpZPrime = (faceToChange, old) => {
        faceToChange.splice(
          0,
          9,
          old[2],
          old[5],
          old[8],
          old[1],
          old[4],
          old[7],
          old[0],
          old[3],
          old[6]
        );
      };

      if (move === 'z') {
        helpZ(u, templ);
        helpZ(r, tempu);
        helpZ(d, tempr);
        helpZ(l, tempd);
        rotateFace(f, 90);
        rotateFace(b, -90);
      } else if (move === 'z2') {
        u.splice(0, 9, ...tempd.reverse()); // need splice as we are mutating the actual face
        r.splice(0, 9, ...templ.reverse());
        d.splice(0, 9, ...tempu.reverse());
        l.splice(0, 9, ...tempr.reverse());
        rotateFace(f, 180);
        rotateFace(b, 180);
      } else if (move === "z'") {
        helpZPrime(u, tempr);
        helpZPrime(r, tempd);
        helpZPrime(d, templ);
        helpZPrime(l, tempu);
        rotateFace(f, -90);
        rotateFace(b, 90);
      }
    };

    if (greenSide === 0) {
      handleX("x'");
    } else if (greenSide === 2) {
      handleY('y');
    } else if (greenSide === 3) {
      handleX('x');
    } else if (greenSide === 4) {
      handleY("y'");
    } else if (greenSide === 5) {
      handleY('y2');
    }

    if (whiteSide === 2) {
      handleZ("z'");
    } else if (whiteSide === 3) {
      handleZ('z2');
    } else if (whiteSide === 4) {
      handleZ('z');
    }

    return cubeState;
  }

  move(move) {
    // * ########## move functions ##########

    const handleU = () => {
      const tempf = f.slice(0, 3);
      const tempr = r.slice(0, 3);
      const tempb = b.slice(0, 3);
      const templ = l.slice(0, 3);
      if (lastChar === "'") {
        l.splice(0, 3, ...tempb);
        b.splice(0, 3, ...tempr);
        r.splice(0, 3, ...tempf);
        f.splice(0, 3, ...templ);
      } else if (lastChar === '2') {
        l.splice(0, 3, ...tempr);
        b.splice(0, 3, ...tempf);
        r.splice(0, 3, ...templ);
        f.splice(0, 3, ...tempb);
      } else {
        l.splice(0, 3, ...tempf);
        b.splice(0, 3, ...templ);
        r.splice(0, 3, ...tempb);
        f.splice(0, 3, ...tempr);
      }
    };

    const handleR = () => {
      const tempu = [u[2], u[5], u[8]];
      const tempb = [b[0], b[3], b[6]];
      const tempd = [d[2], d[5], d[8]];
      const tempf = [f[2], f[5], f[8]];
      if (lastChar === "'") {
        [b[0], b[3], b[6]] = tempd.reverse();
        [d[2], d[5], d[8]] = tempf;
        [f[2], f[5], f[8]] = tempu;
        [u[2], u[5], u[8]] = tempb.reverse();
      } else if (lastChar === '2') {
        [b[0], b[3], b[6]] = tempf.reverse();
        [d[2], d[5], d[8]] = tempu;
        [f[2], f[5], f[8]] = tempb.reverse();
        [u[2], u[5], u[8]] = tempd;
      } else {
        [b[0], b[3], b[6]] = tempu.reverse();
        [d[2], d[5], d[8]] = tempb.reverse();
        [f[2], f[5], f[8]] = tempd;
        [u[2], u[5], u[8]] = tempf;
      }
    };

    const handleF = () => {
      const tempu = u.slice(6);
      const tempr = [r[0], r[3], r[6]];
      const tempd = d.slice(0, 3).reverse();
      const templ = [l[8], l[5], l[2]];
      if (lastChar === "'") {
        u.splice(6, 3, ...tempr);
        [r[0], r[3], r[6]] = tempd;
        d.splice(0, 3, ...templ.reverse());
        [l[2], l[5], l[8]] = tempu.reverse();
      } else if (lastChar === '2') {
        u.splice(6, 3, ...tempd);
        [r[0], r[3], r[6]] = templ;
        d.splice(0, 3, ...tempu.reverse());
        [l[8], l[5], l[2]] = tempr;
      } else {
        u.splice(6, 3, ...templ);
        [r[0], r[3], r[6]] = tempu;
        d.splice(0, 3, ...tempr.reverse());
        [l[8], l[5], l[2]] = tempd;
      }
    };

    const handleD = () => {
      const tempf = f.slice(6);
      const tempr = r.slice(6);
      const tempb = b.slice(6);
      const templ = l.slice(6);
      if (lastChar === "'") {
        f.splice(6, 3, ...tempr);
        l.splice(6, 3, ...tempf);
        b.splice(6, 3, ...templ);
        r.splice(6, 3, ...tempb);
      } else if (lastChar === '2') {
        f.splice(6, 3, ...tempb);
        r.splice(6, 3, ...templ);
        b.splice(6, 3, ...tempf);
        l.splice(6, 3, ...tempr);
      } else {
        f.splice(6, 3, ...templ);
        l.splice(6, 3, ...tempb);
        b.splice(6, 3, ...tempr);
        r.splice(6, 3, ...tempf);
      }
    };

    const handleL = () => {
      const tempu = [u[0], u[3], u[6]];
      const tempf = [f[0], f[3], f[6]];
      const tempd = [d[0], d[3], d[6]];
      const tempb = [b[8], b[5], b[2]];
      if (lastChar === "'") {
        [u[0], u[3], u[6]] = tempf;
        [f[0], f[3], f[6]] = tempd;
        [d[0], d[3], d[6]] = tempb;
        [b[8], b[5], b[2]] = tempu;
      } else if (lastChar === '2') {
        [u[0], u[3], u[6]] = tempd;
        [f[0], f[3], f[6]] = tempb;
        [d[0], d[3], d[6]] = tempu;
        [b[8], b[5], b[2]] = tempf;
      } else {
        [u[0], u[3], u[6]] = tempb;
        [f[0], f[3], f[6]] = tempu;
        [d[0], d[3], d[6]] = tempf;
        [b[8], b[5], b[2]] = tempd;
      }
    };

    const handleB = () => {
      const tempu = u.slice(0, 3).reverse();
      const templ = [l[0], l[3], l[6]];
      const tempd = d.slice(6);
      const tempr = [r[8], r[5], r[2]];
      if (lastChar === "'") {
        u.splice(0, 3, ...templ.reverse());
        [l[0], l[3], l[6]] = tempd;
        d.splice(6, 3, ...tempr);
        [r[8], r[5], r[2]] = tempu;
      } else if (lastChar === '2') {
        u.splice(0, 3, ...tempd.reverse());
        [r[8], r[5], r[2]] = templ;
        d.splice(6, 3, ...tempu);
        [l[0], l[3], l[6]] = tempr;
      } else {
        u.splice(0, 3, ...tempr.reverse());
        [l[0], l[3], l[6]] = tempu;
        d.splice(6, 3, ...templ);
        [r[8], r[5], r[2]] = tempd;
      }
    };

    const handleS = () => {
      const tempu = u.slice(3, 6);
      const tempr = [r[1], r[4], r[7]];
      const tempd = d.slice(3, 6).reverse();
      const templ = [l[7], l[4], l[1]];
      if (move === 'S' || move === 'f' || move === "b'") {
        u.splice(3, 3, ...templ);
        [r[1], r[4], r[7]] = tempu;
        d.splice(3, 3, ...tempr.reverse());
        [l[7], l[4], l[1]] = tempd;
      } else if (move === "S'" || move === "f'" || move === 'b') {
        u.splice(3, 3, ...tempr);
        [r[1], r[4], r[7]] = tempd;
        d.splice(3, 3, ...templ.reverse());
        [l[7], l[4], l[1]] = tempu;
      } else {
        // S2/f2/b2
        u.splice(3, 3, ...tempd);
        [r[1], r[4], r[7]] = templ;
        d.splice(3, 3, ...tempu.reverse());
        [l[7], l[4], l[1]] = tempr;
      }
    };

    const handleM = () => {
      const tempu = [u[1], u[4], u[7]];
      const tempf = [f[1], f[4], f[7]];
      const tempd = [d[1], d[4], d[7]];
      const tempb = [b[7], b[4], b[1]];
      if (move === 'M' || move === 'l' || move === "r'") {
        [f[1], f[4], f[7]] = tempu;
        [d[1], d[4], d[7]] = tempf;
        [b[7], b[4], b[1]] = tempd;
        [u[1], u[4], u[7]] = tempb;
      } else if (move === "M'" || move === "l'" || move === 'r') {
        [f[1], f[4], f[7]] = tempd;
        [u[1], u[4], u[7]] = tempf;
        [b[7], b[4], b[1]] = tempu;
        [d[1], d[4], d[7]] = tempb;
      } else {
        // M2/l2/r2
        [f[1], f[4], f[7]] = tempb;
        [u[1], u[4], u[7]] = tempd;
        [b[7], b[4], b[1]] = tempf;
        [d[1], d[4], d[7]] = tempu;
      }
    };

    const handleE = () => {
      const tempf = f.slice(3, 6);
      const tempr = r.slice(3, 6);
      const tempb = b.slice(3, 6);
      const templ = l.slice(3, 6);
      if (move === 'E' || move === 'd' || move === "u'") {
        f.splice(3, 3, ...templ);
        r.splice(3, 3, ...tempf);
        b.splice(3, 3, ...tempr);
        l.splice(3, 3, ...tempb);
      } else if (move === "E'" || move === "d'" || move === 'u') {
        f.splice(3, 3, ...tempr);
        r.splice(3, 3, ...tempb);
        b.splice(3, 3, ...templ);
        l.splice(3, 3, ...tempf);
      } else {
        // E2/d2/u2
        f.splice(3, 3, ...tempb);
        r.splice(3, 3, ...templ);
        b.splice(3, 3, ...tempf);
        l.splice(3, 3, ...tempr);
      }
    };

    const handleX = () => {
      const tempu = u.slice();
      const tempb = b.slice();
      const tempd = d.slice();
      const tempf = f.slice();

      if (move === 'x') {
        u.splice(0, 9, ...tempf);
        b.splice(0, 9, ...tempu.reverse());
        d.splice(0, 9, ...tempb.reverse());
        f.splice(0, 9, ...tempd);
        this._rotateFace(l, -90);
        this._rotateFace(r, 90);
      } else if (move === 'x2') {
        u.splice(0, 9, ...tempd);
        b.splice(0, 9, ...tempf.reverse());
        d.splice(0, 9, ...tempu);
        f.splice(0, 9, ...tempb.reverse());
        this._rotateFace(l, 180);
        this._rotateFace(r, 180);
      } else if (move === "x'") {
        u.splice(0, 9, ...tempb.reverse());
        f.splice(0, 9, ...tempu);
        d.splice(0, 9, ...tempf);
        b.splice(0, 9, ...tempd.reverse());
        this._rotateFace(l, 90);
        this._rotateFace(r, -90);
      }
    };

    const handleY = () => {
      const tempf = f.slice();
      const templ = l.slice();
      const tempb = b.slice();
      const tempr = r.slice();

      if (move === 'y') {
        f.splice(0, 9, ...tempr);
        r.splice(0, 9, ...tempb);
        b.splice(0, 9, ...templ);
        l.splice(0, 9, ...tempf);
        this._rotateFace(u, 90);
        this._rotateFace(d, -90);
      } else if (move === 'y2') {
        f.splice(0, 9, ...tempb);
        r.splice(0, 9, ...templ);
        b.splice(0, 9, ...tempf);
        l.splice(0, 9, ...tempr);
        this._rotateFace(u, 180);
        this._rotateFace(d, -180);
      } else if (move === "y'") {
        f.splice(0, 9, ...templ);
        r.splice(0, 9, ...tempf);
        b.splice(0, 9, ...tempr);
        l.splice(0, 9, ...tempb);
        this._rotateFace(u, -90);
        this._rotateFace(d, 90);
      }
    };

    const handleZ = () => {
      const tempu = u.slice();
      const tempr = r.slice();
      const tempd = d.slice();
      const templ = l.slice();

      const helpZ = (faceToChange, old) => {
        faceToChange.splice(
          0,
          9,
          old[6],
          old[3],
          old[0],
          old[7],
          old[4],
          old[1],
          old[8],
          old[5],
          old[2]
        );
      };

      const helpZPrime = (faceToChange, old) => {
        faceToChange.splice(
          0,
          9,
          old[2],
          old[5],
          old[8],
          old[1],
          old[4],
          old[7],
          old[0],
          old[3],
          old[6]
        );
      };

      if (move === 'z') {
        helpZ(u, templ);
        helpZ(r, tempu);
        helpZ(d, tempr);
        helpZ(l, tempd);
        this._rotateFace(f, 90);
        this._rotateFace(b, -90);
      } else if (move === 'z2') {
        u.splice(0, 9, ...tempd.reverse()); // need splice as we are mutating the actual face
        r.splice(0, 9, ...templ.reverse());
        d.splice(0, 9, ...tempu.reverse());
        l.splice(0, 9, ...tempr.reverse());
        this._rotateFace(f, 180);
        this._rotateFace(b, 180);
      } else if (move === "z'") {
        helpZPrime(u, tempr);
        helpZPrime(r, tempd);
        helpZPrime(d, templ);
        helpZPrime(l, tempu);
        this._rotateFace(f, -90);
        this._rotateFace(b, 90);
      }
    };

    this.movesApplied.push(move);
    const lastChar = move[move.length - 1];
    const [u, f, r, d, l, b] = [
      this.uFace,
      this.fFace,
      this.rFace,
      this.dFace,
      this.lFace,
      this.bFace,
    ];

    // handle outer moves
    if (move[0] === 'U' || move[0] === 'u') {
      handleU();
    } else if (move[0] === 'R' || move[0] === 'r') {
      handleR();
    } else if (move[0] === 'F' || move[0] === 'f') {
      handleF();
    } else if (move[0] === 'D' || move[0] === 'd') {
      handleD();
    } else if (move[0] === 'L' || move[0] === 'l') {
      handleL();
    } else if (move[0] === 'B' || move[0] === 'b') {
      handleB();
    }
    // handle inner moves
    if (move[0] === 'S' || move[0] === 'f' || move[0] === 'b') {
      handleS();
    } else if (move[0] === 'M' || move[0] === 'l' || move[0] === 'r') {
      handleM();
    } else if (move[0] === 'E' || move[0] === 'd' || move[0] === 'u') {
      handleE();
    }
    // handle rotations
    if (move[0] === 'x') {
      handleX();
    }
    if (move[0] === 'y') {
      handleY();
    }
    if (move[0] === 'z') {
      handleZ();
    }

    if (
      move[0] === 'x' ||
      move[0] === 'y' ||
      move[0] === 'z' ||
      move[0] === 'S' ||
      move[0] === 'M' ||
      move[0] === 'E'
    ) {
      return; // don't rotate any more faces
    }

    // rotate the correct face the right amount of degrees based on the move
    if (move[move.length - 1] === "'") {
      this._rotateFace(this.faceMapping[move.slice(0, 1).toUpperCase()], -90);
    } else if (move[move.length - 1] === '2') {
      this._rotateFace(this.faceMapping[move.slice(0, 1).toUpperCase()], 180);
    } else {
      this._rotateFace(this.faceMapping[move.slice(0, 1).toUpperCase()], 90);
    }
  }

  _rotateFace(face, degrees) {
    const [temp0, temp1, temp2, temp3, temp5, temp6, temp7, temp8] = [
      face[0],
      face[1],
      face[2],
      face[3],
      face[5],
      face[6],
      face[7],
      face[8],
    ];
    if (degrees === 90) {
      [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]] =
        [temp6, temp3, temp0, temp7, temp1, temp8, temp5, temp2];
    } else if (degrees === -90) {
      [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]] =
        [temp2, temp5, temp8, temp1, temp7, temp0, temp3, temp6];
    } else {
      [face[0], face[1], face[2], face[3], face[5], face[6], face[7], face[8]] =
        [temp8, temp7, temp6, temp5, temp3, temp2, temp1, temp0];
    }
  }

  // creates a list of cubes that are adjacent to the current cube, adjacenies generated by allowed movetypes minus most recently applied move type, no rotations allowed for first move
  createAdjList() {
    const adjList = [];
    let simplifiedLastMove;
    if (this.movesApplied.length !== 0) {
      simplifiedLastMove = simplifyMove(
        this.movesApplied[this.movesApplied.length - 1]
      );
    } else {
      simplifiedLastMove = '';
    }

    for (const letter of this.allowedMoves) {
      if (letter !== simplifiedLastMove) {
        const cube1 = this._clone();
        const cube2 = this._clone();
        const cube3 = this._clone();
        cube1.move(letter);
        cube2.move(`${letter}'`);
        cube3.move(`${letter}2`);
        adjList.push(cube1, cube2, cube3);
      }
    }
    return adjList;
  }

  // creates a list of cubes that are adjacent to the current cube, adjacenies generated by allowed movetypes minus most recently applied move type
  createAdjListForSolvedCubeAtStart() {
    const adjList = [];
    let simplifiedLastMove;
    if (this.movesApplied.length !== 0) {
      simplifiedLastMove = simplifyMove(
        this.movesApplied[this.movesApplied.length - 1]
      );
    } else {
      simplifiedLastMove = '';
    }

    for (const letter of this.allowedMoves) {
      // don't allow rotations to be done as the first move as they can be pruned away
      const isFirstMoveAndRotation =
        this.movesApplied.length === 0 && letter === ('x' || 'y' || 'z');
      if (letter !== simplifiedLastMove && !isFirstMoveAndRotation) {
        const cube1 = this._clone();
        const cube2 = this._clone();
        const cube3 = this._clone();
        cube1.move(letter);
        cube2.move(`${letter}'`);
        cube3.move(`${letter}2`);
        adjList.push(cube1, cube2, cube3);
      }
    }
    return adjList;
  }
}

// ! ################################### ALGHANDLER ###################################

function applyAlg(algorithm, cube) {
  if (JSON.stringify(algorithm) === JSON.stringify([''])) return; // if the user doesn't submit a scramble
  for (const move of algorithm) {
    cube.move(move);
  }
}

function invertMoveList(moveList) {
  const invertedList = [];
  for (const move of moveList) {
    invertedList.push(invertMove(move));
  }
  return invertedList;
}

function reverseMoveList(moveList) {
  return moveList.slice().reverse();
}

function reverseAndInvertMoveList(moveList) {
  return invertMoveList(reverseMoveList(moveList));
}

// take in a move string and return just the letter portion
function simplifyMove(move) {
  return move.length === 2 ? move[0] : move;
}

// invert a move string
function invertMove(move) {
  let invertedMove;
  if (move[move.length - 1] === "'") {
    // eslint-disable-next-line prefer-destructuring
    invertedMove = move[0];
  } else if (move.length === 1) {
    invertedMove = `${move}'`;
  }
  if (invertedMove === undefined) return move;
  return invertedMove;
}

// parsing functions
function normalToDouble(move) {
  return `${move}2`;
}

function primeToDouble(move) {
  return `${move[0]}2`;
}

function doubleToNormal(move) {
  return move[0];
}

function doubleToPrime(move) {
  return `${move[0]}'`;
}

// connects the left and right ends of move lists
function cleanUpIntersection(lista, listb) {
  // ["R2", "U" "R'", "U'"] and ["R", "U", "R'", "U2"]
  // create copies of the lists of the moves
  const list1 = lista.slice();
  const list2 = listb.slice();

  // if one of the lists is empty, return the other list
  if (list1.length === 0) {
    return list2;
  }
  if (list2.length === 0) {
    return list1;
  }

  const list1LastMove = list1[list1.length - 1]; // R2 or U
  const list1LastMoveFirstChar = list1LastMove[0]; // R or U
  const list1LastMoveLastChar = list1LastMove[list1LastMove.length - 1]; // 2 or U

  const list2FirstMove = list2[0];
  const list2FirstMoveFirstChar = list2FirstMove[0];
  const list2FirstMoveLastChar = list2FirstMove[list2FirstMove.length - 1];

  // if the last move of the first list is not the same type as the first move of the second list, just return the lists
  if (list1LastMoveFirstChar !== list2FirstMoveFirstChar) {
    // ["R2", "U2"] and ["F2", "R2"]
    return [...list1, ...list2]; // returns ["R2", "U2", "F2", "R2"]
  }

  if (list1LastMoveLastChar === "'") {
    if (list2FirstMoveLastChar === "'") {
      list1[list1.length - 1] = primeToDouble(list1[list1.length - 1]);
    } else if (list2FirstMoveLastChar === '2') {
      list1[list1.length - 1] = invertMove(list1[list1.length - 1]);
    } else {
      list1.splice(-1, 1);
    }
  } else if (list1LastMoveLastChar === '2') {
    if (list2FirstMoveLastChar === "'") {
      list1[list1.length - 1] = doubleToNormal(list1[list1.length - 1]);
    } else if (list2FirstMoveLastChar === '2') {
      // ["R2"] and ["R2"]
      list1.splice(-1, 1);
    } else {
      list1[list1.length - 1] = doubleToPrime(list1[list1.length - 1]);
    }
  } else if (list2FirstMoveLastChar === "'") {
    list1.splice(-1, 1);
  } else if (list2FirstMoveLastChar === '2') {
    list1[list1.length - 1] = invertMove(list1[list1.length - 1]);
  } else {
    list1[list1.length - 1] = normalToDouble(list1[list1.length - 1]);
  }
  list2.splice(0, 1);
  return cleanUpIntersection(list1, list2);
}
