

// ! ALG HANDLER

function applyAlg(algorithm, cube) {
  for (let move of algorithm) {
    cube.move(move);
  }
}

function invertMoveList(moveList) {
  const invertedList = [];
  for (let move of moveList) {
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
  if (move.length === 2) {
    move = move[0];
  }
  return move;
}

// invert a move string
function invertMove(move) {
  if (move[move.length - 1] === "'") {
    move = move[0];
  } else if (move.length === 1) {
    move += "'";
  }
  return move;
}

// parsing functions
function normalToPrime(move) {
  return move + "'";
}

function normalToDouble(move) {
  return move + '2';
}

function primeToDouble(move) {
  return move[0] + '2';
}

function doubleToNormal(move) {
  return move[0];
}

function doubleToPrime(move) {
  return move[0] + "'";
}

// connects the left and right ends of move lists
function cleanUpIntersection(lista, listb) { // ["R2", "U" "R'", "U'"] and ["R", "U", "R'", "U2"]
  // create copies of the lists of the moves
  const list1 = lista.slice();
  const list2 = listb.slice();

  // ? console.log(`list1 is: ${JSON.stringify(list1)}`);
  // ? console.log(`list2 is: ${JSON.stringify(list2)}`);

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
  if (list1LastMoveFirstChar !== list2FirstMoveFirstChar) { // ["R2", "U2"] and ["F2", "R2"]
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
    } else if (list2FirstMoveLastChar === '2') { // ["R2"] and ["R2"]
      list1.splice(-1, 1);
    } else {
      list1[list1.length - 1] = doubleToPrime(list1[list1.length - 1]);
    }
  } else {
    if (list2FirstMoveLastChar === "'") {
      list1.splice(-1, 1);
    } else if (list2FirstMoveLastChar === '2') {
      list1[list1.length - 1] = invertMove(list1[list1.length - 1]);
    } else {
      list1[list1.length - 1] = normalToDouble(list1[list1.length - 1]);
    }
  }
  // ? console.log(`before, list 2 is: ${list2}`)
  list2.splice(0, 1);
  // ? console.log(`new lists to clean up are: ${list1} and ${list2}`)
  return cleanUpIntersection(list1, list2);
}

module.exports = { applyAlg, cleanUpIntersection, reverseAndInvertMoveList, simplifyMove }
