function processMoves(scramble) {
  let result = '';

  for (let i = 0; i < scramble.length; i++) {
    if (i === scramble.length - 1 && /[RUFLDBxyzEMrufldb]/.test(scramble[i])) { // if at the last move and a move matches, add that and return the string
      return result + scramble[i];
    }
    if (/[RUFLDBxyzEMrufldb]/.test(scramble[i])) { // if the current move is a letter, add it
      result += scramble[i];
    }
    if (scramble[i + 1] === "'" || scramble[i + 1] === ' ' || scramble[i + 1] === '2') { // if the next move is a prime, space, or double, add it
      result += scramble[i + 1];
    } else if (scramble[i] !== ' ') { // if the current move is not a space, add another space, so users can type two moves in a row without spaces
      result += ' ';
    }
  }
  return result;
}

export default processMoves;